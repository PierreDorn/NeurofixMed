import { createServerClient } from '@/lib/supabase-server';

export type QuestionStats = {
  total_attempts: number;
  correct: number;
  wrong: number;
  accuracy: number;
  unique_answered: number;
};

export type FlashcardStats = {
  total_reviews: number;
  cards_seen: number;
  rating_counts: Record<'again' | 'hard' | 'good' | 'easy', number>;
};

export type CycleStats = {
  notes_started: number;
  notes_mastered: number;
};

export type SubjectProgress = {
  subject_id: string;
  attempts: number;
  correct: number;
  accuracy: number;
};

export async function getUserProgress(userId: string): Promise<{
  question: QuestionStats;
  flashcard: FlashcardStats;
  cycle: CycleStats;
  bySubject: SubjectProgress[];
}> {
  const supabase = await createServerClient();

  const [attemptsRes, reviewsRes, cyclesRes, questionsBySubject] = await Promise.all([
    supabase
      .from('note_question_attempts')
      .select('question_id, is_correct')
      .eq('user_id', userId),
    supabase
      .from('note_flashcard_reviews')
      .select('flashcard_id, rating')
      .eq('user_id', userId),
    supabase
      .from('user_note_cycles')
      .select('note_slug, stage')
      .eq('user_id', userId),
    supabase
      .from('note_question_attempts')
      .select('question_id, is_correct, note_questions!inner(note_slug, authored_notes!inner(subject_id))')
      .eq('user_id', userId),
  ]);

  const attempts = attemptsRes.data ?? [];
  const correct = attempts.filter((a) => a.is_correct).length;
  const wrong = attempts.length - correct;
  const uniqueAnswered = new Set(attempts.map((a) => a.question_id)).size;

  const reviews = reviewsRes.data ?? [];
  const ratingCounts = { again: 0, hard: 0, good: 0, easy: 0 };
  for (const r of reviews) {
    if (r.rating in ratingCounts) ratingCounts[r.rating as keyof typeof ratingCounts]++;
  }
  const cardsSeen = new Set(reviews.map((r) => r.flashcard_id)).size;

  const cycles = cyclesRes.data ?? [];
  const notesStarted = cycles.length;
  const notesMastered = cycles.filter((c) => c.stage === 'mastered').length;

  // Progresso por matéria (via join question -> note -> subject).
  const bySubjectMap = new Map<string, { attempts: number; correct: number }>();
  type Row = {
    is_correct: boolean;
    note_questions: {
      note_slug: string;
      authored_notes: { subject_id: string } | { subject_id: string }[] | null;
    } | null;
  };
  for (const row of (questionsBySubject.data ?? []) as unknown as Row[]) {
    const noteData = row.note_questions?.authored_notes;
    const subjectId = Array.isArray(noteData) ? noteData[0]?.subject_id : noteData?.subject_id;
    if (!subjectId) continue;
    const acc = bySubjectMap.get(subjectId) ?? { attempts: 0, correct: 0 };
    acc.attempts++;
    if (row.is_correct) acc.correct++;
    bySubjectMap.set(subjectId, acc);
  }
  const bySubject: SubjectProgress[] = Array.from(bySubjectMap.entries())
    .map(([subject_id, v]) => ({
      subject_id,
      attempts: v.attempts,
      correct: v.correct,
      accuracy: v.attempts ? Math.round((v.correct / v.attempts) * 100) : 0,
    }))
    .sort((a, b) => b.attempts - a.attempts);

  return {
    question: {
      total_attempts: attempts.length,
      correct,
      wrong,
      accuracy: attempts.length ? Math.round((correct / attempts.length) * 100) : 0,
      unique_answered: uniqueAnswered,
    },
    flashcard: {
      total_reviews: reviews.length,
      cards_seen: cardsSeen,
      rating_counts: ratingCounts,
    },
    cycle: {
      notes_started: notesStarted,
      notes_mastered: notesMastered,
    },
    bySubject,
  };
}
