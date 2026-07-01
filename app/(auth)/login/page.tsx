'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

const css = `
.nf-page{display:flex;width:100vw;height:100vh;font-family:'Montserrat',sans-serif;background:#000;overflow:hidden}

/* ── LEFT ── */
.nf-left{width:60%;height:100%;position:relative;background:#000;overflow:hidden;display:flex;flex-direction:column;padding:40px 52px 36px}
.nf-bg-glow{position:absolute;top:-5%;right:-5%;width:75%;height:108%;background:radial-gradient(ellipse 55% 42% at 58% 30%,rgba(74,179,255,.42) 0%,rgba(26,111,212,.18) 55%,transparent 75%),radial-gradient(ellipse 40% 30% at 56% 56%,rgba(201,168,76,.12) 0%,transparent 60%),radial-gradient(ellipse 38% 52% at 55% 78%,rgba(74,179,255,.28) 0%,rgba(26,111,212,.1) 55%,transparent 78%);pointer-events:none;z-index:1}
.nf-left::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 70% at 30% 50%,transparent 40%,rgba(0,0,0,.55) 100%);pointer-events:none;z-index:3}
.nf-neuron{position:absolute;top:0;right:-4%;width:62%;height:100%;z-index:2;pointer-events:none;display:flex;align-items:center;justify-content:center}
.nf-neuron svg{width:100%;height:100%}
.nf-logo-area{position:relative;z-index:10}
.nf-copy{position:relative;z-index:10;flex:1;display:flex;flex-direction:column;justify-content:center;max-width:460px;padding-top:24px}
.nf-headline{font-size:clamp(26px,3.4vw,44px);font-weight:800;color:#F0EDE6;line-height:1.12;margin:0 0 20px;letter-spacing:-.4px}
.nf-headline .g{color:#C9A84C}
.nf-gold-bar{width:40px;height:2px;background:#C9A84C;margin-bottom:18px;opacity:.85}
.nf-tag{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:3px;color:#F0EDE6}
.nf-tag span{color:#C9A84C}
.nf-body-p{font-size:12.5px;font-weight:300;color:rgba(240,237,230,.55);line-height:1.78;max-width:380px;margin:16px 0 28px}
.nf-icons{display:flex;gap:0;margin-bottom:28px}
.nf-ic{flex:1;display:flex;flex-direction:column;align-items:center;gap:7px;padding:0 8px;border-right:1px solid rgba(74,144,196,.18)}
.nf-ic:first-child{padding-left:0}.nf-ic:last-child{border:none}
.nf-ic-ring{width:40px;height:40px;border:1.5px solid rgba(74,144,196,.42);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#4AB3FF;background:rgba(26,111,212,.07)}
.nf-ic-lbl{font-size:9px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:rgba(240,237,230,.45);text-align:center}
.nf-bot-box{position:relative;z-index:10;border:1.5px solid #C9A84C;border-radius:3px;padding:12px 24px;max-width:340px;text-align:center;margin-bottom:18px}
.nf-bot-txt{font-size:9.5px;font-weight:700;letter-spacing:3.5px;text-transform:uppercase;color:#F0EDE6}
.nf-bot-txt span{color:#C9A84C}
.nf-social{position:relative;z-index:10;display:flex;align-items:center;gap:11px}
.nf-soc{width:22px;height:22px;color:rgba(240,237,230,.38);cursor:pointer;transition:color .2s;background:none;border:none;padding:0}
.nf-soc:hover{color:#C9A84C}
.nf-soc-sep{width:1px;height:15px;background:rgba(240,237,230,.18)}
.nf-soc-h{font-size:11px;color:rgba(240,237,230,.35);letter-spacing:.5px}

/* ── RIGHT ── */
.nf-right{width:40%;height:100%;background:#07090F;border-left:1px solid rgba(201,168,76,.13);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.nf-right::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 38% at 50% 0%,rgba(26,111,212,.06) 0%,transparent 60%),radial-gradient(ellipse 60% 28% at 50% 100%,rgba(201,168,76,.05) 0%,transparent 60%);pointer-events:none}
.nf-card{width:88%;max-width:348px;position:relative;z-index:1;animation:nfUp .7s ease both}
@keyframes nfUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.nf-card-logo{margin-bottom:26px}
.nf-f-head{font-size:19px;font-weight:800;color:#F0EDE6;letter-spacing:-.3px;margin:0 0 4px}
.nf-f-head span{color:#C9A84C}
.nf-f-sub{font-size:11px;font-weight:300;color:rgba(240,237,230,.45);margin:0 0 22px}
.nf-tabs{display:flex;background:rgba(255,255,255,.025);border:1px solid rgba(201,168,76,.12);border-radius:7px;padding:3px;margin-bottom:20px;gap:3px}
.nf-tab{flex:1;padding:8px 6px;font-size:10.5px;font-weight:600;letter-spacing:.3px;border-radius:5px;cursor:pointer;text-align:center;color:rgba(240,237,230,.45);transition:all .22s;border:1px solid transparent;font-family:'Montserrat',sans-serif;background:none}
.nf-tab.active{background:linear-gradient(135deg,rgba(201,168,76,.2),rgba(26,111,212,.1));color:#F0EDE6;border-color:rgba(201,168,76,.22);box-shadow:0 2px 10px rgba(0,0,0,.35)}
.nf-btn-cta{width:100%;padding:13px;background:linear-gradient(135deg,#8B6914 0%,#E8D08A 40%,#C9A84C 75%,#8B6914 100%);background-size:250% 250%;border:none;border-radius:7px;color:#000;font-family:'Montserrat',sans-serif;font-size:11px;font-weight:800;letter-spacing:3.5px;text-transform:uppercase;cursor:pointer;margin-bottom:8px;box-shadow:0 4px 24px rgba(201,168,76,.32);animation:nfGold 3s ease-in-out infinite;transition:transform .2s,box-shadow .2s}
@keyframes nfGold{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.nf-btn-cta:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(201,168,76,.48)}
.nf-free-note{text-align:center;font-size:10px;color:rgba(240,237,230,.2);letter-spacing:.5px;margin-bottom:16px}
.nf-or-div{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.nf-or-ln{flex:1;height:1px;background:rgba(201,168,76,.1)}
.nf-or-tx{font-size:9px;font-weight:600;letter-spacing:2px;color:rgba(240,237,230,.2);text-transform:uppercase}
.nf-btn-g{width:100%;padding:11px;background:transparent;border:1px solid rgba(240,237,230,.1);border-radius:7px;color:rgba(240,237,230,.48);font-family:'Montserrat',sans-serif;font-size:12px;font-weight:400;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;transition:all .22s;margin-bottom:20px}
.nf-btn-g:hover{border-color:rgba(240,237,230,.2);color:#F0EDE6;background:rgba(240,237,230,.03)}
.nf-card-bot{border:1px solid rgba(201,168,76,.2);border-radius:3px;padding:8px 14px;text-align:center;font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:rgba(240,237,230,.35)}
.nf-card-bot span{color:#C9A84C}
.nf-back{font-size:11px;color:rgba(240,237,230,.2);text-decoration:none;display:block;text-align:center;margin-top:12px;transition:color .2s;font-family:'Montserrat',sans-serif}
.nf-back:hover{color:rgba(240,237,230,.5)}

/* ── Dendrite & spark animations ── */
.d{animation:dPulse 3.8s ease-in-out infinite}
.d:nth-child(2n){animation-delay:.7s}.d:nth-child(3n){animation-delay:1.4s}
.d:nth-child(4n){animation-delay:2.1s}.d:nth-child(5n){animation-delay:2.8s}
@keyframes dPulse{0%,100%{opacity:.85}50%{opacity:1}}
.spark{animation:sparkle 2.5s ease-in-out infinite}
.spark:nth-child(2n){animation-delay:.5s}.spark:nth-child(3n){animation-delay:1s}
.spark:nth-child(4n){animation-delay:1.5s}.spark:nth-child(5n){animation-delay:2s}
@keyframes sparkle{0%,100%{opacity:.25}50%{opacity:1}}

/* ── Mobile ── */
@media(max-width:768px){
  .nf-left{display:none}
  .nf-right{width:100%;border-left:none}
}
`;

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'login' | 'cadastro'>('login');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(() => {
    const err = searchParams?.get('error');
    if (err === 'auth') return 'Falha na autenticação. Tente novamente.';
    if (err === 'missing_code') return 'Código de autenticação ausente. Tente novamente.';
    return null;
  });

  async function handleGoogle() {
    setErrorMsg(null);
    setGoogleLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const next = tab === 'cadastro' ? '/onboarding' : '/dashboard';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback?next=${next}`,
          queryParams: { prompt: 'select_account' },
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? 'Não foi possível iniciar o login com Google.';
      setErrorMsg(msg);
      setGoogleLoading(false);
    }
  }

  function handleCtaClick() {
    if (tab === 'cadastro') {
      router.push('/cadastro');
      return;
    }
    handleGoogle();
  }

  return (
    <>
      <style>{css}</style>
      <div className="nf-page">

        {/* ══ LEFT PANEL ══ */}
        <div className="nf-left">
          <div className="nf-bg-glow" />

          <div className="nf-neuron">
            <svg viewBox="0 0 500 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="somaFill" cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#FFFFFF"/><stop offset="12%" stopColor="#FFE8A0"/>
                  <stop offset="28%" stopColor="#FFC040"/><stop offset="50%" stopColor="#E07010"/>
                  <stop offset="72%" stopColor="#8B3A00"/><stop offset="100%" stopColor="#3A1200" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="somaHalo" cx="50%" cy="48%" r="50%">
                  <stop offset="0%" stopColor="#4AB3FF" stopOpacity="0.5"/><stop offset="55%" stopColor="#1F70D0" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#000820" stopOpacity="0"/>
                </radialGradient>
                <linearGradient id="axonG" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#5AB8FF"/><stop offset="50%" stopColor="#4AB3FF"/>
                  <stop offset="100%" stopColor="#1A4FA0" stopOpacity="0.5"/>
                </linearGradient>
                <linearGradient id="myelinG" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1A6FD4" stopOpacity="0.1"/><stop offset="50%" stopColor="#4AB3FF" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#1A6FD4" stopOpacity="0.1"/>
                </linearGradient>
                <radialGradient id="termGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFFFF"/><stop offset="30%" stopColor="#9DDCFF"/>
                  <stop offset="70%" stopColor="#4AB3FF" stopOpacity="0.6"/><stop offset="100%" stopColor="#1F70D0" stopOpacity="0"/>
                </radialGradient>
                <filter id="gMed" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="5" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="gBig" x="-150%" y="-150%" width="400%" height="400%">
                  <feGaussianBlur stdDeviation="12" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="gXL" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="20"/></filter>
                <filter id="sGF" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="9" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="spF" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="2.5" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <circle cx="250" cy="268" r="135" fill="#0E2E78" opacity="0.22" filter="url(#gXL)"/>
              <circle cx="250" cy="268" r="92" fill="#1A5AB8" opacity="0.42" filter="url(#gBig)"/>
              {/* Dendrite glows */}
              <path d="M250,238 Q248,205 250,175" fill="none" stroke="#4AB3FF" strokeWidth="10" opacity="0.42" filter="url(#gBig)"/>
              <path d="M250,210 Q222,188 195,162 Q172,140 148,112" fill="none" stroke="#4AB3FF" strokeWidth="8" opacity="0.36" filter="url(#gBig)"/>
              <path d="M250,210 Q278,188 305,162 Q328,140 352,112" fill="none" stroke="#4AB3FF" strokeWidth="8" opacity="0.36" filter="url(#gBig)"/>
              <path d="M250,175 Q232,148 218,118 Q208,95 200,68" fill="none" stroke="#4AB3FF" strokeWidth="6" opacity="0.32" filter="url(#gBig)"/>
              <path d="M250,175 Q268,148 282,118 Q292,95 300,68" fill="none" stroke="#4AB3FF" strokeWidth="6" opacity="0.32" filter="url(#gBig)"/>
              <path d="M195,162 Q165,140 135,115 Q110,95 82,72" fill="none" stroke="#4AB3FF" strokeWidth="6" opacity="0.32" filter="url(#gBig)"/>
              <path d="M305,162 Q335,140 365,115 Q390,95 418,72" fill="none" stroke="#4AB3FF" strokeWidth="6" opacity="0.32" filter="url(#gBig)"/>
              {/* Dendrite crisp */}
              <path className="d" d="M250,238 Q248,205 250,175" fill="none" stroke="#5AB8FF" strokeWidth="2.2" strokeLinecap="round"/>
              <path className="d" d="M250,210 Q222,188 195,162 Q172,140 148,112" fill="none" stroke="#4AB3FF" strokeWidth="2" strokeLinecap="round"/>
              <path className="d" d="M250,210 Q278,188 305,162 Q328,140 352,112" fill="none" stroke="#4AB3FF" strokeWidth="2" strokeLinecap="round"/>
              <path className="d" d="M195,162 Q178,145 158,125 Q140,108 120,88" fill="none" stroke="#4AB3FF" strokeWidth="1.6" strokeLinecap="round"/>
              <path className="d" d="M148,112 Q130,94 108,74 Q90,58 70,40" fill="none" stroke="#4AB3FF" strokeWidth="1.3" strokeLinecap="round"/>
              <path className="d" d="M148,112 Q135,96 125,76 Q116,60 112,42" fill="none" stroke="#4AB3FF" strokeWidth="1.1" strokeLinecap="round"/>
              <path className="d" d="M120,88 Q105,72 88,55 Q74,40 58,24" fill="none" stroke="#4AB3FF" strokeWidth="1" strokeLinecap="round"/>
              <path className="d" d="M195,162 Q172,150 148,138 Q128,128 105,118" fill="none" stroke="#4AB3FF" strokeWidth="1.4" strokeLinecap="round"/>
              <path className="d" d="M105,118 Q84,108 62,98 Q44,90 26,82" fill="none" stroke="#4AB3FF" strokeWidth="1.1" strokeLinecap="round"/>
              <path className="d" d="M305,162 Q322,145 342,125 Q360,108 380,88" fill="none" stroke="#4AB3FF" strokeWidth="1.6" strokeLinecap="round"/>
              <path className="d" d="M352,112 Q370,94 392,74 Q410,58 430,40" fill="none" stroke="#4AB3FF" strokeWidth="1.3" strokeLinecap="round"/>
              <path className="d" d="M352,112 Q365,96 375,76 Q384,60 388,42" fill="none" stroke="#4AB3FF" strokeWidth="1.1" strokeLinecap="round"/>
              <path className="d" d="M380,88 Q395,72 412,55 Q426,40 442,24" fill="none" stroke="#4AB3FF" strokeWidth="1" strokeLinecap="round"/>
              <path className="d" d="M305,162 Q328,150 352,138 Q372,128 395,118" fill="none" stroke="#4AB3FF" strokeWidth="1.4" strokeLinecap="round"/>
              <path className="d" d="M395,118 Q416,108 438,98 Q456,90 474,82" fill="none" stroke="#4AB3FF" strokeWidth="1.1" strokeLinecap="round"/>
              <path className="d" d="M250,175 Q232,148 218,118 Q208,95 200,68" fill="none" stroke="#4AB3FF" strokeWidth="1.7" strokeLinecap="round"/>
              <path className="d" d="M218,118 Q205,98 192,76 Q182,58 175,36" fill="none" stroke="#4AB3FF" strokeWidth="1.2" strokeLinecap="round"/>
              <path className="d" d="M200,68 Q188,50 178,30 Q170,14 165,2" fill="none" stroke="#4AB3FF" strokeWidth="1" strokeLinecap="round"/>
              <path className="d" d="M250,175 Q268,148 282,118 Q292,95 300,68" fill="none" stroke="#4AB3FF" strokeWidth="1.7" strokeLinecap="round"/>
              <path className="d" d="M282,118 Q295,98 308,76 Q318,58 325,36" fill="none" stroke="#4AB3FF" strokeWidth="1.2" strokeLinecap="round"/>
              <path className="d" d="M300,68 Q312,50 322,30 Q330,14 335,2" fill="none" stroke="#4AB3FF" strokeWidth="1" strokeLinecap="round"/>
              <path className="d" d="M70,40 Q58,28 46,14" fill="none" stroke="#4AB3FF" strokeWidth="0.9" strokeLinecap="round"/>
              <path className="d" d="M430,40 Q442,28 454,14" fill="none" stroke="#4AB3FF" strokeWidth="0.9" strokeLinecap="round"/>
              <path className="d" d="M26,82 Q12,74 0,66" fill="none" stroke="#4AB3FF" strokeWidth="0.8" strokeLinecap="round"/>
              <path className="d" d="M474,82 Q488,74 500,66" fill="none" stroke="#4AB3FF" strokeWidth="0.8" strokeLinecap="round"/>
              {/* Soma */}
              <circle cx="250" cy="268" r="62" fill="#0E2E78" opacity="0.22" filter="url(#gXL)"/>
              <circle cx="250" cy="265" r="48" fill="url(#somaHalo)">
                <animate attributeName="r" values="46;52;46" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="250" cy="263" r="36" fill="url(#somaFill)" filter="url(#sGF)"/>
              <circle cx="250" cy="262" r="21" fill="none" stroke="rgba(255,200,80,0.35)" strokeWidth="1.5"/>
              <circle cx="250" cy="261" r="13" fill="#FFE090" opacity="0.9" filter="url(#spF)">
                <animate attributeName="opacity" values="0.85;1;0.85" dur="2.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="248" cy="259" r="7" fill="white" opacity="0.97"/>
              <circle cx="250" cy="265" r="54" fill="none" stroke="#4AB3FF" strokeWidth="1.2" opacity="0.5">
                <animate attributeName="r" values="54;88;54" dur="3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.55;0;0.55" dur="3s" repeatCount="indefinite"/>
              </circle>
              <circle cx="250" cy="265" r="54" fill="none" stroke="#2A88E8" strokeWidth="0.8" opacity="0.3">
                <animate attributeName="r" values="54;118;54" dur="4.5s" begin="0.6s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.38;0;0.38" dur="4.5s" begin="0.6s" repeatCount="indefinite"/>
              </circle>
              {/* Axon */}
              <path d="M250,308 Q248,325 250,342" fill="none" stroke="#5AB8FF" strokeWidth="5.5" strokeLinecap="round" opacity="0.9"/>
              <path d="M250,308 Q248,325 250,342" fill="none" stroke="#4AB3FF" strokeWidth="12" strokeLinecap="round" opacity="0.28" filter="url(#gBig)"/>
              <path d="M250,342 Q252,400 250,460 Q248,520 250,580" fill="none" stroke="#4AB3FF" strokeWidth="12" opacity="0.18" filter="url(#gBig)"/>
              <path id="axonPath" className="d" d="M250,342 Q252,400 250,460 Q248,520 250,580" fill="none" stroke="url(#axonG)" strokeWidth="3" strokeLinecap="round"/>
              <circle r="5" fill="#FFFFFF" filter="url(#spF)" opacity="0.95">
                <animateMotion dur="2.6s" repeatCount="indefinite"><mpath href="#axonPath"/></animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="2.6s" repeatCount="indefinite"/>
              </circle>
              <circle r="3" fill="#9DDCFF" filter="url(#spF)" opacity="0.9">
                <animateMotion dur="2.6s" begin="-1.3s" repeatCount="indefinite"><mpath href="#axonPath"/></animateMotion>
                <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.1;0.9;1" dur="2.6s" begin="-1.3s" repeatCount="indefinite"/>
              </circle>
              {/* Myelin sheaths */}
              <rect x="235" y="372" width="30" height="24" rx="12" fill="url(#myelinG)" stroke="#4AB3FF" strokeWidth="1.2" opacity="0.72"><animate attributeName="opacity" values="0.5;0.85;0.5" dur="2.8s" begin="0.2s" repeatCount="indefinite"/></rect>
              <rect x="235" y="416" width="30" height="24" rx="12" fill="url(#myelinG)" stroke="#4AB3FF" strokeWidth="1.2" opacity="0.68"><animate attributeName="opacity" values="0.48;0.82;0.48" dur="3.1s" begin="0.5s" repeatCount="indefinite"/></rect>
              <rect x="235" y="460" width="30" height="24" rx="12" fill="url(#myelinG)" stroke="#4AB3FF" strokeWidth="1.2" opacity="0.65"><animate attributeName="opacity" values="0.45;0.8;0.45" dur="3.4s" begin="0.8s" repeatCount="indefinite"/></rect>
              <rect x="235" y="504" width="30" height="24" rx="12" fill="url(#myelinG)" stroke="#4AB3FF" strokeWidth="1.2" opacity="0.60"><animate attributeName="opacity" values="0.42;0.75;0.42" dur="3.7s" begin="1.1s" repeatCount="indefinite"/></rect>
              <rect x="235" y="548" width="30" height="24" rx="12" fill="url(#myelinG)" stroke="#4AB3FF" strokeWidth="1.2" opacity="0.55"><animate attributeName="opacity" values="0.38;0.7;0.38" dur="4s" begin="1.4s" repeatCount="indefinite"/></rect>
              {/* Terminals */}
              <path d="M250,580 Q248,608 250,635" fill="none" stroke="#4AB3FF" strokeWidth="8" opacity="0.40" filter="url(#gBig)"/>
              <path d="M250,580 Q235,600 218,618 Q202,634 182,648" fill="none" stroke="#4AB3FF" strokeWidth="8" opacity="0.40" filter="url(#gBig)"/>
              <path d="M250,580 Q265,600 282,618 Q298,634 318,648" fill="none" stroke="#4AB3FF" strokeWidth="8" opacity="0.40" filter="url(#gBig)"/>
              <path className="d" d="M250,580 Q248,608 250,635" fill="none" stroke="#4AB3FF" strokeWidth="2" strokeLinecap="round"/>
              <path className="d" d="M250,635 Q238,650 225,665 Q215,676 205,688" fill="none" stroke="#4AB3FF" strokeWidth="1.5" strokeLinecap="round"/>
              <path className="d" d="M250,635 Q262,650 275,665 Q285,676 295,688" fill="none" stroke="#4AB3FF" strokeWidth="1.5" strokeLinecap="round"/>
              <path className="d" d="M250,635 Q250,658 250,698" fill="none" stroke="#4AB3FF" strokeWidth="1.5" strokeLinecap="round"/>
              <path className="d" d="M250,580 Q235,600 218,618 Q202,634 182,648" fill="none" stroke="#4AB3FF" strokeWidth="1.8" strokeLinecap="round"/>
              <path className="d" d="M182,648 Q168,658 152,668 Q140,676 128,685" fill="none" stroke="#4AB3FF" strokeWidth="1.4" strokeLinecap="round"/>
              <path className="d" d="M182,648 Q170,662 162,678 Q155,692 150,706" fill="none" stroke="#4AB3FF" strokeWidth="1.2" strokeLinecap="round"/>
              <path className="d" d="M250,580 Q265,600 282,618 Q298,634 318,648" fill="none" stroke="#4AB3FF" strokeWidth="1.8" strokeLinecap="round"/>
              <path className="d" d="M318,648 Q332,658 348,668 Q360,676 372,685" fill="none" stroke="#4AB3FF" strokeWidth="1.4" strokeLinecap="round"/>
              <path className="d" d="M318,648 Q330,662 338,678 Q345,692 350,706" fill="none" stroke="#4AB3FF" strokeWidth="1.2" strokeLinecap="round"/>
              <circle cx="128" cy="685" r="9" fill="url(#termGlow)" opacity="0.75"/>
              <circle cx="128" cy="685" r="4" fill="#FFFFFF" opacity="0.95" filter="url(#spF)"><animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite"/></circle>
              <circle cx="150" cy="706" r="8" fill="url(#termGlow)" opacity="0.7"/>
              <circle cx="150" cy="706" r="3.5" fill="#FFFFFF" opacity="0.92" filter="url(#spF)"><animate attributeName="opacity" values="0.55;0.95;0.55" dur="2.8s" begin="0.3s" repeatCount="indefinite"/></circle>
              <circle cx="205" cy="688" r="8" fill="url(#termGlow)" opacity="0.7"/>
              <circle cx="205" cy="688" r="3.5" fill="#FFFFFF" opacity="0.92" filter="url(#spF)"><animate attributeName="opacity" values="0.55;0.92;0.55" dur="2.7s" begin="0.4s" repeatCount="indefinite"/></circle>
              <circle cx="250" cy="698" r="9" fill="url(#termGlow)" opacity="0.78"/>
              <circle cx="250" cy="698" r="4" fill="#FFFFFF" opacity="0.95" filter="url(#spF)"><animate attributeName="opacity" values="0.6;1;0.6" dur="2.8s" begin="0.2s" repeatCount="indefinite"/></circle>
              <circle cx="295" cy="688" r="8" fill="url(#termGlow)" opacity="0.7"/>
              <circle cx="295" cy="688" r="3.5" fill="#FFFFFF" opacity="0.92" filter="url(#spF)"><animate attributeName="opacity" values="0.55;0.92;0.55" dur="3s" begin="0.6s" repeatCount="indefinite"/></circle>
              <circle cx="350" cy="706" r="8" fill="url(#termGlow)" opacity="0.7"/>
              <circle cx="350" cy="706" r="3.5" fill="#FFFFFF" opacity="0.92" filter="url(#spF)"><animate attributeName="opacity" values="0.55;0.95;0.55" dur="2.9s" begin="0.5s" repeatCount="indefinite"/></circle>
              <circle cx="372" cy="685" r="9" fill="url(#termGlow)" opacity="0.75"/>
              <circle cx="372" cy="685" r="4" fill="#FFFFFF" opacity="0.95" filter="url(#spF)"><animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" begin="0.2s" repeatCount="indefinite"/></circle>
              {/* Particles */}
              <g filter="url(#spF)">
                <circle className="spark" cx="68" cy="40" r="2.5" fill="#9DDCFF"/>
                <circle className="spark" cx="115" cy="18" r="2" fill="white" opacity="0.8"/>
                <circle className="spark" cx="165" cy="8" r="2.2" fill="#7BC8FF"/>
                <circle className="spark" cx="172" cy="34" r="1.8" fill="white" opacity="0.7"/>
                <circle className="spark" cx="332" cy="8" r="2.2" fill="#9DDCFF"/>
                <circle className="spark" cx="328" cy="34" r="1.8" fill="white" opacity="0.7"/>
                <circle className="spark" cx="385" cy="18" r="2" fill="white" opacity="0.65"/>
                <circle className="spark" cx="432" cy="40" r="2.5" fill="#9DDCFF"/>
                <circle className="spark" cx="455" cy="16" r="1.8" fill="white" opacity="0.6"/>
                <circle className="spark" cx="26" cy="82" r="2.4" fill="#9DDCFF"/>
                <circle className="spark" cx="475" cy="82" r="2.4" fill="#9DDCFF"/>
                <circle className="spark" cx="200" cy="62" r="2" fill="#7BC8FF"/>
                <circle className="spark" cx="300" cy="62" r="2" fill="#7BC8FF"/>
                <circle className="spark" cx="108" cy="48" r="1.6" fill="#9DDCFF"/>
                <circle className="spark" cx="392" cy="48" r="1.6" fill="#9DDCFF"/>
                <circle className="spark" cx="42" cy="50" r="1.8" fill="white" opacity="0.55"/>
                <circle className="spark" cx="458" cy="50" r="1.8" fill="white" opacity="0.55"/>
              </g>
            </svg>
          </div>

          {/* Logo */}
          <div className="nf-logo-area">
            <img
              src="/neurofix-logo.png"
              alt="NeuroFix Med"
              style={{ height: '68px', display: 'block' }}
            />
          </div>

          {/* Copy */}
          <div className="nf-copy">
            <h1 className="nf-headline">
              Você não<br />está atrasado.<br />Você só nunca<br />aprendeu a estudar<br />
              <span className="g">da forma certa.</span>
            </h1>
            <div className="nf-gold-bar" />
            <p className="nf-tag">EDUCAÇÃO QUE <span>FIXA.</span></p>
            <p className="nf-tag">RESULTADOS QUE <span>TRANSFORMAM.</span></p>
            <p className="nf-body-p">A NeuroFix Med combina ciência, tecnologia e estratégia para te acompanhar em toda a sua jornada médica. Do básico à residência.</p>
            <div className="nf-icons">
              <div className="nf-ic">
                <div className="nf-ic-ring">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2Z"/></svg>
                </div>
                <span className="nf-ic-lbl">Ciência</span>
              </div>
              <div className="nf-ic">
                <div className="nf-ic-ring">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                </div>
                <span className="nf-ic-lbl">Estratégia</span>
              </div>
              <div className="nf-ic">
                <div className="nf-ic-ring">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                </div>
                <span className="nf-ic-lbl">Prática</span>
              </div>
              <div className="nf-ic">
                <div className="nf-ic-ring">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <span className="nf-ic-lbl">Fixação</span>
              </div>
            </div>
            <div className="nf-bot-box">
              <span className="nf-bot-txt">DO CICLO BÁSICO <span>À RESIDÊNCIA.</span></span>
            </div>
            <div className="nf-social">
              <button className="nf-soc" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </button>
              <button className="nf-soc" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>
              </button>
              <button className="nf-soc" aria-label="TikTok" style={{ opacity: 0.5 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9a8.17 8.17 0 0 0 4.78 1.52V7.1a4.85 4.85 0 0 1-1.01-.41z"/></svg>
              </button>
              <div className="nf-soc-sep" />
              <span className="nf-soc-h">@neurofixmed</span>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="nf-right">
          <div className="nf-card">

            {/* Mini logo */}
            <div className="nf-card-logo">
              <img
                src="/neurofix-logo.png"
                alt="NeuroFix Med"
                style={{ height: '44px', display: 'block' }}
              />
            </div>

            <h2 className="nf-f-head">
              {tab === 'login' ? <>Bem-vindo<span> de volta.</span></> : <>Crie sua<span> conta.</span></>}
            </h2>
            <p className="nf-f-sub">
              {tab === 'login'
                ? 'Acesse sua conta e continue sua jornada médica.'
                : 'Dê o próximo passo na sua jornada médica.'}
            </p>

            <div className="nf-tabs">
              <button className={`nf-tab${tab === 'cadastro' ? ' active' : ''}`} onClick={() => setTab('cadastro')}>
                Criar conta
              </button>
              <button className={`nf-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>
                Já tenho conta
              </button>
            </div>

            <button
              className="nf-btn-cta"
              onClick={handleCtaClick}
              disabled={tab === 'login' && googleLoading}
              style={tab === 'login' && googleLoading ? { opacity: 0.7, cursor: 'wait' } : undefined}
            >
              {tab === 'login'
                ? (googleLoading ? 'ABRINDO GOOGLE…' : 'ACESSAR AGORA →')
                : 'CRIAR CONTA →'}
            </button>

            {tab === 'cadastro' && (
              <p className="nf-free-note">Ative seu acesso e comece agora.</p>
            )}

            {errorMsg && (
              <div style={{
                margin: '4px 0 12px',
                padding: '9px 12px',
                borderRadius: 6,
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.35)',
                color: '#F87171',
                fontSize: 11,
                lineHeight: 1.5,
              }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="nf-or-div">
              <div className="nf-or-ln" /><span className="nf-or-tx">ou</span><div className="nf-or-ln" />
            </div>

            <button
              className="nf-btn-g"
              onClick={handleGoogle}
              disabled={googleLoading}
              style={googleLoading ? { opacity: 0.7, cursor: 'wait' } : undefined}
              aria-label="Continuar com Google"
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? 'Abrindo Google…' : 'Continuar com Google'}
            </button>

            <div className="nf-card-bot">DO CICLO BÁSICO <span>À RESIDÊNCIA.</span></div>

            <Link href="/" className="nf-back">← Voltar ao início</Link>
          </div>
        </div>

      </div>
    </>
  );
}
