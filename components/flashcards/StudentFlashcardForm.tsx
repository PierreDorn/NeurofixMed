'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { registrarFlashcardCriado } from '@/app/(app)/flashcards/criar/srs-actions';

interface Topico { id: string; nome: string; order_index: number | null; }
interface Subtopic { id: string; nome: string; ordem: number | null; }
interface SubSubtopic { id: string; nome: string; ordem: number | null; }

const CICLOS = ['Ciclo Básico', 'Ciclo Clínico', 'Internato'];

function Toast({ msg, visible, isError }: { msg: string; visible: boolean; isError?: boolean }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28,
      background: 'var(--surface)', border: `1px solid ${isError ? '#ef4444' : '#4ADE80'}`,
      color: isError ? '#ef4444' : '#4ADE80',
      padding: '12px 20px', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 500,
      display: visible ? 'flex' : 'none', alignItems: 'center', gap: 8,
      zIndex: 9999, boxShadow: '0 4px 24px rgba(0,0,0,.5)',
    }}>
      {isError ? '❌' : '✅'} {msg}
    </div>
  );
}

const inp: React.CSSProperties = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)', padding: '11px 14px', color: 'var(--text)',
  fontSize: 14, fontFamily: 'inherit', outline: 'none',
  transition: 'border-color .15s',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 11, color: 'var(--text-dim)', fontWeight: 700,
  marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px',
};
const card: React.CSSProperties = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: '22px 24px', marginBottom: 16,
};
const cardTitle: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: 'var(--text-dim)',
  textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: 18,
  display: 'flex', alignItems: 'center', gap: 8,
};

