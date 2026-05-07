'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

const navItems = [
  { href: '/dashboard',  icon: '🧠', label: 'Início' },
  { href: '/biblioteca', icon: '📚', label: 'Biblioteca' },
  { href: '/flashcards', icon: '🔁', label: 'Flashcards' },
  { href: '/desempenho', icon: '📈', label: 'Desempenho' },
  { href: '/perfil',     icon: '⚙️', label: 'Perfil' },
];

const menuItems = [
  { icon: '⚙️', label: 'Configurações',  href: '/perfil',     disabled: false },
  { icon: '🔒', label: 'Segurança',       href: '#',           disabled: true  },
  { icon: '🔔', label: 'Notificações',    href: '#',           disabled: true  },
  { icon: '❓', label: 'Ajuda',           href: '#',           disabled: true  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
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
      {/* Logo oficial NeuroFix Med */}
      <div className="sidebar-logo" style={{ padding: '20px 16px 16px' }}>
        <Link href="/dashboard" style={{ display: 'block', textDecoration: 'none' }}>
          <Image
            src="/logo.png"
            alt="NeuroFix Med"
            width={200}
            height={60}
            style={{ width: '100%', maxWidth: '200px', height: 'auto', objectFit: 'contain' }}
            priority
          />
        </Link>
      </div>

      {/* Navegação */}
      <nav className="sidebar-nav">
        <span className="nav-section-label">Estudar</span>

        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Botão NF + Menu flutuante */}
      <div
        ref={menuRef}
        style={{ padding: '12px 14px', borderTop: '1px solid rgba(201,164,85,0.14)', position: 'relative' }}
      >
        {/* Menu popup — aparece acima do botão, ancorado à esquerda */}
        {menuAberto && (
          <div style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: '14px',
            width: '210px',
            background: '#111111',
            border: '1px solid rgba(201,164,85,0.22)',
            borderRadius: '14px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            overflow: 'hidden',
            zIndex: 50,
          }}>
            {/* Cabeçalho do menu */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(201,164,85,0.14)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              {/* Mini avatar NF */}
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #8A6020, #D4A84B)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Inter', sans-serif", fontWeight: '800',
                fontSize: '13px', color: '#050505', flexShrink: 0,
                letterSpacing: '-0.02em',
              }}>
                NF
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9', lineHeight: 1.2 }}>
                  NeuroFix Med
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Minha conta
                </div>
              </div>
            </div>

            {/* Itens do menu */}
            <div style={{ padding: '6px' }}>
              {menuItems.map((item) => (
                item.disabled ? (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 10px', borderRadius: '8px',
                      color: '#374151', fontSize: '13px', fontWeight: '600',
                      cursor: 'not-allowed',
                    }}
                  >
                    <span style={{ fontSize: '14px', opacity: 0.4 }}>{item.icon}</span>
                    <span style={{ opacity: 0.4 }}>{item.label}</span>
                    <span style={{
                      marginLeft: 'auto', fontSize: '9px', fontWeight: '700',
                      background: 'rgba(201,164,85,0.12)', color: '#C9A455',
                      padding: '2px 6px', borderRadius: '4px', opacity: 0.7,
                    }}>
                      em breve
                    </span>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuAberto(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '9px 10px', borderRadius: '8px',
                      color: '#cbd5e1', fontSize: '13px', fontWeight: '600',
                      textDecoration: 'none', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontSize: '14px' }}>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* Divisor + Sair */}
            <div style={{ borderTop: '1px solid rgba(201,164,85,0.12)', padding: '6px' }}>
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', padding: '9px 10px', borderRadius: '8px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: '#ef4444', fontSize: '13px', fontWeight: '700',
                    transition: 'background 0.15s', textAlign: 'left',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '14px' }}>🚪</span>
                  Sair
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Botão circular NF */}
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
