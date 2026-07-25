import { createServerClient } from '@/lib/supabase-server';

export type NoteQuestion = {
  id: string;
  ordering: number;
  stem: string;
  options: Record<string, string>;
  answer: string;
  explanation: string | null;
  bank: string | null;
  meta: Record<string, unknown>;
};

export type QuestionLastAttempt = {
  question_id: string;
  chosen: string;
  is_correct: boolean;
  created_at: string;
};

export async function getNoteQuestionsAndAttempts(slug: string): Promise<{
  questions: NoteQuestion[];
  lastAttemptByQuestion: Record<string, QuestionLastAttempt>;
}> {
  const supabase = await createServerClient();
  const [qRes, userRes] = await Promise.all([
    supabase
      .from('note_questions')
      .select('id, ordering, stem, options, answer, explanation, bank, meta')
      .eq('note_slug', slug)
      .order('ordering', { ascending: true }),
    supabase.auth.getUser(),
  ]);
  const questions = (qRes.data ?? []) as NoteQuestion[];
  const userId = userRes.data.user?.id;
  const lastAttemptByQuestion: Record<string, QuestionLastAttempt> = {};
  if (!userId || questions.length === 0) return { questions, lastAttemptByQuestion };

  const ids = questions.map((q) => q.id);
  const { data: attempts } = await supabase
    .from('note_question_attempts')
    .select('question_id, chosen, is_correct, created_at')
    .eq('user_id', userId)
    .in('question_id', ids)
    .order('created_at', { ascending: false });
  for (const a of attempts ?? []) {
    if (!lastAttemptByQuestion[a.question_id]) {
      lastAttemptByQuestion[a.question_id] = a as QuestionLastAttempt;
    }
  }
  return { questions, lastAttemptByQuestion };
}
