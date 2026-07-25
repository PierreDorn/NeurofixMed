import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { getUsoDoDia } from './actions';
import CriadorDeKit from '@/components/ia/CriadorDeKit';
import { NEURO_IA_CONFIG } from '@/lib/neuro-ia';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function IAPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const uso = await getUsoDoDia();
  const geracoesIniciais = uso?.geracoesHoje ?? 0;
  const limiteDiario = uso?.limiteDiario ?? NEURO_IA_CONFIG.limiteDiarioPadrao;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 80px' }}>
      <CriadorDeKit geracoesIniciais={geracoesIniciais} limiteDiario={limiteDiario} />
    </div>
  );
}
