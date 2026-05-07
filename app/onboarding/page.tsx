import Image from 'next/image';
import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

async function salvarOnboarding(formData: FormData) {
  'use server';
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase.from('student_profiles').upsert({
    user_id:          user.id,
    semestre:         String(formData.get('semestre') ?? ''),
    foco:             String(formData.get('foco') ?? ''),
    perfil_cognitivo: String(formData.get('perfil_cognitivo') ?? 'padrao'),
    onboarding_done:  true,
    updated_at:       new Date().toISOString(),
  }, { onConflict: 'user_id' });

  redirect('/dashboard');
}

const focoOpcoes = [
  { value: 'faculdade',  emoji: '🎓', label: 'Provas da faculdade', desc: 'Gabaritar provas semestrais e internas' },
  { value: 'enamed',     emoji: '📋', label: 'ENAMED',              desc: 'Exame Nacional de Desempenho' },
  { value: 'residencia', emoji: '🏥', label: 'Residência médica',   desc: 'Concursos de residência' },
  { value: 'revisao',    emoji: '🔁', label: 'Revisão geral',       desc: 'Consolidar o que já estudei' },
];

const perfilOpcoes = [
  { value: 'tdah',     emoji: '⚡', label: 'TDAH',     desc: 'Blocos curtos, foco no próximo passo' },
  { value: 'tea',      emoji: '🔷', label: 'TEA',      desc: 'Estrutura fixa, menos ambiguidade' },
  { value: 'dislexia', emoji: '📖', label: 'Dislexia', desc: 'Frases curtas, linguagem direta' },
  { value: 'padrao',   emoji: '📝', label: 'Padrão',   desc: 'Explicação tradicional' },
];

