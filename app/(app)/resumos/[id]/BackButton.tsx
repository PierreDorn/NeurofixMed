'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      aria-label="Voltar"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 13px',
        background: 'rgba(201,168,76,0.08)',
        border: '1px solid rgba(201,168,76,0.22)',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 700,
        color: '#E8CA7A',
        cursor: 'pointer',
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        flexShrink: 0,
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(201,168,76,0.16)';
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.42)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
        e.currentTarget.style.borderColor = 'rgba(201,168,76,0.22)';
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
      Voltar
    </button>
  );
}
