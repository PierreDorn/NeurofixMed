'use client';

import { useEffect } from 'react';
import { registrarLeituraResumo } from './srs-actions';

/**
 * Tracker invisível: dispara o agendamento de revisões automáticas
 * uma única vez quando o resumo é aberto. Não bloqueia a UI nem
 * mostra erros pro aluno (regra do projeto).
 */
export default function ResumoTracker({ resumoId }: { resumoId: string }) {
  useEffect(() => {
    let cancelled = false;
    // Aguarda 600ms pra evitar disparar em refresh acidental
    const t = setTimeout(() => {
      if (cancelled) return;
      registrarLeituraResumo(resumoId).catch(err => {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[resumo-tracker]', err);
        }
      });
    }, 600);
    return () => { cancelled = true; clearTimeout(t); };
  }, [resumoId]);

  return null;
}
