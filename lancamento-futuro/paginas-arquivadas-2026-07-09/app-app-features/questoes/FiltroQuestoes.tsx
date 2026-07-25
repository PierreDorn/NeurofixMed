'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import FiltroModal, { type ModalGroup, type ModalItem } from './FiltroModal';
import { contarQuestoes } from './actions';

export interface MateriaOpt {
  id: string;
  nome: string;
  ciclo: string; // 'basico' | 'clinico'
}

export interface TopicOpt {
  id: string;
  materialId: string;
  nome: string;
  ordem: number;
}

export interface FiltroQuestoesProps {
  materiais: MateriaOpt[];
  topics: TopicOpt[];
  totalQuestoesPublicadas: number;
}

type CicloTipo = 'basico' | 'clinico' | null;

export default function FiltroQuestoes({ materiais, topics, totalQuestoesPublicadas }: FiltroQuestoesProps) {
  const router = useRouter();

  const [ciclo, setCiclo] = useState<CicloTipo>(null);
  const [materiaIds, setMateriaIds] = useState<string[]>([]);
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<'materia' | 'modulo' | null>(null);

  const [nQuestoes, setNQuestoes] = useState<number>(totalQuestoesPublicadas);
  const [contando, startCount] = useTransition();

  // ── Cascata: ao trocar ciclo, limpa matérias/módulos que não pertencem
  useEffect(() => {
    if (!ciclo) return;
    const materiaisDoCiclo = new Set(materiais.filter((m) => m.ciclo === ciclo).map((m) => m.id));
    setMateriaIds((prev) => prev.filter((id) => materiaisDoCiclo.has(id)));
  }, [ciclo, materiais]);

  // ── Cascata: ao trocar matérias, limpa módulos que não pertencem
  useEffect(() => {
    const topicsDasMaterias = new Set(topics.filter((t) => materiaIds.includes(t.materialId)).map((t) => t.id));
    setTopicIds((prev) => prev.filter((id) => topicsDasMaterias.has(id)));
  }, [materiaIds, topics]);

  // ── Contagem real de questões
  useEffect(() => {
    startCount(async () => {
      const res = await contarQuestoes(materiaIds, topicIds);
      setNQuestoes(res.count);
    });
  }, [materiaIds, topicIds]);

  // ── Derivações
  const materiasDoCiclo = useMemo(
    () => (ciclo ? materiais.filter((m) => m.ciclo === ciclo) : []),
    [ciclo, materiais],
  );

  const materiasSelecionadas = useMemo(
    () => materiais.filter((m) => materiaIds.includes(m.id)),
    [materiais, materiaIds],
  );

  const topicsElegiveis = useMemo(
    () => topics.filter((t) => materiaIds.includes(t.materialId)),
    [topics, materiaIds],
  );

  const topicsSelecionados = useMemo(
    () => topics.filter((t) => topicIds.includes(t.id)),
    [topics, topicIds],
  );

  // ── Modais: props
  const materiaModalItems: ModalItem[] = materiasDoCiclo.map((m) => ({ id: m.id, nome: m.nome }));
  const moduloModalItems: ModalItem[] = topicsElegiveis.map((t) => ({
    id: t.id,
    nome: t.nome,
    groupId: t.materialId,
  }));
  const moduloModalGroups: ModalGroup[] = materiasSelecionadas.map((m) => ({ id: m.id, nome: m.nome }));

  // ── Labels dinâmicas
  const labelMateria = ciclo == null
    ? 'Escolha o ciclo primeiro'
    : materiaIds.length === 0 ? 'Toque para escolher a matéria'
    : materiaIds.length === 1 ? materiasSelecionadas[0]?.nome ?? '1 matéria'
    : `${materiaIds.length} matérias selecionadas`;

  const labelModulo = materiaIds.length === 0
    ? 'Escolha a matéria primeiro'
    : topicIds.length === 0 ? 'Toque para escolher o módulo (opcional)'
    : topicIds.length === 1 ? topicsSelecionados[0]?.nome ?? '1 módulo'
    : `${topicIds.length} módulos selecionados`;

  const tempoEstimadoMin = Math.max(0, Math.round(nQuestoes * 0.75));
  const tempoEstimado = tempoEstimadoMin >= 60
    ? `${Math.floor(tempoEstimadoMin / 60)}h${tempoEstimadoMin % 60 ? String(tempoEstimadoMin % 60).padStart(2, '0') : ''}`
    : `${tempoEstimadoMin} min`;

  const podeIniciar = ciclo != null && nQuestoes > 0;

  const iniciar = () => {
    if (!podeIniciar) return;
    const params = new URLSearchParams();
    params.set('ciclo', ciclo!);
    if (materiaIds.length) params.set('materias', materiaIds.join(','));
    if (topicIds.length) params.set('modulos', topicIds.join(','));
    router.push(`/questoes/treino?${params.toString()}`);
  };

  return (
    <>
      <style>{stylesCss}</style>

      <main className="fq-root">
        {/* Topbar */}
        <div className="fq-topbar">
          <span className="fq-bar-line" />
          <span className="fq-brand">BANCO DE QUESTÕES · NEUROFIX MED</span>
        </div>

        {/* Hero */}
        <header className="fq-hero">
          <h1 className="fq-h1">
            Vamos montar seu <b>treino de hoje.</b>
          </h1>
          <p className="fq-sub">
            Em três passos rápidos você chega no que quer treinar. Escolha a fase do curso, a matéria e — se quiser — um módulo específico. A NeuroFix cuida do resto.
          </p>
        </header>

        <div className="fq-grid">
          {/* WIZARD */}
          <section className="fq-wizard" aria-label="Filtros de questões">
            {/* STEP 1 · CICLO */}
            <div className="fq-step">
              <div className="fq-step-head">
                <span className="fq-step-num">01</span>
                <div>
                  <div className="fq-step-title">Comece pela fase do curso</div>
                  <div className="fq-step-sub">Toque no ciclo em que você está estudando agora.</div>
                </div>
              </div>
              <div className="fq-step-body fq-2col">
                <button
                  type="button"
                  onClick={() => setCiclo('basico')}
                  className={`fq-card-btn ${ciclo === 'basico' ? 'active' : ''}`}
                >
                  <span className="fq-card-top">
                    <span className="fq-card-name">Ciclo Básico</span>
                    {ciclo === 'basico' && <span className="fq-tag-selected">Selecionado</span>}
                  </span>
                  <span className="fq-card-desc">Anatomia, fisiologia, bioquímica, histologia e as bases pré-clínicas.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCiclo('clinico')}
                  className={`fq-card-btn ${ciclo === 'clinico' ? 'active' : ''}`}
                >
                  <span className="fq-card-top">
                    <span className="fq-card-name">Ciclo Clínico</span>
                    {ciclo === 'clinico' && <span className="fq-tag-selected">Selecionado</span>}
                  </span>
                  <span className="fq-card-desc">Clínica médica, cirurgia, pediatria, GO e raciocínio diagnóstico.</span>
                </button>
              </div>
            </div>

            {/* STEP 2 · MATÉRIA */}
            <div className="fq-step">
              <div className="fq-step-head">
                <span className="fq-step-num">02</span>
                <div>
                  <div className="fq-step-title">Agora, a matéria</div>
                  <div className="fq-step-sub">
                    Toque no botão pra abrir a lista. Você pode digitar pra achar mais rápido e escolher quantas quiser.
                  </div>
                </div>
              </div>
              <div className="fq-step-body">
                <button
                  type="button"
                  onClick={() => ciclo && setModalOpen('materia')}
                  disabled={ciclo == null}
                  className={`fq-select-btn ${materiaIds.length > 0 ? 'has-value' : ''}`}
                >
                  <span className="fq-select-label">{labelMateria}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </div>

            {/* STEP 3 · MÓDULO */}
            <div className="fq-step">
              <div className="fq-step-head">
                <span className="fq-step-num">03</span>
                <div>
                  <div className="fq-step-title">Módulo <span className="fq-optional">(opcional)</span></div>
                  <div className="fq-step-sub">
                    Se quiser focar num módulo específico da matéria, escolha aqui. Se preferir treinar tudo, é só deixar em branco.
                  </div>
                </div>
              </div>
              <div className="fq-step-body">
                <button
                  type="button"
                  onClick={() => materiaIds.length > 0 && setModalOpen('modulo')}
                  disabled={materiaIds.length === 0}
                  className={`fq-select-btn ${topicIds.length > 0 ? 'has-value' : ''}`}
                >
                  <span className="fq-select-label">{labelModulo}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* SIDEBAR RESUMO */}
          <aside className="fq-summary" aria-label="Resumo do seu treino">
            <div className="fq-sum-title">Seu treino em resumo</div>
            <p className="fq-sum-lead">
              Antes de começar, dá uma olhada no que você escolheu. Você pode voltar e mudar quando quiser.
            </p>

            <div className="fq-sum-rows">
              <div className="fq-sum-row">
                <span className="k">Ciclo</span>
                <span className="v">{ciclo === 'basico' ? 'Básico' : ciclo === 'clinico' ? 'Clínico' : '—'}</span>
              </div>
              <div className="fq-sum-row">
                <span className="k">Matéria</span>
                <span className="v">{materiaIds.length === 0 ? '—' : materiaIds.length === 1 ? materiasSelecionadas[0]?.nome : `${materiaIds.length} selecionadas`}</span>
              </div>
              <div className="fq-sum-row last">
                <span className="k">Módulo</span>
                <span className="v">{topicIds.length === 0 ? 'Todos' : topicIds.length === 1 ? topicsSelecionados[0]?.nome : `${topicIds.length} selecionados`}</span>
              </div>
            </div>

            <div className="fq-sum-stats">
              <div className="fq-sum-stat">
                <div className="n">{contando ? '…' : nQuestoes}</div>
                <div className="l">questões no filtro</div>
              </div>
              <div className="fq-sum-stat">
                <div className="n">{contando ? '…' : nQuestoes > 0 ? tempoEstimado : '—'}</div>
                <div className="l">tempo estimado</div>
              </div>
            </div>

            <button
              type="button"
              onClick={iniciar}
              disabled={!podeIniciar}
              className={`fq-cta ${podeIniciar ? '' : 'disabled'}`}
            >
              <span>{podeIniciar ? 'Começar a treinar' : ciclo == null ? 'Escolha o ciclo primeiro' : 'Sem questões no filtro'}</span>
              {podeIniciar && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </button>

            <div className="fq-sum-tip">
              <b>Dica:</b> quanto mais amplo o filtro, mais tipos de questão você treina. Comece amplo e vá afunilando.
            </div>
          </aside>
        </div>
      </main>

      {/* Modal MATÉRIA (flat) */}
      <FiltroModal
        open={modalOpen === 'materia'}
        onClose={() => setModalOpen(null)}
        title="Escolha a matéria"
        subtitle={ciclo === 'basico' ? 'Matérias do ciclo básico' : 'Matérias do ciclo clínico'}
        items={materiaModalItems}
        selectedIds={materiaIds}
        onApply={setMateriaIds}
        emptyMessage="Nenhuma matéria disponível para esse ciclo ainda."
      />

      {/* Modal MÓDULO (agrupado por matéria) */}
      <FiltroModal
        open={modalOpen === 'modulo'}
        onClose={() => setModalOpen(null)}
        title="Escolha o módulo"
        subtitle={materiaIds.length === 1 ? 'Módulos da matéria selecionada' : 'Módulos das matérias selecionadas'}
        items={moduloModalItems}
        groups={moduloModalGroups}
        selectedIds={topicIds}
        onApply={setTopicIds}
        emptyMessage="Ainda não há módulos cadastrados nessa matéria."
      />
    </>
  );
}

