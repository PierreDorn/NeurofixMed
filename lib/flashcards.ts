import { createServerClient } from './supabase-server';
import {
  computeStats,
  normalizeCiclo,
  slugifyMatter,
  type FlashcardRow,
  type FlashcardReviewRow,
  type MatterAggregate,
} from './flashcards-utils';

export * from './flashcards-utils';

export interface FlashHubData {
  matters: MatterAggregate[];
  ciclos: string[];
}

export async function getFlashHubDataForUser(userId: string): Promise<FlashHubData> {
  const supabase = await createServerClient();

  const [{ data: flashcards }, { data: reviews }] = await Promise.all([
    supabase
      .from('flashcards')
      .select('id, user_id, tipo, titulo, ciclo, materia, topic_id, subtopic_id, sub_subtopic_id, pergunta, resposta, status, updated_at, created_at')
      .eq('user_id', userId)
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
    supabase
      .from('flashcard_reviews')
      .select('id, user_id, flashcard_id, dificuldade, next_review_date, acertos_seguidos, created_at, updated_at')
      .eq('user_id', userId),
  ]);

  const cards = (flashcards ?? []) as FlashcardRow[];
  const revs = (reviews ?? []) as FlashcardReviewRow[];

  const byMatter = new Map<string, FlashcardRow[]>();
  const matterToCiclo = new Map<string, string>();

  for (const f of cards) {
    const matter = (f.materia ?? '').trim() || 'Sem matéria';
    if (!byMatter.has(matter)) byMatter.set(matter, []);
    byMatter.get(matter)!.push(f);
    if (!matterToCiclo.has(matter)) matterToCiclo.set(matter, normalizeCiclo(f.ciclo));
  }

  const matters: MatterAggregate[] = [];
  for (const [matter, list] of byMatter) {
    const matterReviews = revs.filter(r => list.some(f => f.id === r.flashcard_id));
    const stats = computeStats(list, matterReviews);
    matters.push({
      materia: matter,
      ciclo: matterToCiclo.get(matter) ?? 'Ciclo Básico',
      total: stats.total,
      novos: stats.novos,
      revisar: stats.revisar,
      fixacao: stats.fixacao,
      flashcards: list,
    });
  }

  matters.sort((a, b) => a.materia.localeCompare(b.materia, 'pt-BR'));
  const ciclos = Array.from(new Set(matters.map(m => m.ciclo)));
  return { matters, ciclos };
}

export async function getMatterDetail(userId: string, matterSlug: string) {
  const supabase = await createServerClient();
  const { data: flashcards } = await supabase
    .from('flashcards')
    .select('id, user_id, tipo, titulo, ciclo, materia, topic_id, subtopic_id, sub_subtopic_id, pergunta, resposta, texto_lacuna, opcoes, resposta_correta, status, updated_at, created_at')
    .eq('user_id', userId)
    .eq('status', 'published')
    .order('created_at', { ascending: true });

  const cards = (flashcards ?? []) as FlashcardRow[];
  const matching = cards.filter(f => slugifyMatter(f.materia ?? '') === matterSlug);
  if (matching.length === 0) return null;

  const matterName = matching[0].materia ?? 'Sem matéria';
  const ciclo = normalizeCiclo(matching[0].ciclo);

  const { data: reviews } = await supabase
    .from('flashcard_reviews')
    .select('id, user_id, flashcard_id, dificuldade, next_review_date, acertos_seguidos, created_at, updated_at')
    .eq('user_id', userId)
    .in('flashcard_id', matching.map(m => m.id));

  const revs = (reviews ?? []) as FlashcardReviewRow[];
  const stats = computeStats(matching, revs);

  return { matter: matterName, ciclo, slug: matterSlug, flashcards: matching, reviews: revs, stats };
}
