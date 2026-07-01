import { createServerClient } from '@/lib/supabase-server';
import AdminResumoForm from '@/components/admin/AdminResumoForm';
import { notFound } from 'next/navigation';

export default async function EditarResumoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();

  const [{ data: resumo }, { data: materiais }] = await Promise.all([
    supabase
      .from('study_summaries')
      .select('id, titulo, content_html, content_type, pdf_url, pdf_filename, pdf_size, status, ciclo, materia, topico, topic_id, subtopic_id, sub_subtopic_id')
      .eq('id', id)
      .single(),
    supabase.from('materiais').select('id, nome, ciclo').eq('ativo', true).order('ordem'),
  ]);

  if (!resumo) notFound();

  return (
    <AdminResumoForm
      materiais={materiais ?? []}
      initial={{
        id: resumo.id,
        titulo: resumo.titulo ?? '',
        content_html: resumo.content_html ?? '',
        content_type: resumo.content_type ?? 'text',
        pdf_url: resumo.pdf_url ?? '',
        pdf_filename: resumo.pdf_filename ?? '',
        pdf_size: resumo.pdf_size ?? '',
        status: resumo.status ?? 'draft',
        ciclo: resumo.ciclo ?? '',
        materia: resumo.materia ?? '',
        topico: resumo.topico ?? '',
        topic_id: resumo.topic_id ?? '',
        subtopic_id: resumo.subtopic_id ?? '',
        sub_subtopic_id: resumo.sub_subtopic_id ?? '',
      }}
    />
  );
}
