'use server';

import { createServerClient } from '@/lib/supabase-server';
import { agendarRevisoes } from '@/lib/srs';

/**
 * Registra tentativa do aluno em uma questão e agenda revisões
 * automáticas no subtópico (primeira interação).
 *
 * IMPORTANTE: módulo básico, deve sofrer evolução futura.
 * Mantém-se idempotente via `ja_tem_revisoes`.
 */
export async function registrarTentativa(questionId: string, isCorrect: boolean): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sessão inválida' };

  const { error } = await supabase.from('question_attempts').insert({
    user_id: user.id,
    question_id: questionId,
    is_correct: isCorrect,
  });
  if (error) return { ok: false, error: error.message };

  // Side-effect: agenda revisão automática no subtópico vinculado
  try {
    const { data: q } = await supabase
      .from('questions')
      .select('subtopic_id, sub_subtopic_id')
      .eq('id', questionId)
      .maybeSingle();
    const subId = q?.sub_subtopic_id ?? q?.subtopic_id;
    if (subId) await agendarRevisoes('subtopic', subId);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[questoes] agendarRevisoes falhou:', err);
    }
  }

  return { ok: true };
}

/**
 * Conta questões publicadas conforme filtros aplicados.
 * Retorna { count } — ou { count: 0, error } em caso de falha.
 *
 * Passos:
 *  1) Se topics selecionados: filtra questões cujo subtópico pertence a esses topics
 *  2) Senão, se materiais selecionados: idem, mas por material_id via topics
 *  3) Senão: total de questões publicadas
 */
export async function contarQuestoes(
  materialIds: string[],
  topicIds: string[],
): Promise<{ count: number; error?: string }> {
  const supabase = await createServerClient();

  try {
    // Estratégia: pegamos os subtopic_ids elegíveis e usamos em `.in()`
    let subtopicIds: string[] = [];

    if (topicIds.length > 0) {
      const { data, error } = await supabase
        .from('subtopics')
        .select('id')
        .in('topic_id', topicIds);
      if (error) throw error;
      subtopicIds = (data ?? []).map((r) => r.id as string);
    } else if (materialIds.length > 0) {
      const { data: topics, error: eTopics } = await supabase
        .from('topics')
        .select('id')
        .in('material_id', materialIds);
      if (eTopics) throw eTopics;
      const topicPool = (topics ?? []).map((t) => t.id as string);
      if (topicPool.length === 0) return { count: 0 };
      const { data, error } = await supabase
        .from('subtopics')
        .select('id')
        .in('topic_id', topicPool);
      if (error) throw error;
      subtopicIds = (data ?? []).map((r) => r.id as string);
    }

    let q = supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    if (subtopicIds.length > 0) {
      q = q.in('subtopic_id', subtopicIds);
    }

    const { count, error } = await q;
    if (error) throw error;
    return { count: count ?? 0 };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Falha ao contar questões';
    return { count: 0, error: msg };
  }
}
