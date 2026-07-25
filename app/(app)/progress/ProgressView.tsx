'use client';

import Shell from '@/components/v73/Shell';
import type { Subject } from '@/lib/subjects-catalog';
import type { QuestionStats, FlashcardStats, CycleStats, SubjectProgress } from '@/lib/progress-data';

type Props = {
  stats: {
    question: QuestionStats;
    flashcard: FlashcardStats;
    cycle: CycleStats;
    bySubject: SubjectProgress[];
  };
  subjectMap: Record<string, Subject>;
};

function Metric({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--muted)' }}>
        {label}
      </div>
      <div style={{ fontSize: 34, fontWeight: 900, color: '#101113', marginTop: 4 }}>{value}</div>
      {hint && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export default function ProgressView({ stats, subjectMap }: Props) {
  const { question, flashcard, cycle, bySubject } = stats;
  const nothingYet = question.total_attempts === 0 && flashcard.total_reviews === 0 && cycle.notes_started === 0;

  return (
    <Shell breadcrumb="Meu progresso">
      <section className="page active" id="page-progress">
        <div className="library-head">
          <div>
            <div className="eyebrow">Sua trajetória</div>
            <h1>Meu progresso</h1>
            <p>Acertos por matéria, revisões cumpridas e ciclos ativos.</p>
          </div>
        </div>

        {nothingYet ? (
          <div className="card" style={{ marginTop: 22, padding: 26 }}>
            <h2 style={{ font: '500 22px Georgia, serif', margin: 0 }}>Aguardando dados</h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginTop: 6 }}>
              Abra uma nota, resolva questões, use os flashcards e avance no ciclo ativo. Suas métricas
              começam a aparecer aqui em tempo real.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 14,
                marginTop: 22,
              }}
            >
              <Metric label="Questões respondidas" value={question.total_attempts} hint={`${question.unique_answered} únicas`} />
              <Metric label="Taxa de acerto" value={`${question.accuracy}%`} hint={`${question.correct} corretas · ${question.wrong} erradas`} />
              <Metric label="Flashcards revisados" value={flashcard.total_reviews} hint={`${flashcard.cards_seen} cards únicos`} />
              <Metric label="Ciclos ativos" value={cycle.notes_started} hint={`${cycle.notes_mastered} dominados`} />
            </div>

            <div className="card" style={{ marginTop: 22, padding: 24 }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Distribuição das avaliações de flashcards</h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 8,
                  marginTop: 14,
                }}
              >
                {(['again', 'hard', 'good', 'easy'] as const).map((k) => {
                  const total = flashcard.total_reviews || 1;
                  const value = flashcard.rating_counts[k];
                  const pct = Math.round((value / total) * 100);
                  const colors = { again: '#b94a48', hard: '#c48f21', good: '#286ed8', easy: '#2d8a63' };
                  const labels = { again: 'Errei', hard: 'Difícil', good: 'Bom', easy: 'Fácil' };
                  return (
                    <div key={k}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
                        <b style={{ color: colors[k] }}>{labels[k]}</b>
                        <span>{value} · {pct}%</span>
                      </div>
                      <div className="progress" style={{ marginTop: 6, height: 8 }}>
                        <span style={{ width: `${pct}%`, background: colors[k] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {bySubject.length > 0 && (
              <div className="card" style={{ marginTop: 22, padding: 24 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>Desempenho por matéria</h3>
                <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
                  {bySubject.map((s) => {
                    const meta = subjectMap[s.subject_id];
                    return (
                      <div key={s.subject_id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                          <b style={{ color: meta?.accent ?? '#101113' }}>
                            {meta?.title ?? s.subject_id}
                          </b>
                          <span style={{ color: 'var(--muted)' }}>
                            {s.correct}/{s.attempts} · {s.accuracy}%
                          </span>
                        </div>
                        <div className="progress" style={{ marginTop: 6 }}>
                          <span
                            style={{
                              width: `${s.accuracy}%`,
                              background: meta?.accent ?? 'var(--gold)',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </Shell>
  );
}
