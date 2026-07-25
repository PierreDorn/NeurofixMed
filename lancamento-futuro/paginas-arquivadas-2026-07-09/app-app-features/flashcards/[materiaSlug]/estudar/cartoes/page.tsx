import { redirect, notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { getMatterDetail } from '@/lib/flashcards';
import CartoesGame from '@/components/flashcards/games/CartoesGame';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CartoesPage({ params }: { params: Promise<{ materiaSlug: string }> }) {
  const { materiaSlug } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const detail = await getMatterDetail(user.id, materiaSlug);
  if (!detail) notFound();

  return (
    <main style={{ minHeight: '100vh', background: '#0A0D14', padding: '32px 16px 60px' }}>
      <CartoesGame
        slug={detail.slug}
        materia={detail.matter}
        cards={detail.flashcards.map(c => ({ id: c.id, pergunta: c.pergunta ?? '', resposta: c.resposta ?? '' }))}
      />
    </main>
  );
}
