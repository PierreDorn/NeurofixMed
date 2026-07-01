import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import ConfiguracoesView from '@/components/configuracoes/ConfiguracoesView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface UserSettingsRow {
  revisao_automatica_ativa: boolean;
  notificacoes_push_ativas: boolean;
  notificacoes_email_ativas: boolean;
  notificacoes_som_ativo: boolean;
  horario_estudo_inicio: string;
  horario_estudo_fim: string;
  dias_semana_estudo: string[];
  intervalo_revisao_1: number;
  intervalo_revisao_2: number;
  intervalo_revisao_3: number;
  intervalo_revisao_4: number;
  tema_preferido: string;
}

const DEFAULTS: UserSettingsRow = {
  revisao_automatica_ativa: true,
  notificacoes_push_ativas: true,
  notificacoes_email_ativas: false,
  notificacoes_som_ativo: true,
  horario_estudo_inicio: '08:00',
  horario_estudo_fim: '22:00',
  dias_semana_estudo: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'],
  intervalo_revisao_1: 1,
  intervalo_revisao_2: 24,
  intervalo_revisao_3: 168,
  intervalo_revisao_4: 720,
  tema_preferido: 'dark',
};

export default async function ConfiguracoesPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: settings }, { data: profile }] = await Promise.all([
    supabase.from('user_settings').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('student_profiles').select('*').eq('user_id', user.id).maybeSingle(),
  ]);

  const merged: UserSettingsRow = { ...DEFAULTS, ...(settings ?? {}) };

  return (
    <main style={{ padding: '24px 24px 60px', maxWidth: 1100, margin: '0 auto' }}>
      <ConfiguracoesView
        email={user.email ?? ''}
        fullName={(user.user_metadata?.full_name as string) ?? ''}
        settings={merged}
        profile={{
          semestre: profile?.semestre ?? null,
          foco: profile?.foco ?? null,
          nome_faculdade: profile?.nome_faculdade ?? null,
          perfil_cognitivo: profile?.perfil_cognitivo ?? null,
        }}
      />
    </main>
  );
}
