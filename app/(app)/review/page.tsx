import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import ReviewView from './ReviewView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type SearchParams = {
  agendar?: string;
  note_slug?: string;
  title?: string;
  subject?: string;
  area?: string;
};

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const sp = await searchParams;

  const [openRes, notesRes] = await Promise.all([
    supabase
      .from('note_review_schedules')
      .select(
        'id, note_slug, note_title, subject_label, area_label, scheduled_at, end_at, all_day, description, color, location, reminders',
      )
      .eq('user_id', user.id)
      .is('completed_at', null)
      .order('scheduled_at', { ascending: true }),
    supabase
      .from('authored_notes')
      .select('slug, title, subject_id, breadcrumb')
      .order('title', { ascending: true }),
  ]);

  const prefill = sp.agendar
    ? {
        note_slug: sp.note_slug ?? '',
        note_title: sp.title ?? '',
        subject_label: sp.subject ?? '',
        area_label: sp.area ?? '',
      }
    : null;

  return (
    <ReviewView
      reviews={openRes.data ?? []}
      notes={notesRes.data ?? []}
      prefill={prefill}
    />
  );
}
