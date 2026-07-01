'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface ResumoLeaf {
  id: string;
  titulo: string | null;
  content: string | null;
}
interface SubSubNode { id: string; nome: string; resumos: ResumoLeaf[]; }
interface SubNode { id: string; nome: string; sub_subtopics: SubSubNode[]; resumos: ResumoLeaf[]; }
interface TopicNode { id: string; nome: string; subtopics: SubNode[]; resumos: ResumoLeaf[]; }
interface MateriaNode {
  ciclo: string;
  materia: string;
  topics: TopicNode[];
  resumosOrfaos: ResumoLeaf[];
  total: number;
}

type DeleteTarget =
  | { tipo: 'materia'; ciclo: string; materia: string; nome: string }
  | { tipo: 'topico'; id: string; nome: string }
  | { tipo: 'subtopico'; id: string; nome: string }
  | { tipo: 'subsubtopico'; id: string; nome: string }
  | { tipo: 'resumo'; id: string; nome: string };

const CICLOS_ORDER = ['Ciclo Básico', 'Ciclo Clínico', 'Internato'];
const CICLO_ICON: Record<string, string> = {
  'Ciclo Básico': '🔬',
  'Ciclo Clínico': '🩺',
  'Internato': '🏥',
};

function normalizeCiclo(value: string | null | undefined): string {
  const v = (value ?? '').trim();
  if (!v) return 'Ciclo Básico';
  const lower = v.toLowerCase();
  if (lower.includes('clín') || lower.includes('clin')) return 'Ciclo Clínico';
  if (lower.includes('intern')) return 'Internato';
  return 'Ciclo Básico';
}

function Toast({ msg, ok, visible }: { msg: string; ok: boolean; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: '#0F131C', border: `1px solid ${ok ? '#4ADE80' : '#ef4444'}`,
      color: ok ? '#4ADE80' : '#ef4444',
      padding: '12px 18px', borderRadius: 14, fontSize: 13, fontWeight: 600,
      display: visible ? 'flex' : 'none', alignItems: 'center', gap: 8,
      boxShadow: '0 12px 32px rgba(0,0,0,.6)',
    }}>
      {ok ? '✅' : '⚠️'} {msg}
    </div>
  );
}

