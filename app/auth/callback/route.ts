import { createServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
  }

  const supabase = await createServerClient();
  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL('/login?error=auth', request.url));
  }

  const userId = sessionData.user?.id;
  if (userId) {
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('onboarding_done')
      .eq('user_id', userId)
      .single();

    // Usuário já fez onboarding → sempre vai para o dashboard
    if (profile?.onboarding_done) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Usuário novo ou sem onboarding → vai para /onboarding
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
