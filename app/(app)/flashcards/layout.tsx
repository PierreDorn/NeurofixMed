import '../biblioteca/biblioteca.css';

export default function FlashcardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ '--sidebar-width': '240px' } as React.CSSProperties}>
      {children}
    </div>
  );
}
