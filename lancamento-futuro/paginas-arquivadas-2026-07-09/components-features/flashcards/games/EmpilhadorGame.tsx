'use client';

import { useState, useEffect, useMemo, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { recordReview } from '@/app/(app)/flashcards/[materiaSlug]/estudar/actions';

export interface EmpiCard {
  id: string;
  pergunta: string;
  resposta: string;
}

interface Props {
  slug: string;
  materia: string;
  cards: EmpiCard[];
}

interface Question {
  card: EmpiCard;
  options: string[];
  correctIndex: number;
}

interface StackedBlock {
  width: number;
}

const TICK_MS = 50;
const SECONDS_TO_FALL = 7;
const PURPLE_MAX = 100;
const PURPLE_STEP = (PURPLE_MAX / (SECONDS_TO_FALL * 1000 / TICK_MS));
const MIN_BLOCK_WIDTH = 30;
const MAX_BLOCK_WIDTH = 90;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildQuestions(cards: EmpiCard[]): Question[] {
  const respostas = cards.map(c => (c.resposta ?? '').trim()).filter(Boolean);
  return shuffle(cards).map(card => {
    const correct = (card.resposta ?? '').trim() || '—';
    const distractorPool = respostas.filter(r => r !== correct);
    const distractors = shuffle(distractorPool).slice(0, 3);
    while (distractors.length < 3) distractors.push('—');
    const options = shuffle([correct, ...distractors]);
    return { card, options, correctIndex: options.indexOf(correct) };
  });
}

export default function EmpilhadorGame({ slug, materia, cards }: Props) {
  const router = useRouter();
  const questions = useMemo(() => buildQuestions(cards), [cards]);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [purpleY, setPurpleY] = useState(0);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'playing' | 'lost' | 'won'>('intro');
  const [stack, setStack] = useState<StackedBlock[]>([]);
  const [score, setScore] = useState(0);
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionResolved = useRef<Set<string>>(new Set());

  const total = questions.length;
  const current = questions[questionIdx] ?? null;
  const insufficient = cards.length < 4;

  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      setPurpleY(prev => {
        const next = prev + PURPLE_STEP;
        if (next >= PURPLE_MAX) {
          setRunning(false);
          setPhase('lost');
          return PURPLE_MAX;
        }
        return next;
      });
    }, TICK_MS);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [running]);

  function handleStart() {
    setStack([]);
    setScore(0);
    setQuestionIdx(0);
    setPurpleY(0);
    setPickedIdx(null);
    setPhase('playing');
    setRunning(true);
    sessionResolved.current = new Set();
  }

  function reportReview(cardId: string, hit: boolean) {
    if (sessionResolved.current.has(cardId)) return;
    sessionResolved.current.add(cardId);
    startTransition(() => { recordReview(cardId, hit).catch(() => {}); });
  }

  function handlePick(optionIdx: number) {
    if (!running || !current) return;
    setPickedIdx(optionIdx);
    setRunning(false);
    const correct = optionIdx === current.correctIndex;
    if (correct) {
      const freshness = 1 - purpleY / PURPLE_MAX;
      const width = MIN_BLOCK_WIDTH + (MAX_BLOCK_WIDTH - MIN_BLOCK_WIDTH) * freshness;
      const blockWidth = Math.max(MIN_BLOCK_WIDTH, Math.round(width));
      setStack(prev => [{ width: blockWidth }, ...prev]);
      setScore(s => s + Math.max(1, Math.round(freshness * 10)));
      reportReview(current.card.id, true);
      setTimeout(() => {
        if (questionIdx + 1 >= total) {
          setPhase('won');
          setRunning(false);
          setPickedIdx(null);
        } else {
          setQuestionIdx(i => i + 1);
          setPurpleY(0);
          setPickedIdx(null);
          setRunning(true);
        }
      }, 450);
    } else {
      reportReview(current.card.id, false);
      setTimeout(() => {
        setPhase('lost');
      }, 450);
    }
  }

  function backToHub() {
    router.push(`/flashcards/${slug}`);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root{--em-bg:#0A0D14;--em-purple:#A78BFA;--em-purple-deep:#7C3AED;--em-blue:#4AB3FF;--em-blue-deep:#2563EB;--em-green:#4ADE80;--em-red:#F87171;--em-gold-light:#E8D08A;--em-card:#0F131C}
        .em-shell{max-width:1080px;margin:0 auto;color:#F7F7F8;font-family:Inter,system-ui,sans-serif}
        .em-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
        .em-back{display:inline-flex;align-items:center;gap:6px;background:transparent;border:none;color:rgba(247,247,248,.66);font-size:13px;font-weight:600;cursor:pointer}
        .em-back:hover{color:#fff}
        .em-title{font-size:13px;color:rgba(247,247,248,.7);font-weight:700}
        .em-title strong{color:var(--em-purple)}
        .em-hud{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;padding:12px 18px;border-radius:14px;border:1px solid rgba(167,139,250,0.20);background:radial-gradient(circle at 100% 50%,rgba(167,139,250,0.06),transparent 50%),rgba(15,19,28,0.78)}
        .em-hud-stats{display:flex;gap:22px;font-size:12px;color:rgba(247,247,248,.7);font-weight:700;letter-spacing:.04em;text-transform:uppercase}
        .em-hud-stats strong{display:block;font-size:18px;color:var(--em-purple);margin-top:2px;letter-spacing:0}
        .em-hud-stats .gold strong{color:var(--em-gold-light)}
        .em-hud-stats .blue strong{color:var(--em-blue)}
        .em-stage{display:grid;grid-template-columns:280px 1fr;gap:24px;min-height:520px}
        .em-rail{position:relative;height:520px;border-radius:18px;border:1px solid rgba(255,255,255,0.08);background:linear-gradient(180deg,rgba(15,19,28,0.5),rgba(5,7,11,0.65));padding:14px;overflow:hidden}
        .em-rail-line{position:absolute;left:14px;right:14px;height:1px;border-bottom:1px dashed rgba(255,255,255,0.10);}
        .em-rail-suspension{position:absolute;left:0;right:0;top:62%;height:1px;border-bottom:1px dashed rgba(248,113,113,0.4);}
        .em-rail-suspension::after{content:'limite';position:absolute;right:14px;top:-16px;font-size:10px;color:rgba(248,113,113,0.75);font-weight:800;letter-spacing:.1em;text-transform:uppercase}
        .em-purple{position:absolute;left:50%;transform:translateX(-50%);width:60%;height:32px;border-radius:14px;background:linear-gradient(180deg,var(--em-purple-deep),var(--em-purple));box-shadow:0 14px 28px rgba(124,58,237,0.32);transition:top .12s linear,opacity .25s ease}
        .em-stack{position:absolute;left:14px;right:14px;bottom:14px;display:flex;flex-direction:column-reverse;align-items:center;gap:4px;pointer-events:none}
        .em-block{height:24px;border-radius:8px;background:linear-gradient(180deg,#1D4ED8,var(--em-blue));border:1px solid rgba(74,179,255,0.5);box-shadow:0 4px 14px rgba(37,99,235,0.30);animation:em-pop .35s cubic-bezier(.34,1.56,.64,1)}
        .em-block.last{background:linear-gradient(180deg,#0EA5E9,#22D3EE);border-color:rgba(34,211,238,0.6)}
        @keyframes em-pop{from{transform:translateY(-16px) scale(.6);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
        .em-rail-floor{position:absolute;left:14px;right:14px;bottom:8px;height:4px;border-radius:2px;background:linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.16),rgba(255,255,255,0.08))}

        .em-game{display:flex;flex-direction:column;gap:18px}
        .em-question{padding:24px 26px;border-radius:18px;border:1px solid rgba(167,139,250,0.20);background:rgba(15,19,28,0.82);min-height:160px;display:flex;flex-direction:column;justify-content:center}
        .em-question-label{font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--em-purple);margin-bottom:10px}
        .em-question-text{font-size:20px;line-height:1.5;font-weight:700;letter-spacing:-.01em;color:#F7F7F8}
        .em-options{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .em-option{padding:18px 18px;border-radius:14px;border:1.5px solid rgba(255,255,255,0.08);background:rgba(15,19,28,0.78);color:#F7F7F8;font-size:14px;line-height:1.45;font-weight:600;text-align:left;cursor:pointer;font-family:inherit;transition:border-color .14s ease,transform .14s ease,background .14s ease;min-height:84px;display:flex;align-items:center;gap:12px}
        .em-option:hover:not(:disabled){border-color:rgba(167,139,250,0.4);transform:translateY(-2px)}
        .em-option:disabled{cursor:not-allowed}
        .em-option.correct{border-color:var(--em-green);background:rgba(74,222,128,0.10);color:#A7F3D0}
        .em-option.wrong{border-color:var(--em-red);background:rgba(248,113,113,0.12);color:#FECACA}
        .em-option-letter{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;font-size:13px;font-weight:900;background:rgba(255,255,255,0.06);color:var(--em-gold-light);flex-shrink:0}
        .em-option.correct .em-option-letter{background:rgba(74,222,128,0.2);color:var(--em-green)}
        .em-option.wrong .em-option-letter{background:rgba(248,113,113,0.2);color:var(--em-red)}

        .em-overlay{padding:40px 30px;border-radius:20px;border:1px solid rgba(167,139,250,0.22);background:radial-gradient(circle at 50% 0%,rgba(167,139,250,0.10),transparent 50%),rgba(15,19,28,0.94);text-align:center}
        .em-overlay h2{font-size:28px;font-weight:900;margin-bottom:6px}
        .em-overlay p{color:rgba(247,247,248,.66);margin-bottom:22px;line-height:1.6}
        .em-overlay .em-instructions{text-align:left;max-width:520px;margin:0 auto 26px;padding:16px 20px;border-radius:14px;background:rgba(5,7,11,0.45);border:1px solid rgba(255,255,255,0.06);color:rgba(247,247,248,.74);font-size:13.5px;line-height:1.7}
        .em-overlay .em-instructions li{margin-bottom:6px}
        .em-overlay .em-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
        .em-btn{padding:14px 24px;border-radius:14px;font-size:14px;font-weight:800;cursor:pointer;border:1px solid transparent;font-family:inherit}
        .em-btn.ghost{background:linear-gradient(135deg,#1F2630,#2A3340);color:#fff;border-color:rgba(255,255,255,0.1)}
        .em-btn.primary{background:linear-gradient(135deg,var(--em-purple-deep),var(--em-purple));color:#0B0420;border-color:rgba(167,139,250,0.4)}
        .em-overlay.lost{border-color:rgba(248,113,113,0.30);background:radial-gradient(circle at 50% 0%,rgba(248,113,113,0.08),transparent 50%),rgba(15,19,28,0.94)}
        .em-overlay.won{border-color:rgba(74,222,128,0.30);background:radial-gradient(circle at 50% 0%,rgba(74,222,128,0.08),transparent 50%),rgba(15,19,28,0.94)}

        @media(max-width:880px){.em-stage{grid-template-columns:1fr}.em-rail{height:300px;order:2}.em-stack{flex-direction:row;left:14px;right:14px;bottom:14px;align-items:flex-end;justify-content:center;gap:3px}.em-block{width:30px!important;height:auto;min-height:18px}.em-options{grid-template-columns:1fr}}

        /* Tema Claro */
        .tema-claro .em-shell{color:#111827}
        .tema-claro .em-back{color:rgba(17,24,39,.60)}
        .tema-claro .em-back:hover{color:#111827}
        .tema-claro .em-title{color:rgba(17,24,39,.66)}
        .tema-claro .em-hud{background:rgba(248,250,252,0.95);border-color:rgba(167,139,250,0.18)}
        .tema-claro .em-hud-stats{color:rgba(17,24,39,.66)}
        .tema-claro .em-rail{background:linear-gradient(180deg,rgba(241,245,249,0.9),rgba(248,250,252,0.95));border-color:rgba(0,0,0,0.10)}
        .tema-claro .em-question{background:rgba(255,255,255,0.92);border-color:rgba(167,139,250,0.18)}
        .tema-claro .em-question-text{color:#111827}
        .tema-claro .em-option{background:rgba(255,255,255,0.88);border-color:rgba(0,0,0,0.10);color:#111827}
        .tema-claro .em-option:hover:not(:disabled){border-color:rgba(167,139,250,0.40)}
        .tema-claro .em-option-letter{background:rgba(0,0,0,0.05)}
        .tema-claro .em-overlay{background:rgba(255,255,255,0.95);border-color:rgba(167,139,250,0.20)}
        .tema-claro .em-overlay p{color:rgba(17,24,39,.62)}
        .tema-claro .em-overlay .em-instructions{background:rgba(0,0,0,0.04);border-color:rgba(0,0,0,0.08);color:rgba(17,24,39,.72)}
        .tema-claro .em-btn.ghost{background:linear-gradient(135deg,#e2e8f0,#f1f5f9);color:#374151;border-color:rgba(0,0,0,0.12)}
      `}} />

      <div className="em-shell">
        <div className="em-top">
          <button className="em-back" type="button" onClick={backToHub}>← Voltar para a matéria</button>
          <div className="em-title">🗼 Empilhador · <strong>{materia}</strong></div>
        </div>

        {insufficient ? (
          <div className="em-overlay">
            <h2>Cards insuficientes</h2>
            <p>Você precisa de pelo menos 4 flashcards nesta matéria para jogar Empilhador (ele precisa de 1 resposta correta + 3 distratoras por rodada).</p>
            <div className="em-actions">
              <button className="em-btn ghost" type="button" onClick={backToHub}>Voltar</button>
            </div>
          </div>
        ) : phase === 'intro' ? (
          <div className="em-overlay">
            <h2>Empilhador</h2>
            <p>Responda rápido para empilhar blocos e construir a maior torre que você conseguir.</p>
            <ul className="em-instructions">
              <li>🟪 O bloco roxo desce sozinho. Se passar do limite vermelho, você perde.</li>
              <li>✅ Acertou rápido? O bloco azul empilhado é maior.</li>
              <li>🐢 Acertou no fim do tempo? O bloco empilha menor.</li>
              <li>❌ Errou a resposta? Fim de jogo.</li>
            </ul>
            <div className="em-actions">
              <button className="em-btn primary" type="button" onClick={handleStart}>Começar →</button>
            </div>
          </div>
        ) : phase === 'lost' ? (
          <div className="em-overlay lost">
            <h2>Que pena!</h2>
            <p>{pickedIdx != null ? 'Você errou a resposta.' : 'O bloco roxo passou do limite.'} Mas sua torre tem <strong>{stack.length}</strong> {stack.length === 1 ? 'bloco' : 'blocos'} — bom resultado!</p>
            <div className="em-actions">
              <button className="em-btn ghost" type="button" onClick={backToHub}>Voltar à matéria</button>
              <button className="em-btn primary" type="button" onClick={handleStart}>Tentar de novo</button>
            </div>
          </div>
        ) : phase === 'won' ? (
          <div className="em-overlay won">
            <h2>Torre completa!</h2>
            <p>Você respondeu todas as {total} {total === 1 ? 'pergunta' : 'perguntas'} desta matéria. Pontuação <strong>{score}</strong>.</p>
            <div className="em-actions">
              <button className="em-btn ghost" type="button" onClick={backToHub}>Voltar à matéria</button>
              <button className="em-btn primary" type="button" onClick={handleStart}>Jogar de novo</button>
            </div>
          </div>
        ) : (
          <>
            <div className="em-hud">
              <div className="em-hud-stats">
                <div className="gold">Pontos<strong>{score}</strong></div>
                <div className="blue">Torre<strong>{stack.length}</strong></div>
                <div>Restantes<strong>{Math.max(0, total - questionIdx - 1)}</strong></div>
              </div>
              <div className="em-hud-stats">
                <div>Pergunta<strong>{questionIdx + 1}/{total}</strong></div>
              </div>
            </div>

            <div className="em-stage">
              <div className="em-rail">
                <div className="em-rail-line" style={{ top: '15%' }} />
                <div className="em-rail-line" style={{ top: '25%' }} />
                <div className="em-rail-line" style={{ top: '35%' }} />
                <div className="em-rail-line" style={{ top: '45%' }} />
                <div className="em-rail-line" style={{ top: '55%' }} />
                <div className="em-rail-suspension" />
                <div
                  className="em-purple"
                  style={{
                    top: `calc(14px + ${(purpleY / 100) * 0.55 * 100}% )`,
                    opacity: phase === 'playing' ? 1 : 0.6,
                  }}
                />
                <div className="em-stack">
                  {stack.map((b, i) => (
                    <div
                      key={`${stack.length}-${i}`}
                      className={`em-block${i === 0 ? ' last' : ''}`}
                      style={{ width: `${b.width}%` }}
                    />
                  ))}
                </div>
                <div className="em-rail-floor" />
              </div>

              <div className="em-game">
                <div className="em-question">
                  <div className="em-question-label">Pergunta · empilhe acertando</div>
                  <div className="em-question-text">{current?.card.pergunta || '—'}</div>
                </div>

                <div className="em-options">
                  {current?.options.map((opt, i) => {
                    const showCorrect = pickedIdx != null && i === current.correctIndex;
                    const showWrong = pickedIdx === i && i !== current.correctIndex;
                    const cls = `em-option${showCorrect ? ' correct' : ''}${showWrong ? ' wrong' : ''}`;
                    return (
                      <button
                        key={i}
                        type="button"
                        className={cls}
                        disabled={!running || pickedIdx != null}
                        onClick={() => handlePick(i)}
                      >
                        <span className="em-option-letter">{String.fromCharCode(65 + i)}</span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
