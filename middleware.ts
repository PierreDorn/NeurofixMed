import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que só podem ser acessadas por usuários NÃO logados
const AUTH_ROUTES = ['/login', '/cadastro'];

// Rotas públicas que qualquer um pode ver
const PUBLIC_ROUTES = ['/', '/auth/callback'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignora arquivos estáticos e API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Cria cliente Supabase para checar sessão no servidor
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Verifica se o usuário está logado (sem causar redirect loop)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r);
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname === r);

  // ✅ Usuário logado tentando acessar login/cadastro/landing → manda pro dashboard
  if (isLoggedIn && (isAuthRoute || pathname === '/')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ✅ Usuário NÃO logado tentando acessar rota protegida → manda pro login
  if (!isLoggedIn && !isAuthRoute && !isPublicRoute) {
    // Salva a URL que o usuário tentou acessar para redirecionar depois do login
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Roda o middleware em todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (imagens)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
