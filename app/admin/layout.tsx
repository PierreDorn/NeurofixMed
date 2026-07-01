import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const ADMIN_EMAILS = ['neurofixmed@gmail.com', 'pierre.doerner01@gmail.com'];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  if (!ADMIN_EMAILS.includes(user.email ?? '')) redirect('/dashboard');

  const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'Admin';
  const initials = firstName.charAt(0).toUpperCase();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *{margin:0;padding:0;box-sizing:border-box}
        :root{
          --bg:#0d1117;--surface:#161b22;--surface2:#1c2230;
          --border:#2a3344;--border-bright:#3d4f6b;
          --primary:#3b82f6;--primary-dim:#1d4ed8;--primary-glow:rgba(59,130,246,0.15);
          --green:#22c55e;--green-dim:rgba(34,197,94,0.12);
          --red:#ef4444;--red-dim:rgba(239,68,68,0.12);
          --yellow:#f59e0b;--purple:#a78bfa;
          --text:#e2e8f0;--text-dim:#8b9ab4;--text-muted:#4a5568;
          --radius:10px;--radius-sm:6px
        }
        body{font-family:'Sora',sans-serif;background:var(--bg);color:var(--text)}
        .adm-wrap{min-height:100vh;display:flex;flex-direction:column;background:var(--bg)}
        .adm-topbar{background:var(--surface);border-bottom:1px solid var(--border);padding:0 24px;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
        .adm-logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:15px;color:var(--text);text-decoration:none}
        .adm-logo-icon{width:28px;height:28px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:14px}
        .adm-badge{background:var(--primary-glow);color:var(--primary);border:1px solid rgba(59,130,246,0.3);font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;letter-spacing:.5px;text-transform:uppercase}
        .adm-user{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--text-dim)}
        .adm-avatar{width:30px;height:30px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:white}
        .adm-layout{display:flex;flex:1}
        .adm-sidebar{width:220px;background:var(--surface);border-right:1px solid var(--border);padding:20px 12px;display:flex;flex-direction:column;gap:4px;flex-shrink:0}
        .adm-sidebar-label{font-size:10px;font-weight:600;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;padding:8px 10px 4px}
        .adm-nav-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--radius-sm);font-size:13px;color:var(--text-dim);transition:all .15s;border:1px solid transparent;text-decoration:none}
        .adm-nav-item:hover{background:var(--surface2);color:var(--text)}
        .adm-nav-item.active{background:var(--primary-glow);color:var(--primary);border-color:rgba(59,130,246,.2);font-weight:500}
        .adm-main{flex:1;padding:28px 32px;overflow-y:auto;background:var(--bg)}
        .adm-btn{display:inline-flex;align-items:center;gap:7px;padding:8px 16px;border-radius:var(--radius-sm);font-size:13px;font-weight:500;cursor:pointer;border:none;transition:background-color 150ms ease,color 150ms ease,border-color 150ms ease,box-shadow 150ms ease,opacity 150ms ease;font-family:'Sora',sans-serif;text-decoration:none}
        .adm-btn:focus-visible{outline:2px solid var(--primary);outline-offset:3px}
        .adm-btn-primary{background:var(--primary);color:white;box-shadow:0 2px 8px rgba(59,130,246,.25)}
        .adm-btn-primary:hover{background:var(--primary-dim)}
        .adm-btn-ghost{background:transparent;color:var(--text-dim);border:1px solid var(--border)}
        .adm-btn-ghost:hover{background:var(--surface2);color:var(--text)}
        .adm-btn-danger{background:var(--red-dim);color:var(--red);border:1px solid rgba(239,68,68,.2)}
        .adm-btn-success{background:var(--green-dim);color:var(--green);border:1px solid rgba(34,197,94,.2)}
        .adm-btn-sm{padding:6px 12px;font-size:12px;min-height:32px}
        .adm-nav-item:focus-visible{outline:2px solid var(--primary);outline-offset:2px}
        @media(prefers-reduced-motion:reduce){.adm-btn,.adm-nav-item,.adm-folder-card{transition:none!important}}
      `}} />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div className="adm-wrap">
        <header className="adm-topbar">
          <Link href="/admin/resumos" className="adm-logo">
            <div className="adm-logo-icon">🧠</div>
            NeurofixMed
            <span className="adm-badge">Admin</span>
          </Link>
          <div className="adm-user">
            <span>{firstName}</span>
            <div className="adm-avatar">{initials}</div>
          </div>
        </header>
        <div className="adm-layout">
          <nav className="adm-sidebar">
            <div className="adm-sidebar-label">Conteúdo</div>
            <Link href="/admin/hierarquia" className="adm-nav-item">🗂 Hierarquia</Link>
            <Link href="/admin/resumos" className="adm-nav-item">📝 Resumos</Link>
            <Link href="/admin/questoes" className="adm-nav-item">❓ Questões</Link>
            <div className="adm-sidebar-label" style={{ marginTop: '12px' }}>Usuários</div>
            <Link href="/admin/estudantes" className="adm-nav-item">👥 Estudantes</Link>
          </nav>
          <main className="adm-main">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
