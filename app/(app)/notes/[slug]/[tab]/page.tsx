import { createServerClient } from '@/lib/supabase-server';
import { redirect, notFound } from 'next/navigation';
import { getNoteWithTabs } from '@/lib/notes';
import { getNoteDeckAndReviews } from '@/lib/note-flashcards';
import { getNoteQuestionsAndAttempts } from '@/lib/note-questions';
import { getUserNoteCycle } from '@/lib/note-cycle';
import NoteView from './NoteView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FLASHCARD_TABS = new Set(['flashcards', 'flash']);
const QUESTION_TABS = new Set(['questions', 'question']);

export default async function AuthoredNotePage({
  params,
}: {
  params: Promise<{ slug: string; tab: string }>;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { slug, tab } = await params;
  const data = await getNoteWithTabs(slug);
  if (!data) notFound();

  const currentTab = data.tabs.find((t) => t.tab_key === tab) ?? data.tabs[0];
  if (!currentTab) notFound();

  const isFlashcards = FLASHCARD_TABS.has(currentTab.tab_key);
  const isQuestions = QUESTION_TABS.has(currentTab.tab_key);

  const [deck, questionPack, cycle, favRes] = await Promise.all([
    isFlashcards ? getNoteDeckAndReviews(slug) : Promise.resolve(null),
    isQuestions ? getNoteQuestionsAndAttempts(slug) : Promise.resolve(null),
    getUserNoteCycle(slug),
    supabase
      .from('favorites')
      .select('entity_id')
      .eq('user_id', user.id)
      .eq('entity_type', 'note')
      .eq('entity_id', slug)
      .maybeSingle(),
  ]);
  const isFavorite = !!favRes.data;

  await supabase.from('user_last_study').upsert(
    {
      user_id: user.id,
      subject_id: data.note.subject_id,
      note_id: data.note.slug,
      tab: currentTab.tab_key,
      title: data.note.title,
      subject_label: data.note.breadcrumb ?? data.note.subject_id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  return (
    <NoteView
      note={data.note}
      tabs={data.tabs}
      activeTab={currentTab.tab_key}
      deck={deck}
      questionPack={questionPack}
      cycle={cycle}
      isFavorite={isFavorite}
    />
  );
}
