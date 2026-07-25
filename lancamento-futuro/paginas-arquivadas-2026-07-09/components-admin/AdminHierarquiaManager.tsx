'use client';

import { useState, useEffect, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface SubSub { id: string; nome: string; }
interface Sub { id: string; nome: string; sub_subtopics: SubSub[]; }
interface Topic { id: string; nome: string; subtopics: Sub[]; }
interface Materia { id: string; nome: string; ciclo: string | null; topics: Topic[]; }

type DeleteTarget =
  | { tipo: 'materia'; id: string; nome: string }
  | { tipo: 'topico'; id: string; nome: string }
  | { tipo: 'subtopico'; id: string; nome: string }
  | { tipo: 'subsubtopico'; id: string; nome: string };

function Toast({ msg, ok, visible }: { msg: string; ok: boolean; visible: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: 'var(--surface)', border: `1px solid ${ok ? 'var(--green)' : 'var(--red)'}`,
      color: ok ? 'var(--green)' : 'var(--red)',
      padding: '12px 18px', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500,
      display: visible ? 'flex' : 'none', alignItems: 'center', gap: 8,
      boxShadow: '0 4px 20px rgba(0,0,0,.4)',
    }}>
      {ok ? '✅' : '⚠️'} {msg}
    </div>
  );
}

