import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import FiltroQuestoes, { type MateriaOpt, type TopicOpt } from './FiltroQuestoes';

export const dynamic = 'force-dynamic';

export default async function QuestoesPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: materiaisRow }, { data: topicsRow }, { count: totalQuestoes }] = await Promise.all([
    supabase
      .from('materiais')
      .select('id, nome, ciclo, ordem')
      .eq('ativo', true)
      .order('ordem'),
    supabase
      .from('topics')
      .select('id, material_id, nome, ordem')
      .order('ordem'),
    supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),
  ]);

  const materiais: MateriaOpt[] = (materiaisRow ?? []).map((m) => ({
    id: m.id as string,
    nome: m.nome as string,
    ciclo: (m.ciclo as string) ?? 'basico',
  }));

  const topics: TopicOpt[] = (topicsRow ?? []).map((t) => ({
    id: t.id as string,
    materialId: t.material_id as string,
    nome: t.nome as string,
    ordem: (t.ordem as number) ?? 0,
  }));

  return (
    <FiltroQuestoes
      materiais={materiais}
      topics={topics}
      totalQuestoesPublicadas={totalQuestoes ?? 0}
    />
  );
}