const stylesCss = `
.fq-root {
  --gold: #C9A84C;
  --gold-2: #E8D08A;
  --blue: #4AB3FF;
  --offwhite: #F0EDE6;
  --panel: #0B0E15;
  --panel-2: #10151c;
  --muted: rgba(240,237,230,0.55);
  --muted-2: rgba(240,237,230,0.32);
  --line: rgba(255,255,255,0.07);
  --hairline: rgba(201,168,76,0.14);

  min-height: 100vh;
  padding: 40px 32px 80px;
  background:
    radial-gradient(1200px 700px at 82% -10%, rgba(74,179,255,.09), transparent 58%),
    radial-gradient(900px 620px at 4% 2%, rgba(201,168,76,.06), transparent 52%),
    #07090d;
  color: var(--offwhite);
  font-family: 'Montserrat', system-ui, sans-serif;
}

.fq-topbar {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 24px; max-width: 1180px; margin-left: auto; margin-right: auto;
}
.fq-bar-line { width: 30px; height: 1px; background: linear-gradient(90deg, var(--gold), rgba(201,168,76,0.08)); }
.fq-brand { font-size: 11px; font-weight: 700; letter-spacing: .22em; color: var(--gold); }

.fq-hero { max-width: 1180px; margin: 0 auto 32px; }
.fq-h1 {
  font-size: clamp(28px, 3.4vw, 44px); font-weight: 800; line-height: 1.1;
  color: var(--offwhite); letter-spacing: -.5px; margin: 0 0 14px;
}
.fq-h1 b { color: var(--gold); font-weight: 800; }
.fq-sub {
  font-size: 15.5px; color: var(--muted); line-height: 1.65;
  max-width: 640px; margin: 0; font-weight: 300;
}

.fq-grid {
  max-width: 1180px; margin: 0 auto;
  display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 22px; align-items: start;
}

.fq-wizard {
  background: linear-gradient(180deg, rgba(18,24,32,.9), rgba(10,14,19,.94));
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 40px 90px -40px rgba(0,0,0,.85);
}
.fq-step { padding: 26px 30px; border-bottom: 1px solid rgba(255,255,255,.055); }
.fq-step:last-child { border-bottom: none; }

.fq-step-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
.fq-step-num { font-family: 'Newsreader', Georgia, serif; font-size: 15px; color: #5c6470; }
.fq-step-title { font-size: 13px; font-weight: 700; letter-spacing: .18em; color: var(--gold); text-transform: uppercase; }
.fq-optional { font-size: 11px; color: var(--muted-2); letter-spacing: .1em; font-weight: 500; text-transform: none; }
.fq-step-sub { font-size: 13px; color: var(--muted); margin-top: 4px; line-height: 1.55; max-width: 540px; }

.fq-step-body { }
.fq-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* CARD BUTTON (ciclo) */
.fq-card-btn {
  position: relative; display: flex; flex-direction: column; gap: 6px; text-align: left;
  padding: 16px 18px; border-radius: 11px; cursor: pointer;
  transition: all .18s; font-family: inherit;
  background: rgba(255,255,255,.025);
  border: 1px solid rgba(255,255,255,.08);
  color: rgba(240,237,230,.7);
}
.fq-card-btn:hover { border-color: rgba(201,168,76,.42); transform: translateY(-1px); color: var(--offwhite); }
.fq-card-btn.active {
  background: linear-gradient(180deg, rgba(201,168,76,.16), rgba(201,168,76,.04));
  border-color: rgba(201,168,76,.55);
  color: #f0e4c2;
  box-shadow: 0 8px 22px -14px rgba(201,168,76,.55);
}
.fq-card-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.fq-card-name { font-size: 15px; font-weight: 700; }
.fq-card-desc { font-size: 12.5px; opacity: .72; line-height: 1.5; }
.fq-tag-selected {
  flex: none; font-size: 9.5px; font-weight: 800; letter-spacing: .1em;
  color: #241d0c; background: #E8D08A; border-radius: 999px; padding: 4px 9px;
  text-transform: uppercase;
}

/* SELECT BUTTON (matéria/módulo) */
.fq-select-btn {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 15px 18px; border-radius: 11px; cursor: pointer;
  transition: all .18s; font-family: inherit;
  background: rgba(255,255,255,.025);
  border: 1px solid rgba(255,255,255,.08);
  color: var(--muted);
  text-align: left;
}
.fq-select-btn:hover:not(:disabled) {
  border-color: rgba(201,168,76,.42);
  background: rgba(201,168,76,.05);
  color: var(--offwhite);
}
.fq-select-btn:disabled { opacity: .55; cursor: not-allowed; }
.fq-select-btn.has-value {
  border-color: rgba(201,168,76,.5);
  background: linear-gradient(180deg, rgba(201,168,76,.1), rgba(201,168,76,.03));
  color: #f0e4c2;
}
.fq-select-label { flex: 1; font-size: 14.5px; font-weight: 600; }

/* SIDEBAR RESUMO */
.fq-summary {
  position: sticky; top: 24px;
  background: linear-gradient(180deg, rgba(21,28,41,.96), rgba(13,18,27,.96));
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 18px; padding: 24px;
  box-shadow: 0 40px 90px -40px rgba(0,0,0,.85);
}
.fq-sum-title { font-size: 20px; font-weight: 800; color: var(--offwhite); margin-bottom: 6px; letter-spacing: -.2px; }
.fq-sum-lead { font-size: 13px; color: var(--muted); line-height: 1.55; margin-bottom: 18px; }
.fq-sum-rows { display: grid; gap: 11px; margin-bottom: 18px; }
.fq-sum-row {
  display: flex; justify-content: space-between; gap: 14px;
  border-bottom: 1px solid rgba(255,255,255,.055); padding-bottom: 10px; font-size: 13px;
}
.fq-sum-row.last { border-bottom: none; padding-bottom: 0; }
.fq-sum-row .k { color: var(--muted); }
.fq-sum-row .v { color: var(--offwhite); font-weight: 700; text-align: right; }
.fq-sum-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
.fq-sum-stat {
  background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07);
  border-radius: 12px; padding: 14px;
}
.fq-sum-stat .n { font-size: 22px; font-weight: 800; color: var(--gold-2); line-height: 1; }
.fq-sum-stat .l { font-size: 11px; color: var(--muted); margin-top: 4px; }

.fq-cta {
  width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 9px;
  padding: 15px 20px; border: none; border-radius: 12px;
  background: linear-gradient(180deg, #E0C47F, #C6A555);
  color: #241d0c;
  font-family: inherit; font-size: 14px; font-weight: 800; letter-spacing: .04em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 12px 26px -14px rgba(201,168,76,.55);
  transition: all .18s;
}
.fq-cta:hover:not(.disabled) { transform: translateY(-1px); box-shadow: 0 16px 34px -14px rgba(201,168,76,.7); }
.fq-cta.disabled {
  background: rgba(255,255,255,.05); color: rgba(240,237,230,.4); box-shadow: none; cursor: not-allowed;
  text-transform: none; letter-spacing: 0; font-size: 13px;
}
.fq-sum-tip {
  margin-top: 16px; border: 1px solid rgba(74,179,255,.22); background: rgba(74,179,255,.06);
  border-radius: 12px; padding: 12px 14px; font-size: 12.5px; line-height: 1.55; color: rgba(240,237,230,.72);
}
.fq-sum-tip b { color: var(--blue); font-weight: 700; }

@media (max-width: 900px) {
  .fq-root { padding: 32px 20px 60px; }
  .fq-grid { grid-template-columns: 1fr; }
  .fq-2col { grid-template-columns: 1fr; }
  .fq-summary { position: static; }
  .fq-step { padding: 22px 22px; }
}
`;
