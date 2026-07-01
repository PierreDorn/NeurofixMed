'use client';

import { Sparkles } from 'lucide-react';

type Props = {
  geracoesHoje: number;
  limiteDiario: number;
};

export default function ContadorGeracoes({ geracoesHoje, limiteDiario }: Props) {
  const restantes = Math.max(0, limiteDiario - geracoesHoje);
  const pct = Math.min(100, (geracoesHoje / limiteDiario) * 100);
  const proximoLimite = pct >= 80;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        background: 'var(--surface, #161616)',
        border: `1px solid ${proximoLimite ? 'rgba(239,68,68,0.4)' : 'var(--border, #2a2a2a)'}`,
        borderRadius: 12,
        fontSize: 13,
        color: 'var(--soft, #c7c7c7)',
        whiteSpace: 'nowrap',
      }}
    >
      <Sparkles size={14} style={{ color: proximoLimite ? '#fca5a5' : 'var(--gold, #d4af37)' }} />
      <span>
        <strong style={{ color: 'var(--text, #fafafa)' }}>{geracoesHoje}</strong>
        <span style={{ opacity: 0.6 }}> / {limiteDiario}</span>{' '}
        <span style={{ opacity: 0.7 }}>gerações hoje</span>
      </span>
      <div
        style={{
          width: 60,
          height: 4,
          background: 'var(--border, #2a2a2a)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: proximoLimite
              ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
              : 'linear-gradient(90deg, #8A6020, var(--gold, #d4af37))',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      {restantes === 0 && (
        <span style={{ color: '#fca5a5', fontSize: 12 }}>limite atingido</span>
      )}
    </div>
  );
}
