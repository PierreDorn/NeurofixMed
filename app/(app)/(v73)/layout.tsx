import type { ReactNode } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

// Grupo de rota (v73) — parênteses = não vira segmento de URL.
// Autenticação já é feita pelo layout pai app/(app)/layout.tsx.
export default function V73Layout({ children }: { children: ReactNode }) {
  return (
    <div className="v73-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar title="NeuroFix V73" breadcrumb="Prévia da nova interface" />
      <main
        className="v73-content"
        style={{
          flex: 1,
          padding: '24px 28px 96px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {children}
      </main>
      <MobileBottomNav />
    </div>
  );
}
