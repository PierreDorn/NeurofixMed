'use server';

import { agendarRevisoes } from '@/lib/srs';

/**
 * Server action chamada após o aluno criar um flashcard.
 * Side-effect puro: agenda 4 revisões automáticas.
 *
 * Idempotente via `ja_tem_revisoes` no motor SRS — chamar duas vezes
 * para o mesmo flashcard não duplica nada.
 *
 * Falhas são silenciosas — nunca quebram o fluxo de criação.
 */
export async function registrarFlashcardCriado(flashcardId: string): Promise<void> {
  await agendarRevisoes('flashcard', flashcardId);
}
