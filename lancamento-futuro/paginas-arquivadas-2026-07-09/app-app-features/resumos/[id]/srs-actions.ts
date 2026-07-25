'use server';

import { createServerClient } from '@/lib/supabase-server';

/**
 * Registra leitura de resumo e agenda as 4 revisões automáticas.
 * Passa o título real para os eventos ficarem identificados na agenda.
 * Retorna { ok, jaExistia, error } para o botão mostrar feedback correto.
 */
export async function registrarLeituraResumo(
  resumoId: string,
): Promise<{ ok: boolean; jaExistia?: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Sessão inválida' };

    // Busca o título real do resumo
    const { data: resumo } = await supabase
      .from('study_summaries')
      .select('titulo')
      .eq('id', resumoId)
      .single();

    // Verifica idempotência
    const { data: jaExistia } = await supabase.rpc('ja_tem_revisoes', {
      p_user_id: user.id,
      p_conteudo_tipo: 'study_summary',
      p_conteudo_id: resumoId,
    });

    if (jaExistia === true) {
      return { ok: true, jaExistia: true };
    }

    const { error } = await supabase.rpc('criar_revisoes_automaticas', {
      p_user_id: user.id,
      p_conteudo_tipo: 'study_summary',
      p_conteudo_id: resumoId,
      p_titulo: resumo?.titulo ?? null,
    });

    if (error) {
      console.warn('[srs-actions] criar_revisoes_automaticas falhou:', error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true, jaExistia: false };
  } catch (err) {
    console.warn('[srs-actions] exceção:', err);
    return { ok: false, error: String(err) };
  }
}
