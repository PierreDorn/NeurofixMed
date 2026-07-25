import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { SUBJECT_CATALOG } from '@/lib/subjects-catalog';
import FavoritesView, { type FavoriteNote } from './FavoritesView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FavoritesPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: favs } = await supabase
    .from('favorites')
    .select('entity_type, entity_id, created_at')
    .order('created_at', { ascending: false });

  const list = favs ?? [];
  const subjectIds = list.filter((f) => f.entity_type === 'subject').map((f) => f.entity_id);
  const favoriteSubjects = SUBJECT_CATALOG.filter((s) => subjectIds.includes(s.id));

  const noteSlugs = list.filter((f) => f.entity_type === 'note').map((f) => f.entity_id);
  let favoriteNotes: FavoriteNote[] = [];
  if (noteSlugs.length) {
    const { data } = await supabase
      .from('authored_notes')
      .select('slug, title, subtitle, subject_id, breadcrumb')
      .in('slug', noteSlugs);
    favoriteNotes = (data ?? []) as FavoriteNote[];
  }

  return <FavoritesView subjects={favoriteSubjects} notes={favoriteNotes} />;
}