export default function ResumosHierarquiaManager() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [tree, setTree] = useState<MateriaNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ visible: false, msg: '', ok: true });
  const [userId, setUserId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);

    const [resRes, topRes, subRes, subsubRes] = await Promise.all([
      supabase.from('study_summaries')
        .select('id, titulo, content, ciclo, materia, topic_id, subtopic_id, sub_subtopic_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase.from('topics').select('id, nome, material_id').eq('user_id', user.id),
      supabase.from('subtopics').select('id, nome, topic_id').eq('user_id', user.id),
      supabase.from('sub_subtopics').select('id, nome, subtopic_id').eq('user_id', user.id),
    ]);

    const resumos = (resRes.data ?? []) as Array<{
      id: string; titulo: string | null; content: string | null;
      ciclo: string | null; materia: string | null;
      topic_id: string | null; subtopic_id: string | null; sub_subtopic_id: string | null;
    }>;
    const topics = (topRes.data ?? []) as Array<{ id: string; nome: string }>;
    const subtopics = (subRes.data ?? []) as Array<{ id: string; nome: string; topic_id: string }>;
    const subsubs = (subsubRes.data ?? []) as Array<{ id: string; nome: string; subtopic_id: string }>;

    const matKey = (c: string, m: string) => `${c}::${m}`;
    const matMap = new Map<string, { ciclo: string; materia: string; resumos: typeof resumos }>();
    for (const r of resumos) {
      const ciclo = normalizeCiclo(r.ciclo);
      const materia = (r.materia ?? '').trim() || 'Sem matéria';
      const k = matKey(ciclo, materia);
      if (!matMap.has(k)) matMap.set(k, { ciclo, materia, resumos: [] });
      matMap.get(k)!.resumos.push(r);
    }

    const subsubNodeMap = new Map<string, SubSubNode>();
    for (const ss of subsubs) subsubNodeMap.set(ss.id, { id: ss.id, nome: ss.nome, resumos: [] });

    const subNodeMap = new Map<string, SubNode>();
    for (const s of subtopics) {
      subNodeMap.set(s.id, {
        id: s.id, nome: s.nome,
        sub_subtopics: subsubs.filter(ss => ss.subtopic_id === s.id).map(ss => subsubNodeMap.get(ss.id)!),
        resumos: [],
      });
    }

    const topicNodeMap = new Map<string, TopicNode>();
    for (const t of topics) {
      topicNodeMap.set(t.id, {
        id: t.id, nome: t.nome,
        subtopics: subtopics.filter(s => s.topic_id === t.id).map(s => subNodeMap.get(s.id)!),
        resumos: [],
      });
    }

    const built: MateriaNode[] = [];
    for (const { ciclo, materia, resumos: rs } of matMap.values()) {
      const topicSnapshots = new Map<string, TopicNode>();
      const resumosOrfaos: ResumoLeaf[] = [];

      for (const r of rs) {
        const leaf: ResumoLeaf = { id: r.id, titulo: r.titulo, content: r.content };
        if (r.sub_subtopic_id && subsubNodeMap.has(r.sub_subtopic_id)) {
          subsubNodeMap.get(r.sub_subtopic_id)!.resumos.push(leaf);
        } else if (r.subtopic_id && subNodeMap.has(r.subtopic_id)) {
          subNodeMap.get(r.subtopic_id)!.resumos.push(leaf);
        } else if (r.topic_id && topicNodeMap.has(r.topic_id)) {
          topicNodeMap.get(r.topic_id)!.resumos.push(leaf);
        } else {
          resumosOrfaos.push(leaf);
        }

        const topId = r.topic_id ?? (r.subtopic_id ? subtopics.find(s => s.id === r.subtopic_id)?.topic_id : null);
        if (topId && topicNodeMap.has(topId)) {
          topicSnapshots.set(topId, topicNodeMap.get(topId)!);
        }
      }

      built.push({
        ciclo, materia,
        topics: Array.from(topicSnapshots.values()),
        resumosOrfaos,
        total: rs.length,
      });
    }

    built.sort((a, b) => a.materia.localeCompare(b.materia, 'pt-BR'));
    setTree(built);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function showToast(msg: string, ok = true) {
    setToast({ visible: true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function confirmDelete() {
    if (!deleteTarget || !userId) return;
    setDeleting(true);
    try {
      if (deleteTarget.tipo === 'materia') {
        const { error } = await supabase.from('study_summaries').delete()
          .eq('user_id', userId).eq('ciclo', deleteTarget.ciclo).eq('materia', deleteTarget.materia);
        if (error) throw error;
      } else if (deleteTarget.tipo === 'resumo') {
        const { error } = await supabase.from('study_summaries').delete()
          .eq('id', deleteTarget.id).eq('user_id', userId);
        if (error) throw error;
      } else if (deleteTarget.tipo === 'topico') {
        await supabase.from('study_summaries').delete().eq('topic_id', deleteTarget.id).eq('user_id', userId);
        const { error } = await supabase.from('topics').delete().eq('id', deleteTarget.id).eq('user_id', userId);
        if (error) throw error;
      } else if (deleteTarget.tipo === 'subtopico') {
        await supabase.from('study_summaries').delete().eq('subtopic_id', deleteTarget.id).eq('user_id', userId);
        const { error } = await supabase.from('subtopics').delete().eq('id', deleteTarget.id).eq('user_id', userId);
        if (error) throw error;
      } else if (deleteTarget.tipo === 'subsubtopico') {
        await supabase.from('study_summaries').delete().eq('sub_subtopic_id', deleteTarget.id).eq('user_id', userId);
        const { error } = await supabase.from('sub_subtopics').delete().eq('id', deleteTarget.id).eq('user_id', userId);
        if (error) throw error;
      }

      showToast(`"${deleteTarget.nome}" excluído com sucesso!`);
      setDeleteTarget(null);
      await fetchAll();
    } catch (err: unknown) {
      showToast('Erro: ' + ((err as { message?: string })?.message ?? 'Falha ao excluir'), false);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  const btnDel = (target: DeleteTarget) => (
    <button
      type="button"
      onClick={e => { e.stopPropagation(); setDeleteTarget(target); }}
      className="nh-del-btn"
    >
      🗑 Excluir
    </button>
  );

  const warningMsg: Record<string, string> = {
    materia: 'Todos os resumos desta matéria serão apagados permanentemente.',
    topico: 'Subtópicos, sub-subtópicos e todos os resumos vinculados a este tópico serão excluídos.',
    subtopico: 'Sub-subtópicos e todos os resumos vinculados a este subtópico serão excluídos.',
    subsubtopico: 'Todos os resumos vinculados a este sub-subtópico serão excluídos.',
    resumo: 'Este resumo será removido permanentemente.',
  };

  const ciclos = CICLOS_ORDER.filter(c => tree.some(n => n.ciclo === c));

  function getPreview(content: string | null): string {
    if (!content) return 'Sem conteúdo';
    const stripped = content.replace(/<[^>]*>/g, '').trim();
    return stripped.length > 120 ? stripped.slice(0, 120) + '...' : stripped;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root{--nh-gold:#C9A84C;--nh-gold-light:#E8D08A;--nh-bg:#0A0D14;--nh-card:#0F131C;--nh-border:rgba(255,255,255,0.08);--nh-border-gold:rgba(201,168,76,0.22);--nh-text:#F7F7F8;--nh-text-dim:rgba(247,247,248,.62);--nh-text-muted:rgba(247,247,248,.42)}
        .nh-page{font-family:'Atkinson Hyperlegible','Inter',sans-serif;color:var(--nh-text)}
        .nh-back{display:inline-flex;align-items:center;gap:7px;color:var(--nh-text-dim);font-size:13px;font-weight:600;background:transparent;border:none;padding:0;margin-bottom:18px;cursor:pointer;transition:color .15s;font-family:inherit}
        .nh-back:hover{color:#fff}
        .nh-hero{padding:28px 30px;border-radius:24px;border:1px solid var(--nh-border-gold);background:radial-gradient(circle at 0% 0%,rgba(201,168,76,0.10),transparent 36%),rgba(15,19,28,0.78);margin-bottom:24px}
        .nh-kicker{font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--nh-gold-light);margin-bottom:6px}
        .nh-title{font-size:28px;line-height:1.1;font-weight:900;letter-spacing:-.02em;color:var(--nh-text)}
        .nh-sub{color:var(--nh-text-dim);font-size:13.5px;line-height:1.55;margin-top:8px;max-width:620px}
        .nh-ciclo-title{font-size:11px;font-weight:800;color:var(--nh-text-muted);text-transform:uppercase;letter-spacing:.14em;margin:24px 0 10px;padding-bottom:8px;border-bottom:1px solid var(--nh-border);display:flex;align-items:center;gap:8px}
        .nh-mat-card{background:rgba(15,19,28,0.7);border:1px solid var(--nh-border);border-radius:18px;margin-bottom:12px;overflow:hidden;transition:border-color .2s}
        .nh-mat-card:hover{border-color:rgba(201,168,76,0.16)}
        .nh-row{display:flex;align-items:center;gap:10px;padding:13px 16px;transition:background .15s;cursor:default}
        .nh-row.clickable{cursor:pointer}
        .nh-row.clickable:hover{background:rgba(255,255,255,0.03)}
        .nh-toggle{cursor:pointer;user-select:none;font-size:11px;color:var(--nh-text-muted);width:14px;text-align:center;flex-shrink:0}
        .nh-ic{font-size:15px;flex-shrink:0}
        .nh-nome{flex:1;font-size:13.5px;color:var(--nh-text);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .nh-mat-nome{font-size:15px;font-weight:800;letter-spacing:-.01em}
        .nh-badge{font-size:10px;color:var(--nh-text-dim);background:rgba(255,255,255,0.04);border:1px solid var(--nh-border);border-radius:999px;padding:3px 9px;font-weight:700;letter-spacing:.04em;flex-shrink:0}
        .nh-badge.gold{color:var(--nh-gold-light);border-color:rgba(201,168,76,0.24);background:rgba(201,168,76,0.06)}
        .nh-children{margin-left:24px;border-left:1px solid var(--nh-border);padding-left:6px}
        .nh-del-btn{background:rgba(239,68,68,.1);color:#fca5a5;border:1px solid rgba(239,68,68,.25);border-radius:10px;padding:4px 10px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0;transition:all .15s}
        .nh-del-btn:hover{background:rgba(239,68,68,.18);color:#fda4a4;border-color:rgba(239,68,68,.4)}
        .nh-resumo{padding:10px 14px;margin:6px 0 6px 8px;border-radius:10px;border:1px solid var(--nh-border);background:rgba(5,7,11,0.4);display:flex;align-items:flex-start;gap:10px}
        .nh-resumo-content{flex:1;min-width:0}
        .nh-resumo-t{font-size:12.5px;color:var(--nh-text);font-weight:600;margin-bottom:3px;line-height:1.4}
        .nh-resumo-p{font-size:11.5px;color:var(--nh-text-muted);line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .nh-empty{color:var(--nh-text-muted);font-size:13px;padding:6px 12px;font-style:italic}
        .nh-empty-card{padding:48px 24px;border-radius:18px;border:1px dashed var(--nh-border);background:rgba(15,19,28,0.5);text-align:center;color:var(--nh-text-dim);font-size:14px}
        .nh-empty-card strong{display:block;font-size:18px;color:var(--nh-text);font-weight:800;margin-bottom:6px}
        .nh-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px)}
        .nh-modal{background:#0F131C;border:1px solid var(--nh-border-gold);border-radius:18px;padding:28px;max-width:460px;width:90%;box-shadow:0 24px 60px rgba(0,0,0,.5);font-family:inherit;color:var(--nh-text)}
        .nh-modal-h{font-size:17px;font-weight:800;margin-bottom:10px;letter-spacing:-.01em}
        .nh-modal-tag{font-size:14px;font-weight:700;padding:10px 14px;background:rgba(5,7,11,0.6);border:1px solid var(--nh-border);border-radius:10px;margin-bottom:12px;color:var(--nh-text)}
        .nh-modal-warn{font-size:12.5px;color:#fca5a5;margin-bottom:20px;line-height:1.6;padding:10px 14px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);border-radius:10px}
        .nh-modal-actions{display:flex;gap:10px;justify-content:flex-end}
        .nh-modal-btn{padding:9px 18px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;border:1px solid var(--nh-border);transition:all .15s}
        .nh-modal-btn.ghost{background:transparent;color:var(--nh-text-dim)}
        .nh-modal-btn.ghost:hover{background:rgba(255,255,255,0.04);color:#fff}
        .nh-modal-btn.danger{background:#ef4444;color:#fff;border-color:#ef4444}
        .nh-modal-btn.danger:hover{background:#dc2626}
        .nh-modal-btn:disabled{opacity:.6;cursor:not-allowed}
      `}} />

      <div className="nh-page">
        <button className="nh-back" type="button" onClick={() => router.push('/biblioteca')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Voltar para biblioteca
        </button>

        <div className="nh-hero">
          <div className="nh-kicker">Hierarquia pessoal</div>
          <div className="nh-title">Organize seus <span style={{ color: '#E8D08A' }}>resumos</span>.</div>
          <p className="nh-sub">
            Veja toda a estrutura dos seus resumos por ciclo, matéria, tópico e subtópico.
            Você pode excluir qualquer nível — tudo o que estiver dentro será apagado junto.
          </p>
        </div>

        {loading && <p style={{ color: 'rgba(247,247,248,.5)', fontSize: 13, padding: '16px 0' }}>Carregando hierarquia...</p>}

        {!loading && tree.length === 0 && (
          <div className="nh-empty-card">
            <strong>Nenhum resumo seu ainda</strong>
            Quando você criar resumos pessoais, eles aparecerão aqui organizados.
          </div>
        )}

        {!loading && ciclos.map(ciclo => {
          const matters = tree.filter(t => t.ciclo === ciclo);
          if (matters.length === 0) return null;
          return (
            <div key={ciclo}>
              <div className="nh-ciclo-title">{CICLO_ICON[ciclo]} {ciclo}</div>
              {matters.map(mat => {
                const matKey = `mat-${ciclo}-${mat.materia}`;
                const open = expanded.has(matKey);
                return (
                  <div key={matKey} className="nh-mat-card">
                    <div className="nh-row clickable" onClick={() => toggle(matKey)} style={{ padding: '14px 16px' }}>
                      <span className="nh-toggle">{open ? '▾' : '▸'}</span>
                      <span className="nh-ic">📚</span>
                      <span className="nh-nome nh-mat-nome">{mat.materia}</span>
                      <span className="nh-badge gold">{mat.total} resumo{mat.total !== 1 ? 's' : ''}</span>
                      {btnDel({ tipo: 'materia', ciclo, materia: mat.materia, nome: mat.materia })}
                    </div>

                    {open && (
                      <div style={{ padding: '4px 16px 14px' }}>
                        {mat.topics.length === 0 && mat.resumosOrfaos.length === 0 && (
                          <p className="nh-empty">Sem tópicos ou resumos.</p>
                        )}

                        {mat.topics.map(top => {
                          const tOpen = expanded.has(`top-${top.id}`);
                          const topResumoCount = top.resumos.length + top.subtopics.reduce(
                            (n, s) => n + s.resumos.length + s.sub_subtopics.reduce((m, ss) => m + ss.resumos.length, 0), 0
                          );
                          return (
                            <div key={top.id}>
                              <div className="nh-row clickable" onClick={() => toggle(`top-${top.id}`)}>
                                <span className="nh-toggle">{tOpen ? '▾' : '▸'}</span>
                                <span className="nh-ic">📂</span>
                                <span className="nh-nome">{top.nome}</span>
                                <span className="nh-badge gold">{topResumoCount} resumo{topResumoCount !== 1 ? 's' : ''}</span>
                                {btnDel({ tipo: 'topico', id: top.id, nome: top.nome })}
                              </div>

                              {tOpen && (
                                <div className="nh-children">
                                  {top.resumos.map(r => (
                                    <div key={r.id} className="nh-resumo">
                                      <div className="nh-resumo-content">
                                        <div className="nh-resumo-t">📄 {r.titulo || 'Sem título'}</div>
                                        <div className="nh-resumo-p">{getPreview(r.content)}</div>
                                      </div>
                                      {btnDel({ tipo: 'resumo', id: r.id, nome: r.titulo ?? 'Resumo' })}
                                    </div>
                                  ))}

                                  {top.subtopics.length === 0 && top.resumos.length === 0 && (
                                    <p className="nh-empty">Vazio.</p>
                                  )}

                                  {top.subtopics.map(sub => {
                                    const sOpen = expanded.has(`sub-${sub.id}`);
                                    const subResumoCount = sub.resumos.length + sub.sub_subtopics.reduce((n, ss) => n + ss.resumos.length, 0);
                                    return (
                                      <div key={sub.id}>
                                        <div className="nh-row clickable" onClick={() => toggle(`sub-${sub.id}`)}>
                                          <span className="nh-toggle">{sOpen ? '▾' : '▸'}</span>
                                          <span className="nh-ic">📄</span>
                                          <span className="nh-nome">{sub.nome}</span>
                                          <span className="nh-badge gold">{subResumoCount} resumo{subResumoCount !== 1 ? 's' : ''}</span>
                                          {btnDel({ tipo: 'subtopico', id: sub.id, nome: sub.nome })}
                                        </div>

                                        {sOpen && (
                                          <div className="nh-children">
                                            {sub.resumos.map(r => (
                                              <div key={r.id} className="nh-resumo">
                                                <div className="nh-resumo-content">
                                                  <div className="nh-resumo-t">📄 {r.titulo || 'Sem título'}</div>
                                                  <div className="nh-resumo-p">{getPreview(r.content)}</div>
                                                </div>
                                                {btnDel({ tipo: 'resumo', id: r.id, nome: r.titulo ?? 'Resumo' })}
                                              </div>
                                            ))}

                                            {sub.sub_subtopics.length === 0 && sub.resumos.length === 0 && (
                                              <p className="nh-empty">Vazio.</p>
                                            )}

                                            {sub.sub_subtopics.map(ss => {
                                              const ssOpen = expanded.has(`ss-${ss.id}`);
                                              return (
                                                <div key={ss.id}>
                                                  <div className="nh-row clickable" onClick={() => toggle(`ss-${ss.id}`)}>
                                                    <span className="nh-toggle">{ssOpen ? '▾' : '▸'}</span>
                                                    <span className="nh-ic">•</span>
                                                    <span className="nh-nome">{ss.nome}</span>
                                                    <span className="nh-badge">{ss.resumos.length} resumo{ss.resumos.length !== 1 ? 's' : ''}</span>
                                                    {btnDel({ tipo: 'subsubtopico', id: ss.id, nome: ss.nome })}
                                                  </div>

                                                  {ssOpen && (
                                                    <div className="nh-children">
                                                      {ss.resumos.length === 0 && <p className="nh-empty">Nenhum resumo.</p>}
                                                      {ss.resumos.map(r => (
                                                        <div key={r.id} className="nh-resumo">
                                                          <div className="nh-resumo-content">
                                                            <div className="nh-resumo-t">📄 {r.titulo || 'Sem título'}</div>
                                                            <div className="nh-resumo-p">{getPreview(r.content)}</div>
                                                          </div>
                                                          {btnDel({ tipo: 'resumo', id: r.id, nome: r.titulo ?? 'Resumo' })}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {mat.resumosOrfaos.length > 0 && (
                          <div style={{ marginTop: 10 }}>
                            <div style={{ fontSize: 11, color: 'rgba(247,247,248,.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', padding: '6px 12px' }}>
                              Sem tópico
                            </div>
                            {mat.resumosOrfaos.map(r => (
                              <div key={r.id} className="nh-resumo">
                                <div className="nh-resumo-content">
                                  <div className="nh-resumo-t">📄 {r.titulo || 'Sem título'}</div>
                                  <div className="nh-resumo-p">{getPreview(r.content)}</div>
                                </div>
                                {btnDel({ tipo: 'resumo', id: r.id, nome: r.titulo ?? 'Resumo' })}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {deleteTarget && (
          <div className="nh-modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
            <div className="nh-modal" onClick={e => e.stopPropagation()}>
              <div className="nh-modal-h">⚠️ Confirmar exclusão</div>
              <div className="nh-modal-tag">"{deleteTarget.nome}"</div>
              <div className="nh-modal-warn">⚠️ {warningMsg[deleteTarget.tipo]}</div>
              <div className="nh-modal-actions">
                <button type="button" className="nh-modal-btn ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                  Cancelar
                </button>
                <button type="button" className="nh-modal-btn danger" onClick={confirmDelete} disabled={deleting}>
                  {deleting ? 'Excluindo...' : '🗑 Confirmar exclusão'}
                </button>
              </div>
            </div>
          </div>
        )}

        <Toast msg={toast.msg} ok={toast.ok} visible={toast.visible} />
      </div>
    </>
  );
}
