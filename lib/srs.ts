/**
 * Motor de Revisão Automática (SRS) — wrapper server-side.
 *
 * O grosso da lógica vive em funções SQL (Postgres) para evitar
 * race conditions e garantir atomicidade. Este arquivo só intermedia
 * o que o Next.js dispara como Server Action.
 */
import 'server-only';
import { createServerClient } from '@/lib/supabase-server';

export type ConteudoTipo = 'study_summary' | 'flashcard' | 'subtopic';
export type Desempenho = 'errei' | 'dificil' | 'facil';

/**
 * Agenda as 4 revisões para um conteúdo específico, respeitando
 * user_settings.revisao_automatica_ativa.
 *
 * SEMPRE não-bloqueante: erros aqui apenas logam no console e
 * NUNCA interrompem o fluxo de estudo do aluno (regra do projeto).
 *
 * Retorna { ok, jaExistia } — jaExistia=true quando o conteúdo
 * já tinha revisões na fila (evita duplicar).
 */
export async function agendarRevisoes(
  conteudoTipo: ConteudoTipo,
  conteudoId: string,
): Promise<{ ok: boolean; jaExistia?: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'sem sessão' };

    // Checa se já existe revisão pra esse conteúdo (idempotente)
    const { data: jaExistia } = await supabase.rpc('ja_tem_revisoes', {
      p_user_id: user.id,
      p_conteudo_tipo: conteudoTipo,
      p_conteudo_id: conteudoId,
    });

    if (jaExistia === true) {
      return { ok: true, jaExistia: true };
    }

    const { error } = await supabase.rpc('criar_revisoes_automaticas', {
      p_user_id: user.id,
      p_conteudo_tipo: conteudoTipo,
      p_conteudo_id: conteudoId,
    });

    if (error) {
      console.warn('[srs] agendarRevisoes falhou:', error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true, jaExistia: false };
  } catch (err) {
    console.warn('[srs] agendarRevisoes exceção:', err);
    return { ok: false, error: String(err) };
  }
}

/**
 * Aplica o desempenho do aluno sobre uma revisão existente.
 * Dispara o algoritmo adaptativo (errei/dificil/facil).
 */
export async function aplicarDesempenho(
  reviewId: string,
  desempenho: Desempenho,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'sem sessão' };

    const { error } = await supabase.rpc('aplicar_desempenho_revisao', {
      p_review_id: reviewId,
      p_desempenho: desempenho,
    });

    if (error) {
      console.warn('[srs] aplicarDesempenho falhou:', error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true };
  } catch (err) {
    console.warn('[srs] aplicarDesempenho exceção:', err);
    return { ok: false, error: String(err) };
  }
}
