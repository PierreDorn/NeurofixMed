import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const cicloMap: Record<string, string> = {
  basico: 'Ciclo Básico',
  clinico: 'Ciclo Clínico',
  internato: 'Internato',
};

type Resumo = { id: string; titulo: string | null };
type Subtopic = { id: string; nome: string; ordem: number; study_summaries: Resumo[] };
type Topic = { id: string; nome: string; order_index: number; subtopics: Subtopic[] };
type Materia = { id: string; nome: string; topics: Topic[] };

export default async function BibliotecaCicloPage({
  params,
}: {
  params: Promise<{ ciclo: string }>;
}) {
  const { ciclo: cicloSlug } = await params;
  const cicloNome = cicloMap[cicloSlug];
  if (!cicloNome) notFound();

  // Ciclos não disponíveis
  if (cicloSlug !== 'basico') {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <Link href="/biblioteca" className="text-sm text-slate-500 hover:text-blue-600">← Biblioteca</Link>
        <div className="mt-12 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-slate-700">{cicloNome}</h1>
          <p className="mt-2 text-slate-500">
            {cicloSlug === 'clinico' ? 'Lançamento previsto para 2027.' : 'Lançamento previsto para 2029.'}
          </p>
          <Link href="/biblioteca" className="mt-6 inline-block text-blue-600 font-semibold hover:underline">
            ← Voltar para a Biblioteca
          </Link>
        </div>
      </main>
    );
  }

  const supabase = await createServerClient();

  const { data } = await supabase
    .from('materiais')
    .select(`
      id, nome,
      topics (
        id, nome, order_index,
        subtopics (
          id, nome, ordem,
          study_summaries!subtopic_id ( id, titulo )
        )
      )
    `)
    .eq('ciclo', cicloNome)
    .eq('ativo', true)
    .order('ordem');

  const materiais = (data ?? []) as unknown as Materia[];

  // Filtrar somente matérias que tenham ao menos um resumo publicado
  // (não temos acesso ao status aqui, mas exibimos todos linkados — o viewer filtra status)
  const materiaisComConteudo = materiais.filter(m =>
    m.topics?.some(t => t.subtopics?.some(s => s.study_summaries?.length > 0))
  );

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/biblioteca" className="hover:text-blue-600">Biblioteca</Link>
        <span>›</span>
        <span className="text-slate-700 font-medium">{cicloNome}</span>
      </div>

      <h1 className="text-3xl font-bold">{cicloNome}</h1>
      <p className="mt-2 text-slate-600">Selecione a matéria para explorar os tópicos e capítulos.</p>

      {materiaisComConteudo.length === 0 ? (
        <div className="mt-12 text-center">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-slate-500 text-lg">Nenhum resumo publicado ainda neste ciclo.</p>
          <p className="text-slate-400 text-sm mt-1">Em breve novos conteúdos serão adicionados.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {materiaisComConteudo.map(m => (
            <article key={m.id} className="card p-5">
              <h2 className="text-xl font-bold text-slate-800 mb-3">{m.nome}</h2>

              <div className="space-y-3">
                {m.topics
                  ?.filter(t => t.subtopics?.some(s => s.study_summaries?.length > 0))
                  .sort((a, b) => a.order_index - b.order_index)
                  .map(t => (
                    <div key={t.id}>
                      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-2">
                        {t.nome}
                      </h3>
                      <div className="space-y-1 ml-2">
                        {t.subtopics
                          ?.filter(s => s.study_summaries?.length > 0)
                          .sort((a, b) => a.ordem - b.ordem)
                          .map(s => (
                            <div key={s.id} className="space-y-1">
                              {s.study_summaries.map(r => (
                                <Link
                                  key={r.id}
                                  href={`/resumos/${r.id}`}
                                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all group"
                                >
                                  <span className="text-slate-400 text-sm w-4 shrink-0">{s.ordem}.</span>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-700">
                                      {r.titulo ?? 'Resumo sem título'}
                                    </p>
                                    <p className="text-xs text-slate-400">{s.nome}</p>
                                  </div>
                                  <span className="ml-auto text-slate-300 group-hover:text-blue-500 shrink-0">→</span>
                                </Link>
                              ))}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
