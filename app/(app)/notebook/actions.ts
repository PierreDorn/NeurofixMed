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

export async function addCapture(formData: FormData) {
  const text = String(formData.get('text') || '').trim();
  if (!text) return;
  const { supabase, user } = await requireUser();
  await supabase.from('caderno_captures').insert({ user_id: user.id, text });
  revalidatePath('/notebook');
}

export async function toggleCaptureResolved(id: string, resolved: boolean) {
  const { supabase } = await requireUser();
  await supabase.from('caderno_captures').update({ resolved }).eq('id', id);
  revalidatePath('/notebook');
}

export async function deleteCapture(id: string) {
  const { supabase } = await requireUser();
  await supabase.from('caderno_captures').delete().eq('id', id);
  revalidatePath('/notebook');
}

export async function addError(formData: FormData) {
  const topic = String(formData.get('topic') || '').trim();
  if (!topic) return;
  const why = String(formData.get('why') || '').trim() || null;
  const rule = String(formData.get('rule') || '').trim() || null;
  const { supabase, user } = await requireUser();
  await supabase.from('caderno_errors').insert({ user_id: user.id, topic, why, rule });
  revalidatePath('/notebook');
}

export async function toggleErrorResolved(id: string, resolved: boolean) {
  const { supabase } = await requireUser();
  await supabase.from('caderno_errors').update({ resolved }).eq('id', id);
  revalidatePath('/notebook');
}

export async function deleteError(id: string) {
  const { supabase } = await requireUser();
  await supabase.from('caderno_errors').delete().eq('id', id);
  revalidatePath('/notebook');
}

export async function addExamItem(formData: FormData) {
  const label = String(formData.get('label') || '').trim();
  if (!label) return;
  const text = String(formData.get('text') || '').trim() || null;
  const { supabase, user } = await requireUser();
  await supabase.from('caderno_exam').insert({ user_id: user.id, label, text });
  revalidatePath('/notebook');
}

export async function deleteExamItem(id: string) {
  const { supabase } = await requireUser();
  await supabase.from('caderno_exam').delete().eq('id', id);
  revalidatePath('/notebook');
}
