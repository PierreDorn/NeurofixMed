'use client';

import { useEffect, useMemo, useState } from 'react';
import { cadernoData, type Questao } from './caderno-data';
import { cadernoIndex } from './caderno-index';
import { useCaderno, type PainelKey } from './CadernoContext';
import './caderno.css';

const TABS: { key: PainelKey; label: string }[] = [
  { key: 'aula',        label: 'Aula explicada' },
  { key: 'resumo',      label: 'Revisão rápida' },
  { key: 'pegadinhas',  label: 'Pontos que confundem' },
  { key: 'questoes',    label: 'Questões' },
  { key: 'flashcards',  label: 'Flashcards' },
  { key: 'plano',       label: 'Plano' },
  { key: 'modelo',      label: 'Modelo padrão' },
];

const PLANO_HTML = `<div class="study-section">
  <h3>Plano de estudo de hoje</h3>
  <p><b>1.</b> Leia a explicação sem tentar decorar tudo na primeira leitura.</p>
  <p><b>2.</b> Volte nos pontos que confundem e marque mentalmente as diferenças.</p>
  <p><b>3.</b> Faça as questões comentadas e leia o comentário mesmo quando acertar.</p>
  <p><b>4.</b> Passe pelos flashcards para testar se o essencial ficou fixado.</p>
  <div class="callout">Meta de hoje: sair deste tema sabendo explicar o básico, reconhecer a pegadinha e responder uma questão sem chutar.</div>
</div>`;

const CHECKLIST_ITEMS = [
  'Li a explicação com calma',
  'Revisei os pontos que confundem',
  'Fiz as questões comentadas',
  'Passei pelos flashcards',
];

// ── localStorage helpers (persistência simples client-side) ─────────
const LS_STUDIED = 'nfx.caderno.studied';     // string[] chaves "materia::tema::subtema"
const LS_CHECKLIST = 'nfx.caderno.checklist'; // Record<key, boolean[]>

function loadStudied(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(LS_STUDIED) ?? '[]')); } catch { return new Set(); }
}
function saveStudied(s: Set<string>) {
  try { localStorage.setItem(LS_STUDIED, JSON.stringify([...s])); } catch {}
}
function loadChecklist(): Record<string, boolean[]> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(LS_CHECKLIST) ?? '{}'); } catch { return {}; }
}
function saveChecklist(c: Record<string, boolean[]>) {
  try { localStorage.setItem(LS_CHECKLIST, JSON.stringify(c)); } catch {}
}

// Total de subtemas por matéria (usado para cálculo de progresso)
const totalSubtemasByMateria: Record<string, number> = Object.fromEntries(
  cadernoIndex.map(m => [m.nome, m.temas.reduce((acc, t) => acc + t.subtemas.length, 0)])
);

