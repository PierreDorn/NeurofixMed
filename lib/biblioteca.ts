import { createServerClient } from './supabase-server';

export interface MaterialRow {
  id: string;
  nome: string;
  ciclo: string;
  descricao: string | null;
  icone_url: string | null;
  ordem: number;
}

export interface TopicRow {
  id: string;
  material_id: string;
  nome: string;
  ordem: number;
}

export interface SubtopicRow {
  id: string;
  topic_id: string;
  nome: string;
  ordem: number;
}

export interface SubSubtopicRow {
  id: string;
  subtopic_id: string;
  nome: string;
  ordem: number;
}

export interface FlashcardDue {
  disciplineKey: string;
  dueCount: number;
  newCount: number;
  totalCount: number;
}

export interface UserProgress {
  material_id: string;
  percent_complete: number;
}

export async function getMateriais(): Promise<MaterialRow[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('materiais')
    .select('id, nome, ciclo, descricao, icone_url, ordem')
    .eq('ativo', true)
    .order('ordem');
  if (error) throw error;
  return data ?? [];
}

export async function getTopicsByMaterial(materialId: string): Promise<TopicRow[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('topics')
    .select('id, material_id, nome, ordem')
    .eq('material_id', materialId)
    .order('ordem');
  if (error) throw error;
  return data ?? [];
}

export async function getSubtopicsByTopic(topicId: string): Promise<SubtopicRow[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('subtopics')
    .select('id, topic_id, nome, ordem')
    .eq('topic_id', topicId)
    .order('ordem');
  if (error) throw error;
  return data ?? [];
}

export async function getSubSubtopicsBySubtopic(subtopicId: string): Promise<SubSubtopicRow[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('sub_subtopics')
    .select('id, subtopic_id, nome, ordem')
    .eq('subtopic_id', subtopicId)
    .order('ordem');
  if (error) throw error;
  return data ?? [];
}

export async function getFlashcardsDue(userId: string): Promise<FlashcardDue[]> {
  const supabase = await createServerClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('flashcard_reviews')
    .select(`
      id,
      next_review_at,
      flashcards!inner(
        id,
        subtopics!inner(
          topics!inner(
            materiais!inner(nome)
          )
        )
      )
    `)
    .eq('user_id', userId)
    .lte('next_review_at', now);

  if (error) throw error;
  return (data ?? []) as unknown as FlashcardDue[];
}

export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('user_progress')
    .select('material_id, percent_complete')
    .eq('user_id', userId);
  if (error) throw error;
  return data ?? [];
}

// ── Hierarchy types for browser-side biblioteca ──────────────────────────────

export interface SubSubtopicDB {
  id: string;
  nome: string;
  ordem: number;
}

export interface SubtopicDB {
  id: string;
  nome: string;
  ordem: number;
  sub_subtopics: SubSubtopicDB[];
}

export interface TopicDB {
  id: string;
  nome: string;
  ordem: number;
  subtopics: SubtopicDB[];
}

export interface MaterialDB {
  id: string;
  nome: string;
  ciclo: string;
  descricao: string | null;
  icone_url: string | null;
  ordem: number;
  topics: TopicDB[];
}
