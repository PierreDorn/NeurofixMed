'use client';

import { useState } from 'react';
import Link from 'next/link';

interface StudySummary { id: string; titulo: string | null; status: string | null; }
interface Subtopic { id: string; nome: string; ordem: number; study_summaries: StudySummary[]; }
interface Topic { id: string; nome: string; order_index: number; subtopics: Subtopic[]; }

interface Props {
  topics: Topic[];
  materiaNome: string;
}

export default function BibliotecaAccordion({ topics, materiaNome }: Props) {
  const [topicoAberto, setTopicoAberto] = useState<string | null>(topics[0]?.id ?? null);

  if (topics.length === 0) {
    return (
      <div className="card p-10 text-center">
        <div className="text-4xl mb-4">📚</div>
        <p className="text-slate-500 font-medium">Nenhum tópico disponível ainda</p>
        <p className="text-sm text-slate-400 mt-1">
          Em breve novos resumos de {materiaNome} serão adicionados.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden divide-y divide-slate-100">
      {topics.map((t, idx) => {
        const subtopicsComResumos = (t.subtopics ?? [])
          .map(s => ({
            ...s,
            study_summaries: (s.study_summaries ?? []).filter(r => r.status === 'published'),
          }))
          .filter(s => s.study_summaries.length > 0)
          .sort((a, b) => a.ordem - b.ordem);

        const totalResumos = subtopicsComResumos.flatMap(s => s.study_summaries).length;
        const isOpen = topicoAberto === t.id;

        return (
          <div key={t.id}>
            {/* Header clicável */}
            <button
              type="button"
              onClick={() => setTopicoAberto(isOpen ? null : t.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-slate-300 text-sm font-mono tabular-nums w-6 shrink-0 text-right">
                  {idx + 1}
                </span>
                <span className="font-semibold text-slate-800 text-sm truncate">{t.nome}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {totalResumos > 0
                    ? `${totalResumos} resumo${totalResumos > 1 ? 's' : ''}`
                    : 'Em breve'}
                </span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Barra de progresso */}
            <div className="h-px bg-slate-100 mx-5">
              {totalResumos > 0 && (
                <div className="h-full bg-blue-400 w-full" />
              )}
            </div>

            {/* Capítulos expandidos */}
            {isOpen && (
              <div className="bg-slate-50 border-t border-slate-100">
                {subtopicsComResumos.length === 0 ? (
                  <p className="px-14 py-4 text-sm text-slate-400 italic">
                    Nenhum resumo publicado neste tópico ainda.
                  </p>
                ) : (
                  subtopicsComResumos.map((s, sIdx) =>
                    s.study_summaries.map(r => (
                      <Link
                        key={r.id}
                        href={`/resumos/${r.id}`}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-0 group"
                      >
                        <span className="text-slate-300 text-xs font-mono tabular-nums w-9 shrink-0 text-right">
                          {idx + 1}.{sIdx + 1}
                        </span>
                        <span className="text-sm text-slate-700 group-hover:text-blue-700 flex-1 truncate">
                          {s.nome}
                        </span>
                        <span className="text-slate-300 group-hover:text-blue-400 text-sm shrink-0">→</span>
                      </Link>
                    ))
                  )
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
