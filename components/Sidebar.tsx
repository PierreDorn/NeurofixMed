'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { updateUserSettings } from '@/app/(app)/configuracoes/actions';
import CadernoTree from '@/app/(app)/dashboard/caderno/CadernoTree';
import '@/app/(app)/dashboard/caderno/caderno.css';
import { V73_ENABLED } from '@/lib/flags';
import { Home, BookOpen, NotebookPen, Repeat, HelpCircle, Layers, BarChart3, Star } from 'lucide-react';

// Sidebar reduzida em 2026-07-09.
// Itens de navegação (Início, Biblioteca, Neuro IA, Flashcards) e o item
// "Notificações" do menu da bolinha foram removidos junto com o arquivamento
// das rotas correspondentes em lancamento-futuro/paginas-arquivadas-2026-07-09/.
// A bolinha dourada (NF popup) segue funcionando com Configurações + Ajuda.
type NavItem = { href: string; label: string; hidden?: boolean; icon: React.ReactNode };

// Itens V73 aparecem SOMENTE quando NEXT_PUBLIC_V73_ENABLED=1.
// Atenção: NEXT_PUBLIC_* é congelada em build time — mudar .env.local exige restart do `next dev`.
const v73Items: NavItem[] = V73_ENABLED
  ? [
      { href: '/home', label: 'Início', icon: <Home size={16} /> },
      { href: '/subjects', label: 'Matérias', icon: <BookOpen size={16} /> },
      { href: '/notebook', label: 'Caderno', icon: <NotebookPen size={16} /> },
      { href: '/review', label: 'Revisão', icon: <Repeat size={16} /> },
      { href: '/questions', label: 'Questões', icon: <HelpCircle size={16} /> },
      { href: '/flashcards', label: 'Flashcards', icon: <Layers size={16} /> },
      { href: '/progress', label: 'Progresso', icon: <BarChart3 size={16} /> },
      { href: '/favorites', label: 'Favoritos', icon: <Star size={16} /> },
    ]
  : [];

const navItems: NavItem[] = [...v73Items];

const menuItems = [
  { icon: '⚙️', label: 'Configurações', href: '/configuracoes', disabled: false },
  { icon: '❓', label: 'Ajuda',          href: '#',              disabled: true  },
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

      {/* Navegação — oculta quando não há itens (features arquivadas em 2026-07-09) */}
      {navItems.filter((item) => !item.hidden).length > 0 && (
        <div className="nav-wrap">
          <div className="nav-title">Estudar</div>
          <nav className="sidebar-nav-list">
            {navItems.filter((item) => !item.hidden).map((item) => {
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
      )}
      {/* Bloco de notas (Início + árvore Ciclo → Matéria → Tema) */}
      <div className="cad-sidebar-slot">
        <CadernoTree />
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

      {/* Footer badge — oculto em 2026-07-09 junto com o arquivamento da biblioteca.
          Mantido no código pra reativação futura. */}
      {false && (
        <div className="sidebar-footer">
          <span className="sidebar-footer-badge">Sua biblioteca médica</span>
          <p>Tudo organizado para revisar, conectar e fixar de verdade.</p>
        </div>
      )}

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
                <div className="nf-menu-account-sub">Sua conta</div>
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
