'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase-server';

async function requireUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Não autenticado');
  return { supabase, user };
}

export type ReviewInput = {
  note_slug: string;
  note_title: string;
  subject_label?: string | null;
  area_label?: string | null;
  scheduled_at: string;
  description?: string | null;
  all_day?: boolean;
  end_at?: string | null;
  color?: string | null;
  location?: string | null;
  reminders?: number[];
};

export async function createReviewSchedule(input: ReviewInput) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from('note_review_schedules').insert({
    user_id: user.id,
    note_slug: input.note_slug,
    note_title: input.note_title,
    subject_label: input.subject_label ?? null,
    area_label: input.area_label ?? null,
    scheduled_at: input.scheduled_at,
    description: input.description ?? null,
    all_day: input.all_day ?? false,
    end_at: input.end_at ?? null,
    color: input.color ?? '#C9A24E',
    location: input.location ?? null,
    reminders: input.reminders ?? [],
  });
  if (error) throw new Error(error.message);
  revalidatePath('/review');
}

export async function updateReviewSchedule(id: string, input: ReviewInput) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from('note_review_schedules')
    .update({
      note_slug: input.note_slug,
      note_title: input.note_title,
      subject_label: input.subject_label ?? null,
      area_label: input.area_label ?? null,
      scheduled_at: input.scheduled_at,
      description: input.description ?? null,
      all_day: input.all_day ?? false,
      end_at: input.end_at ?? null,
      color: input.color ?? '#C9A24E',
      location: input.location ?? null,
      reminders: input.reminders ?? [],
    })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
  revalidatePath('/review');
}

export async function postponeReviewSchedule(id: string, days: number) {
  const { supabase, user } = await requireUser();
  const existing = await supabase
    .from('note_review_schedules')
    .select('scheduled_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();
  if (!existing.data) throw new Error('Revisão não encontrada');
  const next = new Date(existing.data.scheduled_at);
  next.setDate(next.getDate() + days);
  const { error } = await supabase
    .from('note_review_schedules')
    .update({ scheduled_at: next.toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
  revalidatePath('/review');
}

export async function completeReviewSchedule(id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from('note_review_schedules')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
  revalidatePath('/review');
}

export async function deleteReviewSchedule(id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from('note_review_schedules')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  if (error) throw new Error(error.message);
  revalidatePath('/review');
}
