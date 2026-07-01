-- =====================================================================
-- 20260603130000_srs_adaptativo.sql
-- Algoritmo adaptativo para SRS + job de manutenção
--
-- Funções criadas:
--   1. aplicar_desempenho_revisao(review_id, desempenho)
--        - "errei"   → cria revisão extra em 50% do intervalo_1
--        - "dificil" → mantém intervalo padrão (apenas registra desempenho)
--        - "facil"   → próxima revisão em 1.5x o intervalo seguinte
--        - 3x facil seguidas → arquiva (sai da fila ativa)
--
--   2. marcar_revisoes_atrasadas()
--        - Roda no cron: marca como 'atrasada' tudo que estava pendente e venceu
--
--   3. ja_tem_revisoes(user_id, conteudo_tipo, conteudo_id)
--        - Helper para evitar duplicar fila quando o aluno revisita o conteúdo
-- =====================================================================

-- ─── 1) aplicar_desempenho_revisao ──────────────────────────────────
CREATE OR REPLACE FUNCTION public.aplicar_desempenho_revisao(
  p_review_id uuid,
  p_desempenho text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rev            public.review_schedule%ROWTYPE;
  cfg            public.user_settings%ROWTYPE;
  prox_intervalo int;
  data_extra     timestamptz;
  new_event_id   uuid;
  acertos_facil  int;
BEGIN
  IF p_desempenho NOT IN ('errei','dificil','facil') THEN
    RAISE EXCEPTION 'desempenho inválido: %', p_desempenho;
  END IF;

  SELECT * INTO rev FROM public.review_schedule WHERE id = p_review_id;
  IF NOT FOUND THEN RETURN; END IF;

  -- Marca esta revisão como concluída
  UPDATE public.review_schedule
  SET status = 'concluida',
      data_concluida = now(),
      desempenho = p_desempenho
  WHERE id = p_review_id;

  -- Marca o evento ligado como concluído também
  IF rev.event_id IS NOT NULL THEN
    UPDATE public.events
    SET concluido = true, concluido_em = now()
    WHERE id = rev.event_id;
  END IF;

  SELECT * INTO cfg FROM public.user_settings WHERE user_id = rev.user_id;
  IF NOT FOUND THEN
    INSERT INTO public.user_settings(user_id) VALUES (rev.user_id) RETURNING * INTO cfg;
  END IF;

  -- ERREI: cria revisão extra em 50% do intervalo 1
  IF p_desempenho = 'errei' THEN
    data_extra := now() + ((cfg.intervalo_revisao_1 * 0.5) || ' hours')::interval;

    INSERT INTO public.events(
      user_id, titulo, descricao, data_inicio, data_fim,
      tipo, cor, origem, referencia_id, referencia_tipo
    ) VALUES (
      rev.user_id,
      'Revisão extra (errei)',
      'Reforço imediato — você errou na última revisão.',
      data_extra, data_extra + interval '30 minutes',
      'revisao', '#ef4444', 'revisao_automatica', rev.conteudo_id, rev.conteudo_tipo
    ) RETURNING id INTO new_event_id;

    INSERT INTO public.event_reminders(event_id, minutos_antes, tipo) VALUES (new_event_id, 5, 'push');

    INSERT INTO public.review_schedule(
      user_id, conteudo_tipo, conteudo_id, ciclo_numero, data_agendada, event_id
    ) VALUES (
      rev.user_id, rev.conteudo_tipo, rev.conteudo_id,
      LEAST(rev.ciclo_numero + 1, 10), data_extra, new_event_id
    );
    RETURN;
  END IF;

  -- FACIL: 3 acertos seguidos arquiva o conteúdo
  IF p_desempenho = 'facil' THEN
    SELECT count(*) INTO acertos_facil
    FROM public.review_schedule
    WHERE user_id = rev.user_id
      AND conteudo_tipo = rev.conteudo_tipo
      AND conteudo_id = rev.conteudo_id
      AND status = 'concluida'
      AND desempenho = 'facil'
      AND data_concluida >= now() - interval '90 days';

    IF acertos_facil >= 3 THEN
      -- Arquiva: pula futuras revisões pendentes
      UPDATE public.review_schedule
      SET status = 'pulada'
      WHERE user_id = rev.user_id
        AND conteudo_tipo = rev.conteudo_tipo
        AND conteudo_id = rev.conteudo_id
        AND status = 'pendente';

      -- Marca eventos correspondentes como concluídos (silenciados)
      UPDATE public.events e
      SET concluido = true, concluido_em = now()
      FROM public.review_schedule rs
      WHERE rs.event_id = e.id
        AND rs.user_id = rev.user_id
        AND rs.conteudo_id = rev.conteudo_id
        AND rs.conteudo_tipo = rev.conteudo_tipo
        AND rs.status = 'pulada';

      RETURN;
    END IF;

    -- Próximo ciclo com intervalo expandido em 1.5x
    CASE LEAST(rev.ciclo_numero + 1, 4)
      WHEN 1 THEN prox_intervalo := round(cfg.intervalo_revisao_1 * 1.5);
      WHEN 2 THEN prox_intervalo := round(cfg.intervalo_revisao_2 * 1.5);
      WHEN 3 THEN prox_intervalo := round(cfg.intervalo_revisao_3 * 1.5);
      ELSE         prox_intervalo := round(cfg.intervalo_revisao_4 * 1.5);
    END CASE;

    data_extra := now() + (prox_intervalo || ' hours')::interval;

    INSERT INTO public.events(
      user_id, titulo, descricao, data_inicio, data_fim,
      tipo, cor, origem, referencia_id, referencia_tipo
    ) VALUES (
      rev.user_id,
      'Revisão expandida (fácil)',
      'Você marcou a última revisão como fácil. Espalhamos o próximo reforço.',
      data_extra, data_extra + interval '30 minutes',
      'revisao', '#4ADE80', 'revisao_automatica', rev.conteudo_id, rev.conteudo_tipo
    ) RETURNING id INTO new_event_id;

    INSERT INTO public.event_reminders(event_id, minutos_antes, tipo) VALUES (new_event_id, 15, 'push');

    INSERT INTO public.review_schedule(
      user_id, conteudo_tipo, conteudo_id, ciclo_numero, data_agendada, event_id
    ) VALUES (
      rev.user_id, rev.conteudo_tipo, rev.conteudo_id,
      LEAST(rev.ciclo_numero + 1, 10), data_extra, new_event_id
    );
    RETURN;
  END IF;

  -- DIFICIL: mantém o intervalo padrão (já existe o próximo ciclo agendado)
  RETURN;
END;
$$;

REVOKE ALL ON FUNCTION public.aplicar_desempenho_revisao(uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.aplicar_desempenho_revisao(uuid, text) TO authenticated;

-- ─── 2) marcar_revisoes_atrasadas (cron) ────────────────────────────
CREATE OR REPLACE FUNCTION public.marcar_revisoes_atrasadas()
RETURNS TABLE(atrasadas int, reagendadas int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_atrasadas   int := 0;
  v_reagendadas int := 0;
  rev RECORD;
  cfg public.user_settings%ROWTYPE;
  proxima_data timestamptz;
BEGIN
  -- Marca tudo pendente que já venceu como atrasada
  WITH upd AS (
    UPDATE public.review_schedule
    SET status = 'atrasada'
    WHERE status = 'pendente' AND data_agendada < now()
    RETURNING 1
  )
  SELECT count(*) INTO v_atrasadas FROM upd;

  -- Reagenda atrasadas para a próxima janela de estudo
  FOR rev IN
    SELECT * FROM public.review_schedule
    WHERE status = 'atrasada'
      AND data_concluida IS NULL
  LOOP
    SELECT * INTO cfg FROM public.user_settings WHERE user_id = rev.user_id;
    IF NOT FOUND THEN
      proxima_data := now() + interval '4 hours';
    ELSE
      -- Próxima janela: hoje em horario_estudo_inicio (se já passou, amanhã)
      proxima_data := (current_date::timestamp + cfg.horario_estudo_inicio)::timestamptz;
      IF proxima_data < now() THEN
        proxima_data := proxima_data + interval '1 day';
      END IF;
    END IF;

    UPDATE public.review_schedule
    SET status = 'pendente', data_agendada = proxima_data
    WHERE id = rev.id;

    IF rev.event_id IS NOT NULL THEN
      UPDATE public.events
      SET data_inicio = proxima_data,
          data_fim = proxima_data + interval '30 minutes'
      WHERE id = rev.event_id AND concluido = false;
    END IF;

    v_reagendadas := v_reagendadas + 1;
  END LOOP;

  RETURN QUERY SELECT v_atrasadas, v_reagendadas;
END;
$$;

REVOKE ALL ON FUNCTION public.marcar_revisoes_atrasadas() FROM public;
-- service_role chama no cron; authenticated NÃO precisa executar isso

-- ─── 3) ja_tem_revisoes ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.ja_tem_revisoes(
  p_user_id uuid,
  p_conteudo_tipo text,
  p_conteudo_id uuid
) RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.review_schedule
    WHERE user_id = p_user_id
      AND conteudo_tipo = p_conteudo_tipo
      AND conteudo_id = p_conteudo_id
  );
$$;

REVOKE ALL ON FUNCTION public.ja_tem_revisoes(uuid, text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.ja_tem_revisoes(uuid, text, uuid) TO authenticated;
