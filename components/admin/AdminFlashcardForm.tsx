'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface Material { id: string; nome: string; ciclo: string | null; }
interface Topico { id: string; nome: string; order_index: number; ordem?: number; }
interface Subtopic { id: string; nome: string; ordem: number; }
interface SubSubtopic { id: string; nome: string; ordem: number; }

type TipoCard = 'frente_verso' | 'lacuna' | 'multipla_escolha';

interface InitialData {
  id?: string;
  tipo?: TipoCard;
  pergunta?: string;
  resposta?: string;
  texto_lacuna?: string;
  opcoes?: string[];
  resposta_correta?: string;
  status?: string;
  ciclo?: string;
  materia?: string;
  topic_id?: string;
  subtopic_id?: string;
  sub_subtopic_id?: string;
}

interface Props {
  materiais: Material[];
  initial?: InitialData;
}

const CICLOS = ['Ciclo Básico', 'Ciclo Clínico', 'Internato'];

function slugify(str: string) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/, '');
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

const fieldStyle: React.CSSProperties = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', padding: '10px 12px', color: 'var(--text)',
  fontSize: 13, fontFamily: 'inherit', outline: 'none',
};
const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, color: 'var(--text-dim)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.4px' };
const sectionStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 22px', marginBottom: 18 };
const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' };
const ordemInputStyle: React.CSSProperties = { ...fieldStyle, width: 72, flexShrink: 0 };

