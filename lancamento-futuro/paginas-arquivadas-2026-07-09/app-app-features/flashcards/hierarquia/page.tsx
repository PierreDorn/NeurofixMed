import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import FlashcardsHierarquiaManager from '@/components/flashcards/FlashcardsHierarquiaManager';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FlashcardsHierarquiaPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main style={{ padding: '32px 24px', maxWidth: 960, margin: '0 auto' }}>
      <FlashcardsHierarquiaManager />
    </main>
  );
}
