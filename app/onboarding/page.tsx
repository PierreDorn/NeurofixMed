import Image from 'next/image';
import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

async function salvarOnboarding(formData: FormData) {
  'use server';
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  await supabase.from('student_profiles').upsert({
    user_id: user.id,
    semestre: String(formData.get('semestre') ?? ''),
    foco: String(formData.get('foco') ?? ''),
    perfil_cognitivo: String(formData.get('perfil_cognitivo') ?? 'padrao'),
    onboarding_done: true,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  redirect('/dashboard');
}

const focoOpcoes = [
  { value: 'faculdade',  label: 'Provas da faculdade', desc: 'Gabaritar provas semestrais e internas',     svgPath: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0-1-1h4a2 2 0 0 0-1 1m-3 7h6m-6 4h4' },
  { value: 'enamed',     label: 'ENAMED',              desc: 'Exame Nacional de Desempenho',               svgPath: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  { value: 'residencia', label: 'Residência médica',   desc: 'Concursos de residência',                    svgPath: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 8v8M8 12h8' },
  { value: 'revisao',    label: 'Revisão geral',       desc: 'Consolidar o que já estudei',                svgPath: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
];

const perfilOpcoes = [
  { value: 'tdah',     label: 'TDAH',     desc: 'Blocos curtos, foco no próximo passo',  svgPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { value: 'tea',      label: 'TEA',      desc: 'Estrutura fixa, menos ambiguidade',     svgPath: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
  { value: 'dislexia', label: 'Dislexia', desc: 'Frases curtas, linguagem direta',       svgPath: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
  { value: 'padrao',   label: 'Padrão',   desc: 'Explicação tradicional',                svgPath: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
];

export default function OnboardingPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; background: #060b14; }

        .ob-root {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── Background atmosférico ── */
        .ob-bg {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 90% 80% at 10% 50%, rgba(15,40,110,0.65) 0%, transparent 55%),
            radial-gradient(ellipse 70% 60% at 90% 40%, rgba(10,30,90,0.55) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 50% 100%, rgba(20,50,120,0.3) 0%, transparent 50%),
            #060b14;
          z-index: 0;
        }

        /* ── Decoração esquerda: estetoscópio ── */
        .ob-deco-left {
          position: fixed;
          left: 0; top: 0; bottom: 0;
          width: 340px;
          z-index: 1;
          pointer-events: none;
          opacity: 0.25;
        }

        /* ── Decoração direita: cérebro médico ── */
        .ob-deco-right {
          position: fixed;
          right: 0; top: 0; bottom: 0;
          width: 380px;
          z-index: 1;
          pointer-events: none;
          opacity: 0.3;
        }

        /* ── ECG no rodapé ── */
        .ob-ecg {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          z-index: 1;
          pointer-events: none;
          opacity: 0.45;
        }

        /* ── Header ── */
        .ob-header {
          position: relative; z-index: 10;
          padding: 18px 40px;
          border-bottom: 1px solid rgba(107,158,196,0.12);
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(6,11,20,0.6);
          backdrop-filter: blur(8px);
        }
        .ob-steps { display: flex; align-items: center; gap: 6px; }
        .ob-step-circle {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700;
          border: 1px solid rgba(201,164,85,0.5);
          color: #C9A455; background: rgba(201,164,85,0.08);
        }
        .ob-step-circle.dim { border-color: rgba(107,158,196,0.2); color: rgba(107,158,196,0.4); background: transparent; }
        .ob-step-bar { width: 28px; height: 1px; background: rgba(107,158,196,0.2); }

        /* ── Hero ── */
        .ob-hero {
          position: relative; z-index: 10;
          text-align: center;
          padding: 48px 24px 36px;
        }
        .ob-hero-logo { margin-bottom: 20px; }
        .ob-hero-bar {
          width: 120px; height: 1px; margin: 0 auto 20px;
          background: linear-gradient(90deg, transparent, #C9A455 40%, #6B9EC4 60%, transparent);
        }
        .ob-hero h1 {
          font-size: 36px; font-weight: 900;
          letter-spacing: -0.02em; line-height: 1.1;
          color: #f0ede6; margin-bottom: 10px;
        }
        .ob-hero h1 .blue { color: #6B9EC4; }
        .ob-hero h1 .gold { color: #C9A455; }
        .ob-hero p {
          font-size: 15px; color: #7a9ab5; line-height: 1.6;
        }
        .ob-hero p .hl { color: #C9A455; font-weight: 600; }

        /* ── Formulário ── */
        .ob-body {
          position: relative; z-index: 10;
          flex: 1;
          display: flex; align-items: flex-start; justify-content: center;
          padding: 0 24px 80px;
        }
        .ob-card {
          width: 100%; max-width: 640px;
          background: rgba(8,16,32,0.82);
          border: 1px solid rgba(107,158,196,0.18);
          border-radius: 18px;
          padding: 36px 32px;
          backdrop-filter: blur(16px);
          box-shadow: 0 0 0 1px rgba(201,164,85,0.05), 0 40px 80px rgba(0,0,0,0.6);
          position: relative; overflow: hidden;
        }
        .ob-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #C9A455 30%, #6B9EC4 70%, transparent);
        }

        .ob-flabel {
          display: flex; align-items: center; gap: 8px;
          font-size: 10px; font-weight: 700;
          color: #C9A455; text-transform: uppercase;
          letter-spacing: 0.2em; margin-bottom: 10px;
        }
        .ob-flabel svg { width: 13px; height: 13px; flex-shrink: 0; }

        .ob-select {
          width: 100%;
          background: rgba(5,10,20,0.9);
          border: 1px solid rgba(107,158,196,0.18);
          border-radius: 10px;
          padding: 13px 16px;
          color: #c8d8e8; font-size: 14px;
          outline: none; cursor: pointer;
          font-family: inherit; appearance: none;
          transition: border-color 0.2s;
        }
        .ob-select:focus { border-color: rgba(201,164,85,0.45); }
        .ob-select option { background: #0a1525; }

        .ob-grid { display: flex; flex-direction: column; gap: 7px; }
        .ob-opt {
          display: grid;
          grid-template-columns: 18px 42px 1fr;
          align-items: center; gap: 14px;
          padding: 12px 16px;
          background: rgba(5,12,28,0.7);
          border: 1px solid rgba(107,158,196,0.1);
          border-radius: 10px; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .ob-opt:hover { border-color: rgba(107,158,196,0.32); background: rgba(10,22,48,0.8); }
        .ob-opt input[type="radio"] {
          accent-color: #C9A455;
          width: 15px; height: 15px; margin: 0; cursor: pointer; flex-shrink: 0;
        }
        .ob-badge {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(145deg, rgba(25,60,150,0.7), rgba(15,40,110,0.9));
          border: 1px solid rgba(107,158,196,0.22);
          display: flex; align-items: center; justify-content: center;
        }
        .ob-badge svg { width: 17px; height: 17px; stroke: #6B9EC4; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
        .ob-opt-t { font-size: 14px; font-weight: 600; color: #dde9f5; }
        .ob-opt-d { font-size: 12px; color: #3a5570; margin-top: 2px; }

        .ob-sep {
          display: flex; align-items: center; gap: 12px; margin: 2px 0;
        }
        .ob-sep-line { flex: 1; height: 1px; background: rgba(107,158,196,0.08); }
        .ob-sep-txt { font-size: 9px; color: #1e3050; letter-spacing: 0.18em; text-transform: uppercase; }

        .ob-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #C9A455 0%, #E8CA7A 100%);
          border: none; border-radius: 10px; cursor: pointer;
          font-size: 14px; font-weight: 800; color: #080808;
          letter-spacing: 0.05em; font-family: inherit;
          box-shadow: 0 6px 24px rgba(201,164,85,0.28), 0 2px 6px rgba(201,164,85,0.15);
          transition: opacity 0.15s, transform 0.1s;
        }
        .ob-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .ob-dots {
          display: flex; justify-content: center; gap: 7px;
          margin-top: 22px; position: relative; z-index: 10;
          padding-bottom: 16px;
        }
        .ob-dot { height: 3px; border-radius: 2px; }
      `}</style>

      {/* Fundo */}
      <div className="ob-bg" />

      {/* Decoração Esquerda — estetoscópio */}
      <div className="ob-deco-left">
        <svg viewBox="0 0 340 900" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
          {/* Tubo */}
          <path d="M280 100 C280 100 260 150 220 200 C180 250 120 280 100 340 C80 400 90 480 110 540 C130 600 160 640 170 700 C180 760 170 820 160 880"
            stroke="#6B9EC4" strokeWidth="18" fill="none" strokeLinecap="round" opacity="0.8"/>
          {/* Cabeça */}
          <circle cx="170" cy="700" r="55" stroke="#6B9EC4" strokeWidth="10" fill="none"/>
          <circle cx="170" cy="700" r="32" stroke="#C9A455" strokeWidth="5" fill="rgba(201,164,85,0.06)" opacity="0.7"/>
          <circle cx="170" cy="700" r="14" fill="rgba(107,158,196,0.3)" stroke="#6B9EC4" strokeWidth="3"/>
          {/* Ouvidos */}
          <circle cx="280" cy="100" r="22" stroke="#6B9EC4" strokeWidth="8" fill="rgba(6,11,20,0.5)"/>
          <circle cx="280" cy="100" r="10" fill="rgba(107,158,196,0.2)" stroke="#6B9EC4" strokeWidth="3"/>
          {/* Brilhos */}
          <circle cx="220" cy="250" r="4" fill="#C9A455" opacity="0.5"/>
          <circle cx="140" cy="380" r="3" fill="#6B9EC4" opacity="0.4"/>
          <circle cx="120" cy="480" r="4" fill="#C9A455" opacity="0.35"/>
        </svg>
      </div>

      {/* Decoração Direita — cérebro + hexágonos */}
      <div className="ob-deco-right">
        <svg viewBox="0 0 380 900" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
          {/* Glow do cérebro */}
          <ellipse cx="200" cy="300" rx="130" ry="110" fill="rgba(30,70,180,0.12)"/>
          <ellipse cx="200" cy="300" rx="100" ry="85" stroke="rgba(107,158,196,0.3)" strokeWidth="1" fill="none"/>
          {/* Cérebro — contorno */}
          <path d="M130 280 C120 240 140 200 170 195 C185 192 195 200 200 210 C205 200 215 192 230 195 C260 200 280 240 270 280 C280 300 275 330 260 345 C250 355 240 360 230 358 C225 370 215 378 200 378 C185 378 175 370 170 358 C160 360 150 355 140 345 C125 330 120 300 130 280Z"
            stroke="#6B9EC4" strokeWidth="2.5" fill="rgba(20,50,130,0.18)"/>
          {/* Sulcos cerebrais */}
          <path d="M165 225 Q185 215 200 225 Q215 215 235 225" stroke="#6B9EC4" strokeWidth="1.2" fill="none" opacity="0.5"/>
          <path d="M148 260 Q175 248 200 258 Q225 248 252 260" stroke="#6B9EC4" strokeWidth="1.2" fill="none" opacity="0.45"/>
          <path d="M140 295 Q170 285 200 293 Q230 285 260 295" stroke="#6B9EC4" strokeWidth="1.2" fill="none" opacity="0.4"/>
          <path d="M148 330 Q175 320 200 328 Q225 320 252 330" stroke="#6B9EC4" strokeWidth="1.2" fill="none" opacity="0.35"/>
          {/* Cruz médica com brilho */}
          <rect x="188" y="175" width="24" height="80" rx="5" fill="#C9A455" opacity="0.75"/>
          <rect x="160" y="203" width="80" height="24" rx="5" fill="#C9A455" opacity="0.75"/>
          <circle cx="200" cy="215" r="42" stroke="rgba(201,164,85,0.2)" strokeWidth="1" fill="none"/>
          <circle cx="200" cy="215" r="28" stroke="rgba(201,164,85,0.12)" strokeWidth="1" fill="none"/>
          {/* Hexágono 1 — grande */}
          <g transform="translate(260, 450)">
            <polygon points="40,0 80,23 80,69 40,92 0,69 0,23" stroke="#6B9EC4" strokeWidth="1.8" fill="rgba(20,50,130,0.2)"/>
            <line x1="27" y1="46" x2="53" y2="46" stroke="#6B9EC4" strokeWidth="2"/>
            <line x1="40" y1="33" x2="40" y2="59" stroke="#6B9EC4" strokeWidth="2"/>
          </g>
          {/* Hexágono 2 — médio */}
          <g transform="translate(130, 530)">
            <polygon points="30,0 60,17 60,52 30,70 0,52 0,17" stroke="#6B9EC4" strokeWidth="1.5" fill="rgba(20,50,130,0.15)"/>
            <circle cx="30" cy="35" r="12" stroke="#C9A455" strokeWidth="1.5" fill="none" opacity="0.7"/>
            <path d="M22 35 L27 30 L30 38 L33 26 L38 35" stroke="#C9A455" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
          </g>
          {/* Hexágono 3 — pequeno */}
          <g transform="translate(300, 600)">
            <polygon points="22,0 44,13 44,38 22,51 0,38 0,13" stroke="#C9A455" strokeWidth="1.5" fill="rgba(201,164,85,0.08)"/>
            <path d="M11 25 L17 19 L22 28 L27 16 L33 25" stroke="#C9A455" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
          </g>
          {/* Pontos de conexão neural */}
          {[[200,420],[160,460],[240,470],[180,510],[220,500]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="#6B9EC4" opacity="0.4"/>
          ))}
          <line x1="200" y1="420" x2="160" y2="460" stroke="#6B9EC4" strokeWidth="0.8" opacity="0.25"/>
          <line x1="160" y1="460" x2="180" y2="510" stroke="#6B9EC4" strokeWidth="0.8" opacity="0.25"/>
          <line x1="240" y1="470" x2="220" y2="500" stroke="#6B9EC4" strokeWidth="0.8" opacity="0.25"/>
        </svg>
      </div>

      {/* ECG linha */}
      <div className="ob-ecg">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'100%'}}>
          <path d="M0 30 L160 30 L180 30 L200 8 L215 52 L225 2 L238 58 L252 30 L280 30 L480 30 L500 30 L520 8 L535 52 L545 2 L558 58 L572 30 L600 30 L800 30 L820 30 L840 8 L855 52 L865 2 L878 58 L892 30 L920 30 L1120 30 L1140 30 L1160 8 L1175 52 L1185 2 L1198 58 L1212 30 L1440 30"
            stroke="#C9A455" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Conteúdo */}
      <div className="ob-root" style={{position:'relative', zIndex:10}}>

        {/* Header */}
        <header className="ob-header">
          <Image src="/logo.png" alt="NeuroFix Med" width={140} height={42}
            style={{ height: '34px', width: 'auto', objectFit: 'contain' }} priority />
          <div className="ob-steps">
            <div className="ob-step-circle">1</div>
            <div className="ob-step-bar" />
            <div className="ob-step-circle dim">2</div>
            <div className="ob-step-bar" />
            <div className="ob-step-circle dim">3</div>
          </div>
        </header>

        {/* Hero */}
        <div className="ob-hero">
          <div className="ob-hero-logo">
            <Image src="/logo.png" alt="NeuroFix Med" width={220} height={66}
              style={{ height: '58px', width: 'auto', objectFit: 'contain' }} priority />
          </div>
          <div className="ob-hero-bar" />
          <h1>Bem-vindo ao <span className="blue">NeuroFix</span> <span className="gold">Med</span></h1>
          <p>Me conta um pouco sobre você para <span className="hl">personalizar</span> sua experiência de estudo.</p>
        </div>

        {/* Formulário */}
        <div className="ob-body">
          <div className="ob-card">
            <form action={salvarOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

              {/* Semestre */}
              <div>
                <div className="ob-flabel">
                  <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Semestre / Fase
                </div>
                <select name="semestre" required className="ob-select">
                  <option value="">Escolha seu semestre</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                    <option key={n} value={String(n)}>{n}º semestre</option>
                  ))}
                  <option value="internato1">Internato – 1º ano</option>
                  <option value="internato2">Internato – 2º ano</option>
                  <option value="formado">Formado / Residência</option>
                </select>
              </div>

              {/* Foco */}
              <div>
                <div className="ob-flabel">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                  Principal foco agora
                </div>
                <div className="ob-grid">
                  {focoOpcoes.map(({ value, label, desc, svgPath }) => (
                    <label key={value} className="ob-opt">
                      <input type="radio" name="foco" value={value} required />
                      <div className="ob-badge">
                        <svg viewBox="0 0 24 24"><path d={svgPath}/></svg>
                      </div>
                      <div>
                        <div className="ob-opt-t">{label}</div>
                        <div className="ob-opt-d">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divisor */}
              <div className="ob-sep">
                <div className="ob-sep-line"/>
                <span className="ob-sep-txt">Perfil de aprendizado</span>
                <div className="ob-sep-line"/>
              </div>

              {/* Perfil */}
              <div>
                <div className="ob-flabel">
                  <svg viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.14-3.14Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.14-3.14Z"/></svg>
                  Como você aprende melhor?
                </div>
                <div className="ob-grid">
                  {perfilOpcoes.map(({ value, label, desc, svgPath }) => (
                    <label key={value} className="ob-opt">
                      <input type="radio" name="perfil_cognitivo" value={value} defaultChecked={value === 'padrao'} />
                      <div className="ob-badge">
                        <svg viewBox="0 0 24 24"><path d={svgPath}/></svg>
                      </div>
                      <div>
                        <div className="ob-opt-t">{label}</div>
                        <div className="ob-opt-d">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="ob-btn">
                COMEÇAR MEU PLANO DE ESTUDOS →
              </button>

              <p style={{ textAlign: 'center', fontSize: '11px', color: '#1e3050', lineHeight: '1.5' }}>
                Você pode alterar essas informações no seu perfil a qualquer momento.
              </p>
            </form>
          </div>
        </div>

        {/* Progress dots */}
        <div className="ob-dots">
          <div className="ob-dot" style={{ width: '36px', background: '#C9A455' }} />
          <div className="ob-dot" style={{ width: '22px', background: 'rgba(107,158,196,0.2)' }} />
          <div className="ob-dot" style={{ width: '22px', background: 'rgba(107,158,196,0.2)' }} />
          <div className="ob-dot" style={{ width: '22px', background: 'rgba(107,158,196,0.2)' }} />
        </div>
      </div>
    </>
  );
}
