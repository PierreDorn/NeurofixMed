-- =====================================================================
-- 20260624120000_perfis_estudantes_conteudos_gerados.sql
-- Fundação para integração com a OpenAI Assistants API
--
-- Contexto:
--   Esta migration cria a base de dados necessária para suportar a
--   integração do NeuroFix Med com a OpenAI Assistants API. Cada aluno
--   precisa de um perfil que armazena o ID da thread persistente da
--   OpenAI (1:1 com auth.users) e de um armazenamento (1:N) para os
--   conteúdos gerados pela IA (flashcards em JSONB e resumos em texto).
--
-- Cria 2 tabelas novas (não toca em tabelas existentes):
--   1. perfis_estudantes   — 1 perfil por aluno (thread persistente OpenAI)
--   2. conteudos_gerados   — N conteúdos por aluno (flashcards + resumos)
--
-- Observações:
--   - A função public.set_updated_at() já existe (criada na migration
--     20260603120000_agenda_revisao_sistema.sql) e é reutilizada aqui.
--   - RLS habilitada em ambas; cada aluno só vê e mexe nos próprios dados.
--   - GRANTs concedidos apenas ao role `authenticated` (nunca a anon/public).
--   - conteudos_gerados.tipos é um array text[] que indica QUAIS tipos
--     esta geração produziu (combina com as colunas nullable
--     flashcards / questoes / resumo_texto). Valores permitidos:
--     'resumo', 'flashcards', 'questoes'.
--   - Multi-select é suportado nativamente: ['resumo','flashcards'] é
--     válido; "kit completo" = ['resumo','flashcards','questoes'].
--   - O índice GIN em `tipos` acelera queries do estilo
--     `WHERE 'flashcards' = ANY(tipos)` ou
--     `WHERE tipos @> ARRAY['questoes']`.
-- =====================================================================

-- ─── 1) perfis_estudantes ────────────────────────────────────────────
-- 1 linha por aluno. Guarda o openai_thread_id (pode ficar NULL até o
-- aluno usar a IA pela primeira vez — aí o backend popula o campo).
CREATE TABLE IF NOT EXISTS public.perfis_estudantes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  openai_thread_id  text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.perfis_estudantes ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perfis_estudantes TO authenticated;

CREATE POLICY "perfis_estudantes: own select"
  ON public.perfis_estudantes FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "perfis_estudantes: own insert"
  ON public.perfis_estudantes FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "perfis_estudantes: own update"
  ON public.perfis_estudantes FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "perfis_estudantes: own delete"
  ON public.perfis_estudantes FOR DELETE TO authenticated
  USING (user_id = auth.uid());

DROP TRIGGER IF EXISTS trg_perfis_estudantes_updated_at ON public.perfis_estudantes;
CREATE TRIGGER trg_perfis_estudantes_updated_at
  BEFORE UPDATE ON public.perfis_estudantes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_perfis_estudantes_user_id ON public.perfis_estudantes(user_id);

-- ─── 2) conteudos_gerados ────────────────────────────────────────────
-- N linhas por aluno. flashcards em JSONB (estrutura flexível) e
-- resumo_texto em TEXT — ambos nullable porque uma geração pode produzir
-- só um dos dois tipos de conteúdo.
CREATE TABLE IF NOT EXISTS public.conteudos_gerados (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipos         text[] NOT NULL CHECK (
                  array_length(tipos, 1) >= 1
                  AND tipos <@ ARRAY['resumo','flashcards','questoes']::text[]
                ),
  flashcards    jsonb,
  questoes      jsonb,
  resumo_texto  text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.conteudos_gerados ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conteudos_gerados TO authenticated;

CREATE POLICY "conteudos_gerados: own select"
  ON public.conteudos_gerados FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "conteudos_gerados: own insert"
  ON public.conteudos_gerados FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "conteudos_gerados: own update"
  ON public.conteudos_gerados FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "conteudos_gerados: own delete"
  ON public.conteudos_gerados FOR DELETE TO authenticated
  USING (user_id = auth.uid());

DROP TRIGGER IF EXISTS trg_conteudos_gerados_updated_at ON public.conteudos_gerados;
CREATE TRIGGER trg_conteudos_gerados_updated_at
  BEFORE UPDATE ON public.conteudos_gerados
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Composto: cobre filtro por aluno + ordenação por data numa única varredura
CREATE INDEX IF NOT EXISTS idx_conteudos_gerados_user_created
  ON public.conteudos_gerados(user_id, created_at DESC);

-- GIN: para queries do tipo "conteúdos que incluíram flashcards"
CREATE INDEX IF NOT EXISTS idx_conteudos_gerados_tipos
  ON public.conteudos_gerados USING GIN (tipos);
