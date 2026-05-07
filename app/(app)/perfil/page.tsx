import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

async function updateProfile(formData: FormData) {
  'use server';
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  await supabase.from('student_profiles').upsert(
    {
      user_id: user.id,
      perfil_cognitivo: String(formData.get('perfil_cognitivo') ?? 'padrao'),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
  redirect('/dashboard');
}

export default async function Perfil() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('perfil_cognitivo')
    .eq('user_id', user.id)
    .single();

  const opcoes: Array<[string, string]> = [
    ['tdah', 'TDAH: blocos curtos, checklist e foco no próximo passo'],
    ['tea', 'TEA/autismo: previsibilidade, estrutura fixa e menos ambiguidade'],
    ['dislexia', 'Dislexia: frases curtas, espaçamento e linguagem direta'],
    ['padrao', 'Padrão: explicação tradicional'],
  ];

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Perfil de aprendizagem</h1>
      <p className="mt-2 text-slate-600">
        Essa escolha ajusta o jeito como os conteúdos e gabaritos devem ser escritos.
      </p>

      <form action={updateProfile} className="card mt-6 space-y-4 p-6">
        {opcoes.map(([v, l]) => (
          <label key={v} className="flex gap-3 rounded-xl border p-4">
            <input
              type="radio"
              name="perfil_cognitivo"
              value={v}
              defaultChecked={profile?.perfil_cognitivo === v}
            />
            <span>{l}</span>
          </label>
        ))}
        <button className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white">
          Salvar perfil
        </button>
      </form>
    </main>
  );
}