export default function AdminHierarquiaManager() {
  const supabase = createSupabaseBrowserClient();
  const [materiais, setMateriais] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ visible: false, msg: '', ok: true });

  const fetchAll = useCallback(async () => {
    const [matsRes, topsRes, subsRes, subsubsRes] = await Promise.all([
      supabase.from('materiais').select('id, nome, ciclo').order('ordem'),
      supabase.from('topics').select('id, material_id, nome').order('order_index'),
      supabase.from('subtopics').select('id, topic_id, nome').order('ordem'),
      supabase.from('sub_subtopics').select('id, subtopic_id, nome').order('ordem'),
    ]);

    const subsubMap = new Map<string, SubSub[]>();
    for (const ss of (subsubsRes.data ?? [])) {
      const list = subsubMap.get(ss.subtopic_id) ?? [];
      list.push({ id: ss.id, nome: ss.nome });
      subsubMap.set(ss.subtopic_id, list);
    }

    const subMap = new Map<string, Sub[]>();
    for (const s of (subsRes.data ?? [])) {
      const list = subMap.get(s.topic_id) ?? [];
      list.push({ id: s.id, nome: s.nome, sub_subtopics: subsubMap.get(s.id) ?? [] });
      subMap.set(s.topic_id, list);
    }

    const topMap = new Map<string, Topic[]>();
    for (const t of (topsRes.data ?? [])) {
      const list = topMap.get(t.material_id) ?? [];
      list.push({ id: t.id, nome: t.nome, subtopics: subMap.get(t.id) ?? [] });
      topMap.set(t.material_id, list);
    }

    const built: Materia[] = (matsRes.data ?? []).map((m: any) => ({
      id: m.id, nome: m.nome, ciclo: m.ciclo,
      topics: topMap.get(m.id) ?? [],
    }));

    setMateriais(built);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function showToast(msg: string, ok = true) {
    setToast({ visible: true, msg, ok });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const table = {
        materia: 'materiais',
        topico: 'topics',
        subtopico: 'subtopics',
        subsubtopico: 'sub_subtopics',
      }[deleteTarget.tipo];

      const { error } = await supabase.from(table).delete().eq('id', deleteTarget.id);
      if (error) throw error;

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
      style={{
        background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(239,68,68,.2)',
        borderRadius: 'var(--radius-sm)', padding: '3px 9px', fontSize: 11, cursor: 'pointer',
        fontFamily: 'Sora,sans-serif', fontWeight: 500, flexShrink: 0,
      }}
    >
      🗑 Excluir
    </button>
  );

  const warningMsg: Record<string, string> = {
    materia: 'Isso vai apagar todos os tópicos, subtópicos e sub-subtópicos desta matéria. Resumos vinculados perderão a referência de tópico.',
    topico: 'Isso vai apagar todos os subtópicos e sub-subtópicos deste tópico. Resumos vinculados perderão a referência.',
    subtopico: 'Isso vai apagar todos os sub-subtópicos deste subtópico. Resumos vinculados perderão a referência.',
    subsubtopico: 'Resumos vinculados a este sub-subtópico serão excluídos junto.',
  };

  if (loading) return <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Carregando hierarquia...</p>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .hier-row{display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:var(--radius-sm);transition:background .15s;cursor:default}
        .hier-row:hover{background:var(--surface2)}
        .hier-toggle{cursor:pointer;user-select:none;font-size:11px;color:var(--text-muted);width:16px;text-align:center}
        .hier-nome{flex:1;font-size:13px;color:var(--text);font-weight:500}
        .hier-badge{font-size:10px;color:var(--text-muted);background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:2px 7px}
        .hier-children{margin-left:22px;border-left:1px solid var(--border);padding-left:8px}
        .adm-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(2px)}
        .adm-modal{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px;max-width:440px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.5)}
      `}} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -.5 }}>Hierarquia</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 3 }}>Gerencie matérias, tópicos, subtópicos e sub-subtópicos</div>
        </div>
      </div>

      {materiais.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Nenhuma matéria cadastrada.</p>
      )}

      {['Ciclo Básico', 'Ciclo Clínico', 'Internato'].map(ciclo => {
        const grupo = materiais.filter(m => m.ciclo === ciclo);
        if (grupo.length === 0) return null;
        return (
          <div key={ciclo} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>
              {ciclo === 'Ciclo Básico' ? '🔬' : ciclo === 'Ciclo Clínico' ? '🩺' : '🏥'} {ciclo}
            </div>
            {grupo.map(mat => (
        <div key={mat.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 10, overflow: 'hidden' }}>
          {/* MATÉRIA */}
          <div className="hier-row" onClick={() => toggle(mat.id)} style={{ cursor: 'pointer', borderBottom: expanded.has(mat.id) ? '1px solid var(--border)' : 'none', padding: '12px 14px' }}>
            <span className="hier-toggle">{expanded.has(mat.id) ? '▾' : '▸'}</span>
            <span style={{ fontSize: 16 }}>📚</span>
            <span className="hier-nome" style={{ fontSize: 14, fontWeight: 600 }}>{mat.nome}</span>
            {mat.ciclo && <span className="hier-badge">{mat.ciclo}</span>}
            <span className="hier-badge">{mat.topics.length} tópico{mat.topics.length !== 1 ? 's' : ''}</span>
            {btnDel({ tipo: 'materia', id: mat.id, nome: mat.nome })}
          </div>

          {/* TÓPICOS */}
          {expanded.has(mat.id) && (
            <div style={{ padding: '8px 14px 12px' }}>
              {mat.topics.length === 0 && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', padding: '6px 0' }}>Nenhum tópico.</p>
              )}
              {mat.topics.map(top => (
                <div key={top.id}>
                  <div className="hier-row" onClick={() => toggle(top.id)}>
                    <span className="hier-toggle">{expanded.has(top.id) ? '▾' : '▸'}</span>
                    <span>📂</span>
                    <span className="hier-nome">{top.nome}</span>
                    <span className="hier-badge">{top.subtopics.length} subtópico{top.subtopics.length !== 1 ? 's' : ''}</span>
                    {btnDel({ tipo: 'topico', id: top.id, nome: top.nome })}
                  </div>

                  {/* SUBTÓPICOS */}
                  {expanded.has(top.id) && (
                    <div className="hier-children">
                      {top.subtopics.length === 0 && (
                        <p style={{ fontSize: 12, color: 'var(--text-muted)', padding: '6px 8px' }}>Nenhum subtópico.</p>
                      )}
                      {top.subtopics.map(sub => (
                        <div key={sub.id}>
                          <div className="hier-row" onClick={() => toggle(sub.id)}>
                            <span className="hier-toggle">{expanded.has(sub.id) ? '▾' : '▸'}</span>
                            <span>📄</span>
                            <span className="hier-nome">{sub.nome}</span>
                            <span className="hier-badge">{sub.sub_subtopics.length} sub-sub</span>
                            {btnDel({ tipo: 'subtopico', id: sub.id, nome: sub.nome })}
                          </div>

                          {/* SUB-SUBTÓPICOS */}
                          {expanded.has(sub.id) && (
                            <div className="hier-children">
                              {sub.sub_subtopics.length === 0 && (
                                <p style={{ fontSize: 12, color: 'var(--text-muted)', padding: '6px 8px' }}>Nenhum sub-subtópico.</p>
                              )}
                              {sub.sub_subtopics.map(ss => (
                                <div key={ss.id} className="hier-row">
                                  <span className="hier-toggle" />
                                  <span>•</span>
                                  <span className="hier-nome" style={{ fontSize: 12 }}>{ss.nome}</span>
                                  {btnDel({ tipo: 'subsubtopico', id: ss.id, nome: ss.nome })}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
            ))}
          </div>
        );
      })}

      {/* MODAL DE CONFIRMAÇÃO */}
      {deleteTarget && (
        <div className="adm-modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>⚠️ Confirmar exclusão</div>
            <div style={{ fontSize: 14, fontWeight: 600, padding: '10px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: 12 }}>
              "{deleteTarget.nome}"
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 20, lineHeight: 1.6, padding: '10px 12px', background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 'var(--radius-sm)' }}>
              ⚠️ {warningMsg[deleteTarget.tipo]}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancelar
              </button>
              <button type="button" className="adm-btn adm-btn-danger" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Excluindo...' : '🗑 Confirmar exclusão'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast msg={toast.msg} ok={toast.ok} visible={toast.visible} />
    </>
  );
}
