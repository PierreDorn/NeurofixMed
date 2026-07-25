import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronUserAgent = request.headers.get('user-agent')?.includes('vercel-cron');
  const secretOk = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (!cronUserAgent && !secretOk) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabaseAdmin = getSupabaseAdmin();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const now = new Date().toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tasks, error } = (await supabaseAdmin
    .from('tasks')
    .select('id,title,description,reminder_at,user_id,profiles(email,full_name,learning_profile)')
    .lte('reminder_at', now)
    .is('reminder_sent_at', null)
    .eq('completed', false)
    .limit(50)) as any;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  for (const task of tasks ?? []) {
    const profile = Array.isArray(task.profiles) ? task.profiles[0] : task.profiles;
    if (!profile?.email) continue;
    await resend.emails.send({
      from: process.env.REMINDER_FROM_EMAIL ?? 'MedStudy <onboarding@resend.dev>',
      to: profile.email,
      subject: `Lembrete de estudo: ${task.title}`,
      html: `<h2>${task.title}</h2><p>${task.description ?? ''}</p><p>Perfil de estudo: ${profile.learning_profile}</p><p>Abra o app e faça uma revisão curta agora.</p>`,
    });
    await (supabaseAdmin as any).from('tasks').update({ reminder_sent_at: now }).eq('id', task.id);
    sent++;
  }
  return NextResponse.json({ ok: true, sent });
}
