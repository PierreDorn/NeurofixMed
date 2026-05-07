import Image from 'next/image';
import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

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

const focoOpcoes = [
  { value: 'faculdade',  label: '🎓 Provas da faculdade', desc: 'Gabaritar provas semestrais e internas' },
  { value: 'enamed',     label: '📋 ENAMED',              desc: 'Preparação para o Exame Nacional de Desempenho' },
  { value: 'residencia', label: '🏥 Residência médica',   desc: 'Concursos de residência' },
  { value: 'revisao',    label: '🔁 Revisão geral',       desc: 'Consolidar e não esquecer o que já estudei' },
];

const perfilOpcoes = [
  { value: 'tdah',     label: '⚡ TDAH',         desc: 'Blocos curtos, checklist e foco no próximo passo' },
  { value: 'tea',      label: '🔷 TEA',           desc: 'Estrutura fixa, previsibilidade e menos ambiguidade' },
  { value: 'dislexia', label: '📖 Dislexia',      desc: 'Frases curtas, espaçamento maior e linguagem direta' },
  { value: 'padrao',   label: '📝 Padrão',        desc: 'Explicação tradicional, sem adaptações específicas' },
];

export default function OnboardingPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '540px' }}>

        {/* ── Logo + título ── */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <Image
              src="/logo.png"
              alt="NeuroFix Med"
              width={280}
              height={84}
              style={{ height: '72px', width: 'auto', objectFit: 'contain' }}
              priority
            />
          </div>
          <div style={{
            width: '80px', height: '1px',
            background: 'linear-gradient(90deg, transparent, #C9A455, transparent)',
            margin: '0 auto 20px',
          }} />
          <h1 style={{
            fontSize: '20px', fontWeight: '700',
            color: '#f0ede6', marginBottom: '8px', letterSpacing: '-0.01em',
          }}>
            Bem-vindo ao NeuroFix Med
          </h1>
          <p style={{ fontSize: '14px', color: '#6B9EC4', lineHeight: '1.6', margin: 0 }}>
            Me conta um pouco sobre você para personalizar sua experiência.
          </p>
        </div>

        {/* ── Formulário ── */}
        <form action={salvarOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Semestre */}
          <div>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: '700',
              color: '#C9A455', textTransform: 'uppercase' as const,
              letterSpacing: '0.12em', marginBottom: '10px',
            }}>
              Semestre / Fase
            </label>
            <select name="semestre" required style={{
              width: '100%', background: '#111111',
              border: '1px solid rgba(201,164,85,0.25)', borderRadius: '6px',
              padding: '13px 16px', color: '#f0ede6', fontSize: '14px',
              appearance: 'none' as const, outline: 'none', cursor: 'pointer',
            }}>
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
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: '700',
              color: '#C9A455', textTransform: 'uppercase' as const,
              letterSpacing: '0.12em', marginBottom: '10px',
            }}>
              Principal foco agora
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {focoOpcoes.map(({ value, label, desc }) => (
                <label key={value} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  background: '#111111', border: '1px solid #1e1e1e',
                  borderRadius: '8px', padding: '14px 16px', cursor: 'pointer',
                }}>
                  <input
                    type="radio" name="foco" value={value} required
                    style={{ accentColor: '#C9A455', width: '16px', height: '16px', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#f0ede6' }}>{label}</div>
                    <div style={{ fontSize: '12px', color: '#5a5a5a', marginTop: '2px' }}>{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Perfil cognitivo */}
          <div>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: '700',
              color: '#C9A455', textTransform: 'uppercase' as const,
              letterSpacing: '0.12em', marginBottom: '4px',
            }}>
              Como você aprende melhor?
            </label>
            <p style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '10px', lineHeight: '1.5' }}>
              Adapta a forma como os conteúdos são apresentados para você.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {perfilOpcoes.map(({ value, label, desc }) => (
                <label key={value} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  background: '#111111', border: '1px solid #1e1e1e',
                  borderRadius: '8px', padding: '14px 16px', cursor: 'pointer',
                }}>
                  <input
                    type="radio" name="perfil_cognitivo" value={value}
                    defaultChecked={value === 'padrao'}
                    style={{ accentColor: '#C9A455', width: '16px', height: '16px', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#f0ede6' }}>{label}</div>
                    <div style={{ fontSize: '12px', color: '#5a5a5a', marginTop: '2px' }}>{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Botão */}
          <button type="submit" style={{
            width: '100%', padding: '15px',
            background: 'linear-gradient(135deg, #C9A455, #E8CA7A)',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontSize: '14px', fontWeight: '800', color: '#0a0a0a',
            letterSpacing: '0.02em', marginTop: '4px',
          }}>
            Começar meu plano de estudos →
          </button>

          <p style={{ textAlign: 'center', fontSize: '11px', color: '#333', lineHeight: '1.5' }}>
            Você pode alterar essas informações a qualquer momento no seu perfil.
          </p>
        </form>
      </div>
    </main>
  );
}
