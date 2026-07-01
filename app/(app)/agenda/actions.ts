'use server';

import { createServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export interface EventoInput {
  titulo: string;
  descricao?: string | null;
  data_inicio: string;          // ISO
  data_fim?: string | null;     // ISO
  dia_todo?: boolean;
  tipo?: 'estudo' | 'revisao' | 'aula' | 'prova' | 'pessoal' | 'outro';
  cor?: string;
  local?: string | null;
  reminders?: number[];         // minutos antes (ex: [15, 60])
  recurrence?: {
    frequencia: 'diario' | 'semanal' | 'mensal' | 'anual' | 'personalizado';
    intervalo?: number;
    dias_semana?: string[];
    data_fim_recorrencia?: string | null;
  } | null;
}

export async function createEvent(input: EventoInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!input.titulo?.trim()) return { ok: false, error: 'Título obrigatório' };
  if (input.data_fim && new Date(input.data_fim) < new Date(input.data_inicio)) {
    return { ok: false, error: 'Data de término deve ser depois da data de início' };
  }

  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sessão inválida' };

  const { data: evt, error: evtErr } = await supabase
    .from('events')
    .insert({
      user_id: user.id,
      titulo: input.titulo.trim(),
      descricao: input.descricao?.trim() || null,
      data_inicio: input.data_inicio,
      data_fim: input.data_fim ?? null,
      dia_todo: input.dia_todo ?? false,
      tipo: input.tipo ?? 'pessoal',
      cor: input.cor ?? '#C9A84C',
      local: input.local?.trim() || null,
      origem: 'manual',
    })
    .select('id')
    .single();

  if (evtErr || !evt) return { ok: false, error: evtErr?.message ?? 'Falha ao criar' };

  if (input.reminders && input.reminders.length > 0) {
    await supabase.from('event_reminders').insert(
      input.reminders.map(min => ({
        event_id: evt.id,
        minutos_antes: min,
        tipo: 'push' as const,
      })),
    );
  }

  if (input.recurrence) {
    await supabase.from('event_recurrence').insert({
      event_id: evt.id,
      frequencia: input.recurrence.frequencia,
      intervalo: input.recurrence.intervalo ?? 1,
      dias_semana: input.recurrence.dias_semana ?? null,
      data_fim_recorrencia: input.recurrence.data_fim_recorrencia ?? null,
    });
  }

  revalidatePath('/agenda');
  return { ok: true, id: evt.id };
}

export async function updateEvent(id: string, patch: Partial<EventoInput>): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sessão inválida' };

  const { reminders, recurrence, ...rest } = patch;
  const update: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rest)) {
    if (v !== undefined) update[k] = v;
  }

  if (Object.keys(update).length > 0) {
    const { error } = await supabase.from('events').update(update).eq('id', id).eq('user_id', user.id);
    if (error) return { ok: false, error: error.message };
  }

  if (reminders !== undefined) {
    await supabase.from('event_reminders').delete().eq('event_id', id);
    if (reminders.length > 0) {
      await supabase.from('event_reminders').insert(
        reminders.map(min => ({ event_id: id, minutos_antes: min, tipo: 'push' as const })),
      );
    }
  }

  if (recurrence !== undefined) {
    await supabase.from('event_recurrence').delete().eq('event_id', id);
    if (recurrence) {
      await supabase.from('event_recurrence').insert({
        event_id: id,
        frequencia: recurrence.frequencia,
        intervalo: recurrence.intervalo ?? 1,
        dias_semana: recurrence.dias_semana ?? null,
        data_fim_recorrencia: recurrence.data_fim_recorrencia ?? null,
      });
    }
  }

  revalidatePath('/agenda');
  return { ok: true };
}

export async function deleteEvent(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sessão inválida' };

  const { error } = await supabase.from('events').delete().eq('id', id).eq('user_id', user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/agenda');
  return { ok: true };
}

export async function toggleEventConcluido(id: string, concluido: boolean): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sessão inválida' };

  const { error } = await supabase
    .from('events')
    .update({ concluido, concluido_em: concluido ? new Date().toISOString() : null })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath('/agenda');
  return { ok: true };
}

/**
 * Conclui uma revisão automática aplicando o desempenho do aluno.
 *
 * Resolve o review_schedule a partir do event_id e chama o RPC
 * `aplicar_desempenho_revisao`, que:
 *   - Marca a revisão como concluída + grava desempenho
 *   - Marca o evento como concluído
 *   - "errei"   → cria revisão extra em 50% do intervalo_1
 *   - "facil"   → cria próxima revisão expandida 1.5×
 *   - 3× facil  → arquiva (pula revisões pendentes restantes)
 *   - "dificil" → mantém ciclo padrão (próxima já está agendada)
 *
 * Para eventos que NÃO são revisão automática (sem entrada em review_schedule),
 * apenas marca o evento como concluído.
 */
export async function concluirRevisaoComDesempenho(
  eventId: string,
  desempenho: 'errei' | 'dificil' | 'facil',
): Promise<{ ok: boolean; adaptativo: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, adaptativo: false, error: 'Sessão inválida' };

  // Procura review_schedule vinculado a este evento (do próprio usuário)
  const { data: rs } = await supabase
    .from('review_schedule')
    .select('id, status')
    .eq('event_id', eventId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!rs) {
    // Evento normal sem fila de revisão — apenas marca concluído
    const { error } = await supabase
      .from('events')
      .update({ concluido: true, concluido_em: new Date().toISOString() })
      .eq('id', eventId)
      .eq('user_id', user.id);
    if (error) return { ok: false, adaptativo: false, error: error.message };
    revalidatePath('/agenda');
    return { ok: true, adaptativo: false };
  }

  if (rs.status === 'concluida') {
    return { ok: true, adaptativo: false };
  }

  const { error } = await supabase.rpc('aplicar_desempenho_revisao', {
    p_review_id: rs.id,
    p_desempenho: desempenho,
  });
  if (error) return { ok: false, adaptativo: true, error: error.message };

  revalidatePath('/agenda');
  return { ok: true, adaptativo: true };
}
