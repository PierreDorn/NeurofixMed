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
  { value: 'enamed',     emoji: '📋', label: 'ENAMED',              desc: 'Preparação para o Exame Nacional de Desempenho' },
  { value: 'residencia', emoji: '🏥', label: 'Residência médica',   desc: 'Concursos de residência' },
  { value: 'revisao',    emoji: '🔁', label: 'Revisão geral',       desc: 'Consolidar o que já estudei' },
];

const perfilOpcoes = [
  { value: 'tdah',     emoji: '⚡', label: 'TDAH',    desc: 'Blocos curtos e foco no próximo passo' },
  { value: 'tea',      emoji: '🔷', label: 'TEA',     desc: 'Estrutura fixa e menos ambiguidade' },
  { value: 'dislexia', emoji: '📖', label: 'Dislexia',desc: 'Frases curtas e linguagem direta' },
  { value: 'padrao',   emoji: '📝', label: 'Padrão',  desc: 'Explicação tradicional, sem adaptações' },
];

export default function OnboardingPage() {
  return (
    <>
      <style>{`
        body { margin: 0; }
        .ob-radio-group { display: flex; flex-direction: column; gap: 8px; }
        .ob-option { display: grid; grid-template-columns: 20px 36px 1fr; align-items: center; gap: 12px; background: #0f0f0f; border: 1px solid #222; border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: border-color 0.15s; }
        .ob-option:hover { border-color: rgba(201,164,85,0.4); }
        .ob-option input[type="radio"] { accent-color: #C9A455; width: 16px; height: 16px; margin: 0; cursor: pointer; }
        .ob-option input[type="radio"]:checked ~ * { color: #f0ede6; }
        .ob-emoji { font-size: 18px; text-align: center; line-height: 1; }
        .ob-label { font-size: 14px; font-weight: 700; color: #e0ddd6; }
        .ob-desc  { font-size: 12px; color: #555; margin-top: 2px; }
        select { width: 100%; background: #0f0f0f; border: 1px solid #222; border-radius: 10px; padding: 13px 16px; color: #f0ede6; font-size: 14px; outline: none; cursor: pointer; font-family: inherit; }
        select:focus { border-color: rgba(201,164,85,0.5); }
        select option { background: #111; }
      `}</style>

      <main style={{
        minHeight: '100vh',
        background: '#050505',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,164,85,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(107,158,196,0.05) 0%, transparent 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>

          {/* ── Logo ── */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Image src="/logo.png" alt="NeuroFix Med" width={260} height={78}
                style={{ height: '68px', width: 'auto', objectFit: 'contain' }} priority />
            </div>
            <div style={{
              width: '100px', height: '1px', margin: '0 auto 18px',
              background: 'linear-gradient(90deg, transparent, #C9A455 40%, #6B9EC4 60%, transparent)',
            }} />
            <p style={{ fontSize: '15px', color: '#6B9EC4', margin: 0, lineHeight: '1.6' }}>
              Conta um pouco sobre você para personalizar sua experiência.
            </p>
          </div>

          {/* ── Card do formulário ── */}
          <div style={{
            background: '#0c0c0c',
            border: '1px solid rgba(201,164,85,0.15)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
            position: 'relative' as const,
            overflow: 'hidden',
          }}>
            {/* linha dourada no topo */}
            <div style={{
              position: 'absolute' as const, top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, transparent, #C9A455 50%, transparent)',
            }} />

            <form action={salvarOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

              {/* Semestre */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#C9A455', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>
                  Semestre / Fase
                </div>
                <select name="semestre" required>
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
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#C9A455', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '10px' }}>
                  Principal foco agora
                </div>
                <div className="ob-radio-group">
                  {focoOpcoes.map(({ value, emoji, label, desc }) => (
                    <label key={value} className="ob-option">
                      <input type="radio" name="foco" value={value} required />
                      <span className="ob-emoji">{emoji}</span>
                      <div>
                        <div className="ob-label">{label}</div>
                        <div className="ob-desc">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Perfil cognitivo */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#C9A455', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: '4px' }}>
                  Como você aprende melhor?
                </div>
                <p style={{ fontSize: '12px', color: '#444', marginBottom: '10px', lineHeight: '1.5' }}>
                  Adapta como os conteúdos são apresentados para você.
                </p>
                <div className="ob-radio-group">
                  {perfilOpcoes.map(({ value, emoji, label, desc }) => (
                    <label key={value} className="ob-option">
                      <input type="radio" name="perfil_cognitivo" value={value} defaultChecked={value === 'padrao'} />
                      <span className="ob-emoji">{emoji}</span>
                      <div>
                        <div className="ob-label">{label}</div>
                        <div className="ob-desc">{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Botão */}
              <button type="submit" style={{
                width: '100%', padding: '15px',
                background: 'linear-gradient(135deg, #C9A455, #E8CA7A)',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontSize: '14px', fontWeight: '800', color: '#0a0a0a',
                letterSpacing: '0.02em', boxShadow: '0 8px 24px rgba(201,164,85,0.2)',
              }}>
                Começar meu plano de estudos →
              </button>

              <p style={{ textAlign: 'center', fontSize: '11px', color: '#333', lineHeight: '1.5', margin: 0 }}>
                Você pode alterar essas informações no seu perfil a qualquer momento.
              </p>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
