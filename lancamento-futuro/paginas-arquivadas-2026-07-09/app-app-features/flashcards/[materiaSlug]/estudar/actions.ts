'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase-server';
import { agendarRevisoes } from '@/lib/srs';

const INTERVALS = [1, 3, 7, 14, 30, 60, 120];

function addDaysISODate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export interface RecordReviewResult {
  ok: boolean;
  error?: string;
}

export async function recordReview(
  flashcardId: string,
  hit: boolean,
): Promise<RecordReviewResult> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Não autenticado' };

  const { data: existing } = await supabase
    .from('flashcard_reviews')
    .select('id, acertos_seguidos')
    .eq('user_id', user.id)
    .eq('flashcard_id', flashcardId)
    .maybeSingle();

  const acertosAtual = existing?.acertos_seguidos ?? 0;
  const novosAcertos = hit ? acertosAtual + 1 : 0;
  const intervalDays = hit ? INTERVALS[Math.min(novosAcertos - 1, INTERVALS.length - 1)] : 1;
  const nextDate = hit ? addDaysISODate(intervalDays) : addDaysISODate(0);
  const dificuldade = !hit ? 'dificil' : (novosAcertos >= 4 ? 'facil' : 'media');

  if (existing) {
    const { error } = await supabase
      .from('flashcard_reviews')
      .update({
        acertos_seguidos: novosAcertos,
        next_review_date: nextDate,
        dificuldade,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase
      .from('flashcard_reviews')
      .insert({
        user_id: user.id,
        flashcard_id: flashcardId,
        acertos_seguidos: novosAcertos,
        next_review_date: nextDate,
        dificuldade,
        updated_at: new Date().toISOString(),
      });
    if (error) return { ok: false, error: error.message };

    // Primeira interação com este flashcard: agenda revisões automáticas
    // (fire-and-forget — falhas não bloqueiam o fluxo de estudo)
    try {
      await agendarRevisoes('flashcard', flashcardId);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[recordReview] agendarRevisoes falhou:', err);
      }
    }
  }

  revalidatePath('/flashcards');
  return { ok: true };
}
