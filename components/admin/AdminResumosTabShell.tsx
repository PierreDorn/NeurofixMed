'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdminResumosList from './AdminResumosList';
import AdminFlashcardsList from './AdminFlashcardsList';

interface Resumo { id: string; titulo: string | null; status: string | null; ciclo: string | null; materia: string | null; topic_id: string | null; subtopic_id: string | null; sub_subtopic_id: string | null; updated_at: string | null; content_type: string | null; }
interface Flashcard { id: string; titulo: string | null; tipo: string | null; status: string | null; ciclo: string | null; materia: string | null; topic_id: string | null; subtopic_id: string | null; sub_subtopic_id: string | null; updated_at: string | null; }
interface Material { id: string; nome: string; ciclo: string | null; }
interface Topic { id: string; nome: string; material_id: string; }
interface Subtopic { id: string; nome: string; topic_id: string; }
interface SubSubtopic { id: string; nome: string; subtopic_id: string; }

interface Props {
  initialTab: 'resumos' | 'flashcards';
  resumos: Resumo[];
  flashcards: Flashcard[];
  materiais: Material[];
  topics: Topic[];
  subtopics: Subtopic[];
  subSubtopics: SubSubtopic[];
}

export default function AdminResumosTabShell({ initialTab, resumos, flashcards, materiais, topics, subtopics, subSubtopics }: Props) {
  const [tab, setTab] = useState<'resumos' | 'flashcards'>(initialTab);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .adm-tab-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;gap:12px;flex-wrap:wrap}
        .adm-tab-group{display:flex;gap:0;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:3px;flex-shrink:0}
        .adm-tab{padding:7px 20px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--text-dim);transition:all .15s;font-family:inherit;display:flex;align-items:center;gap:7px}
        .adm-tab.active{background:var(--primary);color:#fff;box-shadow:0 2px 8px rgba(59,130,246,.25)}
        .adm-tab:hover:not(.active){background:var(--surface2);color:var(--text)}
        .adm-page-title{font-size:22px;font-weight:700;letter-spacing:-.5px;color:var(--text)}
        .adm-page-subtitle{font-size:13px;color:var(--text-dim);margin-top:3px}
      `}} />

      <div className="adm-tab-bar">
        <div>
          <div className="adm-page-title">{tab === 'resumos' ? 'Resumos' : 'Hierarquia Flashcards'}</div>
          <div className="adm-page-subtitle">
            {tab === 'resumos'
              ? 'Navegue pela hierarquia para gerenciar resumos'
              : 'Navegue pela hierarquia para gerenciar flashcards'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="adm-tab-group">
            <button className={`adm-tab${tab === 'resumos' ? ' active' : ''}`} onClick={() => setTab('resumos')}>
              📝 Resumos
            </button>
            <button className={`adm-tab${tab === 'flashcards' ? ' active' : ''}`} onClick={() => setTab('flashcards')}>
              🃏 Flashcards
            </button>
          </div>
          {tab === 'resumos'
            ? <Link href="/admin/resumos/novo" className="adm-btn adm-btn-primary">＋ Novo Resumo</Link>
            : <Link href="/admin/flashcards/novo" className="adm-btn adm-btn-primary">＋ Novo Flashcard</Link>
          }
        </div>
      </div>

      {tab === 'resumos' && (
        <AdminResumosList
          resumos={resumos}
          materiais={materiais}
          topics={topics}
          subtopics={subtopics}
          subSubtopics={subSubtopics}
        />
      )}

      {tab === 'flashcards' && (
        <AdminFlashcardsList
          flashcards={flashcards}
          materiais={materiais}
          topics={topics}
          subtopics={subtopics}
          subSubtopics={subSubtopics}
        />
      )}
    </>
  );
}
