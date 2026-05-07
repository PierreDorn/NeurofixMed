import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function Dashboard() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('perfil_cognitivo, semestre, foco')
    .eq('user_id', user.id)
    .single();

  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, nome, descricao')
    .order('nome');

  const hoje = new Date().toISOString().split('T')[0];

  const { count: flashcardsPendentes } = await supabase
    .from('flashcard_reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .lte('next_review_date', hoje);

  const { data: reviewedRows } = await supabase
    .from('flashcard_reviews')
    .select('flashcard_id')
    .eq('user_id', user.id);
  const reviewedIds = (reviewedRows ?? []).map((r) => r.flashcard_id);

  let novosCountQuery = supabase
    .from('flashcards')
    .select('*', { count: 'exact', head: true });
  if (reviewedIds.length > 0) {
    novosCountQuery = novosCountQuery.not('id', 'in', `(${reviewedIds.join(',')})`);
  }
  const { count: flashcardsNovos } = await novosCountQuery;

  const { count: questoesRespondidas } = await supabase
    .from('question_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const perfilLabel: Record<string, string> = {
    tdah: '⚡ TDAH', tea: '🔷 TEA', dislexia: '📖 Dislexia', padrao: '📝 Padrão',
  };

  const focoLabel: Record<string, string> = {
    faculdade: 'Provas da faculdade', enamed: 'ENAMED',
    residencia: 'Residência médica', revisao: 'Revisão geral',
  };

  const totalHoje = (flashcardsPendentes ?? 0) + Math.min(flashcardsNovos ?? 0, 10);

  return (
    <div className="page-content">
      {/* Saudação */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '28px' }}>Bom dia! 🧠</h1>
          {profile?.perfil_cognitivo && (
            <span className="badge badge-green">{perfilLabel[profile.perfil_cognitivo] ?? profile.perfil_cognitivo}</span>
          )}
          {profile?.foco && (
            <span className="badge badge-blue">🎯 {focoLabel[profile.foco] ?? profile.foco}</span>
          )}
        </div>
        <p style={{ color: 'var(--muted)', marginTop: '4px', fontSize: '14px' }}>
          {profile?.semestre ? `${profile.semestre}º semestre • ` : ''}
          NeuroFix Med cuida do seu plano de revisão
        </p>
      </div>

      {/* Plano de hoje */}
      <div className="card card-green" style={{ marginBottom: '24px', padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              📋 Plano de hoje
            </div>
            <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>
              {totalHoje > 0
                ? `${totalHoje} flashcard${totalHoje > 1 ? 's' : ''} para revisar`
                : 'Você está em dia! 🎉'}
            </h2>
            <p style={{ color: 'var(--soft)', fontSize: '13px' }}>
              {flashcardsPendentes ?? 0} pendentes + {Math.min(flashcardsNovos ?? 0, 10)} novos
            </p>
          </div>
          {totalHoje > 0 && (
            <Link href="/flashcards" className="btn-primary"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              Começar revisão →
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--yellow)' }}>{flashcardsPendentes ?? 0}</span>
          <span className="stat-label">Flashcards pendentes</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--blue)' }}>{flashcardsNovos ?? 0}</span>
          <span className="stat-label">Cards novos</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--green)' }}>{questoesRespondidas ?? 0}</span>
          <span className="stat-label">Questões respondidas</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{subjects?.length ?? 0}</span>
          <span className="stat-label">Disciplinas</span>
        </div>
      </div>

      {/* Acesso rápido */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {[
          { href: '/flashcards', icon: '🔁', label: 'Flashcards',  desc: 'Revise e fixe de verdade',      color: 'var(--green)' },
          { href: '/biblioteca', icon: '📚', label: 'Biblioteca',  desc: 'Resumos e questões comentadas', color: 'var(--blue)' },
          { href: '/tarefas',    icon: '✅', label: 'Tarefas',     desc: 'Lembretes e plano pessoal',     color: 'var(--purple)' },
          { href: '/perfil',     icon: '⚙️',  label: 'Perfil',     desc: 'Ajuste suas preferências',      color: 'var(--muted)' },
        ].map(item => (
          <Link key={item.href} href={item.href} className="card"
            style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontWeight: '800', fontSize: '14px', color: item.color }}>{item.label}</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)' }}>{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Disciplinas */}
      {subjects && subjects.length > 0 && (
        <div>
          <h2 style={{ fontSize: '18px', marginBottom: '14px' }}>📚 Disciplinas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px' }}>
            {subjects.map(s => (
              <Link key={s.id} href={`/biblioteca`} className="card"
                style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{s.nome}</div>
                {s.descricao && <p style={{ fontSize: '12px', color: 'var(--muted)' }}>{s.descricao}</p>}
              </Link>
            ))}
          </div>
        </div>
      )}

      {!subjects?.length && (
        <div className="card" style={{ textAlign: 'center', padding: '40px', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📚</div>
          <h3 style={{ marginBottom: '8px' }}>Conteúdo em breve</h3>
          <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: '1.6' }}>
            Seus resumos e questões vão aparecer aqui em breve. 🚀
          </p>
        </div>
      )}
    </div>
  );
}
