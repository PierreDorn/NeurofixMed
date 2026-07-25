'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '@/components/v73/Shell';
import NoteFlashcardDeck from '@/components/v73/NoteFlashcardDeck';
import NoteQuestionPractice from '@/components/v73/NoteQuestionPractice';
import NoteCycle from '@/components/v73/NoteCycle';
import { toggleFavorite } from '@/app/(app)/favorites/actions';
import type { NoteHeader, NoteTab } from '@/lib/notes';
import type { NoteFlashcard, FlashcardLastReview } from '@/lib/note-flashcards';
import type { NoteQuestion, QuestionLastAttempt } from '@/lib/note-questions';
import type { NoteCycleState } from '@/lib/note-cycle-shared';

type Props = {
  note: NoteHeader;
  tabs: NoteTab[];
  activeTab: string;
  deck: { cards: NoteFlashcard[]; lastReviewByCard: Record<string, FlashcardLastReview> } | null;
  questionPack: {
    questions: NoteQuestion[];
    lastAttemptByQuestion: Record<string, QuestionLastAttempt>;
  } | null;
  cycle: NoteCycleState | null;
  isFavorite: boolean;
};

function parseBreadcrumb(breadcrumb: string | null): { subject: string; area: string } {
  if (!breadcrumb) return { subject: '', area: '' };
  const parts = breadcrumb.split('·').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return { subject: '', area: '' };
  const subject = parts[0];
  // Ignora tokens tipo "Aula 01"; pega o último elemento não-Aula como área.
  const areaCandidates = parts.slice(1).filter((p) => !/^aula\s/i.test(p));
  const area = areaCandidates[areaCandidates.length - 1] ?? '';
  return { subject, area };
}

export default function NoteView({ note, tabs, activeTab, deck, questionPack, cycle, isFavorite }: Props) {
  const router = useRouter();
  const [favPending, startFav] = useTransition();
  const current = tabs.find((t) => t.tab_key === activeTab) ?? tabs[0];
  const pillTone = note.meta.pillTone ?? 'blue';
  const contentRef = useRef<HTMLDivElement>(null);

  const [ttsState, setTtsState] = useState<'idle' | 'speaking' | 'paused'>('idle');

  useEffect(() => {
    // Se o usuário mudar de aba, para a leitura em andamento.
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setTtsState('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function handleSpeak() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Seu navegador não suporta leitura em voz. Tente Chrome ou Safari desktop.');
      return;
    }
    const synth = window.speechSynthesis;
    if (ttsState === 'speaking') {
      synth.pause();
      setTtsState('paused');
      return;
    }
    if (ttsState === 'paused') {
      synth.resume();
      setTtsState('speaking');
      return;
    }
    const text = contentRef.current?.textContent?.trim();
    if (!text) {
      alert('Não há texto para ler nesta aba.');
      return;
    }
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    utter.rate = 1;
    utter.pitch = 1;
    utter.onend = () => setTtsState('idle');
    utter.onerror = () => setTtsState('idle');
    synth.speak(utter);
    setTtsState('speaking');
  }

  function handleScheduleReview() {
    const { subject, area } = parseBreadcrumb(note.breadcrumb);
    const params = new URLSearchParams({
      agendar: '1',
      note_slug: note.slug,
      title: note.title,
    });
    if (subject) params.set('subject', subject);
    if (area) params.set('area', area);
    router.push(`/review?${params.toString()}`);
  }

  const speakLabel =
    ttsState === 'speaking' ? '⏸ Pausar leitura' : ttsState === 'paused' ? '▶ Continuar' : '♬ Ouvir tela atual';

  return (
    <Shell breadcrumb={note.title}>
      <section className="page active" id={`page-note-${note.slug}`}>
        <button
          type="button"
          className="text-link"
          onClick={() => router.push(`/subjects/${note.subject_id}`)}
        >
          ← Voltar
        </button>

        <div style={{ marginTop: 18 }} className="note-header">
          {note.breadcrumb && <div className="crumb">{note.breadcrumb}</div>}
          <h1>{note.title}</h1>
          {note.subtitle && <p>{note.subtitle}</p>}
          {note.meta.pill && (
            <span className={`pill ${pillTone}`} style={{ marginTop: 12, display: 'inline-block' }}>
              {note.meta.pill}
            </span>
          )}
          <div className="note-tools">
            <button
              type="button"
              onClick={() => startFav(() => toggleFavorite('note', note.slug))}
              disabled={favPending}
              title={isFavorite ? 'Desfavoritar' : 'Favoritar'}
            >
              {isFavorite ? '★ Salva' : '☆ Salvar'}
            </button>
            <button type="button" onClick={handleSpeak} title="Ler o conteúdo desta aba em voz">
              {speakLabel}
            </button>
            <button
              type="button"
              onClick={handleScheduleReview}
              title="Agendar revisão desta aula"
            >
              ↻ Programar revisão
            </button>
          </div>
        </div>

        <NoteCycle noteSlug={note.slug} cycle={cycle} />

        <div className="note-tabs" style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {tabs.map((t) => (
            <button
              key={t.tab_key}
              type="button"
              className={`pill ${t.tab_key === activeTab ? 'active' : ''}`}
              onClick={() => router.push(`/notes/${note.slug}/${t.tab_key}`)}
              style={{ cursor: 'pointer' }}
            >
              {t.tab_label}
            </button>
          ))}
        </div>

        <div ref={contentRef}>
          {deck ? (
            <div style={{ marginTop: 18 }}>
              <NoteFlashcardDeck
                noteSlug={note.slug}
                cards={deck.cards}
                lastReviewByCard={deck.lastReviewByCard}
              />
            </div>
          ) : questionPack ? (
            <div style={{ marginTop: 18 }}>
              <NoteQuestionPractice
                noteSlug={note.slug}
                questions={questionPack.questions}
                lastAttemptByQuestion={questionPack.lastAttemptByQuestion}
              />
            </div>
          ) : (
            <article
              className="card note-content"
              style={{ marginTop: 18, padding: '28px 32px' }}
              dangerouslySetInnerHTML={{ __html: current?.content_html ?? '' }}
            />
          )}
        </div>
      </section>
    </Shell>
  );
}
