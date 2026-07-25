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

type EntityType = 'subject' | 'topic' | 'note';

export async function toggleFavorite(entity_type: EntityType, entity_id: string) {
  const { supabase, user } = await requireUser();

  const existing = await supabase
    .from('favorites')
    .select('entity_id')
    .eq('user_id', user.id)
    .eq('entity_type', entity_type)
    .eq('entity_id', entity_id)
    .maybeSingle();

  if (existing.data) {
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('entity_type', entity_type)
      .eq('entity_id', entity_id);
  } else {
    await supabase.from('favorites').insert({ user_id: user.id, entity_type, entity_id });
  }

  revalidatePath('/favorites');
  revalidatePath('/subjects');
  revalidatePath('/subjects/' + entity_id);
}
