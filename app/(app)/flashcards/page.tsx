import { createServerClient } from '@/lib/supabase-server';
import { FlashcardRevisor } from '@/components/FlashcardRevisor';

type Subjects = { nome: string };
type Topics = { nome: string; subjects?: Subjects };
type Subtopics = { nome: string; topics?: Topics };

type FlashcardRow = {
  id: string;
  pergunta: string;
  resposta: string;
  subtopics?: Subtopics;
};

type ReviewRow = {
  id: string;
  dificuldade: string;
  next_review_date: string;
  acertos_seguidos: number;
  flashcards: FlashcardRow;
};

export default async function FlashcardsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Busca flashcards pendentes para hoje (due_date <= hoje ou sem due_date)
  const hoje = new Date().toISOString().split('T')[0];

  const { data: pendentesRaw } = await supabase
    .from('flashcard_reviews')
    .select(`
      id,
      dificuldade,
      next_review_date,
      acertos_seguidos,
      flashcards (
        id,
        pergunta,
        resposta,
        subtopics ( nome, topics ( nome, subjects ( nome ) ) )
      )
    `)
    .eq('user_id', user.id)
    .lte('next_review_date', hoje)
    .order('next_review_date', { ascending: true })
    .limit(30);

  // Busca IDs já revisados para excluir da lista de "novos" (sem SQL injection)
  const { data: reviewedRows } = await supabase
    .from('flashcard_reviews')
    .select('flashcard_id')
    .eq('user_id', user.id);
  const reviewedIds = (reviewedRows ?? []).map((r) => r.flashcard_id);

  let novosQuery = supabase
    .from('flashcards')
    .select(`
      id, pergunta, resposta,
      subtopics ( nome, topics ( nome, subjects ( nome ) ) )
    `)
    .limit(10);
  if (reviewedIds.length > 0) {
    novosQuery = novosQuery.not('id', 'in', `(${reviewedIds.join(',')})`);
  }
  const { data: novosRaw } = await novosQuery;

  // Estatísticas
  const { count: totalReviews } = await supabase
    .from('flashcard_reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: acertosHoje } = await supabase
    .from('flashcard_reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('updated_at', hoje);

  const pendentes = (pendentesRaw ?? []) as unknown as ReviewRow[];
  const novos = (novosRaw ?? []) as unknown as FlashcardRow[];

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{ fontSize: '24px' }}>🔁</span>
          <h1 style={{ fontSize: '26px' }}>Flashcards</h1>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          Revise no momento certo e fixe de verdade. O sistema agenda a próxima revisão automaticamente.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--green)' }}>
            {pendentes.length + novos.length}
          </span>
          <span className="stat-label">Para revisar hoje</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--blue)' }}>
            {novos.length}
          </span>
          <span className="stat-label">Cards novos</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{acertosHoje ?? 0}</span>
          <span className="stat-label">Revisados hoje</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalReviews ?? 0}</span>
          <span className="stat-label">Total revisados</span>
        </div>
      </div>

      {/* Revisor de flashcards (componente cliente) */}
      <FlashcardRevisor
        pendentes={pendentes}
        novos={novos}
        userId={user.id}
      />
    </div>
  );
}
