'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '@/components/v73/Shell';
import type { Subject } from '@/lib/subjects-catalog';
import type { CurriculumModule } from '@/lib/curriculum';

type Props = { subject: Subject; curriculum: CurriculumModule[] };

export default function SubjectLibraryView({ subject, curriculum }: Props) {
  const router = useRouter();
  const [activeModuleId, setActiveModuleId] = useState<string>(curriculum[0]?.id ?? '');
  const [query, setQuery] = useState('');

  const activeModule = useMemo(
    () => curriculum.find((m) => m.id === activeModuleId) ?? null,
    [curriculum, activeModuleId],
  );

  const filteredTopics = useMemo(() => {
    if (!activeModule) return [];
    if (!query.trim()) return activeModule.topics;
    const q = query.toLowerCase();
    return activeModule.topics.filter(
      (t) => t.title.toLowerCase().includes(q) || (t.subtitle ?? '').toLowerCase().includes(q),
    );
  }, [activeModule, query]);

  const totalModules = curriculum.length;
  const totalTopics = curriculum.reduce((a, m) => a + m.topics.length, 0);

  return (
    <Shell breadcrumb={`Matérias · ${subject.title}`}>
      <section className="page active" id="page-library">
        <div className="library-head">
          <div>
            <div className="eyebrow" style={{ color: subject.accent }}>{subject.eyebrow}</div>
            <h1>{subject.title}</h1>
            <p>{subject.description}</p>
          </div>
          <span
            className="pill"
            style={{ background: subject.soft, color: subject.accent, fontWeight: 800 }}
          >
            {totalModules} aulas · {totalTopics} microassuntos
          </span>
        </div>

        {curriculum.length === 0 ? (
          <div className="subject-stage-empty" style={{ marginTop: 26 }}>
            <div className="subject-stage-empty-head">
              <span>CURRÍCULO EM ESTRUTURAÇÃO</span>
              <h2>Currículo em preparação</h2>
              <p>
                Assim que os módulos, aulas e microassuntos desta disciplina forem organizados, eles
                aparecem aqui com o mesmo padrão das demais notas NeuroFix.
              </p>
            </div>
          </div>
        ) : (
          <div className="library-layout" style={{ marginTop: 24 }}>
            <aside className="tree card" style={{ padding: 16 }}>
              <h3>Aulas</h3>
              <label className="subjects-search" style={{ margin: '4px 0 12px' }}>
                ⌕{' '}
                <input
                  placeholder="Buscar aula ou microassunto..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <div style={{ display: 'grid', gap: 4, maxHeight: 'calc(100vh - 260px)', overflow: 'auto' }}>
                {curriculum.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveModuleId(m.id)}
                    className={`tree-btn${m.id === activeModuleId ? ' active' : ''}`}
                    title={m.title}
                  >
                    <span style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 0 }}>
                      <span style={{ fontWeight: 800, color: subject.accent, minWidth: 26 }}>
                        {m.number}
                      </span>
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {m.title}
                      </span>
                    </span>
                    <small>{m.topics.length}</small>
                  </button>
                ))}
              </div>
            </aside>

            <div className="topic-panel card">
              {activeModule && (
                <>
                  <span
                    className="pill"
                    style={{ background: subject.soft, color: subject.accent, fontWeight: 800 }}
                  >
                    {activeModule.block ?? 'Aula'} · {activeModule.number}
                  </span>
                  <h2 style={{ margin: '8px 0 6px' }}>{activeModule.title}</h2>
                  {activeModule.description && <p>{activeModule.description}</p>}

                  {activeModule.map && (
                    <div
                      className="callout blue"
                      style={{ marginTop: 16, fontSize: 14, lineHeight: 1.55 }}
                    >
                      <b>Sequência lógica</b>
                      {activeModule.map}
                    </div>
                  )}

                  {activeModule.confusions.length > 0 && (
                    <div
                      className="callout gold"
                      style={{ marginTop: 12, fontSize: 14, lineHeight: 1.55 }}
                    >
                      <b>Pontos de confusão frequentes</b>
                      {activeModule.confusions.join(' · ')}
                    </div>
                  )}

                  <div className="module" style={{ marginTop: 20 }}>
                    <div className="module-head">
                      <h3>Microassuntos</h3>
                      <small style={{ color: 'var(--muted)' }}>
                        {filteredTopics.length} de {activeModule.topics.length}
                      </small>
                    </div>
                    {filteredTopics.length === 0 ? (
                      <div style={{ padding: 24, color: 'var(--muted)' }}>
                        Nenhum microassunto bate com a busca.
                      </div>
                    ) : (
                      filteredTopics.map((t) => (
                        <div
                          key={t.id}
                          className={`topic-row${t.status === 'complete' ? ' done' : ''}`}
                          onClick={() =>
                            router.push(
                              `/subjects/${subject.id}/topics/${encodeURIComponent(t.id)}`,
                            )
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="check">
                            {t.status === 'complete' ? '✓' : '○'}
                          </div>
                          <div>
                            <b>{t.title}</b>
                            {t.subtitle && <small>{t.subtitle}</small>}
                          </div>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 12, color: 'var(--muted)' }}>
                            {t.question_count != null && <span>{t.question_count} Q</span>}
                            {t.flashcard_count != null && <span>{t.flashcard_count} F</span>}
                            <span style={{ fontWeight: 700, color: '#101113' }}>Abrir →</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </Shell>
  );
}
