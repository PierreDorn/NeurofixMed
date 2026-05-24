import Link from 'next/link';

const ciclos = [
  {
    id: 'basico',
    nome: 'Ciclo Básico',
    descricao: 'Anatomia, Fisiologia, Farmacologia e mais',
    icone: '🔬',
    disponivel: true,
    href: '/biblioteca/basico',
    badge: null,
  },
  {
    id: 'clinico',
    nome: 'Ciclo Clínico',
    descricao: 'Clínica Médica, Cirurgia, Pediatria e mais',
    icone: '🩺',
    disponivel: false,
    href: null,
    badge: 'Lançamento previsto para 2027',
  },
  {
    id: 'internato',
    nome: 'Internato',
    descricao: 'Rotações clínicas e conteúdo avançado',
    icone: '🏥',
    disponivel: false,
    href: null,
    badge: 'Lançamento previsto para 2029',
  },
];

export default function BibliotecaPage() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold">Biblioteca médica</h1>
      <p className="mt-2 text-slate-600">
        Selecione o ciclo para acessar os resumos e materiais de estudo.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {ciclos.map(ciclo => {
          const inner = (
            <div
              className={`card p-6 h-full flex flex-col gap-4 transition-all ${
                ciclo.disponivel
                  ? 'hover:border-blue-400 hover:shadow-md cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="text-4xl">{ciclo.icone}</div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{ciclo.nome}</h2>
                <p className="mt-1 text-sm text-slate-500">{ciclo.descricao}</p>
              </div>
              {ciclo.badge ? (
                <span className="mt-auto inline-block text-xs font-medium bg-slate-100 text-slate-500 px-3 py-1 rounded-full w-fit">
                  {ciclo.badge}
                </span>
              ) : (
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                  Acessar →
                </span>
              )}
            </div>
          );

          return ciclo.href ? (
            <Link key={ciclo.id} href={ciclo.href} className="block h-full">
              {inner}
            </Link>
          ) : (
            <div key={ciclo.id}>{inner}</div>
          );
        })}
      </div>
    </main>
  );
}
