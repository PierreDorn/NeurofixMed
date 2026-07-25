'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '@/components/v73/Shell';
import { STAGES, STAGE_META, subjectsByStage, type SubjectStage } from '@/lib/subjects-catalog';
import { toggleFavorite } from '@/app/(app)/favorites/actions';

type Props = { favIds: string[] };

export default function SubjectsView({ favIds }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [stage, setStage] = useState<SubjectStage>('basic');
  const [query, setQuery] = useState('');
  const favSet = useMemo(() => new Set(favIds), [favIds]);

  const filtered = useMemo(() => {
    const inStage = subjectsByStage(stage);
    if (!query.trim()) return inStage;
    const q = query.toLowerCase();
    return inStage.filter(
      (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
    );
  }, [stage, query]);

  const stageSubjects = subjectsByStage(stage);
  const totalInStage = stageSubjects.length;
  const stageLabel = STAGES.find((s) => s.id === stage)?.label ?? '';
  const stageMeta = STAGE_META[stage];
  const stageIsEmpty = totalInStage === 0;

  return (
    <Shell breadcrumb="Matérias">
      <section className="page active" id="page-subjects">
        <div className="subjects-hero">
          <div>
            <div className="eyebrow" style={{ color: '#e1c77f' }}>
              Jornada médica organizada por etapas
            </div>
            <h1>Matérias por ciclo de formação</h1>
            <p>
              Todas as disciplinas disponíveis atualmente pertencem ao <b>Ciclo Básico</b>. Use os botões
              abaixo para navegar pelas próximas etapas da formação sem misturar conteúdos, exigências ou
              níveis de complexidade.
            </p>
          </div>
          <div className="hero-count">
            <strong>{totalInStage}</strong>
            <span dangerouslySetInnerHTML={{ __html: stageMeta.countLabel }} />
          </div>
        </div>

        <div className="subjects-toolbar subjects-stage-toolbar">
          <div
            className="subject-tabs subject-stage-tabs"
            role="tablist"
            aria-label="Etapas da formação médica"
          >
            {STAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={stage === s.id ? 'active' : undefined}
                onClick={() => setStage(s.id)}
                role="tab"
                aria-selected={stage === s.id}
              >
                {s.label}
              </button>
            ))}
          </div>
          <label className="subjects-search">
            ⌕{' '}
            <input
              placeholder={stageMeta.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        {stageIsEmpty ? (
          <section className="subject-stage-empty" data-empty-stage={stage} style={{ marginTop: 24 }}>
            <div className="subject-stage-empty-head">
              <span>PRÓXIMA ETAPA DA FORMAÇÃO</span>
              <h2>{stageMeta.title}</h2>
              <p>{stageMeta.description}</p>
            </div>
            <div className="subject-stage-empty-body">
              <div className="subject-stage-coming">
                <b>Lançamento em breve</b>
                <p>
                  Esta área será liberada quando os conteúdos desta etapa estiverem estudados,
                  organizados e revisados no padrão NeuroFix.
                </p>
              </div>
              {stageMeta.cards && (
                <div className="subject-stage-ready-grid">
                  {stageMeta.cards.map(([title, desc]) => (
                    <div key={title}>
                      <b>{title}</b>
                      <small>{desc}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : filtered.length === 0 ? (
          <div className="subject-stage-empty" style={{ marginTop: 24 }}>
            <div className="subject-stage-empty-head">
              <span>NENHUMA DISCIPLINA</span>
              <h2>Nada por aqui ainda</h2>
              <p>
                Não encontramos disciplinas cadastradas para <b>{stageLabel}</b> com esse filtro.
              </p>
            </div>
          </div>
        ) : (
          <div className="subject-directory-grid nf70-subject-grid" style={{ marginTop: 24 }}>
            {filtered.map((s, idx) => {
              const isFav = favSet.has(s.id);
              const col = idx % 3;
              const accent = col === 0 ? '#C9A24E' : col === 1 ? '#286ED8' : '#0A0A0A';
              const soft = col === 0 ? '#FBF4E3' : col === 1 ? '#EAF2FF' : '#F2F2F2';
              return (
                <article
                  key={s.id}
                  className="subject-card"
                  onClick={() => router.push(`/subjects/${s.id}`)}
                  style={
                    {
                      ['--subject-accent' as string]: accent,
                      ['--subject-soft' as string]: soft,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="subject-card-top"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <span className={`subject-status ${s.status === 'live' ? 'live' : 'building'}`}>
                      {s.statusLabel}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        start(() => toggleFavorite('subject', s.id));
                      }}
                      disabled={pending}
                      aria-label={isFav ? 'Desfavoritar' : 'Favoritar'}
                      title={isFav ? 'Desfavoritar' : 'Favoritar'}
                      style={{
                        background: 'transparent',
                        border: 0,
                        cursor: 'pointer',
                        fontSize: 20,
                        color: isFav ? accent : '#c4c4c4',
                        padding: 0,
                        lineHeight: 1,
                      }}
                    >
                      {isFav ? '★' : '☆'}
                    </button>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <div className="subject-card-footer">
                    <small>{s.summary}</small>
                    <button
                      type="button"
                      className="subject-open"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/subjects/${s.id}`);
                      }}
                    >
                      Abrir disciplina →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </Shell>
  );
}
