import { createServerClient } from '@/lib/supabase-server';
import { redirect, notFound } from 'next/navigation';
import { findSubject } from '@/lib/subjects-catalog';
import { getSubjectCurriculum } from '@/lib/curriculum';
import SubjectLibraryView from './SubjectLibraryView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SubjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { id } = await params;
  const subject = findSubject(id);
  if (!subject) notFound();

  const curriculum = await getSubjectCurriculum(id);

  return <SubjectLibraryView subject={subject} curriculum={curriculum} />;
}
