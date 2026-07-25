import { createServerClient } from '@/lib/supabase-server';

export type NoteFlashcard = {
  id: string;
  ordering: number;
  front: string;
  back: string;
  track: string | null;
};

export type FlashcardLastReview = {
  flashcard_id: string;
  rating: 'again' | 'hard' | 'good' | 'easy' | null;
  streak: number;
  interval_days: number;
  next_review_at: string | null;
};

export async function getNoteDeckAndReviews(slug: string): Promise<{
  cards: NoteFlashcard[];
  lastReviewByCard: Record<string, FlashcardLastReview>;
}> {
  const supabase = await createServerClient();
  const [cardsRes, userRes] = await Promise.all([
    supabase
      .from('note_flashcards')
      .select('id, ordering, front, back, track')
      .eq('note_slug', slug)
      .order('ordering', { ascending: true }),
    supabase.auth.getUser(),
  ]);
  const cards = (cardsRes.data ?? []) as NoteFlashcard[];
  const userId = userRes.data.user?.id;
  const lastReviewByCard: Record<string, FlashcardLastReview> = {};
  if (!userId || cards.length === 0) return { cards, lastReviewByCard };

  const ids = cards.map((c) => c.id);
  const { data: reviews } = await supabase
    .from('note_flashcard_reviews')
    .select('flashcard_id, rating, streak, interval_days, next_review_at, created_at')
    .eq('user_id', userId)
    .in('flashcard_id', ids)
    .order('created_at', { ascending: false });

  for (const r of reviews ?? []) {
    if (!lastReviewByCard[r.flashcard_id]) {
      lastReviewByCard[r.flashcard_id] = {
        flashcard_id: r.flashcard_id,
        rating: r.rating as 'again' | 'hard' | 'good' | 'easy',
        streak: r.streak,
        interval_days: r.interval_days,
        next_review_at: r.next_review_at,
      };
    }
  }
  return { cards, lastReviewByCard };
}
