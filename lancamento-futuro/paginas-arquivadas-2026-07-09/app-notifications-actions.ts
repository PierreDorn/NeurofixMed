'use server';

import { createServerClient } from '@/lib/supabase-server';

export interface NotificationRow {
  id: string;
  titulo: string;
  corpo: string | null;
  tipo: string;
  lida: boolean;
  enviada: boolean;
  referencia_id: string | null;
  referencia_tipo: string | null;
  created_at: string;
}

export interface PendingReminder {
  reminder_id: string;
  event_id: string;
  evento_titulo: string;
  evento_descricao: string | null;
  evento_tipo: string;
  evento_cor: string;
  data_inicio: string;
  som_ativo: boolean;
}

/**
 * Busca lembretes que devem disparar agora.
 * Critério: event.data_inicio - minutos_antes <= now AND disparado=false.
 */
export async function fetchPendingReminders(): Promise<PendingReminder[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Pega eventos do usuário começando nas próximas 24h + reminders ainda não disparados
  const now = new Date();
  const horizon = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const { data } = await supabase
    .from('event_reminders')
    .select(`
      id, minutos_antes, disparado, som_ativo,
      events!inner(id, titulo, descricao, tipo, cor, data_inicio, user_id, concluido)
    `)
    .eq('disparado', false)
    .gte('events.data_inicio', now.toISOString())
    .lte('events.data_inicio', horizon.toISOString())
    .eq('events.user_id', user.id)
    .eq('events.concluido', false);

  type Row = {
    id: string;
    minutos_antes: number;
    disparado: boolean;
    som_ativo: boolean;
    events: { id: string; titulo: string; descricao: string | null; tipo: string; cor: string; data_inicio: string; user_id: string; concluido: boolean };
  };

  const rows = (data ?? []) as unknown as Row[];
  const due: PendingReminder[] = [];
  const nowMs = now.getTime();

  for (const r of rows) {
    const triggerAt = new Date(r.events.data_inicio).getTime() - r.minutos_antes * 60 * 1000;
    if (triggerAt <= nowMs) {
      due.push({
        reminder_id: r.id,
        event_id: r.events.id,
        evento_titulo: r.events.titulo,
        evento_descricao: r.events.descricao,
        evento_tipo: r.events.tipo,
        evento_cor: r.events.cor,
        data_inicio: r.events.data_inicio,
        som_ativo: r.som_ativo,
      });
    }
  }

  return due;
}

export async function markReminderDispatched(reminderId: string, alsoLogNotification?: { titulo: string; corpo?: string; tipo?: string; referencia_id?: string; referencia_tipo?: string }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  await supabase.from('event_reminders')
    .update({ disparado: true, disparado_em: new Date().toISOString() })
    .eq('id', reminderId);

  if (alsoLogNotification) {
    await supabase.from('notification_log').insert({
      user_id: user.id,
      titulo: alsoLogNotification.titulo,
      corpo: alsoLogNotification.corpo ?? null,
      tipo: alsoLogNotification.tipo ?? 'lembrete_evento',
      enviada: true,
      referencia_id: alsoLogNotification.referencia_id ?? null,
      referencia_tipo: alsoLogNotification.referencia_tipo ?? null,
    });
  }
  return { ok: true };
}

export async function listNotifications(limit = 20): Promise<NotificationRow[]> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('notification_log')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as NotificationRow[];
}

export async function markNotificationsRead(ids?: string[]) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const q = supabase.from('notification_log').update({ lida: true }).eq('user_id', user.id);
  const { error } = ids && ids.length > 0 ? await q.in('id', ids) : await q.eq('lida', false);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
