'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { advanceCycleStage, resetCycleStage } from '@/app/(app)/notes/[slug]/actions';
import { CYCLE_STAGES, type CycleStage, type NoteCycleState } from '@/lib/note-cycle-shared';

type Props = { noteSlug: string; cycle: NoteCycleState | null };

// Mapa: 6 estágios internos → 3 fases visíveis (padrão NeuroFix).
type PhaseId = 'aprenda' | 'teste' | 'revise';

const PHASES: Array<{
  id: PhaseId;
  n: 1 | 2 | 3;
  title: string;
  hint: string;
  stages: CycleStage[];
}> = [
  { id: 'aprenda', n: 1, title: 'Aprenda', hint: 'entenda o mecanismo', stages: ['understand', 'retrieve'] },
  { id: 'teste', n: 2, title: 'Teste sem olhar', hint: 'lembre, aplique e corrija', stages: ['apply', 'correct'] },
  { id: 'revise', n: 3, title: 'Revise até dominar', hint: 'retorne e confirme', stages: ['review', 'prove'] },
];

const STAGE_PANEL: Record<
  CycleStage,
  { eyebrow: string; desc: string; primaryLabel: string; suggestTab: string; secondaryLabel?: string; secondaryTab?: string }
> = {
  understand: {
    eyebrow: 'APRENDA · CONSTRUA A BASE',
    desc: 'Leia ou ouça a explicação. Nesta etapa, o objetivo é compreender o mecanismo, não decorar frases.',
    primaryLabel: 'Abrir explicação',
    suggestTab: 'explain',
    secondaryLabel: 'Ouvir explicação',
    secondaryTab: 'explain',
  },
  retrieve: {
    eyebrow: 'APRENDA · RECUPERE SEM CONSULTAR',
    desc: 'Reconstrua o raciocínio sem olhar o material. Só ganha memória quem testa a memória.',
    primaryLabel: 'Abrir aba de recuperação',
    suggestTab: 'learning',
  },
  apply: {
    eyebrow: 'TESTE SEM OLHAR · APLIQUE',
    desc: 'Responda as questões e veja onde o conhecimento fica em pé.',
    primaryLabel: 'Abrir questões',
    suggestTab: 'questions',
  },
  correct: {
    eyebrow: 'TESTE SEM OLHAR · CORRIJA',
    desc: 'Revise as pegadinhas e o que confunde. Erros são o mapa da próxima etapa.',
    primaryLabel: 'Abrir "O que confunde"',
    suggestTab: 'confusions',
  },
  review: {
    eyebrow: 'REVISE ATÉ DOMINAR · REVISE',
    desc: 'Passe pelos flashcards para consolidar a recuperação ativa.',
    primaryLabel: 'Abrir flashcards',
    suggestTab: 'flashcards',
  },
  prove: {
    eyebrow: 'REVISE ATÉ DOMINAR · PROVE',
    desc: 'Feche a nota com a véspera compacta.',
    primaryLabel: 'Abrir véspera',
    suggestTab: 'eve',
  },
  mastered: {
    eyebrow: 'NOTA CONCLUÍDA',
    desc: 'Você percorreu as três fases do método NeuroFix. Volte quando quiser para revisar.',
    primaryLabel: 'Abrir domínio e fontes',
    suggestTab: 'mastery',
  },
};

function currentStageAdvanceLabel(stage: CycleStage): string {
  switch (stage) {
    case 'understand': return 'Concluí e consigo resumir';
    case 'retrieve': return 'Concluí sem consultar';
    case 'apply': return 'Concluí a bateria';
    case 'correct': return 'Concluí as correções';
    case 'review': return 'Concluí a revisão';
    case 'prove': return 'Concluí a nota';
    case 'mastered': return 'Nota concluída';
  }
}

