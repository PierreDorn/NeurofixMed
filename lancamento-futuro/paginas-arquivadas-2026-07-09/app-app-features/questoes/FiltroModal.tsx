'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export interface ModalItem {
  id: string;
  nome: string;
  /** Se presente, o item é filho de outro (usado no modo hierárquico) */
  groupId?: string;
  /** Ordem dentro do grupo (usado para prefixo "1.1", "1.2" etc.) */
  ordem?: number;
}

export interface ModalGroup {
  id: string;
  nome: string;
}

export interface FiltroModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Instrução curta abaixo do título */
  subtitle?: string;
  /** Lista de itens selecionáveis */
  items: ModalItem[];
  /** Se fornecido → modo hierárquico (agrupa por groupId) */
  groups?: ModalGroup[];
  selectedIds: string[];
  onApply: (ids: string[]) => void;
  /** Texto do estado vazio (sem itens no filtro) */
  emptyMessage?: string;
}

/**
 * Modal centralizado (retângulo em pé) com:
 * - Barra de pesquisa no topo
 * - Lista de opções abaixo (checkbox multi-select)
 * - Rodapé: Limpar filtro / Aplicar
 *
 * Fecha ao clicar no backdrop, ESC ou botão ×.
 */
export default function FiltroModal({
  open,
  onClose,
  title,
  subtitle,
  items,
  groups,
  selectedIds,
  onApply,
  emptyMessage = 'Nada aqui ainda.',
}: FiltroModalProps) {
  const [busca, setBusca] = useState('');
  const [local, setLocal] = useState<string[]>(selectedIds);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLInputElement>(null);

  // Sincroniza seleção externa ao abrir
  useEffect(() => {
    if (open) {
      setLocal(selectedIds);
      setBusca('');
      // Auto-expande todos os grupos se estiver em modo hierárquico
      if (groups) {
        setExpanded(Object.fromEntries(groups.map((g) => [g.id, true])));
      }
      setTimeout(() => searchRef.current?.focus(), 40);
    }
  }, [open, selectedIds, groups]);

  // ESC fecha
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const buscaNorm = busca.trim().toLowerCase();

  const filteredItems = useMemo(() => {
    if (!buscaNorm) return items;
    return items.filter((it) => it.nome.toLowerCase().includes(buscaNorm));
  }, [items, buscaNorm]);

  const filteredGroups = useMemo(() => {
    if (!groups) return null;
    if (!buscaNorm) return groups;
    // Mantém grupos que têm ao menos um item filtrado OU cujo nome bate
    return groups.filter(
      (g) => g.nome.toLowerCase().includes(buscaNorm) || filteredItems.some((it) => it.groupId === g.id),
    );
  }, [groups, filteredItems, buscaNorm]);

  const toggle = (id: string) =>
    setLocal((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleGroup = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectAllInGroup = (groupId: string) => {
    const ids = items.filter((it) => it.groupId === groupId).map((it) => it.id);
    const allIn = ids.every((id) => local.includes(id));
    setLocal((prev) => (allIn ? prev.filter((x) => !ids.includes(x)) : Array.from(new Set([...prev, ...ids]))));
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(4, 6, 11, 0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, #10151c, #0B0E15)',
          border: '1px solid rgba(201,168,76,0.24)',
          borderRadius: 16,
          width: '100%', maxWidth: 480,
          maxHeight: '82vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(201,168,76,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#F0EDE6' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12, color: 'rgba(240,237,230,0.5)', marginTop: 3 }}>{subtitle}</div>}
          </div>
          <button
            type="button" onClick={onClose} aria-label="Fechar"
            style={{
              width: 32, height: 32, borderRadius: 8, background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,237,230,0.65)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '14px 20px 12px', position: 'relative' }}>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,230,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: 34, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar…"
            style={{
              width: '100%', padding: '11px 14px 11px 40px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10,
              color: '#F0EDE6', fontFamily: 'inherit', fontSize: 14, outline: 'none',
              transition: 'border-color .2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.42)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)')}
          />
        </div>

        {/* List */}
        <div style={{ flex: 1, minHeight: 200, overflowY: 'auto', padding: '4px 12px 12px' }}>
          {filteredGroups && filteredGroups.length > 0 ? (
            filteredGroups.map((g) => {
              const isOpen = expanded[g.id] ?? true;
              const groupItems = filteredItems.filter((it) => it.groupId === g.id);
              const allSelected = groupItems.length > 0 && groupItems.every((it) => local.includes(it.id));
              return (
                <div key={g.id} style={{ marginBottom: 4 }}>
                  {/* Group header */}
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px',
                      background: 'linear-gradient(90deg, rgba(201,168,76,0.14), rgba(201,168,76,0.05))',
                      borderRadius: 8, marginBottom: 4,
                    }}
                  >
                    <button
                      type="button" onClick={() => toggleGroup(g.id)} aria-label={isOpen ? 'Recolher' : 'Expandir'}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', color: 'rgba(240,237,230,0.7)',
                        padding: 2,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transition: 'transform .18s', transform: `rotate(${isOpen ? 90 : 0}deg)` }}>
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: '#F0EDE6', letterSpacing: '.02em' }}>
                      {g.nome}
                    </span>
                    <button
                      type="button"
                      onClick={() => selectAllInGroup(g.id)}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(201,168,76,0.28)',
                        borderRadius: 6, padding: '4px 10px', color: '#E8D08A',
                        fontFamily: 'inherit', fontSize: 10.5, fontWeight: 600, letterSpacing: '.05em',
                        textTransform: 'uppercase', cursor: 'pointer',
                      }}
                    >
                      {allSelected ? 'Limpar' : 'Marcar todos'}
                    </button>
                  </div>
                  {/* Items */}
                  {isOpen && groupItems.map((it) => (
                    <ItemRow key={it.id} nome={it.nome} checked={local.includes(it.id)} onToggle={() => toggle(it.id)} nested />
                  ))}
                </div>
              );
            })
          ) : (
            filteredItems.length > 0 ? (
              filteredItems.map((it) => (
                <ItemRow key={it.id} nome={it.nome} checked={local.includes(it.id)} onToggle={() => toggle(it.id)} />
              ))
            ) : (
              <div style={{
                padding: '32px 20px', textAlign: 'center', color: 'rgba(240,237,230,0.4)',
                fontSize: 13, lineHeight: 1.6,
              }}>
                {buscaNorm ? 'Nada encontrado com esse nome.' : emptyMessage}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px', display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button
            type="button"
            onClick={() => setLocal([])}
            disabled={local.length === 0}
            style={{
              padding: '10px 16px', borderRadius: 8,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: local.length === 0 ? 'rgba(240,237,230,0.28)' : 'rgba(240,237,230,0.7)',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 600, letterSpacing: '.03em',
              cursor: local.length === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            </svg>
            Limpar filtro
          </button>
          <button
            type="button"
            onClick={() => { onApply(local); onClose(); }}
            style={{
              padding: '11px 22px', borderRadius: 8,
              background: 'linear-gradient(180deg, #E8D08A, #C9A84C)',
              border: 'none', color: '#241d0c',
              fontFamily: 'inherit', fontSize: 12.5, fontWeight: 800, letterSpacing: '.04em',
              cursor: 'pointer', textTransform: 'uppercase',
              boxShadow: '0 8px 22px -10px rgba(201,168,76,.6)',
            }}
          >
            Aplicar {local.length > 0 && `(${local.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}

function ItemRow({ nome, checked, onToggle, nested }: { nome: string; checked: boolean; onToggle: () => void; nested?: boolean }) {
  return (
    <label
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: `10px ${nested ? '12px 10px 32px' : '12px'}`,
        cursor: 'pointer', borderRadius: 8,
        transition: 'background .12s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(201,168,76,0.06)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{ flex: 1, fontSize: 14, color: '#dfe2e6', lineHeight: 1.4 }}>{nome}</span>
      <span
        aria-hidden="true"
        style={{
          width: 20, height: 20, borderRadius: 5, flexShrink: 0,
          border: checked ? '1.5px solid #C9A84C' : '1.5px solid rgba(255,255,255,0.18)',
          background: checked ? 'linear-gradient(135deg, #E8D08A, #C9A84C)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .15s',
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#241d0c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onToggle} style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }} />
    </label>
  );
}
