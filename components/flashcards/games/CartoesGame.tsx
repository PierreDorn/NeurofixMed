'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { recordReview } from '@/app/(app)/flashcards/[materiaSlug]/estudar/actions';

export interface CartoesCard {
  id: string;
  pergunta: string;
  resposta: string;
}

interface Props {
  slug: string;
  materia: string;
  cards: CartoesCard[];
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function CartoesGame({ slug, materia, cards }: Props) {
  const router = useRouter();
  const initial = useMemo(() => shuffle(cards), [cards]);
  const [order] = useState<CartoesCard[]>(initial);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ hits: 0, misses: 0 });
  const [pending, startTransition] = useTransition();

  const current = order[idx];
  const total = order.length;
  const done = idx >= total;
  const progress = total > 0 ? Math.round(((idx) / total) * 100) : 0;

  function next(hit: boolean) {
    if (!current) return;
    const id = current.id;
    startTransition(() => {
      recordReview(id, hit).catch(() => {});
    });
    setStats(s => hit ? { ...s, hits: s.hits + 1 } : { ...s, misses: s.misses + 1 });
    setFlipped(false);
    setIdx(i => i + 1);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root{--cg-gold:#C9A84C;--cg-gold-light:#E8D08A;--cg-blue:#4AB3FF;--cg-green:#4ADE80;--cg-red:#F87171}
        .cg-shell{max-width:760px;margin:0 auto;color:#F7F7F8;font-family:Inter,system-ui,sans-serif}
        .cg-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
        .cg-back{display:inline-flex;align-items:center;gap:6px;background:transparent;border:none;color:rgba(247,247,248,.66);font-size:13px;font-weight:600;cursor:pointer}
        .cg-back:hover{color:#fff}
        .cg-title{font-size:13px;color:rgba(247,247,248,.7);font-weight:700;display:flex;align-items:center;gap:8px}
        .cg-title strong{color:var(--cg-gold-light)}
        .cg-progress{height:6px;border-radius:999px;background:rgba(255,255,255,0.06);overflow:hidden;margin-bottom:24px}
        .cg-progress-fill{height:100%;background:linear-gradient(90deg,var(--cg-gold),var(--cg-gold-light));transition:width .3s ease}
        .cg-card-wrap{perspective:1600px;margin-bottom:24px}
        .cg-card{position:relative;width:100%;min-height:340px;transform-style:preserve-3d;transition:transform .55s cubic-bezier(.4,.0,.2,1);cursor:pointer}
        .cg-card.flipped{transform:rotateY(180deg)}
        .cg-face{position:absolute;inset:0;backface-visibility:hidden;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:36px 32px;border-radius:24px;border:1px solid rgba(201,168,76,0.18);background:radial-gradient(circle at 50% 0%,rgba(201,168,76,0.08),transparent 50%),rgba(15,19,28,0.9);box-shadow:0 30px 60px rgba(0,0,0,.45)}
        .cg-face.back{transform:rotateY(180deg);border-color:rgba(74,179,255,0.20);background:radial-gradient(circle at 50% 0%,rgba(74,179,255,0.08),transparent 50%),rgba(15,19,28,0.9)}
        .cg-face-label{font-size:11px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:rgba(247,247,248,.5);margin-bottom:18px}
        .cg-face-label.back{color:var(--cg-blue)}
        .cg-face-content{font-size:22px;line-height:1.45;font-weight:700;text-align:center;max-width:580px;letter-spacing:-.01em}
        .cg-face-tip{margin-top:24px;font-size:12px;color:rgba(247,247,248,.45)}
        .cg-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .cg-actions.single{grid-template-columns:1fr}
        .cg-btn{padding:18px 22px;border-radius:16px;font-size:15px;font-weight:800;letter-spacing:.02em;cursor:pointer;border:1px solid transparent;font-family:inherit;transition:transform .15s ease,box-shadow .15s ease,background .15s ease}
        .cg-btn:hover{transform:translateY(-2px)}
        .cg-btn:disabled{cursor:not-allowed;opacity:.6;transform:none}
        .cg-btn.flip{background:linear-gradient(135deg,#1F2630,#2A3340);color:#fff;border-color:rgba(255,255,255,0.1)}
        .cg-btn.flip:hover{background:linear-gradient(135deg,#252D38,#323C4A)}
        .cg-btn.miss{background:linear-gradient(135deg,#7F1D1D,#B91C1C);color:#fff;border-color:rgba(248,113,113,0.35)}
        .cg-btn.hit{background:linear-gradient(135deg,#15803D,#22C55E);color:#fff;border-color:rgba(74,222,128,0.4)}
        .cg-done{padding:48px 36px;border-radius:24px;border:1px solid rgba(201,168,76,0.18);background:radial-gradient(circle at 50% 0%,rgba(201,168,76,0.10),transparent 50%),rgba(15,19,28,0.9);text-align:center}
        .cg-done h2{font-size:30px;font-weight:900;margin-bottom:8px}
        .cg-done p{color:rgba(247,247,248,.66);margin-bottom:24px}
        .cg-done-stats{display:flex;justify-content:center;gap:32px;margin-bottom:32px}
        .cg-done-stat strong{display:block;font-size:32px;color:var(--cg-gold-light);font-weight:900}
        .cg-done-stat.hit strong{color:var(--cg-green)}
        .cg-done-stat.miss strong{color:var(--cg-red)}
        .cg-done-stat span{display:block;margin-top:6px;font-size:11px;color:rgba(247,247,248,.5);text-transform:uppercase;letter-spacing:.08em;font-weight:700}
        .cg-done-actions{display:flex;justify-content:center;gap:12px}
      `}} />

      <div className="cg-shell">
        <div className="cg-top">
          <button className="cg-back" type="button" onClick={() => router.push(`/flashcards/${slug}`)}>
            ← Voltar para a matéria
          </button>
          <div className="cg-title">
            🃏 Cartões · <strong>{materia}</strong>
          </div>
        </div>

        {!done && (
          <>
            <div className="cg-progress">
              <div className="cg-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="cg-card-wrap">
              <div className={`cg-card${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
                <div className="cg-face">
                  <span className="cg-face-label">Frente · {idx + 1} de {total}</span>
                  <div className="cg-face-content">{current?.pergunta || '—'}</div>
                  <span className="cg-face-tip">Clique no card para ver o verso</span>
                </div>
                <div className="cg-face back">
                  <span className="cg-face-label back">Verso · {idx + 1} de {total}</span>
                  <div className="cg-face-content">{current?.resposta || '—'}</div>
                  <span className="cg-face-tip">Clique para voltar</span>
                </div>
              </div>
            </div>

            <div className={`cg-actions${flipped ? '' : ' single'}`}>
              {!flipped ? (
                <button className="cg-btn flip" type="button" onClick={() => setFlipped(true)}>
                  Mostrar resposta
                </button>
              ) : (
                <>
                  <button className="cg-btn miss" type="button" disabled={pending} onClick={() => next(false)}>
                    Errei
                  </button>
                  <button className="cg-btn hit" type="button" disabled={pending} onClick={() => next(true)}>
                    Acertei
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {done && (
          <div className="cg-done">
            <h2>Sessão finalizada!</h2>
            <p>Você passou por todos os {total} {total === 1 ? 'card' : 'cards'} desta matéria.</p>
            <div className="cg-done-stats">
              <div className="cg-done-stat hit">
                <strong>{stats.hits}</strong>
                <span>Acertos</span>
              </div>
              <div className="cg-done-stat miss">
                <strong>{stats.misses}</strong>
                <span>Erros</span>
              </div>
              <div className="cg-done-stat">
                <strong>{total > 0 ? Math.round((stats.hits / total) * 100) : 0}%</strong>
                <span>Aproveitamento</span>
              </div>
            </div>
            <div className="cg-done-actions">
              <button className="cg-btn flip" type="button" onClick={() => router.push(`/flashcards/${slug}`)}>
                Voltar à matéria
              </button>
              <button className="cg-btn hit" type="button" onClick={() => { setIdx(0); setStats({ hits: 0, misses: 0 }); }}>
                Reiniciar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
