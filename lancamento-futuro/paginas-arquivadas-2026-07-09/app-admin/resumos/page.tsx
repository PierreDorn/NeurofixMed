import { createServerClient } from '@/lib/supabase-server';
import AdminResumosTabShell from '@/components/admin/AdminResumosTabShell';

export default async function AdminResumosPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const supabase = await createServerClient();

  const [
    { data: resumos },
    { data: flashcards },
    { data: materiais },
    { data: topics },
    { data: subtopics },
    { data: subSubtopics },
  ] = await Promise.all([
    supabase.from('study_summaries').select('id, titulo, status, ciclo, materia, topic_id, subtopic_id, sub_subtopic_id, updated_at, content_type').order('updated_at', { ascending: false }),
    supabase.from('flashcards').select('id, titulo, tipo, status, ciclo, materia, topic_id, subtopic_id, sub_subtopic_id, updated_at').order('updated_at', { ascending: false }),
    supabase.from('materiais').select('id, nome, ciclo').eq('ativo', true).order('ordem'),
    supabase.from('topics').select('id, nome, material_id').order('order_index'),
    supabase.from('subtopics').select('id, nome, topic_id').order('ordem'),
    supabase.from('sub_subtopics').select('id, nome, subtopic_id').order('ordem'),
  ]);

  return (
    <AdminResumosTabShell
      initialTab={(tab === 'flashcards' ? 'flashcards' : 'resumos') as 'resumos' | 'flashcards'}
      resumos={resumos ?? []}
      flashcards={flashcards ?? []}
      materiais={materiais ?? []}
      topics={topics ?? []}
      subtopics={subtopics ?? []}
      subSubtopics={subSubtopics ?? []}
    />
  );
}
