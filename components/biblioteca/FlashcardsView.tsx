'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMatterIconSvg, getMatterAccent, slugifyMatter, type MatterAggregate } from '@/lib/flashcards-utils';

interface Props {
  matters: MatterAggregate[];
}

type CycleKey = 'basico' | 'clinico' | 'internato';

function cycleKey(ciclo: string): CycleKey {
  const lower = ciclo.toLowerCase();
  if (lower.includes('clín') || lower.includes('clin')) return 'clinico';
  if (lower.includes('intern')) return 'internato';
  return 'basico';
}

function cycleLabel(key: CycleKey): string {
  if (key === 'clinico') return 'Ciclo Clínico';
  if (key === 'internato') return 'Internato';
  return 'Ciclo Básico';
}

const HERO_STATS_FALLBACK = { totalCards: 0, novos: 0, revisar: 0 };

export default function FlashcardsView({ matters }: Props) {
  const router = useRouter();
  const [selectedCycle, setSelectedCycle] = useState<CycleKey>('basico');
  const [search, setSearch] = useState('');

  const counts = useMemo(() => {
    const map = new Map<CycleKey, number>();
    for (const m of matters) {
      const k = cycleKey(m.ciclo);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [matters]);

  const heroStats = useMemo(() => {
    if (!matters.length) return HERO_STATS_FALLBACK;
    return matters.reduce((acc, m) => ({
      totalCards: acc.totalCards + m.total,
      novos: acc.novos + m.novos,
      revisar: acc.revisar + m.revisar,
    }), HERO_STATS_FALLBACK);
  }, [matters]);

const visibleMatters = useMemo(() => {
    const q = search.trim().toLowerCase();
    return matters.filter(m => {
      if (cycleKey(m.ciclo) !== selectedCycle) return false;
      if (q && !m.materia.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [matters, selectedCycle, search]);

  const cycleMatterCount = counts.get(selectedCycle) ?? 0;
  const totalMatters = matters.length;

  return (
    <section id="flashcards-view" className="study-view active-view" aria-label="Área de flashcards">
      <div className="container">

        {/* HERO */}
        <section className="hero hero-wide flashcards-hero" aria-label="Flashcards">
          <div className="hero-full">
            <div className="section-kicker">Flashcards inteligentes</div>
            <h1 className="hero-title" id="flash-hero-title">
              Revise e fixe com <strong>repetição</strong> e <span className="blue">memória ativa.</span>
            </h1>
            <p className="hero-subtitle">
              Cada baralho fica organizado por ciclo e matéria. Escolha o modo de estudo na hora de revisar.
            </p>

            <div className="search-wrapper">
              <label className="search-card">
                <span className="search-icon">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                    <path d="M10.8 18.2a7.4 7.4 0 1 1 0-14.8 7.4 7.4 0 0 1 0 14.8ZM16.3 16.3 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  id="flashcards-search"
                  type="search"
                  placeholder="Buscar matéria. Ex: Neurologia"
                  autoComplete="off"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </label>

              <div className="filters">
                {(['basico', 'clinico'] as CycleKey[]).map(key => (
                  <button
                    key={key}
                    className={`pill${selectedCycle === key ? ' active' : ''}`}
                    type="button"
                    onClick={() => setSelectedCycle(key)}
                  >
                    {cycleLabel(key)}
                  </button>
                ))}
              </div>
            </div>

            <div className="hero-mini-grid" style={{marginTop:'20px'}}>
              <div className="mini-stat mini-stat-gold">
                <div>
                  <strong>{heroStats.totalCards} {heroStats.totalCards === 1 ? 'Card' : 'Cards'}</strong>
                  <span>Organizados por matéria</span>
                </div>
                <span className="mini-icon mini-icon-gold" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <rect x="2" y="6" width="18" height="13" rx="2"/>
                    <path d="M5 6V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* FLASH BUILDER SECTION */}
        <section className="summary-builder-section flash-builder-section" id="flashcard-tools" aria-labelledby="flashcard-builder-title" style={{display:'none'}}>
          <div className="summary-builder-head">
            <div>
              <div className="section-kicker">Criador de flashcards</div>
              <h2 id="flashcard-builder-title">Crie seus próprios <strong>baralhos de flashcards</strong>.</h2>
              <p>
                Cole um conteúdo, envie um arquivo ou informe uma URL. Os cards ficam organizados por matéria, tópico e subtópico — e você escolhe o modo de revisar.
              </p>
            </div>
            <span className="summary-ready-badge">
              {totalMatters} {totalMatters === 1 ? 'matéria criada' : 'matérias criadas'}
            </span>
          </div>

          <div className="summary-action-grid">
            <article className="summary-action-card">
              <div className="summary-action-top">
                <div>
                  <h3>Criar flashcards</h3>
                  <p>Gere cards objetivos para revisão ativa, repetição espaçada e memorização rápida.</p>
                </div>
                <span className="summary-action-icon blue">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="3"/>
                    <path d="M7 9h10M7 13h6"/>
                    <path d="M17 17l2 2M19 17l-2 2"/>
                  </svg>
                </span>
              </div>
              <div className="summary-action-footer">
                <small>Organização automática por matéria</small>
                <button className="summary-main-btn" type="button" onClick={() => router.push('/flashcards/criar')}>
                  Criar flashcards →
                </button>
              </div>
            </article>

            <article className="summary-action-card">
              <div className="summary-action-top">
                <div>
                  <h3>Acessar hierarquia</h3>
                  <p>Veja e gerencie toda a sua árvore: matérias, tópicos, subtópicos e cards. Exclua qualquer nível.</p>
                </div>
                <span className="summary-action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7h18M6 12h12M9 17h6"/>
                    <circle cx="3" cy="7" r="1.2" fill="currentColor"/>
                    <circle cx="6" cy="12" r="1.2" fill="currentColor"/>
                    <circle cx="9" cy="17" r="1.2" fill="currentColor"/>
                  </svg>
                </span>
              </div>
              <div className="summary-action-footer">
                <small>Exclusão em cascata por nível</small>
                <button className="summary-main-btn" type="button" onClick={() => router.push('/flashcards/hierarquia')}>
                  Acessar hierarquia →
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* CYCLE ROUTER */}
        <section className="cycle-router flash-cycle-router" aria-labelledby="flash-cycle-router-title">
          <div className="cycle-router-head">
            <div>
              <div className="section-kicker">Meus baralhos</div>
              <h2 id="flash-cycle-router-title">Treine flashcards por <strong>etapa da formação.</strong></h2>
              <p>Primeiro escolha o ciclo. Depois aparecem apenas as matérias daquele grupo onde você já criou flashcards.</p>
            </div>
            <span className="cycle-router-note">Seleção por ciclo</span>
          </div>

          <div className="cycle-options">
            <button
              className={`cycle-option${selectedCycle === 'basico' ? ' active' : ''}`}
              type="button"
              onClick={() => setSelectedCycle('basico')}
            >
              <span className="cycle-option-content">
                <span className="cycle-option-top">
                  <span className="cycle-option-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5c-2-2-5-2-6.5 0C3 5.5 2 8 3 10c-1 1-1 3 .5 4C3 16 4.5 17.5 6.5 17.5 7 19 8.5 20 10.5 19.5 11 20.5 12 21 12 21"/>
                      <path d="M12 5c2-2 5-2 6.5 0C21 5.5 22 8 21 10c1 1 1 3-.5 4C21 16 19.5 17.5 17.5 17.5 17 19 15.5 20 13.5 19.5 13 20.5 12 21 12 21"/>
                      <line x1="12" y1="5" x2="12" y2="21"/>
                    </svg>
                  </span>
                  <span className="cycle-option-badge">{counts.get('basico') ?? 0} {(counts.get('basico') ?? 0) === 1 ? 'matéria' : 'matérias'}</span>
                </span>
                <span>
                  <span className="cycle-option-title">Ciclo Básico</span>
                  <span className="cycle-option-desc">Bases fundamentais — anatomia, fisiologia, bioquímica, microbiologia.</span>
                </span>
                <span className="cycle-option-footer">Ver flashcards <span>›</span></span>
              </span>
            </button>

            <button
              className={`cycle-option blue${selectedCycle === 'clinico' ? ' active' : ''}`}
              type="button"
              onClick={() => setSelectedCycle('clinico')}
            >
              <span className="cycle-option-content">
                <span className="cycle-option-top">
                  <span className="cycle-option-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.8 4.8v4.1a4.7 4.7 0 0 0 9.4 0V4.8"/>
                      <path d="M6.8 4H4.4M14.6 4h-2.4"/>
                      <path d="M9.5 13.6v2.1a4.3 4.3 0 0 0 8.6 0v-1.2"/>
                      <circle cx="19.2" cy="12.4" r="1.8"/>
                    </svg>
                  </span>
                  <span className="cycle-option-badge">{counts.get('clinico') ?? 0} {(counts.get('clinico') ?? 0) === 1 ? 'matéria' : 'matérias'}</span>
                </span>
                <span>
                  <span className="cycle-option-title">Ciclo Clínico</span>
                  <span className="cycle-option-desc">Cards aplicados à conduta, diagnóstico e tomada de decisão clínica.</span>
                </span>
                <span className="cycle-option-footer">Ver flashcards <span>›</span></span>
              </span>
            </button>
          </div>
        </section>

        {/* DECKS CYCLE SECTION */}
        <section className="section-block" id="flashcards-cycle-section">
          <div className="section-head">
            <div>
              <div className="section-kicker">Flashcards · {cycleLabel(selectedCycle)}</div>
              <h2>Baralhos do <strong>{cycleLabel(selectedCycle)}.</strong></h2>
            </div>
            <span className="section-counter">
              {cycleMatterCount} {cycleMatterCount === 1 ? 'matéria com cards ativos' : 'matérias com cards ativos'}
            </span>
          </div>

          {visibleMatters.length === 0 ? (
            <div className="flash-empty-state" />
          ) : (
            <div className="discipline-grid">
              {visibleMatters.map(matter => {
                const accent = getMatterAccent(matter.materia);
                const iconSvg = getMatterIconSvg(matter.materia);
                const slug = slugifyMatter(matter.materia);
                const statusLabel = matter.revisar > 0
                  ? `${matter.revisar} para revisar`
                  : matter.novos > 0 ? 'Novo' : 'Em dia';
                const statusClass = matter.revisar > 0 ? 'gold' : (matter.novos > 0 ? 'blue' : 'green');

                return (
                  <article
                    key={slug}
                    className={`discipline-card flashcard-discipline-card${accent !== 'gold' ? ` ${accent}` : ''}`}
                    data-flash-cycle={selectedCycle}
                  >
                    <div className="card-top">
                      <div
                        className="discipline-icon"
                        dangerouslySetInnerHTML={{ __html: iconSvg }}
                      />
                      <span className={`status ${statusClass}`}>{statusLabel}</span>
                    </div>
                    <div className="discipline-label">{matter.ciclo}</div>
                    <h3>{matter.materia}</h3>
                    <p className="discipline-desc">
                      {matter.total} {matter.total === 1 ? 'flashcard criado' : 'flashcards criados'} nesta matéria.
                    </p>
                    <div className="flashcard-metrics">
                      <div className="flashcard-metric">
                        <strong>{matter.revisar}</strong>
                        <span>revisar</span>
                      </div>
                      <div className="flashcard-metric">
                        <strong>{matter.novos}</strong>
                        <span>novos</span>
                      </div>
                      <div className="flashcard-metric">
                        <strong>{matter.total}</strong>
                        <span>total</span>
                      </div>
                    </div>
                    <div className="progress-info">
                      <span>Fixação</span>
                      <strong>{matter.fixacao}%</strong>
                    </div>
                    <div className="track">
                      <div
                        className={`fill${accent !== 'gold' ? ` ${accent}` : ''}`}
                        style={{ width: `${Math.min(100, matter.fixacao)}%` }}
                      />
                    </div>
                    <div className="card-bottom flashcard-bottom">
                      <span className="themes">{matter.total} {matter.total === 1 ? 'card' : 'cards'}</span>
                      <button
                        className="access-link flashcard-access"
                        type="button"
                        onClick={() => router.push(`/flashcards/${slug}`)}
                      >
                        Acessar flash ›
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </section>
  );
}
