'use client';

import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import '../../app/(app)/dashboard/v73/v73-scoped.css';

// Shell fiel ao HTML V73 (sidebar + topbar + mobile bottom nav).
// Cada página do V73 renderiza dentro do <main> usando esta casca.
// CSS global do V73 é aplicado ao mount e desativado no unmount via body class.
type Nav = { href: string; label: string; icon: string };

const NAV_ITEMS: Nav[] = [
  { href: '/dashboard', label: 'Hoje', icon: '⌂' },
  { href: '/notebook', label: 'Meu caderno', icon: '▣' },
  { href: '/subjects', label: 'Matérias', icon: '▤' },
  { href: '/review', label: 'Revisões', icon: '↻' },
  { href: '/progress', label: 'Meu progresso', icon: '◴' },
  { href: '/favorites', label: 'Favoritos', icon: '☆' },
];

const MOBILE_ITEMS: Nav[] = [
  { href: '/dashboard', label: 'Hoje', icon: '⌂' },
  { href: '/notebook', label: 'Caderno', icon: '▣' },
  { href: '/subjects', label: 'Matérias', icon: '▤' },
  { href: '/review', label: 'Revisões', icon: '↻' },
  { href: '/progress', label: 'Progresso', icon: '◴' },
];

type ShellProps = {
  breadcrumb: string;
  children: ReactNode;
};

export default function Shell({ breadcrumb, children }: ShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    document.body.classList.add('v73-dashboard');
    return () => document.body.classList.remove('v73-dashboard');
  }, []);

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="v73-app">
      <div className="app">
        <aside className="sidebar" id="sidebar">
          <div className="logo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-claro.png" alt="NeuroFix Med" />
          </div>
          <nav className="nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                type="button"
                className={isActive(item.href) ? 'active' : undefined}
                onClick={() => router.push(item.href)}
              >
                <span className="ico">{item.icon}</span> {item.label}
                {item.href === '/favorites' && (
                  <span id="favNavCount" style={{ marginLeft: 'auto', fontSize: 11 }}>0</span>
                )}
              </button>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="profile">
              <div className="avatar">JD</div>
              <div>
                <b>Juliana</b>
                <small>1º ciclo • Acadêmica</small>
              </div>
            </div>
            <Link href="/politica-de-privacidade" className="footer-link">
              Privacidade e termos
            </Link>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button type="button" className="icon-btn mobile-menu">☰</button>
              <div className="breadcrumb" id="breadcrumb">
                NeuroFix Med / <b>{breadcrumb}</b>
              </div>
            </div>
            <div className="top-actions">
              <div className="search" id="searchBox">
                ⌕{' '}
                <input
                  id="globalSearch"
                  autoComplete="off"
                  placeholder="Buscar matéria, aula ou microassunto"
                  aria-label="Buscar no caderno"
                />
                <div className="search-results" id="searchResults" />
              </div>
              <button type="button" className="icon-btn" id="mobileSearchButton" aria-label="Abrir busca">⌕</button>
              <button
                type="button"
                className="icon-btn"
                aria-label="Abrir progresso"
                onClick={() => router.push('/progress')}
              >
                ◔
              </button>
            </div>
          </header>

          <div className="content">{children}</div>
        </main>

        <nav className="mobile-bottom-nav" id="mobileBottomNav">
          {MOBILE_ITEMS.map((item) => (
            <button
              key={item.href}
              type="button"
              className={isActive(item.href) ? 'active' : undefined}
              onClick={() => router.push(item.href)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
