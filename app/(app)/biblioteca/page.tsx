import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';

type QuestionOption = {
  id: string;
  texto: string;
  is_correct: boolean;
  explicacao_opcao?: string | null;
};

type Question = {
  id: string;
  enunciado: string;
  explicacao: string;
  question_options?: QuestionOption[] | null;
};

type SubSubtopic = {
  id: string;
  nome: string;
  questions?: Question[] | null;
};

type Subtopic = {
  id: string;
  nome: string;
  sub_subtopics?: SubSubtopic[] | null;
};

type Topic = {
  id: string;
  nome: string;
  subtopics?: Subtopic[] | null;
};

type Material = {
  id: string;
  nome: string;
  descricao?: string | null;
  topics?: Topic[] | null;
};

type Resumo = {
  id: string;
  titulo: string | null;
  materia: string | null;
  topico: string | null;
  content_type: string | null;
};

export default async function Biblioteca() {
  const supabase = await createServerClient();

  const [{ data }, { data: resumosData }] = await Promise.all([
    supabase
      .from('materiais')
      .select(`
        id, nome, descricao,
        topics (
          id, nome,
          subtopics (
            id, nome,
            sub_subtopics (
              id, nome,
              questions (
                id, enunciado, explicacao,
                question_options ( id, texto, is_correct, explicacao_opcao )
              )
            )
          )
        )
      `)
      .eq('ativo', true)
      .order('ordem'),
    supabase
      .from('study_summaries')
      .select('id, titulo, materia, topico, content_type')
      .eq('status', 'published')
      .order('updated_at', { ascending: false }),
  ]);

  const materiais = (data ?? []) as unknown as Material[];
  const resumos = (resumosData ?? []) as Resumo[];

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold">Biblioteca médica</h1>
      <p className="mt-2 text-slate-600">
        Conteúdo separado por matéria, tópico, subtópico e questões com gabarito comentado.
      </p>

      <section className="mt-6 space-y-5">
        {materiais.map((m) => {
          const resumosDaMateria = resumos.filter(r => r.materia === m.nome);

          return (
            <article className="card p-5" key={m.id}>
              <h2 className="text-2xl font-bold mb-1">{m.nome}</h2>
              {m.descricao && <p className="text-slate-600">{m.descricao}</p>}

              {/* RESUMOS DA MATÉRIA */}
              {resumosDaMateria.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-2">
                    <span>📄</span> Resumos disponíveis
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {resumosDaMateria.length}
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {resumosDaMateria.map((r) => (
                      <Link
                        key={r.id}
                        href={`/resumos/${r.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all group"
                      >
                        <span className="text-lg flex-shrink-0">
                          {r.content_type === 'pdf' ? '📄' : '📝'}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-700">
                            {r.titulo ?? 'Resumo sem título'}
                          </p>
                          {r.topico && (
                            <p className="text-xs text-slate-400 truncate">{r.topico}</p>
                          )}
                        </div>
                        <span className="ml-auto text-slate-300 group-hover:text-blue-500 flex-shrink-0">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* TÓPICOS E QUESTÕES */}
              {m.topics && m.topics.length > 0 && (
                <div className="mt-4 space-y-3">
                  {m.topics.map((t) => (
                    <div key={t.id}>
                      <h3 className="font-bold text-lg mb-2">{t.nome}</h3>

                      {t.subtopics?.map((sub) => (
                        <div key={sub.id} className="rounded-xl bg-slate-50 p-4 mb-2">
                          <h4 className="font-semibold text-sm text-slate-700 mb-2">{sub.nome}</h4>

                          {sub.sub_subtopics?.map((ssub) => (
                            <div key={ssub.id} className="ml-3 mb-3">
                              <h5 className="font-semibold text-xs text-slate-500 uppercase tracking-wide mb-2">
                                {ssub.nome}
                              </h5>

                              {ssub.questions?.map((q) => (
                                <div key={q.id} className="mt-2 rounded-lg border bg-white p-3">
                                  <p className="font-semibold">Questão: {q.enunciado}</p>

                                  {q.question_options && q.question_options.length > 0 && (
                                    <ol className="mt-2 list-decimal pl-5 text-sm space-y-1">
                                      {q.question_options.map((opt) => (
                                        <li
                                          key={opt.id}
                                          className={opt.is_correct ? 'font-semibold text-emerald-700' : ''}
                                        >
                                          {opt.texto}
                                          {opt.is_correct && opt.explicacao_opcao && (
                                            <span className="ml-2 text-xs text-emerald-600">
                                              — {opt.explicacao_opcao}
                                            </span>
                                          )}
                                        </li>
                                      ))}
                                    </ol>
                                  )}

                                  <p className="mt-2 text-sm">
                                    <b>Comentado:</b> {q.explicacao}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
