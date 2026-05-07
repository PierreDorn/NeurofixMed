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
  {
    value: 'faculdade', label: 'Provas da faculdade', desc: 'Gabaritar provas semestrais e internas',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>`,
  },
  {
    value: 'enamed', label: 'ENAMED', desc: 'Preparação para o Exame Nacional de Desempenho',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  },
  {
    value: 'residencia', label: 'Residência médica', desc: 'Concursos de residência',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
  },
  {
    value: 'revisao', label: 'Revisão geral', desc: 'Consolidar o que já estudei',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
  },
];

const perfilOpcoes = [
  {
    value: 'tdah', label: 'TDAH', desc: 'Blocos curtos, foco no próximo passo',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  },
  {
    value: 'tea', label: 'TEA', desc: 'Estrutura fixa, menos ambiguidade',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  },
  {
    value: 'dislexia', label: 'Dislexia', desc: 'Frases curtas, linguagem direta',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  },
  {
    value: 'padrao', label: 'Padrão', desc: 'Explicação tradicional',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  },
];

export default function OnboardingPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }

        .ob-page {
          min-height: 100vh;
          background:
            radial-gradient(ellipse 80% 70% at 15% 50%, rgba(20,45,100,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 85% 40%, rgba(15,35,80,0.45) 0%, transparent 55%),
            radial-gradient(ellipse 100% 60% at 50% 0%, rgba(201,164,85,0.06) 0%, transparent 40%),
            #060b14;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
          padding-bottom: 60px;
        }

        /* ── Decoração esquerda: estetoscópio curva ── */
        .deco-left {
          position: absolute;
          left: -40px; top: 50%;
          transform: translateY(-50%);
          width: 280px; height: 500px;
          opacity: 0.18;
          pointer-events: none;
        }

        /* ── Decoração direita: cérebro + hexágonos ── */
        .deco-right {
          position: absolute;
          right: -20px; top: 50%;
          transform: translateY(-50%);
          width: 320px; height: 520px;
          opacity: 0.22;
          pointer-events: none;
        }

        /* ── ECG linha no rodapé ── */
        .deco-ecg {
          position: absolute;
          bottom: 16px; left: 0; right: 0;
          pointer-events: none;
          opacity: 0.5;
        }

        /* ── Conteúdo central ── */
        .ob-center {
          width: 100%;
          max-width: 680px;
          padding: 40px 24px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }

        /* Logo */
        .ob-logo { margin-bottom: 24px; }

        /* Título */
        .ob-title {
          font-size: 30px; font-weight: 800;
          letter-spacing: -0.02em; text-align: center;
          color: #f0ede6; margin-bottom: 10px; line-height: 1.2;
        }
        .ob-title .blue { color: #6B9EC4; }
        .ob-title .gold { color: #C9A455; }

        .ob-subtitle {
          font-size: 14px; color: #8aa0b8;
          text-align: center; line-height: 1.6; margin-bottom: 36px;
        }
        .ob-subtitle .highlight { color: #C9A455; font-weight: 600; }

        /* Card do formulário */
        .ob-card {
          width: 100%;
          background: rgba(10,18,35,0.85);
          border: 1px solid rgba(107,158,196,0.2);
          border-radius: 16px;
          padding: 32px 28px;
          backdrop-filter: blur(12px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(107,158,196,0.05);
          position: relative;
          overflow: hidden;
        }
        .ob-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #C9A455 35%, #6B9EC4 65%, transparent);
        }

        /* Section label */
        .ob-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700; color: #C9A455;
          text-transform: uppercase; letter-spacing: 0.18em;
          margin-bottom: 12px;
        }
        .ob-label svg { width: 14px; height: 14px; stroke: #C9A455; }

        /* Select */
        .ob-select {
          width: 100%;
          background: rgba(6,11,20,0.8);
          border: 1px solid rgba(107,158,196,0.2);
          border-radius: 10px;
          padding: 13px 16px 13px 42px;
          color: #c8d8e8; font-size: 14px;
          outline: none; cursor: pointer;
          font-family: inherit; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B9EC4' stroke-width='2'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E"), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B9EC4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-position: 14px center, calc(100% - 14px) center;
          background-repeat: no-repeat, no-repeat;
          background-size: 16px, 14px;
        }
        .ob-select:focus { border-color: rgba(201,164,85,0.5); }
        .ob-select option { background: #0a1220; }

        /* Options */
        .ob-opts { display: flex; flex-direction: column; gap: 8px; }
        .ob-opt {
          display: grid;
          grid-template-columns: 20px 44px 1fr;
          align-items: center; gap: 12px;
          background: rgba(6,11,20,0.6);
          border: 1px solid rgba(107,158,196,0.12);
          border-radius: 10px; padding: 12px 16px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .ob-opt:hover { border-color: rgba(107,158,196,0.35); background: rgba(10,20,45,0.8); }
        .ob-opt input[type="radio"] { accent-color: #C9A455; width: 16px; height: 16px; margin: 0; cursor: pointer; }
        .ob-icon-badge {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, rgba(30,70,160,0.6), rgba(20,50,120,0.8));
          border: 1px solid rgba(107,158,196,0.25);
          display: flex; align-items: center; justify-content: center;
        }
        .ob-icon-badge svg { width: 18px; height: 18px; color: #6B9EC4; stroke: #6B9EC4; }
        .ob-opt-title { font-size: 14px; font-weight: 600; color: #dde8f0; }
        .ob-opt-desc  { font-size: 12px; color: #4a6070; margin-top: 2px; }

        /* Divisor */
        .ob-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 4px 0;
        }
        .ob-divider-line { flex: 1; height: 1px; background: rgba(107,158,196,0.1); }
        .ob-divider-text { font-size: 10px; color: #2a3a4a; letter-spacing: 0.1em; }

        /* Botão */
        .ob-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #C9A455, #E8CA7A);
          border: none; border-radius: 10px; cursor: pointer;
          font-size: 14px; font-weight: 800; color: #0a0a0a;
          letter-spacing: 0.04em; font-family: inherit;
          box-shadow: 0 8px 24px rgba(201,164,85,0.3), 0 2px 8px rgba(201,164,85,0.2);
          transition: opacity 0.15s, transform 0.1s;
        }
        .ob-btn:hover { opacity: 0.92; transform: translateY(-1px); }

        /* Progress dots */
        .ob-progress {
          display: flex; gap: 8px; justify-content: center;
          margin-top: 24px;
        }
        .ob-dot {
          height: 4px; border-radius: 2px;
          background: rgba(107,158,196,0.25);
        }
      `}</style>

      <div className="ob-page">

        {/* ── Decoração Esquerda: curvas de estetoscópio ── */}
        <div className="deco-left">
          <svg viewBox="0 0 280 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="120" r="50" stroke="#6B9EC4" strokeWidth="12" fill="none"/>
            <path d="M60 170 C60 280 140 300 180 380 C220 460 200 490 180 500" stroke="#6B9EC4" strokeWidth="12" fill="none" strokeLinecap="round"/>
            <circle cx="60" cy="120" r="20" stroke="#C9A455" strokeWidth="4" fill="none" opacity="0.6"/>
            <circle cx="60" cy="120" r="8" fill="#C9A455" opacity="0.4"/>
            <circle cx="100" cy="80" r="8" stroke="#6B9EC4" strokeWidth="3" fill="none"/>
            <circle cx="30" cy="80" r="8" stroke="#6B9EC4" strokeWidth="3" fill="none"/>
          </svg>
        </div>

        {/* ── Decoração Direita: cérebro + hexágonos ── */}
        <div className="deco-right">
          <svg viewBox="0 0 320 520" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cérebro estilizado */}
            <ellipse cx="160" cy="180" rx="90" ry="75" stroke="#6B9EC4" strokeWidth="2" fill="rgba(30,70,160,0.08)"/>
            <path d="M100 155 Q120 130 140 155 Q160 130 180 155 Q200 130 220 155" stroke="#6B9EC4" strokeWidth="1.5" fill="none" opacity="0.6"/>
            <path d="M95 175 Q130 165 160 175 Q190 165 225 175" stroke="#6B9EC4" strokeWidth="1.5" fill="none" opacity="0.5"/>
            <path d="M100 195 Q130 190 160 195 Q190 190 220 195" stroke="#6B9EC4" strokeWidth="1.5" fill="none" opacity="0.4"/>
            {/* Cruz médica com brilho */}
            <rect x="148" y="100" width="24" height="80" rx="4" fill="#C9A455" opacity="0.7"/>
            <rect x="120" y="128" width="80" height="24" rx="4" fill="#C9A455" opacity="0.7"/>
            <circle cx="160" cy="140" r="30" fill="rgba(201,164,85,0.08)" stroke="rgba(201,164,85,0.3)" strokeWidth="1"/>
            {/* Hexágonos médicos */}
            <g transform="translate(220, 300)" opacity="0.6">
              <polygon points="25,0 50,14 50,43 25,57 0,43 0,14" stroke="#6B9EC4" strokeWidth="1.5" fill="rgba(30,70,160,0.15)"/>
              <line x1="17" y1="28" x2="33" y2="28" stroke="#6B9EC4" strokeWidth="1.5"/>
              <line x1="25" y1="20" x2="25" y2="36" stroke="#6B9EC4" strokeWidth="1.5"/>
            </g>
            <g transform="translate(160, 370)" opacity="0.45">
              <polygon points="20,0 40,11 40,34 20,46 0,34 0,11" stroke="#6B9EC4" strokeWidth="1.5" fill="rgba(30,70,160,0.12)"/>
              <circle cx="20" cy="23" r="7" stroke="#6B9EC4" strokeWidth="1.5" fill="none"/>
              <line x1="20" y1="18" x2="20" y2="28" stroke="#6B9EC4" strokeWidth="1.2"/>
              <line x1="15" y1="23" x2="25" y2="23" stroke="#6B9EC4" strokeWidth="1.2"/>
            </g>
            <g transform="translate(250, 390)" opacity="0.35">
              <polygon points="18,0 36,10 36,31 18,41 0,31 0,10" stroke="#C9A455" strokeWidth="1.5" fill="rgba(201,164,85,0.06)"/>
              <path d="M9 20 L13 16 L18 24 L23 12 L27 20" stroke="#C9A455" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            </g>
          </svg>
        </div>

        {/* ── ECG linha ── */}
        <div className="deco-ecg">
          <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
            <path d="M0 30 L200 30 L220 30 L240 10 L260 50 L270 5 L285 55 L300 30 L320 30 L520 30 L540 30 L560 10 L580 50 L590 5 L605 55 L620 30 L640 30 L840 30 L860 30 L880 10 L900 50 L910 5 L925 55 L940 30 L960 30 L1200 30"
              stroke="#C9A455" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
          </svg>
        </div>

        {/* ── Conteúdo central ── */}
        <div className="ob-center">

          {/* Logo */}
          <div className="ob-logo">
            <Image src="/logo.png" alt="NeuroFix Med" width={240} height={72}
              style={{ height: '64px', width: 'auto', objectFit: 'contain' }} priority />
          </div>

          {/* Título */}
          <h1 className="ob-title">
            Bem-vindo ao <span className="blue">NeuroFix</span> <span className="gold">Med</span>
          </h1>
          <p className="ob-subtitle">
            Me conta um pouco sobre você para <span className="highlight">personalizar</span> sua experiência.
          </p>

          {/* Card formulário */}
          <div className="ob-card">
            <form action={salvarOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

              {/* Semestre */}
              <div>
                <div className="ob-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
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
                <div className="ob-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                  Principal foco agora
                </div>
                <div className="ob-opts">
                  {focoOpcoes.map(({ value, label, desc, icon }) => (
                    <label key={value} className="ob-opt">
                      <input type="radio" name="foco" value={value} required />
                      <div className="ob-icon-badge" dangerouslySetInnerHTML={{ __html: icon }} />
                      <div>
                        <div className="ob-opt-title">{label}</div>
                        <div className="ob-opt-desc">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divisor */}
              <div className="ob-divider">
                <div className="ob-divider-line" />
                <span className="ob-divider-text">PERFIL DE APRENDIZADO</span>
                <div className="ob-divider-line" />
              </div>

              {/* Perfil cognitivo */}
              <div>
                <div className="ob-label">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46"/></svg>
                  Como você aprende melhor?
                </div>
                <div className="ob-opts">
                  {perfilOpcoes.map(({ value, label, desc, icon }) => (
                    <label key={value} className="ob-opt">
                      <input type="radio" name="perfil_cognitivo" value={value} defaultChecked={value === 'padrao'} />
                      <div className="ob-icon-badge" dangerouslySetInnerHTML={{ __html: icon }} />
                      <div>
                        <div className="ob-opt-title">{label}</div>
                        <div className="ob-opt-desc">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="ob-btn">
                COMEÇAR MEU PLANO DE ESTUDOS →
              </button>

              <p style={{ textAlign: 'center', fontSize: '11px', color: '#2a3a4a', lineHeight: '1.5' }}>
                Você pode alterar essas informações no seu perfil a qualquer momento.
              </p>
            </form>
          </div>

          {/* Progress dots */}
          <div className="ob-progress">
            <div className="ob-dot" style={{ width: '32px', background: '#C9A455' }} />
            <div className="ob-dot" style={{ width: '20px' }} />
            <div className="ob-dot" style={{ width: '20px' }} />
            <div className="ob-dot" style={{ width: '20px' }} />
          </div>
        </div>
      </div>
    </>
  );
}
