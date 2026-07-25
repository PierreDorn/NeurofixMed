'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Shell from '@/components/v73/Shell';
import './etiologia-module.css';

type PhaseId = 'aprenda' | 'teste' | 'revise';
type TabId =
  | 'start'
  | 'explain'
  | 'learning'
  | 'clinical'
  | 'confusions'
  | 'questions'
  | 'flashcards'
  | 'eve'
  | 'mastery';

const PHASES: Array<{
  id: PhaseId;
  number: number;
  title: string;
  sub: string;
}> = [
  { id: 'aprenda', number: 1, title: 'Aprenda', sub: 'entenda o mecanismo' },
  { id: 'teste', number: 2, title: 'Teste sem olhar', sub: 'lembre, aplique e corrija' },
  { id: 'revise', number: 3, title: 'Revise até dominar', sub: 'retorne e confirme' },
];

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'start', label: 'Comece aqui' },
  { id: 'explain', label: 'Explicação do zero' },
  { id: 'learning', label: 'Entender × memorizar' },
  { id: 'clinical', label: 'Raciocínio clínico' },
  { id: 'confusions', label: 'O que confunde' },
  { id: 'questions', label: 'Questões' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'eve', label: 'Véspera' },
  { id: 'mastery', label: 'Domínio e fontes' },
];

const PHASE_PANEL: Record<PhaseId, {
  tag: string;
  guidance: string;
  secondary: Array<{ label: string }>;
  primary: string;
  note: string;
}> = {
  aprenda: {
    tag: 'Aprenda · construa a base',
    guidance:
      'Leia ou ouça a explicação. Nesta etapa, o objetivo é compreender o mecanismo, não decorar frases.',
    secondary: [{ label: 'Abrir explicação' }, { label: 'Ouvir explicação' }],
    primary: 'Concluí e consigo resumir',
    note: 'Marcar como lido não encerra a nota. A próxima etapa exige recuperação sem consulta.',
  },
  teste: {
    tag: 'Teste sem olhar · recupere sem consulta',
    guidance:
      'Feche a explicação. Responda flashcards e questões antes de conferir o gabarito. O que sair errado volta pra fila.',
    secondary: [{ label: 'Abrir flashcards' }, { label: 'Abrir questões' }],
    primary: 'Concluí a recuperação ativa',
    note: 'Só avance quando conseguir recuperar sem hesitação. Erros hoje evitam confusão na prova.',
  },
  revise: {
    tag: 'Revise até dominar · confirme a longo prazo',
    guidance:
      'Refaça a véspera, releia a regra-mãe e feche a nota com os critérios de domínio. A plataforma agenda a próxima revisão.',
    secondary: [{ label: 'Abrir véspera' }, { label: 'Abrir domínio e fontes' }],
    primary: 'Concluí a revisão de fechamento',
    note: 'Ao concluir, a próxima revisão é agendada pelo sistema de repetição espaçada.',
  },
};

