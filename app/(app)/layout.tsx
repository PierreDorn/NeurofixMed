import { Sidebar } from '@/components/Sidebar';
import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('perfil_cognitivo, semestre, onboarding_done')
    .eq('user_id', user.id)
    .single();

  // Classe de acessibilidade no body baseada no perfil cognitivo
  const perfilClass = profile?.perfil_cognitivo
    ? `perfil-${profile.perfil_cognitivo}`
    : '';

  return (
    <div className={`app-shell ${perfilClass}`}>
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
