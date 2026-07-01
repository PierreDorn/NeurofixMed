'use client';

import { useState, useEffect } from 'react';
import type { SummaryItem } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  summaries: SummaryItem[];
}

function unique(list: string[]) {
  return [...new Set(list.map(v => String(v || '').trim()).filter(Boolean))];
}

function groupByMatter(items: SummaryItem[]) {
  return items.reduce<Record<string, SummaryItem[]>>((acc, item) => {
    const key = item.matter.trim() || 'Sem matéria';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function groupByTopic(items: SummaryItem[]) {
  return items.reduce<Record<string, SummaryItem[]>>((acc, item) => {
    const key = item.topic.trim() || 'Sem tópico';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function groupBySubtopic(items: SummaryItem[]) {
  return items.reduce<Record<string, SummaryItem[]>>((acc, item) => {
    const key = item.subtopic.trim() || 'Sem subtópico';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

const ICONS = ['📄', '🧠', '📚', '📖', '🔬'];

export default function SummaryLibraryModal({ isOpen, onClose, summaries }: Props) {
  const [activeMatter, setActiveMatter] = useState<string | null>(null);
  const [openTopics, setOpenTopics] = useState<Set<string>>(new Set());
  const [openSubtopics, setOpenSubtopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) { setActiveMatter(null); setOpenTopics(new Set()); setOpenSubtopics(new Set()); }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.classList.add('summary-modal-open');
    else document.body.classList.remove('summary-modal-open');
    return () => document.body.classList.remove('summary-modal-open');
  }, [isOpen]);

  if (!isOpen) return null;

  const grouped = groupByMatter(summaries);

  return (
    <div
      className="summary-modal-overlay open"
      id="summary-library-modal"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="summary-modal-panel" role="dialog" aria-modal="true">
        <div className="summary-modal-header">
          <div>
            <div className="section-kicker">Meus resumos</div>
            <h2>Resumos <strong>criados por você</strong></h2>
            <p>Primeiro aparece a matéria criada. Ao clicar em "Acessar resumo", você entra nos tópicos nomeados e abre os subtópicos/subsubtópicos.</p>
          </div>
          <button className="summary-close-btn" type="button" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <div className="summary-generated-list">
          {activeMatter === null ? (
            <div id="summary-list-view">
              {!summaries.length ? (
                <div className="summary-empty-state">
                  Nenhum resumo criado ainda. Clique em <strong>Criar resumo</strong> para adicionar sua primeira matéria.
                </div>
              ) : (
                <div className="summary-matter-grid">
                  {Object.entries(grouped).map(([matter, items], index) => {
                    const topics = unique(items.map(i => i.topic));
                    const subs = unique(items.map(i => i.subtopic));
                    return (
                      <article key={matter} className="summary-matter-card">
                        <div className="matter-top">
                          <div>
                            <h3>{matter}</h3>
                            <p>{topics.length} {topics.length === 1 ? 'tópico nomeado' : 'tópicos nomeados'} e {subs.length} {subs.length === 1 ? 'subtópico' : 'subtópicos'}.</p>
                          </div>
                          <span className="summary-matter-icon">{ICONS[index % ICONS.length]}</span>
                        </div>
                        <p>Entre para visualizar os tópicos no formato de abertura igual às matérias da Biblioteca.</p>
                        <div className="summary-matter-footer">
                          <span>{items.length} {items.length === 1 ? 'resumo' : 'resumos'}</span>
                          <button className="summary-link-btn" type="button" onClick={() => setActiveMatter(matter)}>
                            Acessar resumo →
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div id="summary-topic-view">
              <div className="summary-backline">
                <button className="summary-back-btn" type="button" onClick={() => setActiveMatter(null)}>
                  ← Voltar para matérias
                </button>
                <span className="summary-ready-badge">
                  {activeMatter} · {grouped[activeMatter]?.length ?? 0} {(grouped[activeMatter]?.length ?? 0) === 1 ? 'resumo' : 'resumos'}
                </span>
              </div>
              <div className="summary-existing-path">
                <span className="summary-existing-pill">Matéria: {activeMatter}</span>
                <span className="summary-existing-pill">Tópicos abrem subtópicos; subtópicos com seta abrem subsubtópicos</span>
              </div>
              <div className="accordion-list summary-created-accordion">
                {Object.entries(groupByTopic(grouped[activeMatter] ?? [])).map(([topic, topicItems], ti) => {
                  const topicKey = `t-${ti}`;
                  const isOpen = openTopics.has(topicKey);
                  const bySubtopic = groupBySubtopic(topicItems);

                  return (
                    <article key={ti} className={`accordion-item${isOpen ? ' open' : ''}`}>
                      <div className="accordion-header" onClick={() => {
                        setOpenTopics(prev => {
                          const next = new Set(prev);
                          next.has(topicKey) ? next.delete(topicKey) : next.add(topicKey);
                          return next;
                        });
                      }}>
                        <span className="acc-chevron">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>
                        </span>
                        <span className="acc-num">{ti + 1}</span>
                        <span className="acc-title">{topic}</span>
                        <span className="acc-count">{topicItems.length} {topicItems.length === 1 ? 'resumo' : 'resumos'}</span>
                      </div>
                      <div className="accordion-body">
                        <div className="accordion-body-inner">
                          {Object.entries(bySubtopic).map(([subtopic, subItems], si) => {
                            const subKey = `${topicKey}-s${si}`;
                            const isSubOpen = openSubtopics.has(subKey);
                            const subNumber = `${ti + 1}.${si + 1}`;
                            const childItems = subItems.filter(i => (i.subsubtopic || '').trim());
                            const parentItems = subItems.filter(i => !(i.subsubtopic || '').trim());
                            const hasChildren = childItems.length > 0;

                            return (
                              <div
                                key={si}
                                className={`subtopic-block${hasChildren ? '' : ' no-children'}${isSubOpen ? ' sub-open' : ''}`}
                              >
                                <div
                                  className="subtopic-name"
                                  onClick={() => hasChildren && setOpenSubtopics(prev => {
                                    const next = new Set(prev);
                                    next.has(subKey) ? next.delete(subKey) : next.add(subKey);
                                    return next;
                                  })}
                                >
                                  {hasChildren ? (
                                    <span className="subtopic-chevron">
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </span>
                                  ) : <span className="subtopic-placeholder" />}
                                  <span className="subtopic-index">{subNumber}</span>
                                  <span className="subtopic-title-text">{subtopic}</span>
                                  <span className="summary-subtopic-count">{subItems.length} {subItems.length === 1 ? 'resumo' : 'resumos'}</span>
                                  {(!hasChildren || parentItems.length > 0) && (
                                    <button className="inline-access-btn" type="button" onClick={e => e.stopPropagation()}>
                                      Acessar resumo
                                    </button>
                                  )}
                                </div>
                                {hasChildren && (
                                  <div className="sub-subtopics">
                                    <div className="sub-sub-list">
                                      {childItems.map((item, ci) => (
                                        <div key={ci} className="summary-subsub-card">
                                          <div className="summary-subsub-main">
                                            <strong>
                                              <span className="sub-sub-index">{subNumber}.{ci + 1}</span>{' '}
                                              {item.subsubtopic}
                                            </strong>
                                          </div>
                                          <button className="inline-access-btn" type="button" onClick={e => e.stopPropagation()}>
                                            Acessar resumo
                                          </button>
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
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