export default function EtiologiaModuleView() {
  const router = useRouter();
  const [phase, setPhase] = useState<PhaseId>('aprenda');
  const [tab, setTab] = useState<TabId>('start');
  const activePanel = PHASE_PANEL[phase];

  return (
    <Shell breadcrumb="Etiologia e fatores de risco">
      <section className="page active" id="page-etiology-preview">
        <button
          type="button"
          className="text-link"
          onClick={() => router.push('/subjects/pathology')}
        >
          ← Voltar para Patologia Médica
        </button>

        {/* HERO — Nota NeuroFix Ouro */}
        <div className="etiology-note-hero" style={{ marginTop: 18 }}>
          <span className="official-standard-badge">
            ✦ Nota NeuroFix Ouro · Padrão editorial oficial
          </span>
          <h1>Etiologia e fatores de risco</h1>
          <p>
            Aprenda a identificar por que uma doença surge, diferenciar causa de fator de risco e
            transformar dados do caso clínico em um raciocínio etiológico preciso.
          </p>
          <div className="note-meta-row" style={{ marginTop: 18 }}>
            <span>Aula 01 · Como pensar em Patologia</span>
            <span>35–45 minutos</span>
            <span>Faculdade → Clínica → Residência</span>
            <span>Conteúdo autoral baseado nos livros do projeto</span>
          </div>
          <div className="note-tools" style={{ marginTop: 18 }}>
            <button type="button">☆ Salvar</button>
            <button type="button">♬ Ouvir tela atual</button>
            <button type="button">↻ Programar revisão</button>
          </div>
        </div>

        {/* MÉTODO NEUROFIX EM 3 FASES */}
        <div className="nf-method-block">
          <div className="nf-method-head">
            <div>
              <span className="nf-method-eyebrow">Método NeuroFix em 3 Fases</span>
              <h2>Aprenda. Teste sem olhar. Revise até dominar.</h2>
              <p>A plataforma conduz automaticamente os passos menores dentro de cada fase.</p>
            </div>
            <div className="nf-method-score">
              <strong>0/3</strong>
              <small>fases concluídas</small>
            </div>
          </div>

          <div className="nf-phase-row" role="tablist" aria-label="Fases do método">
            {PHASES.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={phase === p.id}
                className={`nf-phase${phase === p.id ? ' active' : ''}`}
                onClick={() => setPhase(p.id)}
              >
                <span className="nf-phase-number">{p.number}</span>
                <span className="nf-phase-title">{p.title}</span>
                <span className="nf-phase-sub">{p.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PAINEL DA FASE ATIVA */}
        <div className="nf-active-phase-panel">
          <span className="nf-active-phase-tag">{activePanel.tag}</span>
          <p>{activePanel.guidance}</p>
          <div className="nf-active-phase-actions">
            {activePanel.secondary.map((btn) => (
              <button key={btn.label} type="button">{btn.label}</button>
            ))}
            <button type="button" className="primary">{activePanel.primary}</button>
          </div>
          <p className="nf-active-phase-note">{activePanel.note}</p>
        </div>

        {/* BARRA DE ABAS */}
        <div className="nf-module-tabs" role="tablist" aria-label="Seções do módulo">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={tab === t.id ? 'active' : undefined}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* CONTEÚDO DA ABA */}
        {tab === 'start' && <StartTab />}
        {tab !== 'start' && <TabStub tabId={tab} />}
      </section>
    </Shell>
  );
}

function StartTab() {
  return (
    <article className="nf-start-tab">
      <span className="nf-start-eyebrow">Antes de começar</span>
      <h2>O que você vai conseguir fazer ao final</h2>
      <p className="nf-lede">
        Esta nota <b>não foi criada para você decorar</b> uma lista de causas. Ela foi criada para você
        <b> olhar um caso clínico e separar, com segurança, o que é causa, o que é fator de risco, o
        que é gatilho e o que é consequência</b> — sem confundir os quatro.
      </p>

      <div className="nf-prep-grid">
        <div className="nf-prep-card">
          <span className="eyebrow">Objetivo</span>
          <p>Explicar etiologia e fatores de risco e aplicá-los ao raciocínio clínico.</p>
        </div>
        <div className="nf-prep-card">
          <span className="eyebrow">Pré-requisitos</span>
          <p>Nenhum conteúdo avançado. Basta reconhecer que doença altera estrutura e função.</p>
        </div>
        <div className="nf-prep-card">
          <span className="eyebrow">Tempo</span>
          <p>35–45 minutos, divididos em blocos curtos.</p>
        </div>
        <div className="nf-prep-card">
          <span className="eyebrow">Critério de domínio</span>
          <p>Classificar corretamente os dados de um caso sem confundir causa com consequência.</p>
        </div>
      </div>

      <div className="nf-dual-grid">
        <div className="nf-dual-card">
          <h3>Você precisa compreender</h3>
          <ul>
            <li>Como <b>etiologia</b> se diferencia de <b>patogênese</b> na sequência causal.</li>
            <li>Por que <b>fator de risco aumenta probabilidade</b> mas não garante desfecho.</li>
            <li>Como <b>doença de base</b> e <b>gatilho agudo</b> interagem para produzir o quadro.</li>
            <li>Como a causa é <b>multifatorial</b> — suscetibilidade + exposição + mecanismo.</li>
          </ul>
        </div>
        <div className="nf-dual-card">
          <h3>Você precisa memorizar</h3>
          <ul>
            <li><b>Etiologia</b> = causas e fatores responsáveis pelo início da doença.</li>
            <li><b>Patogênese</b> = mecanismos que ligam causa às alterações estruturais.</li>
            <li><b>Modificável × não modificável</b>, <b>congênito × genético</b>.</li>
            <li><b>Idiopático</b> = sem causa identificada · <b>iatrogênico</b> = decorrente de conduta médica.</li>
          </ul>
        </div>
      </div>

      <div className="nf-mother-rule">
        <h4>Regra-mãe da nota</h4>
        <ul>
          <li>A <b>etiologia</b> explica <i>por que</i> a doença surgiu.</li>
          <li>A <b>patogênese</b> explica <i>como</i> ela se desenvolveu.</li>
          <li>O <b>fator de risco</b> mostra <i>em quem</i> ela tem mais probabilidade de aparecer.</li>
        </ul>
      </div>
    </article>
  );
}

