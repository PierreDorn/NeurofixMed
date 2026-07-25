import { redirect, notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { getMatterDetail } from '@/lib/flashcards';
import MatterHubView from '@/components/flashcards/MatterHubView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Params { materiaSlug: string }

export default async function MatterPage({ params }: { params: Promise<Params> }) {
  const { materiaSlug } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const detail = await getMatterDetail(user.id, materiaSlug);
  if (!detail) notFound();

  return (
    <main style={{ padding: '32px 24px 60px', maxWidth: 1100, margin: '0 auto' }}>
      <MatterHubView detail={detail} />
    </main>
  );
}
