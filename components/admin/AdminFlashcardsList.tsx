'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface Flashcard {
  id: string;
  titulo: string | null;
  tipo: string | null;
  status: string | null;
  ciclo: string | null;
  materia: string | null;
  topic_id: string | null;
  subtopic_id: string | null;
  sub_subtopic_id: string | null;
  updated_at: string | null;
}
interface Material { id: string; nome: string; ciclo: string | null; }
interface Topic { id: string; nome: string; material_id: string; }
interface Subtopic { id: string; nome: string; topic_id: string; }
interface SubSubtopic { id: string; nome: string; subtopic_id: string; }

interface Props {
  flashcards: Flashcard[];
  materiais: Material[];
  topics: Topic[];
  subtopics: Subtopic[];
  subSubtopics: SubSubtopic[];
}

type Nivel = 'ciclos' | 'materias' | 'topicos' | 'subtopicos' | 'subsubtopicos' | 'lista';

const CICLOS = [
  { nome: 'Ciclo Básico', icon: '🔬' },
  { nome: 'Ciclo Clínico', icon: '🩺' },
  { nome: 'Internato', icon: '🏥' },
];

const TIPO_LABEL: Record<string, string> = {
  frente_verso: '🃏 Frente/Verso',
  lacuna: '✏️ Lacuna',
  multipla_escolha: '📋 Múltipla Escolha',
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR');
}

function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24,
      background: 'var(--surface)', border: '1px solid var(--green)', color: 'var(--green)',
      padding: '12px 18px', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500,
      display: visible ? 'flex' : 'none', alignItems: 'center', gap: 8,
      zIndex: 999, boxShadow: '0 4px 20px rgba(0,0,0,.4)',
    }}>✅ {msg}</div>
  );
}

