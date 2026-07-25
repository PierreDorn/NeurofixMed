import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import CadernoBloco from './caderno/CadernoBloco';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Dashboard() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return <CadernoBloco />;
}
