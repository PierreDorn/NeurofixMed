import { createServerClient } from '@/lib/supabase-server';

export type CurriculumTopic = {
  id: string;
  module_id: string;
  title: string;
  subtitle: string | null;
  question_count: number | null;
  flashcard_count: number | null;
  level: string | null;
  status: string | null;
  ordering: number;
};

export type CurriculumModule = {
  id: string;
  subject_id: string;
  block_key: string | null;
  block: string | null;
  number: string | null;
  title: string;
  description: string | null;
  map: string | null;
  confusions: string[];
  test_count: number | null;
  ordering: number;
  topics: CurriculumTopic[];
};

export async function getSubjectCurriculum(subjectId: string): Promise<CurriculumModule[]> {
  const supabase = await createServerClient();

  const { data: modules, error: mErr } = await supabase
    .from('curriculum_modules')
    .select('id, subject_id, block_key, block, number, title, description, map, confusions, test_count, ordering')
    .eq('subject_id', subjectId)
    .order('ordering', { ascending: true });
  if (mErr) throw mErr;
  if (!modules || modules.length === 0) return [];

  const moduleIds = modules.map((m) => m.id);
  const { data: topics, error: tErr } = await supabase
    .from('curriculum_topics')
    .select('id, module_id, title, subtitle, question_count, flashcard_count, level, status, ordering')
    .in('module_id', moduleIds)
    .order('ordering', { ascending: true });
  if (tErr) throw tErr;

  const topicsByModule = new Map<string, CurriculumTopic[]>();
  for (const t of topics ?? []) {
    const arr = topicsByModule.get(t.module_id) ?? [];
    arr.push(t as CurriculumTopic);
    topicsByModule.set(t.module_id, arr);
  }

  return modules.map((m) => ({
    ...(m as Omit<CurriculumModule, 'topics' | 'confusions'>),
    confusions: (m.confusions ?? []) as string[],
    topics: topicsByModule.get(m.id) ?? [],
  }));
}

export async function getTopicWithModule(topicId: string): Promise<{
  topic: CurriculumTopic;
  module: CurriculumModule;
} | null> {
  const supabase = await createServerClient();
  const { data: topic } = await supabase
    .from('curriculum_topics')
    .select('id, module_id, title, subtitle, question_count, flashcard_count, level, status, ordering')
    .eq('id', topicId)
    .maybeSingle();
  if (!topic) return null;
  const { data: module } = await supabase
    .from('curriculum_modules')
    .select('id, subject_id, block_key, block, number, title, description, map, confusions, test_count, ordering')
    .eq('id', topic.module_id)
    .maybeSingle();
  if (!module) return null;
  return {
    topic: topic as CurriculumTopic,
    module: {
      ...(module as Omit<CurriculumModule, 'topics' | 'confusions'>),
      confusions: (module.confusions ?? []) as string[],
      topics: [],
    },
  };
}
