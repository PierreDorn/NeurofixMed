'use client';

import { useMemo, useState, useTransition } from 'react';
import { rateFlashcard } from '@/app/(app)/notes/[slug]/actions';
import type { NoteFlashcard, FlashcardLastReview } from '@/lib/note-flashcards';

type Rating = 'again' | 'hard' | 'good' | 'easy';

const RATINGS: Array<{ id: Rating; label: string; color: string }> = [
  { id: 'again', label: 'Errei', color: '#b94a48' },
  { id: 'hard', label: 'Difícil', color: '#c48f21' },
  { id: 'good', label: 'Bom', color: '#286ed8' },
  { id: 'easy', label: 'Fácil', color: '#2d8a63' },
];

type Props = {
  noteSlug: string;
  cards: NoteFlashcard[];
  lastReviewByCard: Record<string, FlashcardLastReview>;
};

export default function NoteFlashcardDeck({ noteSlug, cards, lastReviewByCard }: Props) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [pending, start] = useTransition();
  const [localReviews, setLocalReviews] = useState<Record<string, FlashcardLastReview>>(
    () => ({ ...lastReviewByCard }),
  );

  const totalCards = cards.length;
  const card = cards[index];

  const reviewedCount = useMemo(() => Object.keys(localReviews).length, [localReviews]);
  const dueTodayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    let n = 0;
    for (const id of cards.map((c) => c.id)) {
      const r = localReviews[id];
      if (!r || (r.next_review_at ?? '') <= today) n++;
    }
    return n;
  }, [cards, localReviews]);

  if (totalCards === 0) {
    return (
      <div className="card" style={{ padding: 22, textAlign: 'center' }}>
        Este deck ainda não tem flashcards.
      </div>
    );
  }

  function next(delta: 1 | -1) {
    setFlipped(false);
    setIndex((i) => (i + delta + totalCards) % totalCards);
  }

  function handleRate(rating: Rating) {
    if (!card) return;
    start(async () => {
      const res = await rateFlashcard(card.id, rating, noteSlug);
      setLocalReviews((r) => ({
        ...r,
        [card.id]: {
          flashcard_id: card.id,
          rating,
          streak: res.streak,
          interval_days: res.interval_days,
          next_review_at: res.next_review_at,
        },
      }));
      setTimeout(() => next(1), 100);
    });
  }

  const last = localReviews[card?.id];

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <b style={{ fontSize: 18 }}>Deck de flashcards</b>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            {reviewedCount} de {totalCards} vistos hoje · {dueTodayCount} pendentes
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="mini-btn" onClick={() => next(-1)} disabled={pending}>
            ← Anterior
          </button>
          <button type="button" className="mini-btn" onClick={() => next(1)} disabled={pending}>
            Próximo →
          </button>
        </div>
      </div>

      <div className="progress"><span style={{ width: `${((index + 1) / totalCards) * 100}%` }} /></div>

      <div
        onClick={() => setFlipped((f) => !f)}
        style={{
          minHeight: 260,
          borderRadius: 22,
          border: '1px solid var(--line)',
          background: '#fff',
          padding: '32px 34px',
          cursor: 'pointer',
          boxShadow: '0 18px 50px rgba(31,27,18,.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'transform .2s ease',
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span className="pill" style={{ fontWeight: 800 }}>
            {flipped ? 'Verso' : 'Frente'} · {index + 1} / {totalCards}
          </span>
          {card?.track && (
            <span className="pill blue" style={{ fontWeight: 700 }}>{card.track}</span>
          )}
        </div>
        <div style={{ fontSize: 20, lineHeight: 1.55, color: '#101113', marginTop: 18, whiteSpace: 'pre-wrap' }}>
          {flipped ? card?.back : card?.front}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 18, textAlign: 'right' }}>
          Toque no card para virar (ou Espaço)
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {RATINGS.map((r) => (
          <button
            key={r.id}
            type="button"
            className="btn"
            disabled={pending || !flipped}
            onClick={() => handleRate(r.id)}
            style={{
              background: flipped ? r.color : '#f0efe9',
              color: flipped ? '#fff' : '#666',
              border: 0,
              padding: '14px 10px',
              borderRadius: 14,
              fontWeight: 800,
              cursor: flipped ? 'pointer' : 'not-allowed',
              opacity: pending ? 0.7 : 1,
            }}
            title={flipped ? `Marcar como ${r.label}` : 'Vire o card primeiro'}
          >
            {r.label}
          </button>
        ))}
      </div>

      {last && (
        <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
          Última avaliação: <b>{last.rating}</b> · próxima revisão em{' '}
          {last.next_review_at
            ? new Date(last.next_review_at).toLocaleDateString('pt-BR')
            : '—'}{' '}
          · sequência {last.streak}
        </div>
      )}
    </div>
  );
}
