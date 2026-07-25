'use client';

import { useMemo, useState, useTransition } from 'react';
import { checkQuestion } from '@/app/(app)/notes/[slug]/actions';
import type { NoteQuestion, QuestionLastAttempt } from '@/lib/note-questions';

type Props = {
  noteSlug: string;
  questions: NoteQuestion[];
  lastAttemptByQuestion: Record<string, QuestionLastAttempt>;
};

type Feedback = {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string | null;
} | null;

export default function NoteQuestionPractice({ noteSlug, questions, lastAttemptByQuestion }: Props) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [pending, start] = useTransition();
  const [localAttempts, setLocalAttempts] = useState<Record<string, QuestionLastAttempt>>(
    () => ({ ...lastAttemptByQuestion }),
  );

  const total = questions.length;
  const q = questions[index];

  const stats = useMemo(() => {
    let correct = 0;
    let attempted = 0;
    for (const q of questions) {
      const a = localAttempts[q.id];
      if (a) {
        attempted++;
        if (a.is_correct) correct++;
      }
    }
    return { correct, attempted, accuracy: attempted ? Math.round((correct / attempted) * 100) : 0 };
  }, [questions, localAttempts]);

  if (total === 0) {
    return (
      <div className="card" style={{ padding: 22, textAlign: 'center' }}>
        Este banco ainda não tem questões cadastradas.
      </div>
    );
  }

  function goTo(delta: 1 | -1) {
    setFeedback(null);
    setChosen(null);
    setIndex((i) => (i + delta + total) % total);
  }

  function handleSubmit() {
    if (!q || !chosen) return;
    start(async () => {
      const res = await checkQuestion(q.id, chosen, noteSlug);
      setFeedback({
        isCorrect: res.isCorrect,
        correctAnswer: res.correctAnswer,
        explanation: res.explanation,
      });
      setLocalAttempts((r) => ({
        ...r,
        [q.id]: {
          question_id: q.id,
          chosen,
          is_correct: res.isCorrect,
          created_at: new Date().toISOString(),
        },
      }));
    });
  }

  const optionKeys = q ? Object.keys(q.options).sort() : [];
  const previousAttempt = q ? localAttempts[q.id] : null;

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <b style={{ fontSize: 18 }}>Prática de questões</b>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>
            {stats.attempted} de {total} respondidas · {stats.correct} acertos · {stats.accuracy}% acerto
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="mini-btn" onClick={() => goTo(-1)} disabled={pending}>
            ← Anterior
          </button>
          <button type="button" className="mini-btn" onClick={() => goTo(1)} disabled={pending}>
            Próxima →
          </button>
        </div>
      </div>

      <div className="progress"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div>

      <article className="card" style={{ padding: '26px 28px', display: 'grid', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="pill">Questão {index + 1} / {total}</span>
          {previousAttempt && (
            <span className={`pill ${previousAttempt.is_correct ? 'green' : 'red'}`}>
              {previousAttempt.is_correct ? '✓ Já acertou' : `✗ Já errou (${previousAttempt.chosen})`}
            </span>
          )}
        </div>

        <div style={{ fontSize: 17, lineHeight: 1.6, color: '#101113' }}>{q.stem}</div>

        <div style={{ display: 'grid', gap: 10 }}>
          {optionKeys.map((k) => {
            const isCorrect = feedback && k === feedback.correctAnswer;
            const isWrongChoice = feedback && chosen === k && !feedback.isCorrect;
            const bg = isCorrect
              ? '#eaf7f2'
              : isWrongChoice
                ? '#fff0ef'
                : chosen === k
                  ? '#f4f1ea'
                  : '#fff';
            const border = isCorrect
              ? '#83c8a6'
              : isWrongChoice
                ? '#e5aaa6'
                : chosen === k
                  ? '#d9d2c5'
                  : 'var(--line)';
            return (
              <button
                key={k}
                type="button"
                onClick={() => {
                  if (feedback) return;
                  setChosen(k);
                }}
                disabled={pending}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '36px 1fr',
                  gap: 12,
                  alignItems: 'flex-start',
                  padding: '14px 16px',
                  borderRadius: 14,
                  border: `1px solid ${border}`,
                  background: bg,
                  textAlign: 'left',
                  cursor: feedback ? 'default' : 'pointer',
                  color: '#333',
                  transition: 'background .15s',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: isCorrect ? '#2d8a63' : isWrongChoice ? '#b94a48' : '#f0eee8',
                    color: isCorrect || isWrongChoice ? '#fff' : '#101113',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 900,
                    fontSize: 15,
                  }}
                >
                  {k}
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.55 }}>{q.options[k]}</div>
              </button>
            );
          })}
        </div>

        {!feedback ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!chosen || pending}
            >
              {pending ? 'Corrigindo…' : 'Confirmar resposta'}
            </button>
          </div>
        ) : (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 12,
              background: feedback.isCorrect ? '#eaf7f2' : '#fff0ef',
              color: feedback.isCorrect ? '#205f45' : '#7e312f',
              display: 'grid',
              gap: 6,
            }}
          >
            <b>
              {feedback.isCorrect
                ? '✓ Correto!'
                : `✗ Errado — a resposta certa é ${feedback.correctAnswer}`}
            </b>
            {feedback.explanation && (
              <div style={{ color: '#333', fontSize: 14, lineHeight: 1.6 }}>{feedback.explanation}</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
              <button type="button" className="btn btn-secondary" onClick={() => goTo(1)}>
                Próxima questão →
              </button>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
