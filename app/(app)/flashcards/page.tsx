import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { getFlashHubDataForUser } from '@/lib/flashcards';
import FlashcardsView from '@/components/biblioteca/FlashcardsView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FlashcardsPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const hubData = await getFlashHubDataForUser(user.id);

  return (
    <main className="biblioteca-page">
      <FlashcardsView matters={hubData.matters} />
    </main>
  );
}