export default function StudentFlashcardForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ visible: false, msg: '', isError: false });

  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');

  const [ciclo, setCiclo] = useState('');

  // Matéria: derivada dos flashcards do próprio aluno
  const [myMaterias, setMyMaterias] = useState<string[]>([]);
  const [materia, setMateria] = useState('');
  const [criarMateria, setCriarMateria] = useState(false);
  const [materiaNova, setMateriaNova] = useState('');

  const [topicos, setTopicos] = useState<Topico[]>([]);
  const [topicId, setTopicId] = useState('');
  const [topicNome, setTopicNome] = useState('');
  const [criarTopico, setCriarTopico] = useState(false);

  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [subtopicId, setSubtopicId] = useState('');
  const [subtopicNome, setSubtopicNome] = useState('');
  const [criarSubtopic, setCriarSubtopic] = useState(false);

  const [subSubtopics, setSubSubtopics] = useState<SubSubtopic[]>([]);
  const [subSubtopicId, setSubSubtopicId] = useState('');
  const [subSubtopicNome, setSubSubtopicNome] = useState('');
  const [criarSubSubtopic, setCriarSubSubtopic] = useState(false);

  const reloadMaterias = useCallback(async (uid: string) => {
    const { data } = await supabase.from('flashcards').select('materia').eq('user_id', uid);
    const unique = Array.from(new Set((data ?? []).map(f => (f.materia ?? '').trim()).filter(Boolean))).sort();
    setMyMaterias(unique);
  }, [supabase]);

  const reloadTopicos = useCallback(async (uid: string) => {
    const { data } = await supabase.from('topics').select('id, nome, order_index')
      .eq('user_id', uid).order('order_index', { nullsFirst: false });
    setTopicos((data ?? []) as Topico[]);
  }, [supabase]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await Promise.all([reloadMaterias(user.id), reloadTopicos(user.id)]);
    })();
  }, [supabase, reloadMaterias, reloadTopicos]);

  useEffect(() => {
    if (!topicId || criarTopico) { setSubtopics([]); setSubtopicId(''); return; }
    supabase.from('subtopics').select('id, nome, ordem').eq('topic_id', topicId).order('ordem')
      .then(({ data }) => setSubtopics((data ?? []) as Subtopic[]));
  }, [topicId, criarTopico, supabase]);

  useEffect(() => {
    if (!subtopicId || criarSubtopic) { setSubSubtopics([]); setSubSubtopicId(''); return; }
    supabase.from('sub_subtopics').select('id, nome, ordem').eq('subtopic_id', subtopicId).order('ordem')
      .then(({ data }) => setSubSubtopics((data ?? []) as SubSubtopic[]));
  }, [subtopicId, criarSubtopic, supabase]);

  function showToast(msg: string, isError = false) {
    setToast({ visible: true, msg, isError });
    setTimeout(() => setToast({ visible: false, msg: '', isError: false }), 3500);
  }

  async function save() {
    const materiaFinal = criarMateria ? materiaNova.trim() : materia.trim();

    if (!ciclo) { showToast('Selecione o ciclo!', true); return; }
    if (!materiaFinal) { showToast('Selecione ou digite a matéria!', true); return; }
    if (!pergunta.trim()) { showToast('Preencha a frente do card!', true); return; }
    if (!resposta.trim()) { showToast('Preencha o verso do card!', true); return; }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { showToast('Sessão expirada. Faça login novamente.', true); return; }

      let finalTopicId = topicId;
      let finalTopicNome = topicos.find(t => t.id === topicId)?.nome ?? topicNome;
      if (criarTopico && topicNome.trim()) {
        const { data, error } = await supabase.from('topics')
          .insert({ nome: topicNome.trim(), material_id: null, order_index: 999, user_id: user.id })
          .select('id').single();
        if (error) throw error;
        finalTopicId = data.id;
        finalTopicNome = topicNome.trim();
      }

      let finalSubtopicId = subtopicId;
      let finalSubtopicNome = subtopics.find(s => s.id === subtopicId)?.nome ?? subtopicNome;
      if ((criarSubtopic || criarTopico) && subtopicNome.trim() && finalTopicId) {
        const { data, error } = await supabase.from('subtopics')
          .insert({ nome: subtopicNome.trim(), topic_id: finalTopicId, ordem: 999, user_id: user.id })
          .select('id').single();
        if (error) throw error;
        finalSubtopicId = data.id;
        finalSubtopicNome = subtopicNome.trim();
      }

      let finalSubSubtopicId = subSubtopicId;
      let finalSubSubtopicNome = subSubtopics.find(s => s.id === subSubtopicId)?.nome ?? subSubtopicNome;
      if ((criarSubSubtopic || criarSubtopic) && subSubtopicNome.trim() && finalSubtopicId) {
        const { data, error } = await supabase.from('sub_subtopics')
          .insert({ nome: subSubtopicNome.trim(), subtopic_id: finalSubtopicId, ordem: 999, user_id: user.id })
          .select('id').single();
        if (error) throw error;
        finalSubSubtopicId = data.id;
        finalSubSubtopicNome = subSubtopicNome.trim();
      }

      const titulo = finalSubSubtopicId ? finalSubSubtopicNome : (finalSubtopicNome || finalTopicNome || materiaFinal);

      const { data: novoFlash, error } = await supabase.from('flashcards').insert({
        user_id: user.id,
        tipo: 'frente_verso',
        titulo,
        ciclo,
        materia: materiaFinal,
        topic_id: finalTopicId || null,
        subtopic_id: finalSubtopicId || null,
        sub_subtopic_id: finalSubSubtopicId || null,
        status: 'published',
        updated_at: new Date().toISOString(),
        pergunta,
        resposta,
      }).select('id').single();
      if (error) throw error;

      // Side-effect (fire-and-forget): agenda revisões automáticas para o
      // novo flashcard. Falhas aqui NUNCA bloqueiam a UI.
      if (novoFlash?.id) {
        registrarFlashcardCriado(novoFlash.id).catch(err => {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('[student-flashcard-form] agendarRevisoes falhou:', err);
          }
        });
      }

      showToast('Flashcard criado com sucesso!');
      setTimeout(() => router.push('/flashcards'), 1200);
    } catch (err: unknown) {
      showToast('Erro: ' + ((err as { message?: string })?.message ?? String(err)), true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .sf-mode-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:6px}
        .sf-mode-pill{padding:14px 12px;border-radius:14px;font-size:12.5px;font-weight:700;cursor:default;border:1.5px solid var(--border);background:transparent;color:var(--text-dim);font-family:inherit;display:flex;flex-direction:column;align-items:flex-start;gap:6px;text-align:left;line-height:1.35}
        .sf-mode-pill.active{border-color:#C9A84C;background:rgba(201,168,76,.08);color:var(--text)}
        .sf-mode-pill small{font-size:11px;color:var(--text-dim);font-weight:500;text-transform:none;letter-spacing:0}
        .sf-mode-pill .sf-mode-icon{font-size:18px}
        .sf-mode-hint{font-size:11.5px;color:var(--text-dim);line-height:1.55;padding-top:6px;border-top:1px dashed rgba(255,255,255,.06)}
        .sf-inp{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:11px 14px;color:var(--text);font-size:14px;font-family:inherit;outline:none;transition:border-color .15s;resize:vertical}
        .sf-inp:focus{border-color:#C9A84C;box-shadow:0 0 0 3px rgba(201,168,76,.18)}
        .sf-inp:disabled{opacity:.45;cursor:not-allowed}
        .sf-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .sf-row{display:flex;gap:6px;align-items:stretch}
        .sf-row > .sf-inp{flex:1}
        .sf-del-btn{flex:0 0 auto;width:42px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid rgba(239,68,68,.25);color:#ef4444;border-radius:var(--radius-sm);cursor:pointer;font-size:15px;transition:all .15s;font-family:inherit}
        .sf-del-btn:hover:not(:disabled){background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.5)}
        .sf-del-btn:disabled{opacity:.3;cursor:not-allowed}
        .sf-create-link{font-size:11px;color:#C9A84C;background:none;border:none;cursor:pointer;padding:0;margin-top:5px;display:inline-block;opacity:.85;font-family:inherit}
        .sf-create-link:hover{opacity:1;text-decoration:underline}
        @media(max-width:640px){.sf-grid2{grid-template-columns:1fr}.sf-mode-grid{grid-template-columns:1fr}}
      `}} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 0 40px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.4px', color: 'var(--text)' }}>Criar Flashcard</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>Crie cards pessoais e escolha o modo de estudo depois</div>
          </div>
          <button type="button" onClick={() => router.push('/flashcards')}
            style={{ ...inp, width: 'auto', padding: '9px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--text-dim)' }}>
            ← Voltar
          </button>
        </div>

        {/* Modos disponíveis (informativo) */}
        <div style={card}>
          <div style={cardTitle}>🎮 Modos de estudo disponíveis</div>
          <div className="sf-mode-grid">
            <div className="sf-mode-pill active">
              <span className="sf-mode-icon">🃏</span>
              <strong>Cartões</strong>
              <small>Frente e verso clássico — flip + Errei/Acertei.</small>
            </div>
            <div className="sf-mode-pill active">
              <span className="sf-mode-icon">🧩</span>
              <strong>Combinação</strong>
              <small>Combine pares termo/definição contra o cronômetro.</small>
            </div>
            <div className="sf-mode-pill active">
              <span className="sf-mode-icon">🗼</span>
              <strong>Empilhador</strong>
              <small>Responda rápido para empilhar blocos e construir sua torre.</small>
            </div>
          </div>
          <div className="sf-mode-hint">
            Você cria o card uma vez (frente + verso) e escolhe qualquer um dos 3 modos na hora de revisar.
          </div>
        </div>

        {/* Conteúdo do card */}
        <div style={card}>
          <div style={cardTitle}>📝 Conteúdo do card</div>
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Frente — o que você quer perguntar (ou termo)</label>
            <textarea className="sf-inp" rows={3} value={pergunta} onChange={e => setPergunta(e.target.value)} placeholder="Ex: O que é despolarização?" />
          </div>
          <div>
            <label style={lbl}>Verso — a resposta completa (ou definição)</label>
            <textarea className="sf-inp" rows={4} value={resposta} onChange={e => setResposta(e.target.value)} placeholder="Ex: Inversão do potencial de membrana causada pela entrada de Na⁺ na célula." />
          </div>
        </div>

        {/* Hierarquia pessoal do aluno */}
        <div style={card}>
          <div style={cardTitle}>🗂 Onde este card se encaixa (sua organização pessoal)</div>

          <div className="sf-grid2" style={{ marginBottom: 16 }}>
            {/* Ciclo */}
            <div>
              <label style={lbl}>Ciclo</label>
              <select className="sf-inp" value={ciclo} onChange={e => setCiclo(e.target.value)} style={{ resize: 'none' }}>
                <option value="">Selecione o ciclo</option>
                {CICLOS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Matéria — derivada dos flashcards do aluno */}
            <div>
              <label style={lbl}>Matéria</label>
              {!criarMateria ? (
                <select className="sf-inp" value={materia} onChange={e => setMateria(e.target.value)} style={{ resize: 'none' }}>
                  <option value="">{myMaterias.length ? 'Selecione a matéria' : 'Nenhuma matéria criada ainda'}</option>
                  {myMaterias.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              ) : (
                <input className="sf-inp" type="text" value={materiaNova} onChange={e => setMateriaNova(e.target.value)} placeholder="Nome da nova matéria" autoFocus />
              )}
              <button type="button" className="sf-create-link" onClick={() => { setCriarMateria(!criarMateria); setMateria(''); setMateriaNova(''); }}>
                {criarMateria ? '← Selecionar existente' : '+ Criar nova matéria'}
              </button>
            </div>

            {/* Tópico */}
            <div>
              <label style={lbl}>Tópico <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(opcional)</span></label>
              {!criarTopico ? (
                <select className="sf-inp" value={topicId} onChange={e => {
                  setTopicId(e.target.value);
                  setSubtopicId(''); setSubtopicNome(''); setCriarSubtopic(false);
                  setSubSubtopicId(''); setSubSubtopicNome(''); setCriarSubSubtopic(false);
                }} style={{ resize: 'none' }}>
                  <option value="">{topicos.length ? 'Selecione o tópico' : 'Nenhum tópico criado ainda'}</option>
                  {topicos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              ) : (
                <input className="sf-inp" type="text" value={topicNome} onChange={e => setTopicNome(e.target.value)} placeholder="Nome do novo tópico" autoFocus />
              )}
              <button type="button" className="sf-create-link" onClick={() => { setCriarTopico(!criarTopico); setTopicId(''); setTopicNome(''); }}>
                {criarTopico ? '← Selecionar existente' : '+ Criar novo tópico'}
              </button>
            </div>

            {/* Subtópico */}
            <div>
              <label style={lbl}>Subtópico <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(opcional)</span></label>
              {!criarSubtopic ? (
                <select className="sf-inp" value={subtopicId} onChange={e => {
                  setSubtopicId(e.target.value);
                  setSubSubtopicId(''); setSubSubtopicNome(''); setCriarSubSubtopic(false);
                }} disabled={!topicId && !criarTopico} style={{ resize: 'none' }}>
                  <option value="">{!topicId && !criarTopico ? 'Selecione um tópico primeiro' : (subtopics.length ? 'Selecione o subtópico' : 'Nenhum subtópico ainda')}</option>
                  {subtopics.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                </select>
              ) : (
                <input className="sf-inp" type="text" value={subtopicNome} onChange={e => setSubtopicNome(e.target.value)} placeholder="Nome do novo subtópico" autoFocus />
              )}
              <button type="button" className="sf-create-link" onClick={() => { setCriarSubtopic(!criarSubtopic); setSubtopicId(''); setSubtopicNome(''); }}>
                {criarSubtopic ? '← Selecionar existente' : '+ Criar novo subtópico'}
              </button>
            </div>

            {/* Sub-subtópico */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl}>Sub-subtópico <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none' }}>(opcional)</span></label>
              {!criarSubSubtopic ? (
                <select className="sf-inp" value={subSubtopicId} onChange={e => setSubSubtopicId(e.target.value)}
                  disabled={!subtopicId && !criarSubtopic} style={{ resize: 'none' }}>
                  <option value="">{!subtopicId && !criarSubtopic ? 'Selecione um subtópico primeiro' : (subSubtopics.length ? 'Selecione' : 'Nenhum sub-subtópico ainda')}</option>
                  {subSubtopics.map(ss => <option key={ss.id} value={ss.id}>{ss.nome}</option>)}
                </select>
              ) : (
                <input className="sf-inp" type="text" value={subSubtopicNome} onChange={e => setSubSubtopicNome(e.target.value)} placeholder="Nome do sub-subtópico" autoFocus />
              )}
              <button type="button" className="sf-create-link" onClick={() => { setCriarSubSubtopic(!criarSubSubtopic); setSubSubtopicId(''); setSubSubtopicNome(''); }}>
                {criarSubSubtopic ? '← Selecionar existente' : '+ Criar sub-subtópico'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => router.push('/flashcards')} disabled={saving}
            style={{ ...inp, width: 'auto', padding: '11px 22px', cursor: 'pointer', color: 'var(--text-dim)', fontSize: 14 }}>
            Cancelar
          </button>
          <button type="button" onClick={save} disabled={saving}
            style={{ width: 'auto', padding: '11px 28px', borderRadius: '10px', cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              background: saving ? 'rgba(201,168,76,0.5)' : '#C9A84C',
              color: '#000', border: 'none', opacity: saving ? 0.8 : 1 }}>
            {saving ? 'Salvando...' : '🃏 Salvar flashcard'}
          </button>
        </div>
      </div>

      <Toast msg={toast.msg} visible={toast.visible} isError={toast.isError} />
    </>
  );
}
