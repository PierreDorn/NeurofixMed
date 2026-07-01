'use server';

import { createServerClient } from '@/lib/supabase-server';

export interface UserSettingsPatch {
  revisao_automatica_ativa?: boolean;
  notificacoes_push_ativas?: boolean;
  notificacoes_email_ativas?: boolean;
  notificacoes_som_ativo?: boolean;
  horario_estudo_inicio?: string;
  horario_estudo_fim?: string;
  dias_semana_estudo?: string[];
  intervalo_revisao_1?: number;
  intervalo_revisao_2?: number;
  intervalo_revisao_3?: number;
  intervalo_revisao_4?: number;
  tema_preferido?: string;
}

export interface StudentProfilePatch {
  semestre?: string | null;
  foco?: string | null;
  nome_faculdade?: string | null;
  perfil_cognitivo?: string | null;
}

export async function updateUserSettings(patch: UserSettingsPatch): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sessão inválida' };

  // Upsert: garante linha mesmo na primeira vez
  const { error } = await supabase
    .from('user_settings')
    .upsert({ user_id: user.id, ...patch }, { onConflict: 'user_id' });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateStudentProfile(patch: StudentProfilePatch): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Sessão inválida' };

  const { error } = await supabase
    .from('student_profiles')
    .upsert({ user_id: user.id, ...patch }, { onConflict: 'user_id' });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateUserMetadata(patch: { full_name?: string }): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createServerClient();
  const { error } = await supabase.auth.updateUser({ data: patch });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
