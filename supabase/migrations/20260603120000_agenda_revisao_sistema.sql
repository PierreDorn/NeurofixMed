-- =====================================================================
-- 20260603120000_agenda_revisao_sistema.sql
-- Sistema de Agenda Pessoal + Revisão Automática (curva de Ebbinghaus)
--
-- Cria 6 tabelas novas (não toca em tabelas existentes):
--   1. user_settings        — preferências por aluno
--   2. events               — agenda pessoal (Google Agenda style)
--   3. event_recurrence     — regras de repetição por evento
--   4. event_reminders      — alarmes/lembretes por evento
--   5. review_schedule      — fila de revisão automática (4 ciclos)
--   6. notification_log     — histórico de notificações in-app
--
-- + função set_updated_at() para triggers
-- + função criar_revisoes_automaticas() para SRS (Ebbinghaus 1h/24h/7d/30d)
-- =====================================================================

-- ─── 0) Função genérica de updated_at ────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ─── 1) user_settings ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_settings (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  revisao_automatica_ativa    boolean NOT NULL DEFAULT true,
  notificacoes_push_ativas    boolean NOT NULL DEFAULT true,
  notificacoes_email_ativas   boolean NOT NULL DEFAULT false,
  notificacoes_som_ativo      boolean NOT NULL DEFAULT true,
  horario_estudo_inicio       time    NOT NULL DEFAULT '08:00',
  horario_estudo_fim          time    NOT NULL DEFAULT '22:00',
  dias_semana_estudo          text[]  NOT NULL DEFAULT ARRAY['seg','ter','qua','qui','sex','sab','dom'],
  intervalo_revisao_1         int     NOT NULL DEFAULT 1,   -- horas
  intervalo_revisao_2         int     NOT NULL DEFAULT 24,
  intervalo_revisao_3         int     NOT NULL DEFAULT 168,
  intervalo_revisao_4         int     NOT NULL DEFAULT 720,
  tema_preferido              text    NOT NULL DEFAULT 'dark',
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_settings TO authenticated;

CREATE POLICY "user_settings: own select"
  ON public.user_settings FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_settings: own insert"
  ON public.user_settings FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_settings: own update"
  ON public.user_settings FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "user_settings: own delete"
  ON public.user_settings FOR DELETE TO authenticated
  USING (user_id = auth.uid());

DROP TRIGGER IF EXISTS trg_user_settings_updated_at ON public.user_settings;
CREATE TRIGGER trg_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

-- ─── 2) events ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo          text NOT NULL,
  descricao       text,
  data_inicio     timestamptz NOT NULL,
  data_fim        timestamptz,
  dia_todo        boolean NOT NULL DEFAULT false,
  tipo            text NOT NULL DEFAULT 'pessoal'
                  CHECK (tipo IN ('estudo','revisao','aula','prova','pessoal','outro')),
  cor             text NOT NULL DEFAULT '#C9A84C',
  local           text,
  origem          text NOT NULL DEFAULT 'manual'
                  CHECK (origem IN ('manual','revisao_automatica','sistema')),
  referencia_id   uuid,
  referencia_tipo text,
  concluido       boolean NOT NULL DEFAULT false,
  concluido_em    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;

CREATE POLICY "events: own all"
  ON public.events FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP TRIGGER IF EXISTS trg_events_updated_at ON public.events;
CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_events_user_data ON public.events(user_id, data_inicio);
CREATE INDEX IF NOT EXISTS idx_events_data_inicio ON public.events(data_inicio);

-- ─── 3) event_recurrence ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_recurrence (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id                uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  frequencia              text NOT NULL
                          CHECK (frequencia IN ('diario','semanal','mensal','anual','personalizado')),
  intervalo               int  NOT NULL DEFAULT 1,
  dias_semana             text[],
  data_fim_recorrencia    date,
  created_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_recurrence ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_recurrence TO authenticated;

CREATE POLICY "event_recurrence: own all"
  ON public.event_recurrence FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_event_recurrence_event ON public.event_recurrence(event_id);

-- ─── 4) event_reminders ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.event_reminders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  minutos_antes int  NOT NULL,
  som_ativo     boolean NOT NULL DEFAULT true,
  tipo          text NOT NULL DEFAULT 'push'
                CHECK (tipo IN ('push','email','in_app')),
  disparado     boolean NOT NULL DEFAULT false,
  disparado_em  timestamptz
);

ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_reminders TO authenticated;

