import { createServerClient } from '@/lib/supabase-server';
import { redirect, notFound } from 'next/navigation';
import { findSubject } from '@/lib/subjects-catalog';
import { getTopicWithModule } from '@/lib/curriculum';
import { findNoteByTopic } from '@/lib/notes';
import TopicBlueprintView from './TopicBlueprintView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TopicBlueprint({
  params,
}: {
  params: Promise<{ id: string; topicId: string }>;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { id, topicId } = await params;
  const subject = findSubject(id);
  if (!subject) notFound();

  const decodedTopicId = decodeURIComponent(topicId);

  // Se este tópico tem nota autoral, vai direto pra ela.
  const noteSlug = await findNoteByTopic(decodedTopicId);
  if (noteSlug) redirect(`/notes/${noteSlug}/${firstTabDefault(noteSlug)}`);

  const result = await getTopicWithModule(decodedTopicId);
  if (!result) notFound();

  // Grava última posição de estudo (upsert).
  await supabase
    .from('user_last_study')
    .upsert(
      {
        user_id: user.id,
        subject_id: subject.id,
        note_id: result.topic.id,
        title: result.topic.title,
        subject_label: `${subject.title} · ${result.module.title}`,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

  return (
    <TopicBlueprintView subject={subject} module={result.module} topic={result.topic} />
  );
}

// Notas iniciam sempre por 'start' (ou 'explain' no caso Ascaris).
function firstTabDefault(slug: string) {
  if (slug === 'ascaris-lumbricoides') return 'explain';
  return 'start';
}
