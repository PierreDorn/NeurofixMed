-- =============================================================================
-- Migration: 20260624130000_neuro_ia_cache_e_rate_limit
-- =============================================================================
-- Contexto:
--   A migration anterior (20260624120000_perfis_estudantes_conteudos_gerados)
--   criou `conteudos_gerados` como tabela per-user (cada aluno tinha seus
--   conteudos). Decisao arquitetural mudou:
--
--   1) `conteudos_gerados` vira CACHE GLOBAL COMPARTILHADO entre todos os
--      alunos. Quando dois alunos pedem o mesmo conteudo com as mesmas
--      instrucoes, o backend reaproveita a resposta da OpenAI ao inves de
--      gerar de novo (economia de custo + latencia).
--      - Aluno NUNCA acessa esta tabela diretamente. Apenas o backend via
--        service_role consulta/escreve. RLS fica habilitado e SEM policies
--        para authenticated/anon -> bloqueio total no client.
--      - Lookup feito via `cache_key` (hash deterministico da requisicao:
--        modelo + prompt_versao + parametros + conteudo de entrada).
--
--   2) `perfis_estudantes.openai_thread_id` deixa de existir. A integracao
--      com OpenAI sera via Chat Completions (stateless), nao Assistants API
--      (stateful com threads). A coluna fica orfa e e dropada.
--
--   3) Nova tabela `controle_geracoes_diarias` para rate limit de 200
--      geracoes/dia por aluno. Diferente do cache, este contador E visivel
--      para o aluno (SELECT do proprio registro) para a UI mostrar "X/200".
--      INSERT/UPDATE so via service_role atraves da funcao SECURITY DEFINER
--      `incrementar_geracao()`.
--
-- Estrategia:
--   - Aditiva sempre que possivel. ALTER em vez de DROP+CREATE para preservar
--     dados existentes em `conteudos_gerados`.
--   - Idempotente: IF EXISTS / IF NOT EXISTS em tudo.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1) Transformacao de `conteudos_gerados`: per-user -> cache global
-- -----------------------------------------------------------------------------

-- Dropa policies antigas (eram per-user, agora nao se aplicam).
DROP POLICY IF EXISTS "conteudos_gerados: own select" ON public.conteudos_gerados;
DROP POLICY IF EXISTS "conteudos_gerados: own insert" ON public.conteudos_gerados;
DROP POLICY IF EXISTS "conteudos_gerados: own update" ON public.conteudos_gerados;
DROP POLICY IF EXISTS "conteudos_gerados: own delete" ON public.conteudos_gerados;

-- Revoga grants. authenticated/anon NUNCA tocam nesta tabela.
-- service_role bypassa RLS por padrao, entao o backend continua tendo acesso.
REVOKE ALL ON public.conteudos_gerados FROM authenticated;
REVOKE ALL ON public.conteudos_gerados FROM anon;

-- Drop user_id: cache global nao tem dono.
-- Remove a FK explicitamente antes de dropar a coluna para evitar surpresas.
ALTER TABLE public.conteudos_gerados DROP CONSTRAINT IF EXISTS conteudos_gerados_user_id_fkey;
ALTER TABLE public.conteudos_gerados DROP COLUMN IF EXISTS user_id;

-- Drop indice que dependia de user_id.
DROP INDEX IF EXISTS idx_conteudos_gerados_user_created;
-- Observacao: idx_conteudos_gerados_tipos (GIN) e mantido — ainda util para
-- filtragens por tipo de conteudo na manutencao do cache.

-- Adiciona colunas de cache.
-- Defaults temporarios em cache_key/modelo/prompt_versao garantem que linhas
-- pre-existentes (se houver) nao quebrem o NOT NULL. Apos a migracao,
-- removemos apenas o default de cache_key (campo de identificacao unica).
-- modelo e prompt_versao mantem default util para insercoes futuras.
ALTER TABLE public.conteudos_gerados
  ADD COLUMN IF NOT EXISTS cache_key      text        NOT NULL DEFAULT '__migration_placeholder__',
  ADD COLUMN IF NOT EXISTS modelo         text        NOT NULL DEFAULT 'gpt-5-mini',
  ADD COLUMN IF NOT EXISTS prompt_versao  text        NOT NULL DEFAULT 'v1',
  ADD COLUMN IF NOT EXISTS hits           int         NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ultima_leitura timestamptz;

-- Remove default do cache_key. A partir daqui, todo INSERT precisa fornecer
-- explicitamente o hash. O placeholder permanece apenas em linhas legadas
-- (que, na pratica, nao deveriam existir em producao neste momento).
ALTER TABLE public.conteudos_gerados ALTER COLUMN cache_key DROP DEFAULT;

-- UNIQUE em cache_key: dedup garantido a nivel de banco. Tentativa de inserir
-- chave repetida vai falhar e o backend deve tratar como cache hit.
ALTER TABLE public.conteudos_gerados
  ADD CONSTRAINT conteudos_gerados_cache_key_unique UNIQUE (cache_key);

-- Indice de lookup. O UNIQUE acima ja cria um indice implicito em cache_key,
-- mas mantemos este CREATE INDEX IF NOT EXISTS para clareza/idempotencia
-- (sera no-op se o UNIQUE ja cobrir).
CREATE INDEX IF NOT EXISTS idx_conteudos_gerados_cache_key
  ON public.conteudos_gerados(cache_key);

