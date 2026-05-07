import { createServerClient } from '@/lib/supabase-server';

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
  accessibility_notes?: string | null;
  question_options?: QuestionOption[] | null;
};

type Subtopic = {
  id: string;
  nome: string;
  questions?: Question[] | null;
};

type Topic = {
  id: string;
  nome: string;
  subtopics?: Subtopic[] | null;
};

type Subject = {
  id: string;
  nome: string;
  descricao?: string | null;
  topics?: Topic[] | null;
};

export default async function Biblioteca() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('subjects')
    .select(`
      id, nome, descricao,
      topics (
        id, nome,
        subtopics (
          id, nome,
          questions (
            id, enunciado, explicacao, accessibility_notes,
            question_options ( id, texto, is_correct, explicacao_opcao )
          )
        )
      )
    `)
    .order('nome');

  const subjects = (data ?? []) as unknown as Subject[];

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold">Biblioteca médica</h1>
      <p className="mt-2 text-slate-600">
        Conteúdo separado por matéria, tópico, subtópico e questões com gabarito comentado.
      </p>

      <section className="mt-6 space-y-5">
        {subjects.map((s) => (
          <article className="card p-5" key={s.id}>
            <h2 className="text-2xl font-bold">{s.nome}</h2>
            {s.descricao && <p className="text-slate-600">{s.descricao}</p>}

            <div className="mt-4 space-y-3">
              {s.topics?.map((t) => (
                <div key={t.id}>
                  <h3 className="font-bold text-lg mb-2">{t.nome}</h3>

                  {t.subtopics?.map((sub) => (
                    <div key={sub.id} className="rounded-xl bg-slate-50 p-4 mb-2">
                      <h4 className="font-semibold text-sm text-slate-700 mb-2">{sub.nome}</h4>

                      {sub.questions?.map((q) => (
                        <div key={q.id} className="mt-3 rounded-lg border bg-white p-3">
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

                          {q.accessibility_notes && (
                            <p className="mt-2 text-sm text-emerald-700">
                              <b>Adaptação:</b> {q.accessibility_notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