export default function AdminFlashcardsList({ flashcards: initialFlashcards, materiais, topics, subtopics, subSubtopics }: Props) {
  const supabase = createSupabaseBrowserClient();
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);
  const [nivel, setNivel] = useState<Nivel>('ciclos');
  const [cicloAtivo, setCicloAtivo] = useState('');
  const [materiaAtiva, setMateriaAtiva] = useState({ id: '', nome: '' });
  const [topicAtivo, setTopicAtivo] = useState({ id: '', nome: '' });
  const [subtopicAtivo, setSubtopicAtivo] = useState({ id: '', nome: '' });
  const [subSubtopicAtivo, setSubSubtopicAtivo] = useState({ id: '', nome: '' });
  const [toast, setToast] = useState({ visible: false, msg: '' });
  const [deleteModal, setDeleteModal] = useState({ visible: false, id: '', titulo: '' });
  const [deleting, setDeleting] = useState(false);

  function showToast(msg: string) {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: '' }), 3000);
  }

  function goCiclo(ciclo: string) { setCicloAtivo(ciclo); setNivel('materias'); }
  function goMateria(id: string, nome: string) { setMateriaAtiva({ id, nome }); setNivel('topicos'); }
  function goTopico(id: string, nome: string) { setTopicAtivo({ id, nome }); setNivel('subtopicos'); }
  function goSubtopico(id: string, nome: string) {
    setSubtopicAtivo({ id, nome });
    setSubSubtopicAtivo({ id: '', nome: '' });
    const temSubSubs = subSubtopics.some(ss => ss.subtopic_id === id);
    setNivel(temSubSubs ? 'subsubtopicos' : 'lista');
  }
  function goSubSubtopico(id: string, nome: string) {
    setSubSubtopicAtivo({ id, nome });
    setNivel('lista');
  }

  function goBack() {
    if (nivel === 'lista' && subSubtopicAtivo.id) { setNivel('subsubtopicos'); return; }
    if (nivel === 'lista') { setNivel('subtopicos'); return; }
    if (nivel === 'subsubtopicos') { setNivel('subtopicos'); return; }
    if (nivel === 'subtopicos') { setNivel('topicos'); return; }
    if (nivel === 'topicos') { setNivel('materias'); return; }
    if (nivel === 'materias') { setNivel('ciclos'); return; }
  }

  const materiasDoCiclo = materiais.filter(m => m.ciclo === cicloAtivo);
  const topicsDaMateria = topics.filter(t => t.material_id === materiaAtiva.id);
  const subtopicsDoTopico = subtopics.filter(s => s.topic_id === topicAtivo.id);
  const subSubsDoSubtopico = subSubtopics.filter(ss => ss.subtopic_id === subtopicAtivo.id);
  const flashcardsAtivos = nivel === 'lista'
    ? (subSubtopicAtivo.id
        ? flashcards.filter(f => f.sub_subtopic_id === subSubtopicAtivo.id)
        : flashcards.filter(f => f.subtopic_id === subtopicAtivo.id && !f.sub_subtopic_id))
    : [];

  const countPorCiclo = (nome: string) => flashcards.filter(f => f.ciclo === nome).length;
  const countPorMateria = (id: string) => flashcards.filter(f => f.topic_id && topics.find(t => t.id === f.topic_id && t.material_id === id)).length;
  const countPorTopico = (id: string) => flashcards.filter(f => f.topic_id === id).length;
  const countPorSubtopico = (id: string) => flashcards.filter(f => f.subtopic_id === id).length;
  const countPorSubSub = (id: string) => flashcards.filter(f => f.sub_subtopic_id === id).length;

  const stats = {
    total: flashcards.length,
    published: flashcards.filter(f => f.status === 'published').length,
    draft: flashcards.filter(f => f.status === 'draft').length,
  };

  async function confirmDelete() {
    setDeleting(true);
    try {
      const { error } = await supabase.from('flashcards').delete().eq('id', deleteModal.id);
      if (error) throw error;
      setFlashcards(prev => prev.filter(f => f.id !== deleteModal.id));
      setDeleteModal({ visible: false, id: '', titulo: '' });
      showToast('Flashcard excluído!');
    } catch (err: unknown) {
      showToast('Erro: ' + ((err as { message?: string })?.message ?? 'Falha ao excluir'));
      setDeleteModal({ visible: false, id: '', titulo: '' });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .adm-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
        .adm-stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px}
        .adm-stat-label{font-size:11px;color:var(--text-dim);font-weight:500;text-transform:uppercase;letter-spacing:.5px}
        .adm-stat-value{font-size:26px;font-weight:700;margin-top:6px;font-family:'JetBrains Mono',monospace;letter-spacing:-1px}
        .adm-stat-value.blue{color:var(--primary)}.adm-stat-value.green{color:var(--green)}.adm-stat-value.yellow{color:var(--yellow)}.adm-stat-value.purple{color:var(--purple)}
        .adm-breadcrumb{display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:20px;font-size:12px;flex-wrap:wrap}
        .adm-bc-item{color:var(--text-dim);cursor:pointer;transition:color .15s}.adm-bc-item:hover{color:var(--primary)}.adm-bc-item.active{color:var(--text);font-weight:600;cursor:default}
        .adm-bc-sep{color:var(--text-muted);font-size:11px}
        .adm-bc-back{display:flex;align-items:center;gap:6px;padding:4px 10px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:11px;color:var(--text-dim);cursor:pointer;margin-right:4px;transition:all .15s;flex-shrink:0}
        .adm-bc-back:hover{color:var(--text);background:var(--border)}
        .adm-folder-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
        .adm-folder-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .15s}
        .adm-folder-card:hover{border-color:var(--primary);background:var(--primary-glow);transform:translateY(-1px)}
        .adm-folder-icon{font-size:22px;flex-shrink:0}
        .adm-folder-name{font-size:13px;font-weight:600;color:var(--text)}
        .adm-folder-count{font-size:11px;color:var(--text-muted);margin-top:2px}
        .adm-resumo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .adm-resumo-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;transition:all .15s;position:relative}
        .adm-resumo-card:hover{border-color:var(--border-bright)}
        .adm-resumo-card-icon{font-size:18px;margin-bottom:10px}
        .adm-resumo-card-title{font-size:13px;font-weight:600;line-height:1.4;margin-bottom:6px;color:var(--text)}
        .adm-resumo-card-meta{font-size:11px;color:var(--text-muted)}
        .adm-resumo-card-actions{display:flex;gap:6px;margin-top:12px;padding-top:10px;border-top:1px solid var(--border);flex-wrap:wrap}
        .adm-resumo-badge{position:absolute;top:12px;right:12px}
        .adm-status-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:500}
        .adm-status-active{background:var(--green-dim);color:var(--green)}.adm-status-draft{background:rgba(245,158,11,.12);color:var(--yellow)}
        .adm-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(2px)}
        .adm-modal{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.5)}
        @media(max-width:700px){.adm-folder-grid,.adm-resumo-grid{grid-template-columns:1fr}.adm-stats-row{grid-template-columns:repeat(2,1fr)}}
      `}} />

      {/* Stats */}
      <div className="adm-stats-row">
        <div className="adm-stat-card"><div className="adm-stat-label">Total</div><div className="adm-stat-value purple">{stats.total}</div></div>
        <div className="adm-stat-card"><div className="adm-stat-label">Publicados</div><div className="adm-stat-value green">{stats.published}</div></div>
        <div className="adm-stat-card"><div className="adm-stat-label">Rascunhos</div><div className="adm-stat-value yellow">{stats.draft}</div></div>
        <div className="adm-stat-card"><div className="adm-stat-label">Matérias</div><div className="adm-stat-value blue">{materiais.length}</div></div>
      </div>

      {/* Breadcrumb */}
      <div className="adm-breadcrumb">
        {nivel !== 'ciclos' && <span className="adm-bc-back" onClick={goBack}>← Voltar</span>}
        <span className={`adm-bc-item${nivel === 'ciclos' ? ' active' : ''}`} onClick={() => setNivel('ciclos')}>📁 Início</span>
        {nivel !== 'ciclos' && <><span className="adm-bc-sep">›</span><span className={`adm-bc-item${nivel === 'materias' ? ' active' : ''}`} onClick={() => setNivel('materias')}>{CICLOS.find(c => c.nome === cicloAtivo)?.icon} {cicloAtivo}</span></>}
        {['topicos','subtopicos','subsubtopicos','lista'].includes(nivel) && <><span className="adm-bc-sep">›</span><span className={`adm-bc-item${nivel === 'topicos' ? ' active' : ''}`} onClick={() => setNivel('topicos')}>📂 {materiaAtiva.nome}</span></>}
        {['subtopicos','subsubtopicos','lista'].includes(nivel) && <><span className="adm-bc-sep">›</span><span className={`adm-bc-item${nivel === 'subtopicos' ? ' active' : ''}`} onClick={() => setNivel('subtopicos')}>📂 {topicAtivo.nome}</span></>}
        {['subsubtopicos','lista'].includes(nivel) && <><span className="adm-bc-sep">›</span><span className="adm-bc-item active">📄 {subtopicAtivo.nome}</span></>}
        {nivel === 'lista' && subSubtopicAtivo.id && <><span className="adm-bc-sep">›</span><span className="adm-bc-item active">• {subSubtopicAtivo.nome}</span></>}
      </div>

      {/* Ciclos */}
      {nivel === 'ciclos' && (
        <div className="adm-folder-grid">
          {CICLOS.map(c => (
            <div key={c.nome} className="adm-folder-card" onClick={() => goCiclo(c.nome)}>
              <div className="adm-folder-icon">{c.icon}</div>
              <div><div className="adm-folder-name">{c.nome}</div><div className="adm-folder-count">{countPorCiclo(c.nome)} flashcards</div></div>
            </div>
          ))}
        </div>
      )}

      {/* Matérias */}
      {nivel === 'materias' && (
        <div className="adm-folder-grid">
          {materiasDoCiclo.length === 0 && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)', fontSize: 13 }}>Nenhuma matéria neste ciclo.</p>}
          {materiasDoCiclo.map(m => (
            <div key={m.id} className="adm-folder-card" onClick={() => goMateria(m.id, m.nome)}>
              <div className="adm-folder-icon">📚</div>
              <div><div className="adm-folder-name">{m.nome}</div><div className="adm-folder-count">{countPorMateria(m.id)} flashcards</div></div>
            </div>
          ))}
        </div>
      )}

      {/* Tópicos */}
      {nivel === 'topicos' && (
        <div className="adm-folder-grid">
          {topicsDaMateria.length === 0 && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)', fontSize: 13 }}>Nenhum tópico.</p>}
          {topicsDaMateria.map(t => (
            <div key={t.id} className="adm-folder-card" onClick={() => goTopico(t.id, t.nome)}>
              <div className="adm-folder-icon">📂</div>
              <div><div className="adm-folder-name">{t.nome}</div><div className="adm-folder-count">{countPorTopico(t.id)} flashcards</div></div>
            </div>
          ))}
        </div>
      )}

      {/* Subtópicos */}
      {nivel === 'subtopicos' && (
        <div className="adm-folder-grid">
          {subtopicsDoTopico.length === 0 && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)', fontSize: 13 }}>Nenhum subtópico.</p>}
          {subtopicsDoTopico.map(s => {
            const temSubSubs = subSubtopics.some(ss => ss.subtopic_id === s.id);
            const count = countPorSubtopico(s.id);
            return (
              <div key={s.id} className="adm-folder-card" onClick={() => goSubtopico(s.id, s.nome)}>
                <div className="adm-folder-icon">{temSubSubs ? '📂' : '🃏'}</div>
                <div><div className="adm-folder-name">{s.nome}</div><div className="adm-folder-count">{count} flashcard(s)</div></div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-subtópicos */}
      {nivel === 'subsubtopicos' && (
        <div className="adm-folder-grid">
          {subSubsDoSubtopico.length === 0 && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)', fontSize: 13 }}>Nenhum sub-subtópico.</p>}
          {subSubsDoSubtopico.map(ss => {
            const count = countPorSubSub(ss.id);
            return (
              <div key={ss.id} className="adm-folder-card" onClick={() => goSubSubtopico(ss.id, ss.nome)}>
                <div className="adm-folder-icon">🃏</div>
                <div><div className="adm-folder-name">{ss.nome}</div><div className="adm-folder-count">{count} flashcard(s)</div></div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lista de flashcards */}
      {nivel === 'lista' && (
        <div className="adm-resumo-grid">
          {flashcardsAtivos.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🃏</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Nenhum flashcard aqui ainda</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>
                {subSubtopicAtivo.id ? subSubtopicAtivo.nome : subtopicAtivo.nome}
              </div>
              <Link href="/admin/flashcards/novo" className="adm-btn adm-btn-primary">＋ Criar Flashcard</Link>
            </div>
          )}
          {flashcardsAtivos.map(f => (
            <div key={f.id} className="adm-resumo-card">
              <span className={`adm-resumo-badge adm-status-badge ${f.status === 'published' ? 'adm-status-active' : 'adm-status-draft'}`}>
                {f.status === 'published' ? '● Pub' : '● Draft'}
              </span>
              <div className="adm-resumo-card-icon">{f.tipo === 'lacuna' ? '✏️' : f.tipo === 'multipla_escolha' ? '📋' : '🃏'}</div>
              <div className="adm-resumo-card-title">{f.titulo ?? 'Sem título'}</div>
              <div className="adm-resumo-card-meta" style={{ marginBottom: 4 }}>{TIPO_LABEL[f.tipo ?? 'frente_verso'] ?? f.tipo}</div>
              <div className="adm-resumo-card-meta">Atualizado: {formatDate(f.updated_at)}</div>
              <div className="adm-resumo-card-actions">
                <Link href={`/admin/flashcards/${f.id}/editar`} className="adm-btn adm-btn-primary adm-btn-sm">✏️ Editar</Link>
                <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => setDeleteModal({ visible: true, id: f.id, titulo: f.titulo ?? 'Sem título' })}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal delete */}
      {deleteModal.visible && (
        <div className="adm-modal-overlay" onClick={() => !deleting && setDeleteModal({ visible: false, id: '', titulo: '' })}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>⚠️ Excluir flashcard?</div>
            <div style={{ fontSize: 14, fontWeight: 600, padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: 12 }}>"{deleteModal.titulo}"</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>Esta ação não pode ser desfeita.</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setDeleteModal({ visible: false, id: '', titulo: '' })} disabled={deleting}>Cancelar</button>
              <button type="button" className="adm-btn adm-btn-danger" onClick={confirmDelete} disabled={deleting}>{deleting ? 'Excluindo...' : '🗑 Sim, excluir'}</button>
            </div>
          </div>
        </div>
      )}

      <Toast msg={toast.msg} visible={toast.visible} />
    </>
  );
}
