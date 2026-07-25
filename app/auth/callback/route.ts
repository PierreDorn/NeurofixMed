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

  // Onboarding arquivado em 2026-07-09 (ver lancamento-futuro/paginas-arquivadas-2026-07-09/).
  // Todo usuário autenticado vai direto para /dashboard.
  if (sessionData.user?.id) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
