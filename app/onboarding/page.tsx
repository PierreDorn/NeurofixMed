import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import FocoSelector from './FocoSelector';

async function salvarOnboarding(formData: FormData) {
  'use server';
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const semestre = String(formData.get('semestre') ?? '');
  const foco     = String(formData.get('foco') ?? '');
  const perfil   = String(formData.get('perfil_cognitivo') ?? 'padrao');

  await supabase.from('student_profiles').upsert({
    user_id:          user.id,
    semestre,
    foco,
    perfil_cognitivo: perfil,
    onboarding_done:  true,
    updated_at:       new Date().toISOString(),
  }, { onConflict: 'user_id' });

  redirect('/dashboard');
}

export default function OnboardingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        :root {
          --gold:#C9A84C; --gold-light:#E8C96A; --gold-dim:rgba(201,168,76,0.12);
          --blue:#4A90C4; --navy:#0A1628;
          --white:#F0EDE6; --muted:#6B8CAE; --border:rgba(255,255,255,0.07);
          --border-gold:rgba(201,168,76,0.25);
        }
        * { margin:0; padding:0; box-sizing:border-box; }
        .ob-root { min-height:100vh; background:var(--navy); color:var(--white); font-family:'DM Sans',sans-serif; position:relative; overflow-x:hidden; }
        .ob-bg { position:fixed; inset:0; z-index:0; background:radial-gradient(ellipse 60% 70% at 0% 50%, rgba(74,144,196,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 100% 40%, rgba(74,144,196,0.06) 0%, transparent 60%), linear-gradient(160deg,#07111E 0%,#0D1E35 40%,#0A1628 100%); }
        .ob-nav { position:fixed; top:0; left:0; right:0; z-index:10; display:flex; align-items:center; justify-content:space-between; padding:14px 40px; background:rgba(7,17,30,0.85); backdrop-filter:blur(16px); border-bottom:1px solid var(--border); }
        .ob-brand { font-family:'Space Mono',monospace; font-size:10px; letter-spacing:0.2em; color:var(--gold); opacity:0.7; }
        .ob-steps { display:flex; align-items:center; gap:10px; }
        .ob-step { width:26px; height:26px; border-radius:50%; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; font-family:'Space Mono',monospace; font-size:10px; color:var(--muted); }
        .ob-step.active { border-color:var(--gold); color:var(--gold); background:var(--gold-dim); }
        .ob-step-line { width:32px; height:1px; background:var(--border); }
        .ob-side-left { position:fixed; left:0; top:0; bottom:0; width:260px; z-index:2; pointer-events:none; display:flex; align-items:center; justify-content:center; }
        .ob-side-right { position:fixed; right:0; top:0; bottom:0; width:280px; z-index:2; pointer-events:none; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; padding-right:20px; }
        .ob-brain { width:200px; height:200px; position:relative; animation:ob-float 7s ease-in-out infinite; }
        .ob-brain-glow { position:absolute; inset:-10px; background:radial-gradient(ellipse,rgba(74,144,196,0.2) 0%,transparent 70%); filter:blur(16px); border-radius:50%; }
        .ob-side-icons { display:flex; flex-direction:column; gap:14px; margin-top:8px; }
        .ob-hex-icon { opacity:0.5; animation:ob-float 8s ease-in-out infinite; position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center; font-size:18px; }
        .ob-hex-icon:nth-child(2) { animation-delay:-3s; margin-left:24px; }
        .ob-hex-icon:nth-child(3) { animation-delay:-5s; }
        .ob-heartbeat { position:fixed; bottom:24px; left:0; right:0; height:36px; z-index:2; pointer-events:none; opacity:0.45; }
        .ob-hb-path { stroke-dasharray:2400; stroke-dashoffset:2400; animation:ob-draw 3s ease forwards 0.8s; }
        .ob-main { position:relative; z-index:5; min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:100px 300px 80px; }
        @media (max-width:1100px) { .ob-main{padding:100px 32px 80px;} .ob-side-left,.ob-side-right,.ob-heartbeat{display:none;} }
        .ob-logo-wrap { margin-bottom:32px; animation:ob-fadeUp 0.7s ease forwards; opacity:0; }
        .ob-logo-box { display:inline-flex; align-items:center; gap:14px; border:1px solid var(--border-gold); border-radius:8px; padding:12px 28px; background:rgba(0,0,0,0.35); backdrop-filter:blur(12px); position:relative; }
        .ob-logo-box::before { content:''; position:absolute; top:0; left:15%; right:15%; height:1px; background:linear-gradient(90deg,transparent,#C9A84C,transparent); }
        .ob-logo-nf { font-family:'Playfair Display',serif; font-size:36px; font-weight:700; background:linear-gradient(135deg,#C9A84C,#E8C96A); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .ob-logo-sep { width:1px; height:34px; background:linear-gradient(180deg,transparent,#C9A84C,transparent); }
        .ob-logo-text { display:flex; flex-direction:column; gap:3px; }
        .ob-logo-neurofix { font-family:'Space Mono',monospace; font-size:14px; letter-spacing:0.28em; background:linear-gradient(90deg,#C9A84C,#4A90C4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .ob-logo-med { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:0.45em; color:var(--muted); }
        .ob-heading { text-align:center; margin-bottom:40px; animation:ob-fadeUp 0.7s ease forwards 0.15s; opacity:0; }
        .ob-gold-bar { width:80px; height:1.5px; background:linear-gradient(90deg,transparent,#C9A84C,transparent); margin:0 auto 24px; }
        .ob-heading h1 { font-family:'Playfair Display',serif; font-size:clamp(30px,4vw,52px); font-weight:700; line-height:1.15; margin-bottom:12px; color:#F0EDE6; }
        .ob-blue { color:#5B8DB8; } .ob-gold { color:#C9A84C; }
        .ob-heading p { font-size:15px; color:var(--muted); font-weight:300; }
        .ob-heading p strong { color:#C9A84C; font-weight:500; }
        .ob-card { width:100%; max-width:620px; background:rgba(13,30,53,0.75); border:1px solid var(--border); border-radius:14px; padding:36px 40px; backdrop-filter:blur(20px); box-shadow:0 0 0 1px rgba(201,168,76,0.06),0 24px 60px rgba(0,0,0,0.5); animation:ob-fadeUp 0.7s ease forwards 0.3s; opacity:0; position:relative; overflow:hidden; }
        .ob-card::before { content:''; position:absolute; top:0; left:15%; right:15%; height:1px; background:linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent); }
        .ob-field-label { font-family:'Space Mono',monospace; font-size:13px; letter-spacing:0.2em; color:#C9A84C; text-transform:uppercase; margin-bottom:12px; display:block; }
        .ob-sel-wrap { position:relative; margin-bottom:32px; }
        .ob-select { width:100%; background:rgba(0,0,0,0.25); border:1px solid var(--border); border-radius:8px; padding:15px 40px 15px 16px; color:var(--muted); font-family:'DM Sans',sans-serif; font-size:15px; appearance:none; cursor:pointer; outline:none; transition:border-color 0.2s; }
        .ob-select:focus { border-color:#C9A84C; box-shadow:0 0 0 3px rgba(201,168,76,0.1); color:#F0EDE6; }
        .ob-sel-arrow { position:absolute; right:14px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; font-size:12px; }
        .ob-options { display:flex; flex-direction:column; gap:10px; margin-bottom:32px; }
        .ob-opt { display:flex; align-items:center; gap:14px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:10px; padding:16px 20px; cursor:pointer; transition:all 0.22s ease; user-select:none; }
        .ob-opt:hover { border-color:rgba(201,168,76,0.25); background:rgba(201,168,76,0.04); transform:translateX(3px); }
        .ob-opt.selected { border-color:#C9A84C !important; background:rgba(201,168,76,0.08) !important; transform:translateX(3px); }
        .ob-radio { width:20px; height:20px; border-radius:50%; border:1.5px solid rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.2s; }
        .ob-opt.selected .ob-radio { border-color:#C9A84C; background:#C9A84C; }
        .ob-radio-dot { width:7px; height:7px; border-radius:50%; background:#0A1628; opacity:0; transform:scale(0); transition:all 0.2s; }
        .ob-opt.selected .ob-radio-dot { opacity:1; transform:scale(1); }
        .ob-opt-title { font-size:15px; font-weight:500; color:#F0EDE6; margin-bottom:3px; }
        .ob-opt-desc { font-size:13px; color:var(--muted); font-weight:300; }
        .ob-btn { width:100%; padding:15px; background:linear-gradient(135deg,#C9A84C,#E8C96A); border:none; border-radius:8px; color:#07111E; font-family:'Space Mono',monospace; font-size:12px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; transition:all 0.25s ease; margin-top:4px; }
        .ob-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(201,168,76,0.35); }
        .ob-progress { display:flex; justify-content:center; gap:6px; margin-top:24px; }
        .ob-prog { height:3px; border-radius:2px; background:rgba(255,255,255,0.07); width:10px; }
        .ob-prog.active { background:#C9A84C; width:24px; }
        @keyframes ob-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes ob-draw { to{stroke-dashoffset:0} }
        @keyframes ob-fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div className="ob-root">
        <div className="ob-bg" />

        <nav className="ob-nav">
          <span className="ob-brand">NF · NEUROFIX MED</span>
          <div className="ob-steps">
            <div className="ob-step active">1</div>
            <div className="ob-step-line" />
            <div className="ob-step">2</div>
            <div className="ob-step-line" />
            <div className="ob-step">3</div>
          </div>
        </nav>

        <div className="ob-side-left">
          <svg viewBox="0 0 120 320" fill="none" style={{width:'140px',height:'320px',opacity:0.35}}>
            <path d="M60 0 Q20 60 60 120 Q100 180 60 240 Q20 300 60 320" stroke="url(#wg)" strokeWidth="1.5" fill="none" opacity="0.7"/>
            <path d="M40 0 Q80 80 40 140 Q0 200 40 260 Q80 320 40 320" stroke="url(#wb)" strokeWidth="1" fill="none" opacity="0.4"/>
            <circle cx="60" cy="120" r="4" fill="#C9A84C" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite"/></circle>
            <circle cx="60" cy="240" r="3" fill="#C9A84C" opacity="0.7"><animate attributeName="opacity" values="0.7;0.2;0.7" dur="3s" repeatCount="indefinite"/></circle>
            <circle cx="40" cy="140" r="2.5" fill="#4A90C4" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite"/></circle>
            <defs>
              <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C9A84C" stopOpacity="0"/>
                <stop offset="30%" stopColor="#C9A84C" stopOpacity="0.8"/>
                <stop offset="70%" stopColor="#C9A84C" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
              </linearGradient>
              <linearGradient id="wb" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4A90C4" stopOpacity="0"/>
                <stop offset="50%" stopColor="#4A90C4" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="#4A90C4" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="ob-side-right">
          <div className="ob-brain">
            <div className="ob-brain-glow" />
            <svg viewBox="0 0 220 220" fill="none" style={{width:'100%',height:'100%',position:'relative',zIndex:1}}>
              <path d="M110 30 C75 30 45 55 40 85 C35 100 38 115 45 125 C40 135 42 150 52 158 C55 175 70 185 90 183 C100 192 110 195 110 195 C110 195 120 192 130 183 C150 185 165 175 168 158 C178 150 180 135 175 125 C182 115 185 100 180 85 C175 55 145 30 110 30Z" stroke="url(#bo)" strokeWidth="1.2" fill="none" opacity="0.5"/>
              <path d="M110 35 Q107 80 110 110 Q113 140 110 190" stroke="#C9A84C" strokeWidth="0.8" opacity="0.4" fill="none"/>
              <path d="M65 75 Q85 85 75 100 Q65 115 80 128" stroke="#4A90C4" strokeWidth="0.8" fill="none" opacity="0.35"/>
              <path d="M155 75 Q135 85 145 100 Q155 115 140 128" stroke="#4A90C4" strokeWidth="0.8" fill="none" opacity="0.35"/>
              <circle cx="80" cy="72" r="2.5" fill="#C9A84C" opacity="0.9"><animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.2s" repeatCount="indefinite"/></circle>
              <circle cx="140" cy="72" r="2" fill="#4A90C4" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="3.1s" repeatCount="indefinite"/></circle>
              <circle cx="110" cy="88" r="3" fill="#C9A84C" opacity="0.8"><animate attributeName="opacity" values="0.8;0.3;0.8" dur="2.4s" repeatCount="indefinite"/></circle>
              <circle cx="68" cy="105" r="2" fill="#C9A84C" opacity="0.7"><animate attributeName="opacity" values="0.7;0.1;0.7" dur="1.8s" repeatCount="indefinite"/></circle>
              <circle cx="152" cy="105" r="2.5" fill="#4A90C4" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.7s" repeatCount="indefinite"/></circle>
              <defs>
                <linearGradient id="bo" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.7"/>
                  <stop offset="50%" stopColor="#4A90C4" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="ob-side-icons">
            {(['🩺','📊','🧬'] as const).map((icon, i) => (
              <div key={i} className="ob-hex-icon">
                <svg viewBox="0 0 50 50" fill="none" style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
                  <polygon points="25,2 46,14 46,36 25,48 4,36 4,14" fill="rgba(74,144,196,0.08)" stroke="rgba(74,144,196,0.35)" strokeWidth="1"/>
                </svg>
                <span style={{position:'relative',zIndex:1}}>{icon}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ob-heartbeat">
          <svg viewBox="0 0 1440 36" preserveAspectRatio="none" fill="none" style={{width:'100%',height:'100%'}}>
            <path className="ob-hb-path" d="M0,18 L180,18 L200,18 L218,5 L236,31 L254,2 L272,34 L290,18 L310,18 L500,18 L520,18 L538,8 L556,28 L574,18 L594,18 L780,18 L800,18 L818,5 L836,31 L854,2 L872,34 L890,18 L910,18 L1440,18" stroke="#C9A84C" strokeWidth="1.2"/>
          </svg>
        </div>

        <main className="ob-main">
          <div className="ob-logo-wrap">
            <div className="ob-logo-box">
              <span className="ob-logo-nf">NF</span>
              <div className="ob-logo-sep" />
              <div className="ob-logo-text">
                <span className="ob-logo-neurofix">NEUROFIX</span>
                <span className="ob-logo-med">— MED —</span>
              </div>
            </div>
          </div>

          <div className="ob-heading">
            <div className="ob-gold-bar" />
            <h1>Bem-vindo ao <span className="ob-blue">Neuro</span><span className="ob-gold">Fix Med</span></h1>
            <p>Me conta um pouco sobre você para <strong>personalizar</strong> sua experiência de estudo.</p>
          </div>

          <div className="ob-card">
            <form action={salvarOnboarding}>
              <span className="ob-field-label">Semestre / Fase</span>
              <div className="ob-sel-wrap">
                <select name="semestre" required className="ob-select">
                  <option value="">Escolha seu semestre</option>
                  {['1','2','3','4','5','6','7','8','9','10','11','12'].map(n => (
                    <option key={n} value={n}>{n}º Semestre</option>
                  ))}
                  <option value="internato1">Internato – 1º ano</option>
                  <option value="internato2">Internato – 2º ano</option>
                  <option value="formado">Formado / Residência</option>
                </select>
                <span className="ob-sel-arrow">▾</span>
              </div>

              <span className="ob-field-label">Principal foco agora</span>
              <FocoSelector />

              <button type="submit" className="ob-btn">Continuar →</button>
              <div className="ob-progress">
                <div className="ob-prog active" />
                <div className="ob-prog" />
                <div className="ob-prog" />
                <div className="ob-prog" />
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
