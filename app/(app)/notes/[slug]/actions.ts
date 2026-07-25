'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase-server';

type Rating = 'again' | 'hard' | 'good' | 'easy';

async function requireUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');
  return { supabase, user };
}

function nextInterval(prev: {
  streak: number;
  interval_days: number;
} | null, rating: Rating) {
  const prevStreak = prev?.streak ?? 0;
  const prevInterval = prev?.interval_days ?? 0;
  if (rating === 'again') {
    return { streak: 0, interval_days: 1 };
  }
  if (rating === 'hard') {
    return { streak: prevStreak + 1, interval_days: Math.max(2, Math.round(prevInterval * 1.2 || 2)) };
  }
  if (rating === 'good') {
    const base = prevInterval > 0 ? Math.round(prevInterval * 2.2) : 3;
    return { streak: prevStreak + 1, interval_days: Math.min(base, 60) };
  }
  // easy
  const base = prevInterval > 0 ? Math.round(prevInterval * 2.8) : 5;
  return { streak: prevStreak + 1, interval_days: Math.min(base, 90) };
}

export async function rateFlashcard(flashcardId: string, rating: Rating, noteSlug: string) {
  const { supabase, user } = await requireUser();

  const { data: prev } = await supabase
    .from('note_flashcard_reviews')
    .select('streak, interval_days')
    .eq('user_id', user.id)
    .eq('flashcard_id', flashcardId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { streak, interval_days } = nextInterval(prev, rating);
  const next = new Date();
  next.setDate(next.getDate() + interval_days);
  const nextIso = next.toISOString().slice(0, 10);

  await supabase.from('note_flashcard_reviews').insert({
    user_id: user.id,
    flashcard_id: flashcardId,
    rating,
    streak,
    interval_days,
    next_review_at: nextIso,
  });

  revalidatePath(`/notes/${noteSlug}/flashcards`);
  revalidatePath(`/notes/${noteSlug}/flash`);

  return { streak, interval_days, next_review_at: nextIso };
}

export async function advanceCycleStage(noteSlug: string, currentStage: string) {
  const { supabase, user } = await requireUser();
  const order = ['understand', 'retrieve', 'apply', 'correct', 'review', 'prove', 'mastered'];
  const i = order.indexOf(currentStage);
  const next = i < 0 || i >= order.length - 1 ? 'mastered' : order[i + 1];

  const { data: existing } = await supabase
    .from('user_note_cycles')
    .select('stages_completed')
    .eq('user_id', user.id)
    .eq('note_slug', noteSlug)
    .maybeSingle();
  const completed = new Set((existing?.stages_completed ?? []) as string[]);
  if (currentStage && currentStage !== 'mastered') completed.add(currentStage);

  await supabase.from('user_note_cycles').upsert(
    {
      user_id: user.id,
      note_slug: noteSlug,
      stage: next,
      stages_completed: Array.from(completed),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,note_slug' },
  );

  revalidatePath(`/notes/${noteSlug}`, 'layout');
  revalidatePath('/dashboard');
  revalidatePath('/progress');
  return { stage: next };
}

export async function resetCycleStage(noteSlug: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from('user_note_cycles')
    .delete()
    .eq('user_id', user.id)
    .eq('note_slug', noteSlug);
  revalidatePath(`/notes/${noteSlug}`, 'layout');
  revalidatePath('/dashboard');
  revalidatePath('/progress');
}

export async function checkQuestion(
  questionId: string,
  chosen: string,
  noteSlug: string,
  mode: 'theory' | 'clinical' = 'theory',
) {
  const { supabase, user } = await requireUser();

  const { data: q, error } = await supabase
    .from('note_questions')
    .select('answer, explanation, options')
    .eq('id', questionId)
    .maybeSingle();
  if (error || !q) throw new Error('Questão não encontrada');

  const isCorrect = String(chosen).toUpperCase() === String(q.answer).toUpperCase();

  await supabase.from('note_question_attempts').insert({
    user_id: user.id,
    question_id: questionId,
    chosen,
    is_correct: isCorrect,
    mode,
  });

  revalidatePath(`/notes/${noteSlug}/questions`);
  revalidatePath(`/notes/${noteSlug}/question`);

  return {
    isCorrect,
    correctAnswer: q.answer as string,
    explanation: (q.explanation as string) ?? null,
    options: (q.options as Record<string, string>) ?? {},
  };
}
