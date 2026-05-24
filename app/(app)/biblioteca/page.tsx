import { createServerClient } from '@/lib/supabase-server';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

type StudySummary = { id: string; status: string | null };
type Subtopic = { study_summaries: StudySummary[] };
type Topic = { subtopics: Subtopic[] };
type Materia = { id: string; nome: string; icone_url: string | null; topics: Topic[] };

export default async function BibliotecaPage() {
  const supabase = await createServerClient();

  const { data } = await supabase
    .from('materiais')
    .select(`
      id, nome, icone_url,
      topics(
        subtopics(
          study_summaries!subtopic_id(id, status)
        )
      )
    `)
    .eq('ciclo', 'Ciclo Básico')
    .eq('ativo', true)
    .order('ordem');

  const materiais = (data ?? []) as unknown as Materia[];

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold">Resumos por disciplina</h1>
      <p className="mt-2 text-slate-600">
        Selecione uma matéria para estudar os tópicos e capítulos.
      </p>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {materiais.map(m => {
          const totalResumos = (m.topics ?? []).flatMap(t =>
            (t.subtopics ?? []).flatMap(s =>
              (s.study_summaries ?? []).filter(r => r.status === 'published')
            )
          ).length;

          return (
            <Link key={m.id} href={`/biblioteca/${m.id}`}>
              <div className="card overflow-hidden hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group">
                <div className="h-32 bg-slate-50 flex items-center justify-center border-b border-slate-100">
                  {m.icone_url ? (
                    <img
                      src={m.icone_url}
                      alt={m.nome}
                      className="h-24 object-contain opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <span className="text-5xl opacity-25 group-hover:opacity-40 transition-opacity">📚</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 text-sm">{m.nome}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {totalResumos > 0
                      ? `${totalResumos} resumo${totalResumos > 1 ? 's' : ''} disponíve${totalResumos > 1 ? 'is' : 'l'}`
                      : 'Em breve'}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