export default function OnboardingPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }

        .ob-wrap {
          min-height: 100vh;
          background: #050505;
          background-image:
            radial-gradient(ellipse 100% 60% at 50% 0%, rgba(201,164,85,0.10) 0%, transparent 55%),
            radial-gradient(ellipse 70% 40% at 90% 90%, rgba(107,158,196,0.07) 0%, transparent 50%);
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
        }

        /* ── Header ── */
        .ob-header {
          padding: 20px 40px;
          border-bottom: 1px solid rgba(201,164,85,0.10);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ob-steps {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ob-step {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700;
          border: 1px solid rgba(201,164,85,0.3);
          color: #C9A455;
        }
        .ob-step-line { width: 32px; height: 1px; background: rgba(201,164,85,0.2); }

        /* ── Hero banner ── */
        .ob-hero {
          background: linear-gradient(135deg, #0a0a0a 0%, #111008 50%, #080d12 100%);
          border-bottom: 1px solid rgba(201,164,85,0.08);
          padding: 48px 40px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .ob-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A455' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .ob-hero-title {
          font-size: 32px; font-weight: 900;
          color: #f0ede6; line-height: 1.15;
          letter-spacing: -0.02em; margin: 0 0 12px;
          position: relative;
        }
        .ob-hero-title span.gold { color: #C9A455; }
        .ob-hero-title span.blue { color: #6B9EC4; }
        .ob-hero-sub {
          font-size: 15px; color: #6B9EC4;
          margin: 0; line-height: 1.6;
          position: relative;
        }

        /* ── Três pilares ── */
        .ob-pillars {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(201,164,85,0.08);
          border-bottom: 1px solid rgba(201,164,85,0.08);
        }
        .ob-pillar {
          background: #050505;
          padding: 20px 24px;
          display: flex; align-items: center; gap: 14px;
        }
        .ob-pillar-num {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(201,164,85,0.08);
          border: 1px solid rgba(201,164,85,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #C9A455;
          flex-shrink: 0;
        }
        .ob-pillar-title { font-size: 13px; font-weight: 700; color: #f0ede6; margin: 0 0 2px; }
        .ob-pillar-desc  { font-size: 11px; color: #555; margin: 0; }

        /* ── Formulário ── */
        .ob-body {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 48px 24px;
        }
        .ob-form-card {
          width: 100%; max-width: 580px;
          background: #0c0c0c;
          border: 1px solid rgba(201,164,85,0.15);
          border-radius: 16px;
          padding: 36px;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
          position: relative;
          overflow: hidden;
        }
        .ob-form-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #C9A455 40%, #6B9EC4 60%, transparent);
        }

        .ob-section-label {
          font-size: 10px; font-weight: 700;
          color: #C9A455; text-transform: uppercase;
          letter-spacing: 0.18em; margin-bottom: 10px;
          display: block;
        }
        .ob-select {
          width: 100%; background: #0a0a0a;
          border: 1px solid #222; border-radius: 8px;
          padding: 13px 16px; color: #f0ede6;
          font-size: 14px; outline: none; cursor: pointer;
          font-family: inherit; appearance: none;
        }
        .ob-select:focus { border-color: rgba(201,164,85,0.5); }
        .ob-select option { background: #111; }

        .ob-options { display: flex; flex-direction: column; gap: 8px; }
        .ob-opt {
          display: grid;
          grid-template-columns: 20px 32px 1fr;
          align-items: center;
          gap: 12px;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 8px;
          padding: 13px 16px;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .ob-opt:hover { border-color: rgba(201,164,85,0.35); background: #111; }
        .ob-opt input[type="radio"] {
          accent-color: #C9A455;
          width: 16px; height: 16px;
          margin: 0; cursor: pointer;
        }
        .ob-opt-emoji { font-size: 17px; text-align: center; }
        .ob-opt-title { font-size: 14px; font-weight: 600; color: #e8e5de; }
        .ob-opt-desc  { font-size: 12px; color: #484848; margin-top: 2px; }

        .ob-btn {
          width: 100%; padding: 16px;
          background: linear-gradient(135deg, #C9A455, #E8CA7A);
          border: none; border-radius: 8px; cursor: pointer;
          font-size: 15px; font-weight: 800; color: #0a0a0a;
          letter-spacing: 0.02em;
          box-shadow: 0 8px 24px rgba(201,164,85,0.25);
          font-family: inherit;
          transition: opacity 0.15s;
        }
        .ob-btn:hover { opacity: 0.92; }
      `}</style>

      <div className="ob-wrap">

        {/* ── Header ── */}
        <header className="ob-header">
          <Image src="/logo.png" alt="NeuroFix Med" width={160} height={48}
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }} priority />
          <div className="ob-steps">
            <div className="ob-step">1</div>
            <div className="ob-step-line" />
            <div className="ob-step" style={{ opacity: 0.35 }}>2</div>
            <div className="ob-step-line" style={{ opacity: 0.35 }} />
            <div className="ob-step" style={{ opacity: 0.35 }}>3</div>
          </div>
        </header>

        {/* ── Hero ── */}
        <div className="ob-hero">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <Image src="/logo.png" alt="NeuroFix Med" width={220} height={66}
              style={{ height: '58px', width: 'auto', objectFit: 'contain', position: 'relative' }} priority />
          </div>
          <h1 className="ob-hero-title">
            APERFEIÇOE SUA JORNADA<br />
            <span className="gold">NA MEDICINA.</span>
          </h1>
          <p className="ob-hero-sub">
            Personaliza sua experiência de estudo em menos de 1 minuto.
          </p>
        </div>

        {/* ── Três pilares ── */}
        <div className="ob-pillars">
          {[
            { n: '①', title: 'FOCO OTIMIZADO', desc: 'Plano diário baseado no seu semestre' },
            { n: '②', title: 'REVISÃO INTELIGENTE', desc: 'IA calcula o momento exato de revisar' },
            { n: '③', title: 'RACIOCÍNIO CLÍNICO', desc: 'Questões estilo prova com gabarito' },
          ].map(p => (
            <div key={p.n} className="ob-pillar">
              <div className="ob-pillar-num">{p.n}</div>
              <div>
                <p className="ob-pillar-title">{p.title}</p>
                <p className="ob-pillar-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Body / formulário ── */}
        <div className="ob-body">
          <div className="ob-form-card">
            <form action={salvarOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Semestre */}
              <div>
                <span className="ob-section-label">Semestre / Fase</span>
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
                <span className="ob-section-label">Principal foco agora</span>
                <div className="ob-options">
                  {focoOpcoes.map(({ value, emoji, label, desc }) => (
                    <label key={value} className="ob-opt">
                      <input type="radio" name="foco" value={value} required />
                      <span className="ob-opt-emoji">{emoji}</span>
                      <div>
                        <div className="ob-opt-title">{label}</div>
                        <div className="ob-opt-desc">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Perfil cognitivo */}
              <div>
                <span className="ob-section-label">Como você aprende melhor?</span>
                <p style={{ fontSize: '12px', color: '#3a3a3a', marginBottom: '10px', lineHeight: '1.5' }}>
                  Adapta a forma como os conteúdos são apresentados para você.
                </p>
                <div className="ob-options">
                  {perfilOpcoes.map(({ value, emoji, label, desc }) => (
                    <label key={value} className="ob-opt">
                      <input type="radio" name="perfil_cognitivo" value={value} defaultChecked={value === 'padrao'} />
                      <span className="ob-opt-emoji">{emoji}</span>
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

              <p style={{ textAlign: 'center', fontSize: '11px', color: '#2a2a2a', lineHeight: '1.5', margin: 0 }}>
                Você pode alterar essas informações no seu perfil a qualquer momento.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
