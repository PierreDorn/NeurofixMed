import { Sidebar } from '@/components/Sidebar';
import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { CadernoProvider } from './dashboard/caderno/CadernoContext';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const [{ data: profile }, { data: settings }] = await Promise.all([
    supabase
      .from('student_profiles')
      .select('perfil_cognitivo, semestre')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('user_settings')
      .select('tema_preferido')
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  const perfilClass = profile?.perfil_cognitivo ? `perfil-${profile.perfil_cognitivo}` : '';
  const temaClass   = settings?.tema_preferido === 'light' ? 'tema-claro' : '';

  return (
    <CadernoProvider>
      <div className={['app-shell', perfilClass, temaClass].filter(Boolean).join(' ')}>
        <Sidebar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </CadernoProvider>
  );
}
