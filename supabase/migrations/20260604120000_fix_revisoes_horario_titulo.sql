-- =====================================================================
-- 20260604120000_fix_revisoes_horario_titulo.sql
--
-- Corrige criar_revisoes_automaticas para:
--   1. Aceitar p_titulo opcional e usar o título real no evento
--   2. Respeitar dias_semana_estudo e horario_estudo_inicio/fim
--      ao calcular data_revisao
-- =====================================================================

CREATE OR REPLACE FUNCTION public.criar_revisoes_automaticas(
  p_user_id       uuid,
  p_conteudo_tipo text,
  p_conteudo_id   uuid,
  p_titulo        text DEFAULT NULL   -- título real do conteúdo (opcional)
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cfg              public.user_settings%ROWTYPE;
  ciclo            int;
  data_revisao     timestamptz;
  intervalos       int[];
  new_event_id     uuid;
  evento_titulo    text;
  evento_desc      text;
  -- ajuste de horário
  hora_calc        time;
  dia_isodow       int;
  dia_key          text;
  dia_valido       boolean;
  -- mapeamento chave → isodow (seg=1 … dom=7)
  dias_map         text[]  := ARRAY['seg','ter','qua','qui','sex','sab','dom'];
  dias_isodow_map  int[]   := ARRAY[1,2,3,4,5,6,7];
  idx              int;
  tentativas       int;
BEGIN
  -- Carrega configuração (cria defaults se não existir)
  SELECT * INTO cfg FROM public.user_settings WHERE user_id = p_user_id;
  IF NOT FOUND THEN
    INSERT INTO public.user_settings(user_id) VALUES (p_user_id) RETURNING * INTO cfg;
  END IF;

  IF NOT cfg.revisao_automatica_ativa THEN RETURN; END IF;

  intervalos := ARRAY[
    cfg.intervalo_revisao_1,
    cfg.intervalo_revisao_2,
    cfg.intervalo_revisao_3,
    cfg.intervalo_revisao_4
  ];

  -- Título do evento: usa p_titulo se fornecido
  IF p_conteudo_tipo = 'study_summary' THEN
    evento_titulo := COALESCE(p_titulo, 'Revisão de resumo');
    evento_desc   := 'Revise o resumo estudado para fixar o conteúdo na memória de longo prazo.';
  ELSIF p_conteudo_tipo = 'flashcard' THEN
    evento_titulo := COALESCE(p_titulo, 'Revisão de flashcard');
    evento_desc   := 'Revisão programada do flashcard estudado.';
  ELSIF p_conteudo_tipo = 'subtopic' THEN
    evento_titulo := COALESCE(p_titulo, 'Revisão de subtópico');
    evento_desc   := 'Revisão do conteúdo estudado neste subtópico.';
  ELSE
    evento_titulo := COALESCE(p_titulo, 'Revisão de conteúdo');
    evento_desc   := 'Revisão automática agendada pelo sistema.';
  END IF;

  FOR ciclo IN 1..4 LOOP
    -- Calcula data base com intervalo em horas
    data_revisao := now() + (intervalos[ciclo] || ' hours')::interval;

    -- ── Ajuste 1: hora fora do horário de estudo ──────────────────
    hora_calc := data_revisao::time;

    IF hora_calc < cfg.horario_estudo_inicio THEN
      -- Antes do horário → move para o início do mesmo dia
      data_revisao := date_trunc('day', data_revisao) + cfg.horario_estudo_inicio;
    ELSIF hora_calc >= cfg.horario_estudo_fim THEN
      -- Depois do horário → move para o início do próximo dia
      data_revisao := date_trunc('day', data_revisao) + interval '1 day' + cfg.horario_estudo_inicio;
    END IF;

    -- ── Ajuste 2: dia da semana não permitido ─────────────────────
    -- Avança até o próximo dia válido (max 7 tentativas)
    tentativas := 0;
    LOOP
      dia_isodow := extract(isodow from data_revisao)::int; -- 1=seg..7=dom
      dia_valido := false;

      -- Mapeia isodow de volta para a chave de texto e verifica array
      FOR idx IN 1..7 LOOP
        IF dias_isodow_map[idx] = dia_isodow THEN
          dia_key := dias_map[idx];
          EXIT;
        END IF;
      END LOOP;

      IF cfg.dias_semana_estudo @> ARRAY[dia_key] THEN
        dia_valido := true;
      END IF;

      EXIT WHEN dia_valido OR tentativas >= 7;
      data_revisao := date_trunc('day', data_revisao) + interval '1 day' + cfg.horario_estudo_inicio;
      tentativas := tentativas + 1;
    END LOOP;

    -- Insere evento na agenda
    INSERT INTO public.events(
      user_id, titulo, descricao, data_inicio, data_fim,
      tipo, cor, origem, referencia_id, referencia_tipo
    ) VALUES (
      p_user_id,
      evento_titulo || ' — revisão ' || ciclo || 'ª',
      evento_desc,
      data_revisao,
      data_revisao + interval '30 minutes',
      'revisao', '#4AB3FF', 'revisao_automatica', p_conteudo_id, p_conteudo_tipo
    ) RETURNING id INTO new_event_id;

    INSERT INTO public.event_reminders(event_id, minutos_antes, tipo)
    VALUES (new_event_id, 15, 'push');

    INSERT INTO public.review_schedule(
      user_id, conteudo_tipo, conteudo_id, ciclo_numero, data_agendada, event_id
    ) VALUES (
      p_user_id, p_conteudo_tipo, p_conteudo_id, ciclo, data_revisao, new_event_id
    );
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.criar_revisoes_automaticas(uuid, text, uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.criar_revisoes_automaticas(uuid, text, uuid, text) TO authenticated;
