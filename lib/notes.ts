import { createServerClient } from '@/lib/supabase-server';

export type NoteHeader = {
  slug: string;
  subject_id: string;
  module_id: string | null;
  topic_id: string | null;
  title: string;
  subtitle: string | null;
  breadcrumb: string | null;
  duration: string | null;
  level: string | null;
  meta: { pill?: string; pillTone?: string };
};

export type NoteTab = {
  tab_key: string;
  tab_label: string;
  content_html: string;
  ordering: number;
};

export async function getNoteWithTabs(slug: string) {
  const supabase = await createServerClient();
  const [noteRes, tabsRes] = await Promise.all([
    supabase
      .from('authored_notes')
      .select('slug, subject_id, module_id, topic_id, title, subtitle, breadcrumb, duration, level, meta')
      .eq('slug', slug)
      .maybeSingle(),
    supabase
      .from('authored_note_tabs')
      .select('tab_key, tab_label, content_html, ordering')
      .eq('note_slug', slug)
      .order('ordering', { ascending: true }),
  ]);
  if (!noteRes.data) return null;
  return {
    note: noteRes.data as NoteHeader,
    tabs: (tabsRes.data ?? []) as NoteTab[],
  };
}

export async function findNoteByTopic(topicId: string): Promise<string | null> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('authored_notes')
    .select('slug')
    .eq('topic_id', topicId)
    .maybeSingle();
  return data?.slug ?? null;
}
