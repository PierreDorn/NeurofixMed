'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { PanelMode, DeepLink } from './types';
import type { MaterialDB } from '@/lib/biblioteca';
import { DISCIPLINES } from './data';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface Props {
  isOpen: boolean;
  /** New interface: pass the full MaterialDB object (from biblioteca page) */
  material?: MaterialDB | null;
  /** Legacy interface: discipline string key (still used by flashcards page) */
  disciplineKey?: string;
  mode: PanelMode;
  onClose: () => void;
  deepLink?: DeepLink;
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function countTopicUnits(topic: MaterialDB['topics'][number]): number {
  return topic.subtopics.reduce((n, s) => n + 1 + s.sub_subtopics.length, 0);
}

interface Counts {
  bySub: Record<string, number>;
  bySubSub: Record<string, number>;
  byTopicOnly: Record<string, number>;
  byTopic: Record<string, number>;
  total: number;
}

function buildCounts(
  rows: Array<{ topic_id?: string | null; subtopic_id: string | null; sub_subtopic_id: string | null }>,
  material: MaterialDB,
): Counts {
  const bySub: Record<string, number> = {};
  const bySubSub: Record<string, number> = {};
  const byTopicOnly: Record<string, number> = {};

  // Cada linha conta exatamente uma vez no nível mais profundo em que foi criada
  for (const r of rows) {
    if (r.sub_subtopic_id) {
      bySubSub[r.sub_subtopic_id] = (bySubSub[r.sub_subtopic_id] ?? 0) + 1;
    } else if (r.subtopic_id) {
      bySub[r.subtopic_id] = (bySub[r.subtopic_id] ?? 0) + 1;
    } else if (r.topic_id) {
      byTopicOnly[r.topic_id] = (byTopicOnly[r.topic_id] ?? 0) + 1;
    }
  }

  const byTopic: Record<string, number> = {};
  let total = 0;
  for (const t of material.topics) {
    let tCount = byTopicOnly[t.id] ?? 0;
    for (const s of t.subtopics) {
      tCount += bySub[s.id] ?? 0;
      for (const ss of s.sub_subtopics) tCount += bySubSub[ss.id] ?? 0;
    }
    byTopic[t.id] = tCount;
    total += tCount;
  }

  return { bySub, bySubSub, byTopicOnly, byTopic, total };
}

function subtotal(counts: Counts, sub: MaterialDB['topics'][number]['subtopics'][number]): number {
  let n = counts.bySub[sub.id] ?? 0;
  for (const ss of sub.sub_subtopics) n += counts.bySubSub[ss.id] ?? 0;
  return n;
}

/** Convert legacy DISCIPLINES entry to MaterialDB shape so the panel renders uniformly */
function legacyToMaterial(key: string): MaterialDB | null {
  const d = DISCIPLINES[key];
  if (!d) return null;
  return {
    id: key,
    nome: d.name,
    ciclo: d.cycle,
    descricao: d.desc,
    icone_url: d.icon ?? null,
    ordem: 0,
    topics: (d.topics ?? []).map((t, ti) => ({
      id: `${key}-t${ti}`,
      nome: t.title,
      ordem: ti,
      subtopics: (t.subtopics ?? []).map((s, si) => ({
        id: `${key}-t${ti}-s${si}`,
        nome: s.name,
        ordem: si,
        sub_subtopics: (s.subs ?? []).map((name, ssi) => ({
          id: `${key}-t${ti}-s${si}-ss${ssi}`,
          nome: name,
          ordem: ssi,
        })),
      })),
    })),
  };
}

export default function DisciplinePanel({ isOpen, material, disciplineKey, mode, onClose, deepLink }: Props) {
  const [openTopics, setOpenTopics] = useState<Set<number>>(new Set([0]));
  const [openSubs, setOpenSubs] = useState<Set<string>>(new Set());
  const lastDeepLink = useRef<DeepLink | undefined>(undefined);
  const [summaryMap, setSummaryMap] = useState<Record<string, string>>({});
  const [resumoCounts, setResumoCounts] = useState<Counts>({ bySub: {}, bySubSub: {}, byTopicOnly: {}, byTopic: {}, total: 0 });
  const [questaoCounts, setQuestaoCounts] = useState<Counts>({ bySub: {}, bySubSub: {}, byTopicOnly: {}, byTopic: {}, total: 0 });
  const router = useRouter();

  const isFlash = mode === 'flashcards';

  // Resolve active material: prefer new `material` prop, fall back to legacy key
  const activeMaterial: MaterialDB | null = material ?? (disciplineKey ? legacyToMaterial(disciplineKey) : null);

  // Fetch published summaries + questions, build map + counts
  useEffect(() => {
    if (!activeMaterial || isFlash) return;

    const allTopicIds = activeMaterial.topics.map(t => t.id);
    const allSubtopicIds = activeMaterial.topics.flatMap(t => t.subtopics.map(s => s.id));
    const allSubSubtopicIds = activeMaterial.topics.flatMap(t =>
      t.subtopics.flatMap(s => s.sub_subtopics.map(ss => ss.id))
    );

    const parts: string[] = [];
    if (allTopicIds.length > 0) parts.push(`topic_id.in.(${allTopicIds.join(',')})`);
    if (allSubtopicIds.length > 0) parts.push(`subtopic_id.in.(${allSubtopicIds.join(',')})`);
    if (allSubSubtopicIds.length > 0) parts.push(`sub_subtopic_id.in.(${allSubSubtopicIds.join(',')})`);
    if (parts.length === 0) return;

    const supabase = createSupabaseBrowserClient();
    const filter = parts.join(',');

    // Resumos publicados desta matéria
    supabase
      .from('study_summaries')
      .select('id, topic_id, subtopic_id, sub_subtopic_id')
      .eq('status', 'published')
      .or(filter)
      .then(({ data }) => {
        const rows = data ?? [];
        const map: Record<string, string> = {};
        for (const s of rows) {
          if (s.sub_subtopic_id) map[s.sub_subtopic_id] = s.id;
          else if (s.subtopic_id) map[s.subtopic_id] = s.id;
        }
        setSummaryMap(map);
        setResumoCounts(buildCounts(rows, activeMaterial));
      });

    // Questões desta matéria (preparado para crescimento futuro)
    supabase
      .from('questions')
      .select('id, topic_id, subtopic_id, sub_subtopic_id')
      .or(filter)
      .then(({ data }) => {
        setQuestaoCounts(buildCounts(data ?? [], activeMaterial));
      });
  }, [activeMaterial, isFlash]);

  // Deep-link: auto-open accordion and scroll to the target element when panel opens
  useEffect(() => {
    if (!isOpen || !activeMaterial || !deepLink) return;
    if (!deepLink.topicId && !deepLink.subtopicId && !deepLink.subSubtopicId) return;
    if (lastDeepLink.current === deepLink) return;
    lastDeepLink.current = deepLink;

    let ti = -1;
    let si = -1;
    let ssi = -1;

    if (deepLink.topicId) {
      ti = activeMaterial.topics.findIndex(t => t.id === deepLink.topicId);
    } else if (deepLink.subtopicId) {
      outer: for (let t = 0; t < activeMaterial.topics.length; t++) {
        const s = activeMaterial.topics[t].subtopics.findIndex(sub => sub.id === deepLink.subtopicId);
        if (s >= 0) { ti = t; si = s; break outer; }
      }
    } else if (deepLink.subSubtopicId) {
      outer: for (let t = 0; t < activeMaterial.topics.length; t++) {
        for (let s = 0; s < activeMaterial.topics[t].subtopics.length; s++) {
          const ss = activeMaterial.topics[t].subtopics[s].sub_subtopics.findIndex(sub => sub.id === deepLink.subSubtopicId);
          if (ss >= 0) { ti = t; si = s; ssi = ss; break outer; }
        }
      }
    }

    if (ti < 0) return;

    setOpenTopics(new Set([ti]));

    const subId = si >= 0 ? `sub-${ti}-${si}` : null;
    if (subId && si >= 0 && activeMaterial.topics[ti].subtopics[si].sub_subtopics.length > 0) {
      setOpenSubs(new Set([subId]));
    }

    const scrollTargetId = ssi >= 0
      ? `subsub-${ti}-${si}-${ssi}`
      : subId ?? `dp-topic-${ti}`;

    setTimeout(() => {
      const elRaw = document.getElementById(scrollTargetId);
      const containerRaw = document.getElementById('discipline-panel');
      if (!elRaw || !containerRaw) return;
      const el = elRaw;
      const container = containerRaw;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function applyHighlight() {
        el.classList.add('dp-highlight');
        setTimeout(() => el.classList.remove('dp-highlight'), 2900);
      }

      if (reducedMotion) {
        // Sem animação: posiciona instantaneamente e aplica outline estático
        const containerRect = container.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        container.scrollTop += elRect.top - containerRect.top - container.clientHeight / 2 + el.offsetHeight / 2;
        applyHighlight();
        return;
      }

      // Custom eased scroll — easeInOutQuart 950ms, mais lento e profissional
      function easeInOutQuart(t: number) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
      }

      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const scrollStart = container.scrollTop;
      const scrollDelta = elRect.top - containerRect.top
        - container.clientHeight / 2
        + el.offsetHeight / 2;
      const duration = 950;
      const startTime = performance.now();

      function step(now: number) {
        const t = Math.min((now - startTime) / duration, 1);
        container.scrollTop = scrollStart + scrollDelta * easeInOutQuart(t);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          applyHighlight();
        }
      }

      requestAnimationFrame(step);
    }, 420);
  }, [isOpen, deepLink, activeMaterial]);

  function toggleTopic(i: number) {
    setOpenTopics(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function toggleSub(id: string) {
    setOpenSubs(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (!activeMaterial) return null;

  const topicCount = activeMaterial.topics.length;
  const descText = isFlash
    ? `Baralhos de flashcards de ${activeMaterial.nome} organizados por tópicos para revisar, aprender novos cards e reforçar a fixação.`
    : (activeMaterial.descricao ?? '');

  const iconEl = activeMaterial.icone_url
    ? (activeMaterial.icone_url.trimStart().startsWith('<')
      ? <div dangerouslySetInnerHTML={{ __html: activeMaterial.icone_url }} />
      : <img src={activeMaterial.icone_url} alt={activeMaterial.nome} width={32} height={32} style={{ objectFit: 'contain' }} />)
    : <DefaultIcon />;

  return (
    <div className={`discipline-panel${isOpen ? ' open' : ''}`} id="discipline-panel">
      <div className="dp-inner">
        <div className="breadcrumb">
          <button className="breadcrumb-back" onClick={onClose}>
            <BackIcon />
            <span>{isFlash ? 'Flashcards' : 'Biblioteca'}</span>
          </button>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{activeMaterial.nome}</span>
        </div>

        <div className="dp-header">
          <div className="dp-header-left">
            <div className="dp-disc-icon">{iconEl}</div>
            <div className="dp-disc-info">
              <div className="dp-disc-cycle">
                {isFlash ? `${activeMaterial.ciclo} · flashcards` : activeMaterial.ciclo}
              </div>
              <div className="dp-disc-name">{activeMaterial.nome}</div>
              <div className="dp-disc-desc">{descText}</div>
            </div>
          </div>
          <div className="dp-stats">
            <div className="dp-stat">
              <strong>{topicCount}</strong>
              <span>{isFlash ? 'para revisar' : 'tópicos'}</span>
            </div>
            <div className="dp-stat">
              <strong>{isFlash ? 0 : resumoCounts.total}</strong>
              <span>{isFlash ? 'novos' : 'resumos'}</span>
            </div>
            <div className="dp-stat">
              <strong>{isFlash ? 0 : questaoCounts.total}</strong>
              <span>{isFlash ? 'dominados' : 'questões'}</span>
            </div>
          </div>
        </div>

        <div className="topics-title">
          {isFlash ? 'baralhos de flashcards' : 'tópicos da disciplina'}
        </div>

        <div className="accordion-list" id="accordion-list">
          {activeMaterial.topics.map((topic, ti) => {
            const isTopicOpen = openTopics.has(ti);
            const resumeCount = isFlash ? countTopicUnits(topic) : (resumoCounts.byTopic[topic.id] ?? 0);
            const unit = isFlash
              ? (resumeCount === 1 ? 'baralho' : 'baralhos')
              : (resumeCount === 1 ? 'resumo' : 'resumos');

            return (
              <div key={topic.id} id={`dp-topic-${ti}`} className={`accordion-item${isTopicOpen ? ' open' : ''}`}>
                <div className="accordion-header" onClick={() => toggleTopic(ti)}>
                  <span className="acc-chevron"><ChevronIcon /></span>
                  <span className="acc-num">{ti + 1}</span>
                  <span className="acc-title">{topic.nome}</span>
                  <span className="acc-count">{resumeCount} {unit}</span>
                </div>
                <div className="accordion-body">
                  <div className="accordion-body-inner">
                    {topic.subtopics.map((sub, si) => {
                      const subId = `sub-${ti}-${si}`;
                      const hasChildren = sub.sub_subtopics.length > 0;
                      const isSubOpen = openSubs.has(subId);
                      const subResumeCount = isFlash
                        ? (hasChildren ? 1 + sub.sub_subtopics.length : 1)
                        : subtotal(resumoCounts, sub);
                      const subUnit = isFlash
                        ? (subResumeCount === 1 ? '1 baralho' : `${subResumeCount} baralhos`)
                        : (subResumeCount === 1 ? '1 resumo' : `${subResumeCount} resumos`);
                      const subNumber = `${ti + 1}.${si + 1}`;

                      return (
                        <div
                          key={sub.id}
                          className={`subtopic-block${hasChildren ? '' : ' no-children'}${isSubOpen ? ' sub-open' : ''}`}
                          id={subId}
                        >
                          <div
                            className="subtopic-name"
                            onClick={() => hasChildren ? toggleSub(subId) : undefined}
                          >
                            {hasChildren ? (
                              <span className="subtopic-chevron"><ChevronIcon /></span>
                            ) : (
                              <span className="subtopic-placeholder" />
                            )}
                            <span className="subtopic-index">{subNumber}</span>
                            <span className="subtopic-title-text">{sub.nome}</span>
                            <span className="subtopic-resume-count">{subUnit}</span>
                            {!hasChildren && (
                              <button
                                className={`inline-access-btn${isFlash ? ' blue' : ''}${!isFlash && !summaryMap[sub.id] ? ' disabled' : ''}`}
                                onClick={e => {
                                  e.stopPropagation();
                                  if (!isFlash && summaryMap[sub.id]) {
                                    sessionStorage.setItem('biblioteca-panel-restore', JSON.stringify({
                                      materialId: activeMaterial.id,
                                      subtopicId: sub.id,
                                    }));
                                    router.push(`/resumos/${summaryMap[sub.id]}`);
                                  }
                                }}
                                title={!isFlash && !summaryMap[sub.id] ? 'Resumo ainda não publicado' : undefined}
                              >
                                {isFlash ? 'Acessar flash' : 'Acessar resumo'}
                              </button>
                            )}
                          </div>
                          {hasChildren && (
                            <div className="sub-subtopics">
                              <div className="sub-sub-list">
                                {sub.sub_subtopics.map((ss, subi) => (
                                  <div key={ss.id} id={`subsub-${ti}-${si}-${subi}`} className="sub-sub-row">
                                    <div className="sub-sub-main">
                                      <span className="sub-sub-index">{subNumber}.{subi + 1}</span>
                                      <span className="sub-sub-title-text">{ss.nome}</span>
                                    </div>
                                    <div className="sub-sub-actions single-action">
                                      <button
                                        className={`inline-access-btn${isFlash ? ' blue' : ''}${!isFlash && !summaryMap[ss.id] ? ' disabled' : ''}`}
                                        onClick={e => {
                                          e.stopPropagation();
                                          if (!isFlash && summaryMap[ss.id]) {
                                            sessionStorage.setItem('biblioteca-panel-restore', JSON.stringify({
                                              materialId: activeMaterial.id,
                                              subtopicId: sub.id,
                                              subSubtopicId: ss.id,
                                            }));
                                            router.push(`/resumos/${summaryMap[ss.id]}`);
                                          }
                                        }}
                                        title={!isFlash && !summaryMap[ss.id] ? 'Resumo ainda não publicado' : undefined}
                                      >
                                        {isFlash ? 'Acessar flash' : 'Acessar resumo'}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
