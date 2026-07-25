import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BibliotecaAccordion from '@/components/BibliotecaAccordion';

export const dynamic = 'force-dynamic';

type Topic = {
  id: string;
  nome: string;
  order_index: number;
  subtopics: {
    id: string;
    nome: string;
    ordem: number;
    study_summaries: { id: string; titulo: string | null; status: string | null }[];
  }[];
};

type Sugestao = { id: string; titulo: string | null; materia: string | null };

export default async function BibliotecaMateriaPage({
  params,
}: {
  params: Promise<{ ciclo: string }>;
}) {
  // O parâmetro [ciclo] é reutilizado como materiaId (UUID)
  const { ciclo: materiaId } = await params;
  const supabase = await createServerClient();

  const [{ data: materia }, { data: topicsData }, { data: sugestoesData }] = await Promise.all([
    supabase
      .from('materiais')
      .select('id, nome, ciclo')
      .eq('id', materiaId)
      .single(),
    supabase
      .from('topics')
      .select(`
        id, nome, order_index,
        subtopics (
          id, nome, ordem,
          study_summaries!subtopic_id ( id, titulo, status )
        )
      `)
      .eq('material_id', materiaId)
      .order('order_index'),
    supabase
      .from('study_summaries')
      .select('id, titulo, materia')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(6),
  ]);

  if (!materia) notFound();

  const topics = (topicsData ?? []) as unknown as Topic[];
  const sugestoes = (sugestoesData ?? []) as Sugestao[];

  return (
    <main className="mx-auto max-w-6xl p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/biblioteca" className="hover:text-blue-600 transition-colors">
          Biblioteca
        </Link>
        <span className="text-slate-300">›</span>
        <span className="text-slate-700 font-medium">{materia.nome}</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        Resumos de {materia.nome}
      </h1>

      <div className="flex gap-6 items-start">
        {/* Accordion de tópicos */}
        <div className="flex-1 min-w-0">
          <BibliotecaAccordion
            topics={topics}
            materiaNome={materia.nome}
          />
        </div>

        {/* Painel lateral — sugestões */}
        <aside className="w-72 shrink-0 hidden lg:block">
          <div className="card p-4">
            <h3 className="font-bold text-slate-800 text-sm mb-1">Por onde começar?</h3>
            <p className="text-xs text-slate-500 mb-4">
              O NeurofixMed separou alguns resumos para você
            </p>

            <div>
              {sugestoes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">
                  Nenhum resumo publicado ainda.
                </p>
              ) : (
                sugestoes.map(s => (
                  <Link
                    key={s.id}
                    href={`/resumos/${s.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      {s.materia && (
                        <span className="text-xs text-slate-400 block truncate">{s.materia}</span>
                      )}
                      <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600 truncate">
                        {s.titulo ?? 'Resumo sem título'}
                      </p>
                    </div>
                    <span className="text-slate-300 group-hover:text-blue-400 ml-2 shrink-0">→</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
