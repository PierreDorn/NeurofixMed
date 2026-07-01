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