export default function NoteCycle({ noteSlug, cycle }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const currentStage: CycleStage = cycle?.stage ?? 'understand';
  const completed = new Set(cycle?.stages_completed ?? []);
  const isMastered = currentStage === 'mastered';

  const currentPhase =
    PHASES.find((p) => (p.stages as CycleStage[]).includes(currentStage)) ?? PHASES[0];

  function isPhaseCompleted(phase: (typeof PHASES)[number]): boolean {
    if (isMastered) return true;
    return phase.stages.every((s) => completed.has(s));
  }

  const phasesDone = PHASES.filter(isPhaseCompleted).length;

  const panel = STAGE_PANEL[currentStage];

  function speakExplanation() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Seu navegador não suporta leitura em voz.');
      return;
    }
    const el = document.querySelector<HTMLElement>('.note-content');
    const text = el?.textContent?.trim();
    if (!text) {
      // Não está na aba certa: navega e o usuário usa o botão do header.
      router.push(`/notes/${noteSlug}/${panel.secondaryTab ?? panel.suggestTab}`);
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    synth.speak(utter);
  }

  return (
    <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
      {/* Card preto: MÉTODO NEUROFIX EM 3 FASES */}
      <section
        style={{
          background: 'linear-gradient(135deg,#11151c,#172235)',
          color: '#fff',
          borderRadius: 20,
          padding: '22px 26px',
          display: 'grid',
          gap: 18,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                color: '#e8cf8b',
                letterSpacing: '.14em',
                fontWeight: 900,
                fontSize: 10,
              }}
            >
              MÉTODO NEUROFIX EM 3 FASES
            </div>
            <h2 style={{ font: '500 26px Georgia,serif', margin: '4px 0 4px', color: '#fff' }}>
              Aprenda. Teste sem olhar. Revise até dominar.
            </h2>
            <p style={{ color: '#c7d0dc', margin: 0, fontSize: 14, lineHeight: 1.5 }}>
              A plataforma conduz automaticamente os passos menores dentro de cada fase.
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1 }}>{phasesDone}/3</div>
            <div style={{ fontSize: 11, color: '#c7d0dc', marginTop: 2 }}>fases concluídas</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {PHASES.map((p) => {
            const active = p.id === currentPhase.id && !isMastered;
            const done = isPhaseCompleted(p);
            return (
              <div
                key={p.id}
                style={{
                  borderRadius: 14,
                  padding: '14px 14px 12px',
                  textAlign: 'center',
                  background: active
                    ? '#0A0A0A'
                    : done
                      ? 'rgba(201,162,78,.14)'
                      : 'rgba(255,255,255,.04)',
                  border: active
                    ? '1px solid #C9A24E'
                    : done
                      ? '1px solid rgba(201,162,78,.35)'
                      : '1px solid rgba(255,255,255,.08)',
                  color: active ? '#fff' : done ? '#e8cf8b' : '#8a94a3',
                  transition: '.15s',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 6px',
                    background: active ? '#C9A24E' : done ? '#C9A24E' : 'rgba(255,255,255,.08)',
                    color: active || done ? '#0A0A0A' : '#8a94a3',
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  {p.n}
                </div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{p.title}</div>
                <div style={{ fontSize: 11, marginTop: 2, opacity: 0.85 }}>{p.hint}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Painel branco: contexto da etapa atual */}
      <section
        style={{
          background: '#fff',
          border: '1px solid #E8E4DB',
          borderRadius: 16,
          padding: '18px 22px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                color: '#8a6020',
                fontSize: 10,
                letterSpacing: '.14em',
                fontWeight: 900,
              }}
            >
              {panel.eyebrow}
            </div>
            <p style={{ margin: '4px 0 0', color: '#333', lineHeight: 1.5, fontSize: 14, maxWidth: 720 }}>
              {panel.desc}
            </p>
          </div>
          {cycle && !isMastered && (
            <button
              type="button"
              onClick={() => start(() => resetCycleStage(noteSlug))}
              disabled={pending}
              style={{
                background: 'transparent',
                border: '1px solid #e5c9c7',
                color: '#b94a48',
                padding: '6px 10px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                cursor: pending ? 'wait' : 'pointer',
              }}
            >
              Reiniciar ciclo
            </button>
          )}
        </div>

        <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button
            type="button"
            onClick={() => router.push(`/notes/${noteSlug}/${panel.suggestTab}`)}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid #e5e0d7',
              background: '#fff',
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {panel.primaryLabel}
          </button>

          {panel.secondaryLabel && (
            <button
              type="button"
              onClick={speakExplanation}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid #e5e0d7',
                background: '#fff',
                fontWeight: 800,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              {panel.secondaryLabel}
            </button>
          )}

          {!isMastered && (
            <button
              type="button"
              onClick={() =>
                start(async () => {
                  const { stage } = await advanceCycleStage(noteSlug, currentStage);
                  const nextInfo = CYCLE_STAGES.find((s) => s.id === stage);
                  if (nextInfo) router.push(`/notes/${noteSlug}/${nextInfo.suggestTab}`);
                })
              }
              disabled={pending}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                border: 'none',
                background: '#0A0A0A',
                color: '#fff',
                fontWeight: 800,
                fontSize: 13,
                cursor: pending ? 'wait' : 'pointer',
              }}
            >
              {pending ? 'Salvando…' : currentStageAdvanceLabel(currentStage)}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
