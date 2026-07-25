import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { getUserProgress } from '@/lib/progress-data';
import { SUBJECT_CATALOG } from '@/lib/subjects-catalog';
import ProgressView from './ProgressView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProgressPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const stats = await getUserProgress(user.id);
  const subjectMap = Object.fromEntries(SUBJECT_CATALOG.map((s) => [s.id, s]));

  return <ProgressView stats={stats} subjectMap={subjectMap} />;
}