function TabStub({ tabId }: { tabId: TabId }) {
  const meta: Record<TabId, { eyebrow: string; title: string; text: string }> = {
    start: { eyebrow: '', title: '', text: '' },
    explain: {
      eyebrow: 'Explicação do zero',
      title: 'Construa o raciocínio em seis blocos',
      text: 'Avance um bloco de cada vez. Ao final de cada explicação, use a revisão para ler ou ouvir antes de seguir. Conteúdo autoral será importado do V70.',
    },
    learning: {
      eyebrow: 'Entender × memorizar',
      title: 'O que precisa ficar na sua cabeça',
      text: 'Síntese estruturada por profundidade cognitiva: o que compreender, o que memorizar, o que cai em prova e o que é aprofundamento.',
    },
    clinical: {
      eyebrow: 'Raciocínio clínico para o ciclo básico',
      title: 'Do risco crônico ao infarto: aprenda a pensar o caso inteiro',
      text: 'Chegada do paciente → mecanismo → prioridade terapêutica → prevenção. Área mais extensa e aplicada do módulo. Caso completo estruturado nas 6 seções (traduza, interprete, ligue, confunda, pergunte, evite erros).',
    },
    confusions: {
      eyebrow: 'O que costuma confundir',
      title: 'Trocas de conceito que derrubam em prova',
      text: 'Etiologia × patogênese · Causa × fator de risco · Doença de base × gatilho · Genético × hereditário. Glossário interativo dos termos do tema abaixo.',
    },
    questions: {
      eyebrow: 'Seu próximo passo',
      title: 'Escolha como você quer treinar agora',
      text: 'Duas rotas: fixar o conteúdo (30 questões teóricas) ou resolver casos clínicos (30 casos). Cada questão traz gabarito comentado alternativa por alternativa + 5 pegadinhas + mini revisão.',
    },
    flashcards: {
      eyebrow: 'Recuperação ativa',
      title: '40 flashcards para dominar Etiologia e fatores de risco',
      text: 'Responda antes de virar. Classifique a lembrança em Errei · Difícil · Lembrei · Dominei. A classificação alimenta os indicadores e o mapa segmentado.',
    },
    eve: {
      eyebrow: 'Revisão de véspera',
      title: 'Etiologia e fatores de risco em 90 segundos',
      text: 'Termos essenciais + definições curtas. Sem interações, sem exercícios. Última linha traz a regra de prova.',
    },
    mastery: {
      eyebrow: 'Domínio e fontes',
      title: 'Critérios observáveis + base editorial',
      text: 'Critérios de domínio (verbos de ação), grade 2×2 de fontes bibliográficas + Padrão NeuroFix, faixa de status editorial.',
    },
  };
  const m = meta[tabId];
  return (
    <section className="nf-tab-stub">
      <span className="eyebrow">{m.eyebrow}</span>
      <h2>{m.title}</h2>
      <p>{m.text}</p>
      <p>
        <small style={{ color: 'var(--muted)' }}>
          Conteúdo desta aba será estruturado nas próximas iterações seguindo o design-system.md
          seção {sectionForTab(tabId)}.
        </small>
      </p>
    </section>
  );
}

function sectionForTab(t: TabId): string {
  const map: Record<TabId, string> = {
    start: '7.1',
    explain: '7.2',
    learning: '7.3',
    clinical: '7.4',
    confusions: '7.5',
    questions: '7.6',
    flashcards: '7.7',
    eve: '7.8',
    mastery: '7.9',
  };
  return map[t];
}
