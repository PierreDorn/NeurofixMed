import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * Página placeholder do sistema de questões.
 *
 * NOTA: módulo em construção, vai sofrer evolução profunda no futuro.
 * Esta página existe apenas para reservar a rota e mostrar o estado atual
 * (quantidade de questões disponíveis + integração com SRS via question_attempts).
 */
export default async function QuestoesPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ count: totalQuestoes }, { count: minhasTentativas }] = await Promise.all([
    supabase.from('questions').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('question_attempts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ]);

  return (
    <main style={{ padding: '32px 24px 60px', maxWidth: 960, margin: '0 auto', fontFamily: "'Atkinson Hyperlegible', 'Inter', sans-serif", color: '#F7F7F8' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.18em', textTransform: 'uppercase', color: '#E8D08A' }}>
          Questões
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-.02em', margin: '6px 0 0' }}>
          Banco de questões.
        </h1>
        <p style={{ color: 'rgba(247,247,248,.62)', fontSize: 13.5, lineHeight: 1.55, margin: '8px 0 0', maxWidth: 620 }}>
          Sistema em construção. Cada questão respondida pela primeira vez agenda automaticamente revisões
          no subtópico correspondente, integrando-se ao motor de revisão por curva do esquecimento.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
        <div style={{ padding: 22, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: '#0F131C' }}>
          <div style={{ fontSize: 11, color: 'rgba(247,247,248,.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Questões publicadas
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#E8D08A', marginTop: 6 }}>{totalQuestoes ?? 0}</div>
        </div>
        <div style={{ padding: 22, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: '#0F131C' }}>
          <div style={{ fontSize: 11, color: 'rgba(247,247,248,.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Suas tentativas
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#4AB3FF', marginTop: 6 }}>{minhasTentativas ?? 0}</div>
        </div>
      </div>

      <div style={{ padding: 48, borderRadius: 18, border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(15,19,28,0.5)', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🧪</div>
        <strong style={{ display: 'block', fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Módulo em construção</strong>
        <p style={{ color: 'rgba(247,247,248,.55)', fontSize: 13.5, lineHeight: 1.55, margin: 0, maxWidth: 460, marginInline: 'auto' }}>
          O sistema de banco de questões + simulados + análise de desempenho será habilitado em breve.
          A integração com a agenda de revisão já está pronta no backend (via <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 4 }}>registrarTentativa</code>).
        </p>
      </div>
    </main>
  );
}
