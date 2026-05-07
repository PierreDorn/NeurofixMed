import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

async function salvarOnboarding(formData: FormData) {
  'use server';
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const semestre       = String(formData.get('semestre') ?? '');
  const foco           = String(formData.get('foco') ?? '');
  const perfil         = String(formData.get('perfil_cognitivo') ?? 'padrao');

  // Upsert no perfil do estudante
  await supabase.from('student_profiles').upsert({
    user_id:           user.id,
    semestre,
    foco,
    perfil_cognitivo:  perfil,
    onboarding_done:   true,
    updated_at:        new Date().toISOString(),
  }, { onConflict: 'user_id' });

  redirect('/dashboard');
}

export default function OnboardingPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(34,197,94,0.35)',
          }}>🧠</div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
            Bem-vindo ao NeuroFix Med
          </h1>
          <p style={{ color: 'var(--soft)', fontSize: '15px', lineHeight: '1.6' }}>
            Me conta um pouco sobre você para personalizar sua experiência de estudo.
          </p>
        </div>

        {/* Formulário */}
        <form action={salvarOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Semestre */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--soft)', marginBottom: '8px' }}>
              Em qual semestre/fase você está?
            </label>
            <select name="semestre" required style={{ background: 'var(--bg2)' }}>
              <option value="">Escolha seu semestre</option>
              <option value="1">1º semestre</option>
              <option value="2">2º semestre</option>
              <option value="3">3º semestre</option>
              <option value="4">4º semestre</option>
              <option value="5">5º semestre</option>
              <option value="6">6º semestre</option>
              <option value="7">7º semestre</option>
              <option value="8">8º semestre</option>
              <option value="9">9º semestre</option>
              <option value="10">10º semestre</option>
              <option value="11">11º semestre</option>
              <option value="12">12º semestre</option>
              <option value="internato1">Internato – 1º ano</option>
              <option value="internato2">Internato – 2º ano</option>
              <option value="formado">Formado / Residência</option>
            </select>
          </div>

          {/* Foco */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--soft)', marginBottom: '8px' }}>
              Qual é o seu principal foco agora?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { value: 'faculdade', label: '🎓 Provas da faculdade', desc: 'Gabaritar provas semestrais e internas' },
                { value: 'enamed',    label: '📋 ENAMED', desc: 'Preparação para o Exame Nacional de Desempenho' },
                { value: 'residencia',label: '🏥 Residência médica', desc: 'Concursos de residência' },
                { value: 'revisao',   label: '🔁 Revisão geral', desc: 'Consolidar e não esquecer o que já estudei' },
              ].map(({ value, label, desc }) => (
                <label key={value} className="perfil-option" style={{ cursor: 'pointer' }}>
                  <input type="radio" name="foco" value={value} required />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Perfil cognitivo */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: 'var(--soft)', marginBottom: '4px' }}>
              Como você aprende melhor?
            </label>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px', lineHeight: '1.5' }}>
              Isso adapta a forma como os conteúdos e gabaritos são apresentados para você.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { value: 'tdah',    label: '⚡ TDAH', desc: 'Blocos curtos, checklist e foco no próximo passo' },
                { value: 'tea',     label: '🔷 Autismo / TEA', desc: 'Estrutura fixa, previsibilidade e menos ambiguidade' },
                { value: 'dislexia',label: '📖 Dislexia', desc: 'Frases curtas, espaçamento maior e linguagem direta' },
                { value: 'padrao',  label: '📝 Padrão', desc: 'Explicação tradicional, sem adaptações específicas' },
              ].map(({ value, label, desc }) => (
                <label key={value} className="perfil-option" style={{ cursor: 'pointer' }}>
                  <input type="radio" name="perfil_cognitivo" value={value} defaultChecked={value === 'padrao'} />
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '14px' }}
          >
            Começar meu plano de estudos →
          </button>

          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted)', lineHeight: '1.5' }}>
            Você pode alterar essas informações a qualquer momento no seu perfil.
          </p>
        </form>
      </div>
    </main>
  );
}
