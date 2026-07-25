'use client';

import { useState, useEffect, useMemo, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { recordReview } from '@/app/(app)/flashcards/[materiaSlug]/estudar/actions';

export interface CombiCard {
  id: string;
  pergunta: string;
  resposta: string;
}

interface Props {
  slug: string;
  materia: string;
  cards: CombiCard[];
}

interface Tile {
  key: string;
  cardId: string;
  side: 'frente' | 'verso';
  text: string;
}

const PAIRS_PER_ROUND = 6;

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildTiles(cards: CombiCard[]): Tile[] {
  const tiles: Tile[] = [];
  for (const c of cards) {
    tiles.push({ key: `${c.id}-f`, cardId: c.id, side: 'frente', text: c.pergunta || '—' });
    tiles.push({ key: `${c.id}-v`, cardId: c.id, side: 'verso', text: c.resposta || '—' });
  }
  return shuffle(tiles);
}

function formatTime(ms: number): string {
  const total = Math.floor(ms / 100) / 10;
  return total.toFixed(1) + 's';
}

export default function CombinacaoGame({ slug, materia, cards }: Props) {
  const router = useRouter();
  const roundCards = useMemo(() => shuffle(cards).slice(0, PAIRS_PER_ROUND), [cards]);
  const [tiles, setTiles] = useState<Tile[]>(() => buildTiles(roundCards));
  const [selected, setSelected] = useState<Tile | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<{ a: string; b: string } | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [misses, setMisses] = useState(0);
  const [pending, startTransition] = useTransition();
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalPairs = roundCards.length;
  const matchedPairs = matched.size;
  const done = matchedPairs === totalPairs && totalPairs > 0;

  useEffect(() => {
    if (startedAt == null) return;
    if (done) return;
    tickRef.current = setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 100);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [startedAt, done]);

  useEffect(() => {
    if (done && finishedAt == null) {
      const finishTs = Date.now();
      setFinishedAt(finishTs);
      if (tickRef.current) clearInterval(tickRef.current);
      const hitIds = roundCards.map(c => c.id);
      startTransition(() => {
        Promise.all(hitIds.map(id => recordReview(id, misses === 0))).catch(() => {});
      });
    }
  }, [done, finishedAt, misses, roundCards]);

  function handleTileClick(tile: Tile) {
    if (matched.has(tile.cardId)) return;
    if (wrongFlash) return;
    if (selected?.key === tile.key) { setSelected(null); return; }
    if (!startedAt) setStartedAt(Date.now());
    if (!selected) { setSelected(tile); return; }

    if (selected.cardId === tile.cardId && selected.side !== tile.side) {
      setMatched(prev => new Set(prev).add(tile.cardId));
      setSelected(null);
    } else {
      setMisses(m => m + 1);
      setWrongFlash({ a: selected.key, b: tile.key });
      setTimeout(() => {
        setWrongFlash(null);
        setSelected(null);
      }, 520);
    }
  }

  function reset() {
    setTiles(buildTiles(roundCards));
    setMatched(new Set());
    setSelected(null);
    setWrongFlash(null);
    setStartedAt(null);
    setFinishedAt(null);
    setElapsed(0);
    setMisses(0);
  }

  const cantPlay = totalPairs < 2;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root{--cb-bg:#0A0D14;--cb-blue:#4AB3FF;--cb-green:#4ADE80;--cb-red:#F87171;--cb-gold-light:#E8D08A}
        .cb-shell{max-width:980px;margin:0 auto;color:#F7F7F8;font-family:Inter,system-ui,sans-serif}
        .cb-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
        .cb-back{display:inline-flex;align-items:center;gap:6px;background:transparent;border:none;color:rgba(247,247,248,.66);font-size:13px;font-weight:600;cursor:pointer}
        .cb-back:hover{color:#fff}
        .cb-title{font-size:13px;color:rgba(247,247,248,.7);font-weight:700}
        .cb-title strong{color:var(--cb-blue)}
        .cb-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;padding:14px 20px;border-radius:16px;border:1px solid rgba(74,179,255,0.18);background:radial-gradient(circle at 0% 50%,rgba(74,179,255,0.06),transparent 50%),rgba(15,19,28,0.78)}
        .cb-timer{font-size:22px;font-weight:900;letter-spacing:.02em;color:var(--cb-blue);font-variant-numeric:tabular-nums}
        .cb-pairs{font-size:13px;color:rgba(247,247,248,.7);font-weight:700}
        .cb-pairs strong{color:var(--cb-gold-light);font-size:16px}
        .cb-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
        .cb-tile{padding:18px 14px;min-height:118px;border-radius:14px;border:1.5px solid rgba(255,255,255,0.08);background:rgba(15,19,28,0.78);color:#F7F7F8;font-size:13px;line-height:1.45;text-align:center;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:600;transition:transform .14s ease,border-color .14s ease,background .14s ease,opacity .25s ease;font-family:inherit;letter-spacing:-.01em}
        .cb-tile:hover:not(.matched):not(.wrong){transform:translateY(-2px);border-color:rgba(74,179,255,0.40)}
        .cb-tile.selected{border-color:var(--cb-blue);background:rgba(74,179,255,0.10);box-shadow:0 0 0 3px rgba(74,179,255,0.18)}
        .cb-tile.matched{border-color:rgba(74,222,128,0.4);background:rgba(74,222,128,0.06);color:rgba(74,222,128,0.65);opacity:.55;cursor:default}
        .cb-tile.wrong{border-color:var(--cb-red);background:rgba(248,113,113,0.10);animation:cb-shake .42s ease}
        @keyframes cb-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}}
        .cb-done{margin-top:22px;padding:36px 30px;border-radius:22px;border:1px solid rgba(74,222,128,0.22);background:radial-gradient(circle at 50% 0%,rgba(74,222,128,0.08),transparent 50%),rgba(15,19,28,0.92);text-align:center}
        .cb-done h2{font-size:28px;font-weight:900;margin-bottom:6px}
        .cb-done p{color:rgba(247,247,248,.66);margin-bottom:22px}
        .cb-done-stats{display:flex;justify-content:center;gap:30px;margin-bottom:24px;flex-wrap:wrap}
        .cb-done-stat strong{display:block;font-size:30px;color:var(--cb-blue);font-weight:900}
        .cb-done-stat.miss strong{color:var(--cb-red)}
        .cb-done-stat.good strong{color:var(--cb-green)}
        .cb-done-stat span{display:block;margin-top:6px;font-size:11px;color:rgba(247,247,248,.5);text-transform:uppercase;letter-spacing:.08em;font-weight:700}
        .cb-actions{display:flex;justify-content:center;gap:12px}
        .cb-btn{padding:14px 22px;border-radius:14px;font-size:14px;font-weight:800;cursor:pointer;border:1px solid transparent;font-family:inherit}
        .cb-btn.ghost{background:linear-gradient(135deg,#1F2630,#2A3340);color:#fff;border-color:rgba(255,255,255,0.1)}
        .cb-btn.primary{background:linear-gradient(135deg,#0EA5E9,#22D3EE);color:#031018;border-color:rgba(74,179,255,0.4)}
        .cb-empty{padding:48px 30px;text-align:center;border-radius:20px;border:1px dashed rgba(255,255,255,0.1);background:rgba(15,19,28,0.78);color:rgba(247,247,248,.66)}
        @media(max-width:760px){.cb-grid{grid-template-columns:repeat(2,1fr)}.cb-tile{min-height:108px;font-size:12.5px}}
      `}} />

      <div className="cb-shell">
        <div className="cb-top">
          <button className="cb-back" type="button" onClick={() => router.push(`/flashcards/${slug}`)}>
            ← Voltar para a matéria
          </button>
          <div className="cb-title">
            🧩 Combinação · <strong>{materia}</strong>
          </div>
        </div>

        {cantPlay ? (
          <div className="cb-empty">
            Você precisa de pelo menos 2 flashcards nesta matéria para jogar Combinação.
          </div>
        ) : (
          <>
            <div className="cb-bar">
              <span className="cb-pairs">
                Pares <strong>{matchedPairs}/{totalPairs}</strong> · erros <strong style={{ color: misses > 0 ? '#F87171' : '#E8D08A' }}>{misses}</strong>
              </span>
              <span className="cb-timer">{formatTime(finishedAt != null && startedAt != null ? finishedAt - startedAt : elapsed)}</span>
            </div>

            <div className="cb-grid">
              {tiles.map(tile => {
                const isMatched = matched.has(tile.cardId);
                const isSelected = selected?.key === tile.key;
                const isWrong = wrongFlash && (wrongFlash.a === tile.key || wrongFlash.b === tile.key);
                const cls = `cb-tile${isMatched ? ' matched' : ''}${isSelected ? ' selected' : ''}${isWrong ? ' wrong' : ''}`;
                return (
                  <button
                    key={tile.key}
                    type="button"
                    className={cls}
                    onClick={() => handleTileClick(tile)}
                    disabled={isMatched}
                  >
                    {tile.text}
                  </button>
                );
              })}
            </div>

            {done && (
              <div className="cb-done">
                <h2>Mandou bem!</h2>
                <p>Você combinou todos os {totalPairs} pares.</p>
                <div className="cb-done-stats">
                  <div className="cb-done-stat good">
                    <strong>{formatTime((finishedAt ?? 0) - (startedAt ?? 0))}</strong>
                    <span>Tempo total</span>
                  </div>
                  <div className="cb-done-stat">
                    <strong>{totalPairs}</strong>
                    <span>Pares</span>
                  </div>
                  <div className="cb-done-stat miss">
                    <strong>{misses}</strong>
                    <span>Erros</span>
                  </div>
                </div>
                <div className="cb-actions">
                  <button className="cb-btn ghost" type="button" onClick={() => router.push(`/flashcards/${slug}`)} disabled={pending}>
                    Voltar
                  </button>
                  <button className="cb-btn primary" type="button" onClick={reset} disabled={pending}>
                    Jogar de novo
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
