/**
 * Job diário de manutenção do SRS.
 *
 * Roda 1x por dia via Vercel Cron (ver vercel.json).
 * Marca revisões pendentes vencidas como "atrasada" e reagenda
 * para o próximo horário de estudo do aluno.
 *
 * Protegido por header `Authorization: Bearer <CRON_SECRET>`.
 * Vercel Cron envia esse header automaticamente quando a env var existe.
 */
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc('marcar_revisoes_atrasadas');

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const result = Array.isArray(data) && data.length > 0
      ? data[0] as { atrasadas: number; reagendadas: number }
      : { atrasadas: 0, reagendadas: 0 };

    return NextResponse.json({
      ok: true,
      ran_at: new Date().toISOString(),
      atrasadas: result.atrasadas,
      reagendadas: result.reagendadas,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
