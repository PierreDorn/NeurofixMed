import { createServerClient } from '@/lib/supabase-server';
import AdminResumoForm from '@/components/admin/AdminResumoForm';

export default async function NovoResumoPage() {
  const supabase = await createServerClient();
  const { data: materiais } = await supabase.from('materiais').select('id, nome').eq('ativo', true).order('ordem');

  return <AdminResumoForm materiais={materiais ?? []} />;
}
