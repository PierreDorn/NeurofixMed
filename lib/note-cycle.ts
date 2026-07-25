import 'server-only';
import { createServerClient } from '@/lib/supabase-server';
import type { CycleStage, NoteCycleState } from '@/lib/note-cycle-shared';

export type { CycleStage, NoteCycleState } from '@/lib/note-cycle-shared';
export { CYCLE_STAGES } from '@/lib/note-cycle-shared';

export function nextStage(stage: CycleStage): CycleStage {
  const order: CycleStage[] = ['understand', 'retrieve', 'apply', 'correct', 'review', 'prove', 'mastered'];
  const i = order.indexOf(stage);
  if (i < 0 || i >= order.length - 1) return 'mastered';
  return order[i + 1];
}

export async function getUserNoteCycle(noteSlug: string): Promise<NoteCycleState | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('user_note_cycles')
    .select('stage, stages_completed, updated_at')
    .eq('user_id', user.id)
    .eq('note_slug', noteSlug)
    .maybeSingle();
  if (!data) return null;
  return {
    stage: data.stage as CycleStage,
    stages_completed: (data.stages_completed ?? []) as CycleStage[],
    updated_at: data.updated_at as string,
  };
}
