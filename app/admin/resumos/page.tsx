import { createServerClient } from '@/lib/supabase-server';
import AdminResumosList from '@/components/admin/AdminResumosList';

export default async function AdminResumosPage() {
  const supabase = await createServerClient();

  const [{ data: resumos }, { data: materiais }] = await Promise.all([
    supabase.from('study_summaries').select('id, titulo, status, ciclo, materia, updated_at, content_type').order('updated_at', { ascending: false }),
    supabase.from('materiais').select('id, nome').eq('ativo', true).order('ordem'),
  ]);

  const list = resumos ?? [];
  const stats = {
    total: list.length,
    published: list.filter(r => r.status === 'published').length,
    draft: list.filter(r => r.status === 'draft').length,
  };

  return (
    <AdminResumosList
      resumos={list}
      materiais={materiais ?? []}
      stats={stats}
    />
  );
}