function Flashcard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`flashcard${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(v => !v)}>
      <div className="flash-inner">
        <div className="front">{front}</div>
        <div className="back">{back}</div>
      </div>
    </div>
  );
}

function QuestionCard({ q, index }: { q: Questao; index: number }) {
  const [picked, setPicked] = useState<number | null>(null);
  const showExplain = picked !== null;
  return (
    <div className="question">
      <h4>{index + 1}. {q.q}</h4>
      <div className="alts">
        {q.alts.map((a, ai) => {
          let cls = 'alt';
          if (picked !== null) {
            if (ai === q.correct) cls += ' correct';
            else if (ai === picked) cls += ' wrong';
          }
          return (
            <button key={ai} className={cls} disabled={picked !== null} onClick={() => setPicked(ai)}>
              {String.fromCharCode(65 + ai)}) {a}
            </button>
          );
        })}
      </div>
      {showExplain && (
        <div className="explain" style={{ display: 'block' }}>
          <h4>Comentários das alternativas</h4>
          {q.comments
            ? q.comments.map((c, ci) => (
                <p key={ci}>
                  <b>{String.fromCharCode(65 + ci)}) {q.alts[ci]}</b><br />
                  {ci === q.correct ? '✅ ' : '❌ '}{c}
                </p>
              ))
            : q.exp && <p>{q.exp}</p>}

          {Array.isArray(q.traps) ? (
            <div className="warning">
              <b>5 possíveis pegadinhas:</b>
              <div className="trap-list">
                {q.traps.map((t, i) => (
                  <div key={i} className="trap-item">
                    <div className="trap-number">{i + 1}</div>
                    <div>
                      <p><b>Erro:</b> {t.erro ?? ''}</p>
                      <p><b>Versão verdadeira:</b> {t.verdade ?? ''}</p>
                      <p><b>Mini revisão:</b> {t.revisao ?? ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            q.traps && <div className="warning"><b>Atenção:</b> {q.traps}</div>
          )}

          {q.clinicalReasoning && <div className="callout"><b>Raciocínio Clínico para resolver a questão do Zero:</b> {q.clinicalReasoning}</div>}
          {q.tip && <div className="callout"><b>Dica para gabaritar:</b> {q.tip}</div>}
          {q.oral && <div className="callout"><b>Revisão oral:</b> {q.oral}</div>}
        </div>
      )}
    </div>
  );
}

export default function CadernoBloco() {
  const { selectedTema, selectedSubtema, setSelectedSubtema, painel, setPainel } = useCaderno();
  const [tipoQuestao, setTipoQuestao] = useState<'conteudo' | 'casos'>('conteudo');
  const [studied, setStudied] = useState<Set<string>>(() => new Set());
  const [checklist, setChecklist] = useState<Record<string, boolean[]>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setStudied(loadStudied());
    setChecklist(loadChecklist());
  }, []);

  const subtemas = useMemo(() => {
    if (!selectedTema) return [] as string[];
    const lesson = cadernoData[selectedTema.materia]?.lessons?.[selectedTema.tema];
    return lesson ? Object.keys(lesson.topics) : [];
  }, [selectedTema]);

  const subtemaContent = useMemo(() => {
    if (!selectedTema || !selectedSubtema) return null;
    return cadernoData[selectedTema.materia]?.lessons?.[selectedTema.tema]?.topics?.[selectedSubtema] ?? null;
  }, [selectedTema, selectedSubtema]);

  const currentMateria = selectedTema?.materia ?? '';
  const subtemaKey = selectedTema && selectedSubtema
    ? `${selectedTema.materia}::${selectedTema.tema}::${selectedSubtema}`
    : '';

  // Progresso real da matéria = subtemas estudados / total de subtemas × 100
  const totalSubtemas = totalSubtemasByMateria[currentMateria] ?? 0;
  const studiedInMateria = useMemo(() => {
    if (!currentMateria) return 0;
    const prefix = `${currentMateria}::`;
    let count = 0;
    studied.forEach(k => { if (k.startsWith(prefix)) count++; });
    return count;
  }, [studied, currentMateria]);
  const currentProgress = totalSubtemas > 0
    ? Math.round((studiedInMateria / totalSubtemas) * 100)
    : 0;

  const currentChecklist: boolean[] = checklist[subtemaKey] ?? [false, false, false, false];
  const isSubtemaStudied = !!subtemaKey && studied.has(subtemaKey);

  function toggleCheck(idx: number) {
    if (!subtemaKey) return;
    const next = [...currentChecklist];
    next[idx] = !next[idx];
    const nextMap = { ...checklist, [subtemaKey]: next };
    setChecklist(nextMap);
    saveChecklist(nextMap);
  }

  function markDone() {
    if (!subtemaKey) return;
    const next = new Set(studied);
    let msg: string;
    if (next.has(subtemaKey)) {
      next.delete(subtemaKey);
      msg = `Desmarcado como estudado: ${selectedSubtema}`;
    } else {
      next.add(subtemaKey);
      const newStudiedInMat = [...next].filter(k => k.startsWith(`${currentMateria}::`)).length;
      const pct = totalSubtemas > 0 ? Math.round((newStudiedInMat / totalSubtemas) * 100) : 0;
      msg = pct === 100
        ? `${currentMateria} 100% concluída! 🎉`
        : `${selectedSubtema} marcado · ${currentMateria} em ${pct}%`;
    }
    setStudied(next);
    saveStudied(next);
    setFeedback(msg);
    window.setTimeout(() => setFeedback(null), 2600);
  }

  const questoes = subtemaContent
    ? (tipoQuestao === 'casos' ? subtemaContent.casosClinicos ?? [] : subtemaContent.questoes ?? [])
    : [];

  return (
    <div className="cad-wrap">
      {/* ── Topbar com título + 2 botões funcionais ── */}
      <div className="cad-topbar">
        <div className="cad-hello">
          <h1>Seu caderno NeuroFix</h1>
          <p>Escolha a disciplina, entre no tema e estude com explicação, revisão e treino no mesmo lugar.</p>
        </div>
        <div className="cad-top-actions">
          <button
            type="button"
            className="cad-btn"
            onClick={() => setPainel('plano')}
            disabled={!selectedTema}
            title={selectedTema ? 'Ver plano de hoje' : 'Selecione um tema primeiro'}
          >
            Plano de hoje
          </button>
          <button
            type="button"
            className={`cad-btn gold${isSubtemaStudied ? ' done' : ''}`}
            onClick={markDone}
            disabled={!subtemaKey}
            title={subtemaKey ? (isSubtemaStudied ? 'Desmarcar este subtema' : 'Marcar este subtema como estudado') : 'Selecione um subtema primeiro'}
          >
            {isSubtemaStudied ? '✓ Estudado' : 'Marcar como estudado'}
          </button>
        </div>
      </div>

      {feedback && <div className="cad-feedback">{feedback}</div>}

      <div className="cad-layout">
        {/* ── Área central: hero card + tabs + conteúdo ── */}
        <section className="cad-content">
          {!selectedTema && (
            <div className="cad-empty">
              <h3>Bem-vindo ao seu caderno NeuroFix</h3>
              <p>Escolha um <b>Ciclo</b> na barra lateral, entre em uma <b>matéria</b> e depois em um <b>tema</b>. Os subtemas aparecem à direita com o conteúdo completo — aula, revisão, pontos que confundem, questões e flashcards.</p>
            </div>
          )}

          {selectedTema && subtemaContent && selectedSubtema && (
            <>
              <div className="cad-hero-card">
                <div className="cad-breadcrumb">
                  Ciclo Básico / <b>{selectedTema.materia}</b> / {selectedTema.tema}
                </div>
                <h2 className="cad-topic-title">{selectedSubtema}</h2>
                {subtemaContent.intro && <p className="cad-topic-intro">{subtemaContent.intro}</p>}
                <div className="cad-tabs">
                  {TABS.map(t => (
                    <button
                      key={t.key}
                      className={`cad-tab${painel === t.key ? ' active' : ''}`}
                      onClick={() => setPainel(t.key)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cad-content-area">
                {painel === 'aula' && (
                  <div className="study-section" dangerouslySetInnerHTML={{ __html: subtemaContent.aula }} />
                )}
                {painel === 'resumo' && (
                  <div className="study-section" dangerouslySetInnerHTML={{ __html: subtemaContent.resumo ?? '<h3>Revisão em breve</h3>' }} />
                )}
                {painel === 'pegadinhas' && (
                  <div className="study-section" dangerouslySetInnerHTML={{ __html: subtemaContent.pegadinhas ?? '<h3>Pontos que confundem em breve</h3>' }} />
                )}
                {painel === 'plano' && (
                  <div dangerouslySetInnerHTML={{ __html: subtemaContent.plano ?? PLANO_HTML }} />
                )}
                {painel === 'modelo' && (
                  <div dangerouslySetInnerHTML={{ __html: subtemaContent.modelo ?? modeloDefault() }} />
                )}

                {painel === 'questoes' && (
                  <div className="study-section">
                    <h3>{tipoQuestao === 'casos' ? 'Questões de casos clínicos' : 'Questões sobre o conteúdo'}</h3>
                    <p>
                      {tipoQuestao === 'casos'
                        ? 'Treine o raciocínio clínico com enunciados em formato de prova.'
                        : 'Treine os conceitos principais do tema antes de avançar para casos clínicos.'}
                    </p>
                    <div className="question-type-buttons">
                      <button
                        className={`qtype${tipoQuestao === 'conteudo' ? ' active' : ''}`}
                        onClick={() => setTipoQuestao('conteudo')}
                      >Questões sobre o conteúdo</button>
                      <button
                        className={`qtype${tipoQuestao === 'casos' ? ' active' : ''}`}
                        onClick={() => setTipoQuestao('casos')}
                      >Questões de casos clínicos</button>
                    </div>
                    {questoes.length > 0
                      ? questoes.map((q, i) => <QuestionCard key={i} q={q} index={i} />)
                      : <p style={{ color: '#7D8492' }}>Questões em breve para este modo.</p>}
                  </div>
                )}

                {painel === 'flashcards' && (
                  <div className="study-section">
                    <h3>Flashcards</h3>
                    <p>Clique no cartão para virar e revisar rápido.</p>
                    <div className="flashcards">
                      {(subtemaContent.flashcards ?? []).map((fc, i) => (
                        <Flashcard key={i} front={fc[0]} back={fc[1]} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {/* ── Rail direita: 3 cards (progresso, checklist, subtemas) ── */}
        {selectedTema && (
          <aside className="cad-rail">
            <div className="cad-rail-card">
              <h3>Progresso da disciplina</h3>
              <div className="cad-progress-wrap">
                <div className="cad-progress-top">
                  <span>{currentMateria}</span>
                  <span>{currentProgress}%</span>
                </div>
                <div className="cad-bar"><div className="cad-fill" style={{ width: `${currentProgress}%` }} /></div>
                <div className="cad-progress-sub">
                  {totalSubtemas > 0
                    ? `${studiedInMateria} de ${totalSubtemas} subtemas estudados`
                    : 'Ainda sem subtemas cadastrados nessa matéria'}
                </div>
              </div>
            </div>

            <div className="cad-rail-card">
              <h3>Checklist do estudo</h3>
              <div className="cad-tasks">
                {CHECKLIST_ITEMS.map((label, i) => (
                  <label key={i} className="cad-task">
                    <input
                      type="checkbox"
                      checked={currentChecklist[i] ?? false}
                      onChange={() => toggleCheck(i)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {subtemas.length > 0 && (
              <div className="cad-rail-card">
                <h3>Subtemas de {selectedTema.tema}</h3>
                <div className="cad-subtema-list">
                  {subtemas.map(sub => (
                    <button
                      key={sub}
                      className={`cad-subtema-btn${selectedSubtema === sub ? ' active' : ''}`}
                      onClick={() => { setSelectedSubtema(sub); setPainel('aula'); }}
                    >
                      <span>{sub}</span>
                      <small>abrir</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

function modeloDefault() {
  return `<div class="standard-model">
    <h3>Modelo padrão NeuroFix Med</h3>
    <p>Todo conteúdo novo inserido na plataforma deve seguir o mesmo padrão do modelo de <span class="gold"><b>Ascaris lumbricoides</b></span>.</p>
    <div class="standard-grid">
      <div class="standard-card"><h4>1. Aula explicada</h4><p>Explicar do zero, em linguagem de professora.</p></div>
      <div class="standard-card"><h4>2. Revisão rápida</h4><p>Frases curtas, sequência lógica, mapa anti-pegadinha.</p></div>
      <div class="standard-card"><h4>3. Pontos que confundem</h4><p>Confusões clássicas em formato pegadinha → erro → verdade → revisão.</p></div>
      <div class="standard-card"><h4>4. Questões</h4><p>Objetivas com A a E, comentário de cada alternativa.</p></div>
      <div class="standard-card"><h4>5. Flashcards</h4><p>Curtos, diretos e progressivos.</p></div>
      <div class="standard-card"><h4>6. Plano de estudo</h4><p>Organizado em dias, indicando o que revisar até dominar.</p></div>
    </div>
  </div>`;
}
