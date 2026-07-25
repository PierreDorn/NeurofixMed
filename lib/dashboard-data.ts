import { createServerClient } from '@/lib/supabase-server';

export type ReviewCandidate = {
  note_slug: string;
  note_title: string;
  subject_id: string;
  count_due: number;
  count_flashcards: number;
};

export type ActiveCycleSummary = {
  note_slug: string;
  note_title: string;
  subject_id: string;
  stage: string;
  progress_pct: number;
  updated_at: string;
};

export async function getDueFlashcardsByNote(userId: string): Promise<ReviewCandidate[]> {
  const supabase = await createServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: notes } = await supabase
    .from('authored_notes')
    .select('slug, title, subject_id');
  if (!notes) return [];

  const results: ReviewCandidate[] = [];
  for (const n of notes) {
    const { data: cards } = await supabase
      .from('note_flashcards')
      .select('id')
      .eq('note_slug', n.slug);
    const total = cards?.length ?? 0;
    if (total === 0) continue;
    const ids = (cards ?? []).map((c) => c.id);

    const { data: reviews } = await supabase
      .from('note_flashcard_reviews')
      .select('flashcard_id, next_review_at, created_at')
      .eq('user_id', userId)
      .in('flashcard_id', ids)
      .order('created_at', { ascending: false });

    const lastByCard = new Map<string, { next_review_at: string }>();
    for (const r of reviews ?? []) {
      if (!lastByCard.has(r.flashcard_id))
        lastByCard.set(r.flashcard_id, { next_review_at: r.next_review_at });
    }

    let due = 0;
    for (const id of ids) {
      const last = lastByCard.get(id);
      if (!last) due++;
      else if (last.next_review_at <= today) due++;
    }
    if (due > 0) {
      results.push({
        note_slug: n.slug,
        note_title: n.title,
        subject_id: n.subject_id,
        count_due: due,
        count_flashcards: total,
      });
    }
  }
  return results.sort((a, b) => b.count_due - a.count_due).slice(0, 5);
}

export async function getActiveCycles(userId: string): Promise<ActiveCycleSummary[]> {
  const supabase = await createServerClient();
  const { data: cycles } = await supabase
    .from('user_note_cycles')
    .select('note_slug, stage, stages_completed, updated_at')
    .eq('user_id', userId)
    .neq('stage', 'mastered')
    .order('updated_at', { ascending: false })
    .limit(4);
  if (!cycles || cycles.length === 0) return [];

  const slugs = cycles.map((c) => c.note_slug);
  const { data: notes } = await supabase
    .from('authored_notes')
    .select('slug, title, subject_id')
    .in('slug', slugs);

  return cycles.map((c) => {
    const meta = (notes ?? []).find((n) => n.slug === c.note_slug);
    const completed = ((c.stages_completed ?? []) as string[]).length;
    return {
      note_slug: c.note_slug,
      note_title: meta?.title ?? c.note_slug,
      subject_id: meta?.subject_id ?? '',
      stage: c.stage,
      progress_pct: Math.min(100, Math.round((completed / 6) * 100)),
      updated_at: c.updated_at,
    };
  });
}