CREATE POLICY "event_reminders: own all"
  ON public.event_reminders FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_event_reminders_event ON public.event_reminders(event_id);
CREATE INDEX IF NOT EXISTS idx_event_reminders_pending ON public.event_reminders(disparado) WHERE disparado = false;

-- ─── 5) review_schedule ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.review_schedule (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conteudo_tipo  text NOT NULL
                 CHECK (conteudo_tipo IN ('study_summary','flashcard','subtopic')),
  conteudo_id    uuid NOT NULL,
  ciclo_numero   int  NOT NULL CHECK (ciclo_numero BETWEEN 1 AND 10),
  data_agendada  timestamptz NOT NULL,
  data_concluida timestamptz,
  status         text NOT NULL DEFAULT 'pendente'
                 CHECK (status IN ('pendente','concluida','atrasada','pulada')),
  desempenho     text CHECK (desempenho IN ('errei','dificil','facil')),
  event_id       uuid REFERENCES public.events(id) ON DELETE SET NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.review_schedule ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.review_schedule TO authenticated;

CREATE POLICY "review_schedule: own all"
  ON public.review_schedule FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_review_schedule_user_data ON public.review_schedule(user_id, data_agendada);
CREATE INDEX IF NOT EXISTS idx_review_schedule_pending  ON public.review_schedule(status, data_agendada) WHERE status = 'pendente';

-- ─── 6) notification_log ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notification_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo          text NOT NULL,
  corpo           text,
  tipo            text NOT NULL,
  lida            boolean NOT NULL DEFAULT false,
  enviada         boolean NOT NULL DEFAULT false,
  referencia_id   uuid,
  referencia_tipo text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_log TO authenticated;

CREATE POLICY "notification_log: own all"
  ON public.notification_log FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_notification_log_user_created ON public.notification_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_log_unread ON public.notification_log(user_id, lida) WHERE lida = false;

-- ─── 7) criar_revisoes_automaticas() ─────────────────────────────────
-- Lê user_settings; se ativada, cria 4 revisões com intervalos configurados
-- e seus eventos + reminders na agenda.
CREATE OR REPLACE FUNCTION public.criar_revisoes_automaticas(
  p_user_id uuid,
  p_conteudo_tipo text,
  p_conteudo_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cfg            public.user_settings%ROWTYPE;
  ciclo          int;
  data_revisao   timestamptz;
  intervalos     int[];
  new_event_id   uuid;
  evento_titulo  text;
  evento_desc    text;
BEGIN
  -- Carrega configuração do usuário (cria defaults se não existir)
  SELECT * INTO cfg FROM public.user_settings WHERE user_id = p_user_id;
  IF NOT FOUND THEN
    INSERT INTO public.user_settings(user_id) VALUES (p_user_id)
    RETURNING * INTO cfg;
  END IF;

  -- Respeita preferência
  IF NOT cfg.revisao_automatica_ativa THEN
    RETURN;
  END IF;

  intervalos := ARRAY[
    cfg.intervalo_revisao_1,
    cfg.intervalo_revisao_2,
    cfg.intervalo_revisao_3,
    cfg.intervalo_revisao_4
  ];

  IF p_conteudo_tipo = 'study_summary' THEN
    evento_titulo := 'Revisão de resumo';
    evento_desc   := 'Revise o resumo estudado para fixar o conteúdo na memória de longo prazo.';
  ELSIF p_conteudo_tipo = 'flashcard' THEN
    evento_titulo := 'Revisão de flashcard';
    evento_desc   := 'Revisão programada do flashcard estudado.';
  ELSIF p_conteudo_tipo = 'subtopic' THEN
    evento_titulo := 'Revisão de subtópico';
    evento_desc   := 'Revisão do conteúdo estudado neste subtópico.';
  ELSE
    evento_titulo := 'Revisão de conteúdo';
    evento_desc   := 'Revisão automática agendada pelo sistema.';
  END IF;

  FOR ciclo IN 1..4 LOOP
    data_revisao := now() + (intervalos[ciclo] || ' hours')::interval;

    INSERT INTO public.events(
      user_id, titulo, descricao, data_inicio, data_fim,
      tipo, cor, origem, referencia_id, referencia_tipo
    ) VALUES (
      p_user_id,
      evento_titulo || ' (' || ciclo || 'ª)',
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

REVOKE ALL ON FUNCTION public.criar_revisoes_automaticas(uuid, text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.criar_revisoes_automaticas(uuid, text, uuid) TO authenticated;
