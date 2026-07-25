'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, NotebookPen, Repeat, BarChart3 } from 'lucide-react';

type Item = { href: string; label: string; icon: React.ReactNode };

const items: Item[] = [
  { href: '/home', label: 'Início', icon: <Home size={20} /> },
  { href: '/subjects', label: 'Matérias', icon: <BookOpen size={20} /> },
  { href: '/notebook', label: 'Caderno', icon: <NotebookPen size={20} /> },
  { href: '/review', label: 'Revisão', icon: <Repeat size={20} /> },
  { href: '/progress', label: 'Progresso', icon: <BarChart3 size={20} /> },
];

// Aparece apenas em ≤768px (bloqueado por media query inline).
// Segue o breakpoint do projeto (CSS puro em globals.css), não `md:` do Tailwind.
export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <>
      <style>{`
        .v73-mobile-bottom-nav { display: none; }
        @media (max-width: 768px) {
          .v73-mobile-bottom-nav { display: flex; }
        }
      `}</style>
      <nav
        className="v73-mobile-bottom-nav"
        aria-label="Navegação inferior"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: '64px',
          padding: '6px 8px',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          zIndex: 75,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '6px 8px',
                borderRadius: '12px',
                color: active ? 'var(--gold-light)' : 'var(--soft)',
                background: active ? 'var(--gold-dim)' : 'transparent',
                fontSize: '11px',
                fontWeight: 600,
                textDecoration: 'none',
                minWidth: '56px',
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default MobileBottomNav;