export default function AdminFlashcardForm({ materiais, initial }: Props) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, msg: '' });

  // Tipo do card
  const [tipo, setTipo] = useState<TipoCard>(initial?.tipo ?? 'frente_verso');

  // Conteúdo por tipo
  const [pergunta, setPergunta] = useState(initial?.pergunta ?? '');
  const [resposta, setResposta] = useState(initial?.resposta ?? '');
  const [textoLacuna, setTextoLacuna] = useState(initial?.texto_lacuna ?? '');
  const [opcoes, setOpcoes] = useState<string[]>(initial?.opcoes ?? ['', '', '', '']);
  const [respostaCorreta, setRespostaCorreta] = useState(initial?.resposta_correta ?? '');

  // Status
  const [status, setStatus] = useState(initial?.status ?? 'draft');

  // Hierarquia
  const [ciclo, setCiclo] = useState(initial?.ciclo ?? '');
  const [materiaId, setMateriaId] = useState(() =>
    initial?.materia ? (materiais.find(m => m.nome === initial.materia)?.id ?? '') : ''
  );
  const [materiaNome, setMateriaNome] = useState(initial?.materia ?? '');
  const [criarMateria, setCriarMateria] = useState(false);
  const [materiaNovaNome, setMateriaNovaNome] = useState('');

  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [topicId, setTopicId] = useState(initial?.topic_id ?? '');
  const [topicNome, setTopicNome] = useState('');
  const [criarTopico, setCriarTopico] = useState(false);

  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [subtopicId, setSubtopicId] = useState(initial?.subtopic_id ?? '');
  const [subtopicNome, setSubtopicNome] = useState('');
  const [criarSubtopic, setCriarSubtopic] = useState(false);

  const [subSubtopics, setSubSubtopics] = useState<SubSubtopic[]>([]);
  const [subSubtopicId, setSubSubtopicId] = useState(initial?.sub_subtopic_id ?? '');
  const [subSubtopicNome, setSubSubtopicNome] = useState('');
  const [criarSubSubtopic, setCriarSubSubtopic] = useState(false);

  // Ordem de cada nível (para organização)
  const [materiaOrdem, setMateriaOrdem] = useState<number>(0);
  const [topicOrdem, setTopicOrdem] = useState<number>(0);
  const [subtopicOrdem, setSubtopicOrdem] = useState<number>(0);
  const [subSubtopicOrdem, setSubSubtopicOrdem] = useState<number>(0);

  function showToast(msg: string) {
    setToast({ visible: true, msg });
    setTimeout(() => setToast({ visible: false, msg: '' }), 3500);
  }

  // Carregar tópicos
  useEffect(() => {
    if (!materiaId) { setTopicos([]); setTopicId(''); return; }
    supabase.from('topics').select('id, nome, order_index').eq('material_id', materiaId).order('order_index')
      .then(({ data }) => setTopicos((data ?? []) as Topico[]));
    // Carregar ordem atual da matéria
    supabase.from('materiais').select('ordem').eq('id', materiaId).single()
      .then(({ data }) => setMateriaOrdem(data?.ordem ?? 0));
  }, [materiaId]);

  // Carregar subtópicos
  useEffect(() => {
    if (!topicId || criarTopico) { setSubtopics([]); setSubtopicId(''); return; }
    supabase.from('subtopics').select('id, nome, ordem').eq('topic_id', topicId).order('ordem')
      .then(({ data }) => setSubtopics((data ?? []) as Subtopic[]));
    const t = topicos.find(t => t.id === topicId);
    setTopicOrdem(t?.order_index ?? 0);
  }, [topicId, criarTopico]);

  // Carregar sub-subtópicos
  useEffect(() => {
    if (!subtopicId || criarSubtopic) { setSubSubtopics([]); setSubSubtopicId(''); return; }
    supabase.from('sub_subtopics').select('id, nome, ordem').eq('subtopic_id', subtopicId).order('ordem')
      .then(({ data }) => setSubSubtopics((data ?? []) as SubSubtopic[]));
    const s = subtopics.find(s => s.id === subtopicId);
    setSubtopicOrdem(s?.ordem ?? 0);
  }, [subtopicId, criarSubtopic]);

  // Ordem do sub-subtópico
  useEffect(() => {
    const ss = subSubtopics.find(s => s.id === subSubtopicId);
    setSubSubtopicOrdem(ss?.ordem ?? 0);
  }, [subSubtopicId]);

  const materiasFiltradas = !criarMateria ? (ciclo ? materiais.filter(m => m.ciclo === ciclo) : materiais) : [];

  // Actualizar opção individual
  function setOpcao(i: number, val: string) {
    setOpcoes(prev => prev.map((o, idx) => idx === i ? val : o));
  }

  async function save(targetStatus: 'draft' | 'published') {
    if (!materiaId && !(criarMateria && materiaNovaNome.trim())) { showToast('Selecione ou crie uma matéria!'); return; }
    if (tipo === 'frente_verso' && !pergunta.trim()) { showToast('Preencha a pergunta (frente do card)!'); return; }
    if (tipo === 'lacuna' && !textoLacuna.trim()) { showToast('Preencha o texto com lacunas!'); return; }
    if (tipo === 'lacuna' && !textoLacuna.includes('{{')) { showToast('Use {{ }} para marcar as lacunas no texto!'); return; }
    if (tipo === 'multipla_escolha' && !pergunta.trim()) { showToast('Preencha a pergunta!'); return; }
    if (tipo === 'multipla_escolha' && opcoes.filter(o => o.trim()).length < 2) { showToast('Adicione pelo menos 2 opções!'); return; }
    if (tipo === 'multipla_escolha' && !respostaCorreta) { showToast('Marque a opção correta!'); return; }

    setSaving(true);
    try {
      // Resolver matéria
      let finalMateriaId = materiaId;
      let finalMateriaNome = materiaNome;
      if (criarMateria && materiaNovaNome.trim()) {
        const { data, error } = await supabase.from('materiais')
          .insert({ nome: materiaNovaNome.trim(), ciclo, ativo: true, ordem: materiaOrdem || 999 })
          .select('id, nome').single();
        if (error) throw error;
        finalMateriaId = data.id;
        finalMateriaNome = data.nome;
      } else if (materiaOrdem > 0) {
        await supabase.from('materiais').update({ ordem: materiaOrdem }).eq('id', finalMateriaId);
      }

      // Resolver tópico
      let finalTopicId = topicId;
      let finalTopicNome = topicos.find(t => t.id === topicId)?.nome ?? topicNome;
      if ((criarTopico || criarMateria) && topicNome.trim()) {
        const { data, error } = await supabase.from('topics')
          .insert({ nome: topicNome.trim(), material_id: finalMateriaId, order_index: topicOrdem || 0 })
          .select('id').single();
        if (error) throw error;
        finalTopicId = data.id;
        finalTopicNome = topicNome.trim();
      } else if (finalTopicId && topicOrdem > 0) {
        await supabase.from('topics').update({ order_index: topicOrdem }).eq('id', finalTopicId);
      }

      // Resolver subtópico
      let finalSubtopicId = subtopicId;
      let finalSubtopicNome = subtopics.find(s => s.id === subtopicId)?.nome ?? subtopicNome;
      if ((criarSubtopic || criarTopico) && subtopicNome.trim() && finalTopicId) {
        const { data, error } = await supabase.from('subtopics')
          .insert({ nome: subtopicNome.trim(), topic_id: finalTopicId, ordem: subtopicOrdem || subtopics.length + 1 })
          .select('id').single();
        if (error) throw error;
        finalSubtopicId = data.id;
        finalSubtopicNome = subtopicNome.trim();
      } else if (finalSubtopicId && subtopicOrdem > 0) {
        await supabase.from('subtopics').update({ ordem: subtopicOrdem }).eq('id', finalSubtopicId);
      }

      // Resolver sub-subtópico
      let finalSubSubtopicId = subSubtopicId;
      let finalSubSubtopicNome = subSubtopics.find(s => s.id === subSubtopicId)?.nome ?? subSubtopicNome;
      if ((criarSubSubtopic || criarSubtopic) && subSubtopicNome.trim() && finalSubtopicId) {
        const { data, error } = await supabase.from('sub_subtopics')
          .insert({ nome: subSubtopicNome.trim(), subtopic_id: finalSubtopicId, ordem: subSubtopicOrdem || subSubtopics.length + 1 })
          .select('id').single();
        if (error) throw error;
        finalSubSubtopicId = data.id;
        finalSubSubtopicNome = subSubtopicNome.trim();
      } else if (finalSubSubtopicId && subSubtopicOrdem > 0) {
        await supabase.from('sub_subtopics').update({ ordem: subSubtopicOrdem }).eq('id', finalSubSubtopicId);
      }

      const titulo = finalSubSubtopicId ? finalSubSubtopicNome : (finalSubtopicNome || finalTopicNome);

      const payload: Record<string, unknown> = {
        tipo,
        titulo,
        ciclo,
        materia: finalMateriaNome,
        topic_id: finalTopicId || null,
        subtopic_id: finalSubtopicId || null,
        sub_subtopic_id: finalSubSubtopicId || null,
        status: targetStatus,
        updated_at: new Date().toISOString(),
        // conteúdo por tipo
        pergunta: tipo === 'frente_verso' ? pergunta : tipo === 'multipla_escolha' ? pergunta : null,
        resposta: tipo === 'frente_verso' ? resposta : null,
        texto_lacuna: tipo === 'lacuna' ? textoLacuna : null,
        opcoes: tipo === 'multipla_escolha' ? opcoes.filter(o => o.trim()) : null,
        resposta_correta: tipo === 'multipla_escolha' ? respostaCorreta : null,
      };

      if (initial?.id) {
        const { error } = await supabase.from('flashcards').update(payload).eq('id', initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('flashcards').insert(payload);
        if (error) throw error;
      }

      showToast(targetStatus === 'published' ? 'Flashcard publicado!' : 'Rascunho salvo!');
      setTimeout(() => router.push('/admin/resumos?tab=flashcards'), 1500);
    } catch (err: unknown) {
      showToast('Erro: ' + ((err as { message?: string })?.message ?? String(err)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .fl-tipo-btn{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid var(--border);background:var(--bg);color:var(--text-dim);transition:all .15s;font-family:inherit}
        .fl-tipo-btn.active{border-color:var(--primary);background:var(--primary-glow);color:var(--primary)}
        .fl-tipo-btn:hover:not(.active){background:var(--surface2);color:var(--text)}
        .fl-opcao-row{display:flex;gap:10px;align-items:center;margin-bottom:10px}
        .fl-radio{width:18px;height:18px;cursor:pointer;accent-color:var(--primary);flex-shrink:0}
        .fl-lacuna-preview{font-size:12px;color:var(--text-dim);background:var(--bg);border:1px dashed var(--border);border-radius:6px;padding:10px 12px;margin-top:10px;line-height:1.7}
        .fl-lacuna-blank{background:var(--primary-glow);color:var(--primary);border-radius:3px;padding:1px 6px;font-weight:600}
        .adm-section-label{font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:14px;display:flex;align-items:center;gap:6px}
        .adm-ordem-badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--text-dim);background:var(--bg);border:1px solid var(--border);border-radius:6px;padding:3px 8px}
      `}} />

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{initial?.id ? '✏️ Editar Flashcard' : '＋ Novo Flashcard'}</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 3 }}>Crie cards de estudo para revisão espaçada</div>
          </div>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => router.push('/admin/resumos?tab=flashcards')}>← Voltar</button>
        </div>

        {/* Tipo do card */}
        <div style={sectionStyle}>
          <div className="adm-section-label">🃏 Tipo do flashcard</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" className={`fl-tipo-btn${tipo === 'frente_verso' ? ' active' : ''}`} onClick={() => setTipo('frente_verso')}>🃏 Frente / Verso</button>
            <button type="button" className={`fl-tipo-btn${tipo === 'lacuna' ? ' active' : ''}`} onClick={() => setTipo('lacuna')}>✏️ Lacuna / Cloze</button>
            <button type="button" className={`fl-tipo-btn${tipo === 'multipla_escolha' ? ' active' : ''}`} onClick={() => setTipo('multipla_escolha')}>📋 Múltipla Escolha</button>
          </div>
        </div>

        {/* Conteúdo: Frente/Verso */}
        {tipo === 'frente_verso' && (
          <div style={sectionStyle}>
            <div className="adm-section-label">📝 Conteúdo do card</div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Frente (pergunta)</label>
              <textarea value={pergunta} onChange={e => setPergunta(e.target.value)} rows={3} placeholder="O que você quer perguntar?" style={{ ...fieldStyle, resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Verso (resposta)</label>
              <textarea value={resposta} onChange={e => setResposta(e.target.value)} rows={4} placeholder="A resposta completa..." style={{ ...fieldStyle, resize: 'vertical' }} />
            </div>
          </div>
        )}

        {/* Conteúdo: Lacuna */}
        {tipo === 'lacuna' && (
          <div style={sectionStyle}>
            <div className="adm-section-label">✏️ Texto com lacunas</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10, padding: '8px 12px', background: 'var(--bg)', borderRadius: 6, border: '1px solid var(--border)' }}>
              💡 Use <code style={{ color: 'var(--primary)', background: 'var(--primary-glow)', padding: '1px 5px', borderRadius: 3 }}>{'{{palavra}}'}</code> para marcar cada lacuna. Ex: <em>O coração tem {'{{4}}'} câmaras.</em>
            </div>
            <textarea
              value={textoLacuna}
              onChange={e => setTextoLacuna(e.target.value)}
              rows={5}
              placeholder={'Ex: A pressão arterial é medida em {{mmHg}} e o valor normal é {{120/80}} mmHg.'}
              style={{ ...fieldStyle, resize: 'vertical' }}
            />
            {textoLacuna && (
              <div className="fl-lacuna-preview">
                <strong style={{ display: 'block', marginBottom: 6, fontSize: 11, color: 'var(--text-dim)' }}>PRÉVIA:</strong>
                <span dangerouslySetInnerHTML={{
                  __html: textoLacuna.replace(/\{\{([^}]+)\}\}/g, '<span class="fl-lacuna-blank">_____</span>')
                }} />
              </div>
            )}
          </div>
        )}

        {/* Conteúdo: Múltipla Escolha */}
        {tipo === 'multipla_escolha' && (
          <div style={sectionStyle}>
            <div className="adm-section-label">📋 Múltipla escolha</div>
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Pergunta</label>
              <textarea value={pergunta} onChange={e => setPergunta(e.target.value)} rows={3} placeholder="Escreva a pergunta..." style={{ ...fieldStyle, resize: 'vertical' }} />
            </div>
            <label style={labelStyle}>Opções (marque a correta com o botão à esquerda)</label>
            {opcoes.map((op, i) => (
              <div key={i} className="fl-opcao-row">
                <input type="radio" className="fl-radio" name="correta" checked={respostaCorreta === op && op.trim() !== ''} onChange={() => op.trim() && setRespostaCorreta(op)} />
                <input
                  type="text"
                  value={op}
                  onChange={e => {
                    const newVal = e.target.value;
                    if (respostaCorreta === opcoes[i]) setRespostaCorreta(newVal);
                    setOpcao(i, newVal);
                  }}
                  placeholder={`Opção ${String.fromCharCode(65 + i)}`}
                  style={{ ...fieldStyle, flex: 1 }}
                />
              </div>
            ))}
            {respostaCorreta && <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 8 }}>✓ Resposta correta: <strong>{respostaCorreta}</strong></div>}
          </div>
        )}

        {/* Hierarquia + Ordem */}
        <div style={sectionStyle}>
          <div className="adm-section-label">🗂 Hierarquia e posição</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>

            {/* Ciclo */}
            <div>
              <label style={labelStyle}>Ciclo</label>
              <select value={ciclo} onChange={e => {
                setCiclo(e.target.value);
                setMateriaId(''); setMateriaNome(''); setCriarMateria(false); setMateriaNovaNome('');
                setTopicId(''); setTopicNome(''); setCriarTopico(false);
                setSubtopicId(''); setSubtopicNome(''); setCriarSubtopic(false);
                setSubSubtopicId(''); setSubSubtopicNome(''); setCriarSubSubtopic(false);
              }} style={fieldStyle}>
                <option value="">Selecione o ciclo</option>
                {CICLOS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Matéria */}
            <div>
              <label style={labelStyle}>Matéria</label>
              {!criarMateria ? (
                <div style={rowStyle}>
                  <select value={materiaId} onChange={e => {
                    setMateriaId(e.target.value);
                    setMateriaNome(materiasFiltradas.find(m => m.id === e.target.value)?.nome ?? '');
                    setTopicId(''); setTopicNome(''); setCriarTopico(false);
                    setSubtopicId(''); setSubtopicNome(''); setCriarSubtopic(false);
                    setSubSubtopicId(''); setSubSubtopicNome(''); setCriarSubSubtopic(false);
                  }} style={{ ...fieldStyle, flex: 1 }}>
                    <option value="">Selecione</option>
                    {materiasFiltradas.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                  </select>
                  {materiaId && (
                    <div title="Posição na listagem">
                      <label style={{ ...labelStyle, marginBottom: 4 }}>Pos.</label>
                      <input type="number" min={1} value={materiaOrdem || ''} onChange={e => setMateriaOrdem(Number(e.target.value))} style={ordemInputStyle} placeholder="—" />
                    </div>
                  )}
                </div>
              ) : (
                <input type="text" value={materiaNovaNome} onChange={e => setMateriaNovaNome(e.target.value)} placeholder="Nome da nova matéria" style={fieldStyle} autoFocus />
              )}
              <button type="button" onClick={() => { setCriarMateria(!criarMateria); setMateriaId(''); setMateriaNovaNome(''); }}
                style={{ fontSize: 11, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 6, padding: 0 }}>
                {criarMateria ? '← Selecionar existente' : '+ Criar nova matéria'}
              </button>
            </div>

            {/* Tópico */}
            <div>
              <label style={labelStyle}>Tópico</label>
              {!criarTopico ? (
                <div style={rowStyle}>
                  <select value={topicId} onChange={e => {
                    setTopicId(e.target.value);
                    setSubtopicId(''); setSubtopicNome(''); setCriarSubtopic(false);
                    setSubSubtopicId(''); setSubSubtopicNome(''); setCriarSubSubtopic(false);
                  }} style={{ ...fieldStyle, flex: 1 }} disabled={!materiaId && !criarMateria}>
                    <option value="">{!materiaId && !criarMateria ? 'Selecione uma matéria primeiro' : 'Selecione o tópico'}</option>
                    {topicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                  {topicId && (
                    <div title="Posição na listagem">
                      <label style={{ ...labelStyle, marginBottom: 4 }}>Pos.</label>
                      <input type="number" min={1} value={topicOrdem || ''} onChange={e => setTopicOrdem(Number(e.target.value))} style={ordemInputStyle} placeholder="—" />
                    </div>
                  )}
                </div>
              ) : (
                <input type="text" value={topicNome} onChange={e => setTopicNome(e.target.value)} placeholder="Nome do novo tópico" style={fieldStyle} autoFocus />
              )}
              <button type="button" onClick={() => { setCriarTopico(!criarTopico); setTopicId(''); setTopicNome(''); }}
                style={{ fontSize: 11, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 6, padding: 0 }}>
                {criarTopico ? '← Selecionar existente' : '+ Criar novo tópico'}
              </button>
            </div>

            {/* Subtópico */}
            <div>
              <label style={labelStyle}>Subtópico</label>
              {!criarSubtopic ? (
                <div style={rowStyle}>
                  <select value={subtopicId} onChange={e => {
                    setSubtopicId(e.target.value);
                    setSubSubtopicId(''); setSubSubtopicNome(''); setCriarSubSubtopic(false);
                  }} style={{ ...fieldStyle, flex: 1 }} disabled={!topicId && !criarTopico}>
                    <option value="">{!topicId && !criarTopico ? 'Selecione um tópico primeiro' : 'Selecione o subtópico'}</option>
                    {subtopics.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                  </select>
                  {subtopicId && (
                    <div title="Posição na listagem">
                      <label style={{ ...labelStyle, marginBottom: 4 }}>Pos.</label>
                      <input type="number" min={1} value={subtopicOrdem || ''} onChange={e => setSubtopicOrdem(Number(e.target.value))} style={ordemInputStyle} placeholder="—" />
                    </div>
                  )}
                </div>
              ) : (
                <input type="text" value={subtopicNome} onChange={e => setSubtopicNome(e.target.value)} placeholder="Nome do novo subtópico" style={fieldStyle} autoFocus />
              )}
              <button type="button" onClick={() => { setCriarSubtopic(!criarSubtopic); setSubtopicId(''); setSubtopicNome(''); }}
                style={{ fontSize: 11, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 6, padding: 0 }}>
                {criarSubtopic ? '← Selecionar existente' : '+ Criar novo subtópico'}
              </button>
            </div>

            {/* Sub-subtópico */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Sub-subtópico <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(opcional)</span></label>
              {!criarSubSubtopic ? (
                <div style={rowStyle}>
                  <select value={subSubtopicId} onChange={e => setSubSubtopicId(e.target.value)}
                    style={{ ...fieldStyle, flex: 1 }} disabled={!subtopicId && !criarSubtopic}>
                    <option value="">{!subtopicId && !criarSubtopic ? 'Selecione um subtópico primeiro' : 'Nenhum'}</option>
                    {subSubtopics.map(ss => <option key={ss.id} value={ss.id}>{ss.nome}</option>)}
                  </select>
                  {subSubtopicId && (
                    <div title="Posição na listagem">
                      <label style={{ ...labelStyle, marginBottom: 4 }}>Pos.</label>
                      <input type="number" min={1} value={subSubtopicOrdem || ''} onChange={e => setSubSubtopicOrdem(Number(e.target.value))} style={ordemInputStyle} placeholder="—" />
                    </div>
                  )}
                </div>
              ) : (
                <input type="text" value={subSubtopicNome} onChange={e => setSubSubtopicNome(e.target.value)} placeholder="Nome do sub-subtópico" style={fieldStyle} autoFocus />
              )}
              <button type="button" onClick={() => { setCriarSubSubtopic(!criarSubSubtopic); setSubSubtopicId(''); setSubSubtopicNome(''); }}
                style={{ fontSize: 11, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 6, padding: 0 }}>
                {criarSubSubtopic ? '← Selecionar existente' : '+ Criar sub-subtópico'}
              </button>
            </div>

          </div>
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => router.push('/admin/resumos?tab=flashcards')} disabled={saving}>Cancelar</button>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={() => save('draft')} disabled={saving}>{saving ? 'Salvando...' : '💾 Salvar rascunho'}</button>
          <button type="button" className="adm-btn adm-btn-primary" onClick={() => save('published')} disabled={saving}>{saving ? 'Publicando...' : '🚀 Publicar'}</button>
        </div>
      </div>

      <Toast msg={toast.msg} visible={toast.visible} />
    </>
  );
}
