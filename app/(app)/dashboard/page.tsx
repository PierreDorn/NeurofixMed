import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { SUBJECT_CATALOG } from '@/lib/subjects-catalog';
import { getActiveCycles } from '@/lib/dashboard-data';
import DashboardV70 from './v73/DashboardV70';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [favs, last, activeCycles] = await Promise.all([
    supabase.from('favorites').select('entity_id').eq('entity_type', 'subject'),
    supabase
      .from('user_last_study')
      .select('subject_id, note_id, tab, title, subject_label, updated_at')
      .maybeSingle(),
    getActiveCycles(user.id),
  ]);

  const favIds = new Set((favs.data ?? []).map((f) => f.entity_id));
  const favoriteSubjects = SUBJECT_CATALOG.filter((s) => favIds.has(s.id));
  const semesterSubjects =
    favoriteSubjects.length > 0
      ? favoriteSubjects
      : SUBJECT_CATALOG.filter((s) => s.status === 'live');

  return (
    <DashboardV70
      semesterSubjects={semesterSubjects}
      lastStudy={last.data ?? null}
      activeCycles={activeCycles}
    />
  );
}