-- RLS continua ENABLED (foi habilitado na migration anterior). Sem nenhuma
-- policy + sem GRANT para authenticated/anon = bloqueio total no client.
-- service_role bypassa RLS, entao o backend (Server Action / API route com
-- service_role key) consegue ler e escrever normalmente.


-- -----------------------------------------------------------------------------
-- 2) Drop de `perfis_estudantes.openai_thread_id`
-- -----------------------------------------------------------------------------
-- Decisao: migrar para Chat Completions (stateless). Assistants API nao sera
-- usada, entao a coluna de thread fica orfa. Drop seguro com IF EXISTS.
ALTER TABLE public.perfis_estudantes DROP COLUMN IF EXISTS openai_thread_id;


-- -----------------------------------------------------------------------------
-- 3) Nova tabela `controle_geracoes_diarias` (rate limit visivel)
-- -----------------------------------------------------------------------------
-- Um registro por (user_id, data). Reseta naturalmente todo dia porque o
-- backend usa CURRENT_DATE no upsert: novo dia = nova linha = contador zerado.
-- Linhas antigas ficam no historico (util para metricas futuras).
CREATE TABLE IF NOT EXISTS public.controle_geracoes_diarias (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data       date        NOT NULL DEFAULT CURRENT_DATE,
  contador   int         NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT controle_geracoes_diarias_user_data_unique UNIQUE (user_id, data)
);

ALTER TABLE public.controle_geracoes_diarias ENABLE ROW LEVEL SECURITY;

-- Aluno SO LE o proprio contador (UI mostra "X/200 hoje").
-- Sem GRANT de INSERT/UPDATE/DELETE para authenticated: alteracoes apenas via
-- service_role (chamando a funcao SECURITY DEFINER abaixo).
GRANT SELECT ON public.controle_geracoes_diarias TO authenticated;

DROP POLICY IF EXISTS "controle_geracoes_diarias: own select"
  ON public.controle_geracoes_diarias;

CREATE POLICY "controle_geracoes_diarias: own select"
  ON public.controle_geracoes_diarias
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Trigger de updated_at usa a funcao public.set_updated_at() criada na
-- migration anterior (20260624120000). Reaproveitamos.
DROP TRIGGER IF EXISTS trg_controle_geracoes_diarias_updated_at
  ON public.controle_geracoes_diarias;

CREATE TRIGGER trg_controle_geracoes_diarias_updated_at
  BEFORE UPDATE ON public.controle_geracoes_diarias
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indice para a query mais comum: "qual o contador do user X hoje?"
-- data DESC para acelerar consultas que olham o mais recente primeiro.
CREATE INDEX IF NOT EXISTS idx_controle_geracoes_user_data
  ON public.controle_geracoes_diarias(user_id, data DESC);


-- -----------------------------------------------------------------------------
-- 4) Funcao `incrementar_geracao(p_user_id uuid) RETURNS int`
-- -----------------------------------------------------------------------------
-- Chamada pelo backend (Server Action) via service_role. Faz upsert atomico
-- do contador do dia e retorna o novo valor para o backend decidir se deve
-- ou nao prosseguir com a chamada a OpenAI (limite = 200).
--
-- SECURITY DEFINER: executa com privilegios do dono da funcao (postgres),
-- permitindo escrita na tabela mesmo que o role chamador nao tenha grant.
-- search_path fixo em `public` evita ataques de path hijack.
--
-- Restringimos EXECUTE: PUBLIC, anon, authenticated NAO podem chamar. So
-- service_role (que tem acesso por padrao a tudo) consegue invocar.
CREATE OR REPLACE FUNCTION public.incrementar_geracao(p_user_id uuid)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  novo_contador int;
BEGIN
  INSERT INTO public.controle_geracoes_diarias (user_id, data, contador)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, data)
  DO UPDATE SET
    contador   = controle_geracoes_diarias.contador + 1,
    updated_at = now()
  RETURNING contador INTO novo_contador;

  RETURN novo_contador;
END;
$$;

-- Defesa em profundidade: revoga EXECUTE de todos os roles publicos.
-- service_role (usado pelo backend) ja tem acesso por bypass.
REVOKE ALL ON FUNCTION public.incrementar_geracao(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.incrementar_geracao(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.incrementar_geracao(uuid) FROM authenticated;


-- =============================================================================
-- Fim da migration.
--
-- Como reverter (se necessario):
--   1) DROP FUNCTION IF EXISTS public.incrementar_geracao(uuid);
--   2) DROP TABLE  IF EXISTS public.controle_geracoes_diarias;
--   3) ALTER TABLE public.perfis_estudantes
--        ADD COLUMN IF NOT EXISTS openai_thread_id text;
--   4) Em `conteudos_gerados`:
--        ALTER TABLE public.conteudos_gerados
--          DROP CONSTRAINT IF EXISTS conteudos_gerados_cache_key_unique;
--        DROP INDEX IF EXISTS idx_conteudos_gerados_cache_key;
--        ALTER TABLE public.conteudos_gerados
--          DROP COLUMN IF EXISTS cache_key,
--          DROP COLUMN IF EXISTS modelo,
--          DROP COLUMN IF EXISTS prompt_versao,
--          DROP COLUMN IF EXISTS hits,
--          DROP COLUMN IF EXISTS ultima_leitura,
--          ADD  COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id)
--               ON DELETE CASCADE;
--        -- recriar policies per-user e GRANTs para authenticated conforme
--        -- a migration 20260624120000.
--   ATENCAO: a reversao NAO restaura dados das colunas dropadas.
-- =============================================================================
