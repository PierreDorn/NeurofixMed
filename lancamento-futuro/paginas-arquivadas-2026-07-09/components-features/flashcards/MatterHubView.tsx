'use client';

import { useRouter } from 'next/navigation';
import { getMatterAccent, getMatterIconSvg, type FlashcardRow, type MatterStats } from '@/lib/flashcards-utils';

interface Detail {
  matter: string;
  ciclo: string;
  slug: string;
  flashcards: FlashcardRow[];
  stats: MatterStats;
}

interface Props {
  detail: Detail;
}

interface ModeCard {
  id: 'cartoes' | 'combinacao' | 'empilhador';
  icon: string;
  title: string;
  desc: string;
  minCards: number;
  accent: string;
}

const MODES: ModeCard[] = [
  { id: 'cartoes', icon: '🃏', title: 'Cartões', desc: 'Frente e verso clássico. Vire, avalie e siga.', minCards: 1, accent: 'gold' },
  { id: 'combinacao', icon: '🧩', title: 'Combinação', desc: 'Combine pares de termos e definições contra o tempo.', minCards: 3, accent: 'blue' },
  { id: 'empilhador', icon: '🗼', title: 'Empilhador', desc: 'Acerte rápido para empilhar blocos e construir sua torre.', minCards: 4, accent: 'violet' },
];

