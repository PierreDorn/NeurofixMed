import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import AgendaView from '@/components/agenda/AgendaView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AgendaPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Janela: 35 dias para trás (eventos passados) + 90 pra frente (mês + ~1 extra)
  // Para eventos com recorrência, busca TODOS (não filtra pelo data_inicio inicial)
  const now = new Date();
  const start = new Date(now); start.setDate(now.getDate() - 35);
  const end = new Date(now);   end.setDate(now.getDate() + 90);

  const [{ data: events }, { data: recurrences }] = await Promise.all([
    supabase
      .from('events')
      .select('id, titulo, descricao, data_inicio, data_fim, dia_todo, tipo, cor, local, origem, referencia_id, referencia_tipo, concluido')
      .eq('user_id', user.id)
      .order('data_inicio'),
    supabase
      .from('event_recurrence')
      .select('event_id, frequencia, intervalo, dias_semana, data_fim_recorrencia'),
  ]);

  return (
    <main style={{ padding: '20px 24px 60px', maxWidth: 1240, margin: '0 auto' }}>
      <AgendaView
        events={events ?? []}
        recurrences={recurrences ?? []}
        windowStartISO={start.toISOString()}
        windowEndISO={end.toISOString()}
      />
    </main>
  );
}
