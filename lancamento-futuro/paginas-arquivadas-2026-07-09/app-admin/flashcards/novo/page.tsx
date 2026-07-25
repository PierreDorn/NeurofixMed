import { createServerClient } from '@/lib/supabase-server';
import AdminFlashcardForm from '@/components/admin/AdminFlashcardForm';

export default async function NovoFlashcardPage() {
  const supabase = await createServerClient();
  const { data: materiais } = await supabase.from('materiais').select('id, nome, ciclo').eq('ativo', true).order('ordem');
  return <AdminFlashcardForm materiais={materiais ?? []} />;
}
