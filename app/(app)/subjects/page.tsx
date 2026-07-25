import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import SubjectsView from './SubjectsView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SubjectsPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: favs } = await supabase
    .from('favorites')
    .select('entity_id')
    .eq('entity_type', 'subject');

  const favIds = new Set((favs ?? []).map((f) => f.entity_id));
  return <SubjectsView favIds={Array.from(favIds)} />;
}