export default function MatterHubView({ detail }: Props) {
  const router = useRouter();
  const accent = getMatterAccent(detail.matter);
  const iconSvg = getMatterIconSvg(detail.matter);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root{
          --mh-gold:#C9A84C; --mh-gold-light:#E8D08A; --mh-blue:#4AB3FF; --mh-violet:#A78BFA; --mh-green:#4ADE80;
          --mh-bg:#0A0D14; --mh-card:#0F131C; --mh-border:rgba(255,255,255,0.08);
        }
        .mh-back{display:inline-flex;align-items:center;gap:7px;color:rgba(247,247,248,.66);font-size:13px;font-weight:600;background:transparent;border:none;padding:0;margin-bottom:18px;cursor:pointer;transition:color .15s}
        .mh-back:hover{color:#fff}
        .mh-hero{display:grid;grid-template-columns:1fr 1fr;gap:24px;padding:30px;border-radius:24px;border:1px solid var(--mh-border);background:radial-gradient(circle at 0% 0%,rgba(201,168,76,0.10),transparent 36%),rgba(15,19,28,0.78);margin-bottom:28px}
        .mh-hero-left{display:flex;flex-direction:column;gap:14px}
        .mh-kicker{font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--mh-gold-light)}
        .mh-title{font-size:36px;line-height:1.05;font-weight:900;letter-spacing:-.02em;color:#F7F7F8;display:flex;align-items:center;gap:14px}
        .mh-title-icon{width:54px;height:54px;border-radius:16px;display:grid;place-items:center;border:1px solid rgba(201,168,76,0.22);background:rgba(201,168,76,0.08);color:var(--mh-gold-light)}
        .mh-title-icon.blue{border-color:rgba(74,179,255,0.24);background:rgba(74,179,255,0.10);color:var(--mh-blue)}
        .mh-title-icon.green{border-color:rgba(74,222,128,0.22);background:rgba(74,222,128,0.10);color:var(--mh-green)}
        .mh-title-icon.violet{border-color:rgba(167,139,250,0.24);background:rgba(167,139,250,0.10);color:var(--mh-violet)}
        .mh-title-icon svg{width:30px;height:30px}
        .mh-subtitle{color:rgba(247,247,248,.66);font-size:14.5px;line-height:1.55;max-width:520px}
        .mh-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;align-content:center}
        .mh-stat{padding:18px 16px;border-radius:16px;border:1px solid rgba(255,255,255,0.08);background:rgba(5,7,11,0.5);text-align:center}
        .mh-stat strong{display:block;font-size:26px;color:#fff;font-weight:900;line-height:1}
        .mh-stat span{display:block;margin-top:8px;font-size:11px;color:rgba(247,247,248,.46);font-weight:700;letter-spacing:.06em;text-transform:uppercase}
        .mh-stat.blue strong{color:var(--mh-blue)}
        .mh-stat.gold strong{color:var(--mh-gold-light)}
        .mh-stat.green strong{color:var(--mh-green)}
        .mh-stat-progress{grid-column:1/-1;padding:18px 18px 20px;border-radius:14px;border:1px solid rgba(255,255,255,0.08);background:rgba(5,7,11,0.5)}
        .mh-stat-progress-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
        .mh-stat-progress-head span{font-size:12px;color:rgba(247,247,248,.66);font-weight:700;letter-spacing:.06em;text-transform:uppercase}
        .mh-stat-progress-head strong{font-size:18px;color:var(--mh-gold-light);font-weight:900}
        .mh-stat-progress-track{height:8px;border-radius:999px;background:rgba(255,255,255,0.06);overflow:hidden}
        .mh-stat-progress-fill{height:100%;background:linear-gradient(90deg,var(--mh-gold),var(--mh-gold-light));border-radius:999px;transition:width .5s ease}

        .mh-modes-head{display:flex;justify-content:space-between;align-items:end;margin-bottom:16px}
        .mh-modes-head h2{font-size:22px;font-weight:900;color:#F7F7F8;letter-spacing:-.01em}
        .mh-modes-head h2 strong{color:var(--mh-gold-light)}
        .mh-modes-head p{font-size:13.5px;color:rgba(247,247,248,.62);margin-top:4px}

        .mh-mode-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:36px}
        .mh-mode-card{position:relative;text-align:left;padding:24px;border-radius:20px;border:1px solid var(--mh-border);background:rgba(15,19,28,0.74);color:#F7F7F8;cursor:pointer;transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease;display:flex;flex-direction:column;gap:12px;min-height:200px;font-family:inherit}
        .mh-mode-card:hover:not(.disabled){transform:translateY(-3px);border-color:rgba(255,255,255,0.18)}
        .mh-mode-card.disabled{opacity:.45;cursor:not-allowed}
        .mh-mode-card .mh-mode-icon{font-size:30px;display:inline-flex;align-items:center;justify-content:center;width:54px;height:54px;border-radius:14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08)}
        .mh-mode-card .mh-mode-title{font-size:18px;font-weight:900;letter-spacing:-.01em}
        .mh-mode-card .mh-mode-desc{font-size:13.5px;color:rgba(247,247,248,.62);line-height:1.55}
        .mh-mode-card .mh-mode-footer{margin-top:auto;display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid rgba(255,255,255,0.06)}
        .mh-mode-card .mh-mode-cta{font-size:12.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
        .mh-mode-card .mh-mode-required{font-size:11px;color:rgba(247,247,248,.4)}
        .mh-mode-card.accent-gold{box-shadow:inset 0 0 0 1px rgba(201,168,76,0.18)}
        .mh-mode-card.accent-gold .mh-mode-cta{color:var(--mh-gold-light)}
        .mh-mode-card.accent-blue{box-shadow:inset 0 0 0 1px rgba(74,179,255,0.20)}
        .mh-mode-card.accent-blue .mh-mode-cta{color:var(--mh-blue)}
        .mh-mode-card.accent-violet{box-shadow:inset 0 0 0 1px rgba(167,139,250,0.22)}
        .mh-mode-card.accent-violet .mh-mode-cta{color:var(--mh-violet)}

        .mh-cards-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
        .mh-cards-head h2{font-size:18px;font-weight:800;color:#F7F7F8}
        .mh-cards-head span{font-size:12px;color:rgba(247,247,248,.5);text-transform:uppercase;letter-spacing:.06em;font-weight:700}
        .mh-card-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
        .mh-card-item{padding:16px 18px;border-radius:14px;border:1px solid var(--mh-border);background:rgba(15,19,28,0.66);transition:border-color .15s}
        .mh-card-item:hover{border-color:rgba(255,255,255,0.16)}
        .mh-card-item .mh-card-pergunta{font-size:14px;font-weight:700;color:#F7F7F8;line-height:1.45;margin-bottom:8px}
        .mh-card-item .mh-card-resposta{font-size:13px;color:rgba(247,247,248,.58);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

        @media (max-width:880px){
          .mh-hero{grid-template-columns:1fr;padding:22px}
          .mh-title{font-size:26px}
          .mh-mode-grid{grid-template-columns:1fr}
        }

        /* Tema Claro */
        .tema-claro{--mh-bg:#f5f7fa;--mh-card:#ffffff;--mh-border:rgba(201,168,76,0.18)}
        .tema-claro .mh-back{color:rgba(17,24,39,.60)}
        .tema-claro .mh-back:hover{color:#111827}
        .tema-claro .mh-hero{background:radial-gradient(circle at 0% 0%,rgba(201,168,76,0.07),transparent 36%),rgba(248,250,252,0.95)!important;border-color:rgba(201,168,76,0.20)}
        .tema-claro .mh-title{color:#111827}
        .tema-claro .mh-subtitle{color:rgba(17,24,39,.60)}
        .tema-claro .mh-stat{background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.08)}
        .tema-claro .mh-stat strong{color:#111827}
        .tema-claro .mh-stat span{color:rgba(17,24,39,.46)}
        .tema-claro .mh-stat-progress{background:rgba(0,0,0,0.03);border-color:rgba(0,0,0,0.08)}
        .tema-claro .mh-stat-progress-head span{color:rgba(17,24,39,.60)}
        .tema-claro .mh-stat-progress-track{background:rgba(0,0,0,0.08)}
        .tema-claro .mh-modes-head h2{color:#111827}
        .tema-claro .mh-modes-head p{color:rgba(17,24,39,.56)}
        .tema-claro .mh-mode-card{background:rgba(255,255,255,0.90);color:#111827;border-color:rgba(0,0,0,0.08)}
        .tema-claro .mh-mode-card:hover:not(.disabled){border-color:rgba(201,168,76,0.30)}
        .tema-claro .mh-mode-card .mh-mode-icon{background:rgba(0,0,0,0.04);border-color:rgba(0,0,0,0.08)}
        .tema-claro .mh-mode-card .mh-mode-desc{color:rgba(17,24,39,.56)}
        .tema-claro .mh-mode-card .mh-mode-footer{border-top-color:rgba(0,0,0,0.07)}
        .tema-claro .mh-mode-card .mh-mode-required{color:rgba(17,24,39,.40)}
        .tema-claro .mh-cards-head h2{color:#111827}
        .tema-claro .mh-cards-head span{color:rgba(17,24,39,.50)}
        .tema-claro .mh-card-item{background:rgba(255,255,255,0.88);border-color:rgba(0,0,0,0.08)}
        .tema-claro .mh-card-item:hover{border-color:rgba(201,168,76,0.28)}
        .tema-claro .mh-card-item .mh-card-pergunta{color:#111827}
        .tema-claro .mh-card-item .mh-card-resposta{color:rgba(17,24,39,.54)}
      `}} />

      <button className="mh-back" type="button" onClick={() => router.push('/flashcards')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Flashcards
      </button>

      <section className="mh-hero">
        <div className="mh-hero-left">
          <div className="mh-kicker">{detail.ciclo}</div>
          <div className="mh-title">
            <span className={`mh-title-icon ${accent}`} dangerouslySetInnerHTML={{ __html: iconSvg }} />
            {detail.matter}
          </div>
          <p className="mh-subtitle">
            Você tem {detail.stats.total} {detail.stats.total === 1 ? 'flashcard' : 'flashcards'} criados nesta matéria. Escolha como quer revisar.
          </p>
        </div>
        <div className="mh-stats-grid">
          <div className="mh-stat gold">
            <strong>{detail.stats.revisar}</strong>
            <span>Revisar</span>
          </div>
          <div className="mh-stat blue">
            <strong>{detail.stats.novos}</strong>
            <span>Novos</span>
          </div>
          <div className="mh-stat">
            <strong>{detail.stats.total}</strong>
            <span>Total</span>
          </div>
          <div className="mh-stat-progress">
            <div className="mh-stat-progress-head">
              <span>Fixação</span>
              <strong>{detail.stats.fixacao}%</strong>
            </div>
            <div className="mh-stat-progress-track">
              <div className="mh-stat-progress-fill" style={{ width: `${Math.min(100, detail.stats.fixacao)}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="mh-modes-head">
        <div>
          <h2>Escolha o <strong>modo de estudo</strong>.</h2>
          <p>Os 3 modos usam os mesmos cards de frente/verso que você criou.</p>
        </div>
      </div>

      <div className="mh-mode-grid">
        {MODES.map(mode => {
          const disabled = detail.stats.total < mode.minCards;
          return (
            <button
              key={mode.id}
              type="button"
              className={`mh-mode-card accent-${mode.accent}${disabled ? ' disabled' : ''}`}
              disabled={disabled}
              onClick={() => !disabled && router.push(`/flashcards/${detail.slug}/estudar/${mode.id}`)}
            >
              <span className="mh-mode-icon">{mode.icon}</span>
              <div className="mh-mode-title">{mode.title}</div>
              <div className="mh-mode-desc">{mode.desc}</div>
              <div className="mh-mode-footer">
                <span className="mh-mode-cta">{disabled ? 'Cards insuficientes' : 'Iniciar →'}</span>
                <span className="mh-mode-required">mín. {mode.minCards} {mode.minCards === 1 ? 'card' : 'cards'}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mh-cards-head">
        <h2>Cards desta matéria</h2>
        <span>{detail.flashcards.length} {detail.flashcards.length === 1 ? 'card' : 'cards'}</span>
      </div>
      <div className="mh-card-list">
        {detail.flashcards.map(card => (
          <article key={card.id} className="mh-card-item">
            <div className="mh-card-pergunta">{card.pergunta || card.titulo || 'Sem pergunta'}</div>
            <div className="mh-card-resposta">{card.resposta || 'Sem resposta cadastrada'}</div>
          </article>
        ))}
      </div>
    </>
  );
}
