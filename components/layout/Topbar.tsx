import type { ReactNode } from 'react';

type TopbarProps = {
  title?: ReactNode;
  breadcrumb?: ReactNode;
  search?: ReactNode;
  actions?: ReactNode;
};

// Classe intencionalmente `v73-topbar` para não colidir com `.topbar` existente em app/globals.css.
export function Topbar({ title, breadcrumb, search, actions }: TopbarProps) {
  return (
    <header
      className="v73-topbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 28px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ minWidth: 0, flex: '0 1 auto' }}>
        {breadcrumb && (
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '2px' }}>
            {breadcrumb}
          </div>
        )}
        {title && (
          <div
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </div>
        )}
      </div>
      {search && <div style={{ flex: '1 1 320px', minWidth: 0 }}>{search}</div>}
      {actions && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: '0 0 auto' }}>
          {actions}
        </div>
      )}
    </header>
  );
}

export default Topbar;
