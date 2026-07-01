'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { updateUserSettings } from '@/app/(app)/configuracoes/actions';

const navItems = [
  {
    href: '/dashboard',
    label: 'Início',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/ia',
    label: 'Estudar com IA',
    hidden: true, // MVP: oculto visualmente — funções/rotas preservadas. Ver lancamento-futuro/04-sidebar-estudar-ia.md
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/>
        <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z"/>
        <path d="M5 14l.6 1.6L7 16l-1.4.4L5 18l-.6-1.6L3 16l1.4-.4z"/>
      </svg>
    ),
  },
  {
    href: '/biblioteca',
    label: 'Biblioteca',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    href: '/flashcards',
    label: 'Flashcards',
    hidden: true, // MVP: oculto visualmente — funções/rotas preservadas. Ver lancamento-futuro/README.md
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
];

const menuItems = [
  { icon: '⚙️', label: 'Configurações', href: '/configuracoes', disabled: false },
  { icon: '🔔', label: 'Notificações',   href: '/configuracoes#notificacoes', disabled: true  }, // MVP: ver lancamento-futuro/05-agenda-notificacoes-srs.md
  { icon: '❓', label: 'Ajuda',          href: '#',        disabled: true  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const [temaClaro, setTemaClaro] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTemaClaro(document.querySelector('.app-shell')?.classList.contains('tema-claro') ?? false);
  }, []);

  async function toggleTema() {
    const novoTema = temaClaro ? 'dark' : 'light';
    setTemaClaro(!temaClaro);
    const shell = document.querySelector('.app-shell');
    if (!temaClaro) {
      shell?.classList.add('tema-claro');
    } else {
      shell?.classList.remove('tema-claro');
    }
    await updateUserSettings({ tema_preferido: novoTema });
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAberto(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="sidebar">

      {/* Logo — PNG transparente, funciona em ambos os temas */}
      <div className="logo-area">
        <Link href="/dashboard">
          <Image
            src="/logo-claro.png"
            alt="NeuroFix Med"
            width={1429}
            height={274}
            style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
            priority
          />
        </Link>
      </div>

      {/* Navegação */}
      <div className="nav-wrap">
        <div className="nav-title">Estudar</div>
        <nav className="sidebar-nav-list">
          {navItems.filter((item) => !(item as { hidden?: boolean }).hidden).map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Theme toggle */}
      <div style={{ padding: '0 10px 10px' }}>
        <button type="button" className="theme-toggle-btn" onClick={toggleTema}>
          {temaClaro ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
          {temaClaro ? 'Tema escuro' : 'Tema claro'}
        </button>
      </div>

      {/* Footer badge */}
      <div className="sidebar-footer">
        <span className="sidebar-footer-badge">Biblioteca ativa</span>
        <p>Conteúdos organizados para revisar, conectar e fixar medicina.</p>
      </div>

      {/* Botão NF + Menu flutuante */}
      <div
        ref={menuRef}
        style={{ padding: '12px 14px', borderTop: '1px solid rgba(201,164,85,0.14)', position: 'relative' }}
      >
        {menuAberto && (
          <div className="nf-menu-popup">
            <div className="nf-menu-header">
              <div className="nf-menu-avatar">NF</div>
              <div>
                <div className="nf-menu-account-name">NeuroFix Med</div>
                <div className="nf-menu-account-sub">Minha conta</div>
              </div>
            </div>

            <div style={{ padding: '6px' }}>
              {menuItems.map((item) => (
                item.disabled ? (
                  <div key={item.label} className="nf-menu-item nf-menu-item-disabled">
                    <span style={{ fontSize: '14px', opacity: 0.4 }}>{item.icon}</span>
                    <span style={{ opacity: 0.4 }}>{item.label}</span>
                    <span className="nf-menu-soon">em breve</span>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuAberto(false)}
                    className="nf-menu-item"
                  >
                    <span style={{ fontSize: '14px' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            <div className="nf-menu-divider">
              <form action="/auth/logout" method="post">
                <button type="submit" className="nf-menu-logout">
                  <span style={{ fontSize: '14px' }}>🚪</span>
                  Sair
                </button>
              </form>
            </div>
          </div>
        )}

        <button
          onClick={() => setMenuAberto(prev => !prev)}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: menuAberto
              ? 'linear-gradient(135deg, #C9A455, #E8CA7A)'
              : 'linear-gradient(135deg, #8A6020, #D4A84B)',
            border: menuAberto ? '2px solid rgba(201,164,85,0.6)' : '2px solid rgba(201,164,85,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Inter', sans-serif", fontWeight: '800',
            fontSize: '14px', color: '#050505',
            cursor: 'pointer', letterSpacing: '-0.02em',
            boxShadow: menuAberto ? '0 0 16px rgba(201,164,85,0.35)' : 'none',
            transition: 'all 0.2s ease',
          }}
          title="Menu da conta"
        >
          NF
        </button>
      </div>
    </aside>
  );
}
