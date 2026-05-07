import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type UserRef = { email: string | null } | null;

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  reminder_at: string;
  user_id: string;
  users: UserRef | UserRef[];
};

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronUserAgent = request.headers.get('user-agent')?.includes('vercel-cron');
  const secretOk = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (!cronUserAgent && !secretOk) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const resend = new Resend(process.env.RESEND_API_KEY);
  const now = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .select('id,title,description,reminder_at,user_id,users(email)')
    .lte('reminder_at', now)
    .is('reminder_sent_at', null)
    .eq('completed', false)
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const tasks = (data ?? []) as unknown as TaskRow[];

  let sent = 0;
  for (const task of tasks) {
    const userRef = Array.isArray(task.users) ? task.users[0] : task.users;
    if (!userRef?.email) continue;

    await resend.emails.send({
      from: process.env.REMINDER_FROM_EMAIL ?? 'NeuroFix Med <onboarding@resend.dev>',
      to: userRef.email,
      subject: `Lembrete de estudo: ${task.title}`,
      html: `<h2>${task.title}</h2><p>${task.description ?? ''}</p><p>Abra o app e faça uma revisão curta agora.</p>`,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabaseAdmin.from('tasks') as any)
      .update({ reminder_sent_at: now })
      .eq('id', task.id);

    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
