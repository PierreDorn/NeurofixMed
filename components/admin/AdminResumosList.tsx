'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Resumo {
  id: string;
  titulo: string | null;
  status: string | null;
  ciclo: string | null;
  materia: string | null;
  updated_at: string | null;
  content_type: string | null;
}

interface Material { id: string; nome: string; }

interface Stats { total: number; published: number; draft: number; }

interface Props {
  resumos: Resumo[];
  materiais: Material[];
  stats: Stats;
}

const CICLOS = [
  { nome: 'Ciclo Básico', icon: '🔬' },
  { nome: 'Ciclo Clínico', icon: '🩺' },
];

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('pt-BR');
}

export default function AdminResumosList({ resumos, materiais, stats }: Props) {
  const [nivel, setNivel] = useState<'ciclos' | 'materias' | 'lista'>('ciclos');
  const [cicloAtivo, setCicloAtivo] = useState('');
  const [materiaAtiva, setMateriaAtiva] = useState('');

  const resumosDaCiclo = resumos.filter(r => r.ciclo === cicloAtivo);
  const materiasDaCiclo = materiais.filter(m => {
    const nomes = resumosDaCiclo.map(r => r.materia);
    return nomes.includes(m.nome);
  });

  const resumosDaMateria = resumos.filter(r => r.ciclo === cicloAtivo && r.materia === materiaAtiva);

  const countPorMateria = (nome: string) => resumos.filter(r => r.materia === nome && r.ciclo === cicloAtivo).length;
  const countPorCiclo = (nome: string) => resumos.filter(r => r.ciclo === nome).length;

  function goCiclo(ciclo: string) {
    setCicloAtivo(ciclo);
    setNivel('materias');
  }

  function goMateria(mat: string) {
    setMateriaAtiva(mat);
    setNivel('lista');
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .adm-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px}
        .adm-stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px}
        .adm-stat-label{font-size:11px;color:var(--text-dim);font-weight:500;text-transform:uppercase;letter-spacing:.5px}
        .adm-stat-value{font-size:26px;font-weight:700;margin-top:6px;font-family:'JetBrains Mono',monospace;letter-spacing:-1px}
        .adm-stat-value.blue{color:var(--primary)}.adm-stat-value.green{color:var(--green)}.adm-stat-value.yellow{color:var(--yellow)}.adm-stat-value.purple{color:var(--purple)}
        .adm-breadcrumb{display:flex;align-items:center;gap:8px;padding:12px 16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);margin-bottom:20px;font-size:13px}
        .adm-bc-item{color:var(--text-dim);cursor:pointer;transition:color .15s}.adm-bc-item:hover{color:var(--primary)}.adm-bc-item.active{color:var(--text);font-weight:600}
        .adm-bc-sep{color:var(--text-muted);font-size:11px}
        .adm-bc-back{display:flex;align-items:center;gap:6px;padding:5px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:12px;color:var(--text-dim);cursor:pointer;margin-right:8px;transition:all .15s}
        .adm-bc-back:hover{color:var(--text);background:var(--border)}
        .adm-folder-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px}
        .adm-folder-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .15s}
        .adm-folder-card:hover{border-color:var(--primary);background:var(--primary-glow);transform:translateY(-1px)}
        .adm-folder-icon{font-size:22px}
        .adm-folder-name{font-size:13px;font-weight:600;color:var(--text)}
        .adm-folder-count{font-size:11px;color:var(--text-muted);margin-top:2px}
        .adm-resumo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .adm-resumo-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px;cursor:pointer;transition:all .15s;position:relative}
        .adm-resumo-card:hover{border-color:var(--primary);transform:translateY(-1px)}
        .adm-resumo-card-icon{font-size:18px;margin-bottom:10px}
        .adm-resumo-card-title{font-size:13px;font-weight:600;line-height:1.4;margin-bottom:6px;color:var(--text)}
        .adm-resumo-card-meta{font-size:11px;color:var(--text-muted)}
        .adm-resumo-card-actions{display:flex;gap:6px;margin-top:12px;padding-top:10px;border-top:1px solid var(--border)}
        .adm-resumo-badge{position:absolute;top:12px;right:12px}
        .adm-status-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:500}
        .adm-status-active{background:var(--green-dim);color:var(--green)}.adm-status-draft{background:rgba(245,158,11,.12);color:var(--yellow)}
        .adm-page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px}
        .adm-page-title{font-size:22px;font-weight:700;letter-spacing:-.5px;color:var(--text)}
        .adm-page-subtitle{font-size:13px;color:var(--text-dim);margin-top:3px}
        @media(max-width:700px){.adm-folder-grid,.adm-resumo-grid{grid-template-columns:1fr}.adm-stats-row{grid-template-columns:repeat(2,1fr)}}
      `}} />

      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">Resumos</div>
          <div className="adm-page-subtitle">Gerencie os resumos por ciclo, matéria e tópico</div>
        </div>
        <Link href="/admin/resumos/novo" className="adm-btn adm-btn-primary">＋ Novo Resumo</Link>
      </div>

      <div className="adm-stats-row">
        <div className="adm-stat-card"><div className="adm-stat-label">Total</div><div className="adm-stat-value purple">{stats.total}</div></div>
        <div className="adm-stat-card"><div className="adm-stat-label">Publicados</div><div className="adm-stat-value green">{stats.published}</div></div>
        <div className="adm-stat-card"><div className="adm-stat-label">Rascunhos</div><div className="adm-stat-value yellow">{stats.draft}</div></div>
        <div className="adm-stat-card"><div className="adm-stat-label">Matérias</div><div className="adm-stat-value blue">{materiais.length}</div></div>
      </div>

      {/* BREADCRUMB */}
      <div className="adm-breadcrumb">
        {nivel !== 'ciclos' && (
          <span className="adm-bc-back" onClick={() => setNivel(nivel === 'lista' ? 'materias' : 'ciclos')}>← Voltar</span>
        )}
        <span className={`adm-bc-item${nivel === 'ciclos' ? ' active' : ''}`} onClick={() => setNivel('ciclos')}>📁 Início</span>
        {nivel !== 'ciclos' && (
          <>
            <span className="adm-bc-sep">›</span>
            <span className={`adm-bc-item${nivel === 'materias' ? ' active' : ''}`} onClick={() => setNivel('materias')}>
              {CICLOS.find(c => c.nome === cicloAtivo)?.icon} {cicloAtivo}
            </span>
          </>
        )}
        {nivel === 'lista' && (
          <>
            <span className="adm-bc-sep">›</span>
            <span className="adm-bc-item active">📄 {materiaAtiva}</span>
          </>
        )}
      </div>

      {/* NÍVEL 1 — CICLOS */}
      {nivel === 'ciclos' && (
        <div className="adm-folder-grid">
          {CICLOS.map(c => (
            <div key={c.nome} className="adm-folder-card" onClick={() => goCiclo(c.nome)}>
              <div className="adm-folder-icon">{c.icon}</div>
              <div>
                <div className="adm-folder-name">{c.nome}</div>
                <div className="adm-folder-count">{countPorCiclo(c.nome)} resumos</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NÍVEL 2 — MATÉRIAS */}
      {nivel === 'materias' && (
        <div className="adm-folder-grid">
          {materiais.map(m => (
            <div key={m.id} className="adm-folder-card" onClick={() => goMateria(m.nome)}>
              <div className="adm-folder-icon">📂</div>
              <div>
                <div className="adm-folder-name">{m.nome}</div>
                <div className="adm-folder-count">{countPorMateria(m.nome)} resumos</div>
              </div>
            </div>
          ))}
          {materiais.length === 0 && (
            <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>
              Nenhum resumo neste ciclo ainda.{' '}
              <Link href="/admin/resumos/novo" className="adm-btn adm-btn-primary adm-btn-sm" style={{ display: 'inline-flex' }}>Criar agora</Link>
            </p>
          )}
        </div>
      )}

      {/* NÍVEL 3 — RESUMOS */}
      {nivel === 'lista' && (
        <div className="adm-resumo-grid">
          {resumosDaMateria.length === 0 ? (
            <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>Nenhum resumo nesta matéria ainda.</p>
          ) : (
            resumosDaMateria.map(r => (
              <div key={r.id} className="adm-resumo-card">
                <span className={`adm-resumo-badge adm-status-badge ${r.status === 'published' ? 'adm-status-active' : 'adm-status-draft'}`}>
                  {r.status === 'published' ? '● Pub' : '● Draft'}
                </span>
                <div className="adm-resumo-card-icon">{r.content_type === 'pdf' ? '📄' : '📝'}</div>
                <div className="adm-resumo-card-title">{r.titulo ?? 'Sem título'}</div>
                <div className="adm-resumo-card-meta">Atualizado em: {formatDate(r.updated_at)}</div>
                <div className="adm-resumo-card-actions">
                  <Link href={`/admin/resumos/${r.id}/editar`} className="adm-btn adm-btn-primary adm-btn-sm">✏️ Editar</Link>
                  <Link href={`/resumos/${r.id}`} target="_blank" className="adm-btn adm-btn-ghost adm-btn-sm">👁</Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
