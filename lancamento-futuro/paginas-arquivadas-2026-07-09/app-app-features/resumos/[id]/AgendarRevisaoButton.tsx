'use client';

import { useState } from 'react';
import { registrarLeituraResumo } from './srs-actions';

interface Props {
  resumoId: string;
  jaAgendado: boolean;
}

export default function AgendarRevisaoButton({ resumoId, jaAgendado: initial }: Props) {
  const [estado, setEstado] = useState<'idle' | 'loading' | 'ok' | 'jaExistia' | 'erro'>(
    initial ? 'jaExistia' : 'idle'
  );
  const [erro, setErro] = useState('');

  async function handleClick() {
    if (estado === 'loading' || estado === 'ok' || estado === 'jaExistia') return;
    setEstado('loading');
    try {
      const res = await registrarLeituraResumo(resumoId);
      if (res.jaExistia) setEstado('jaExistia');
      else if (res.ok) setEstado('ok');
      else { setErro(res.error ?? 'Erro desconhecido'); setEstado('erro'); }
    } catch (e) {
      setErro(String(e));
      setEstado('erro');
    }
  }

  // ── estado: agendado com sucesso agora ──
  if (estado === 'ok') {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="arb arb-success">
          <svg className="arb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div className="arb-text">
            <span className="arb-label">4 revisões agendadas</span>
            <span className="arb-sub">Aparecem na sua agenda do dashboard</span>
          </div>
        </div>
      </>
    );
  }

  // ── estado: já existia de antes ──
  if (estado === 'jaExistia') {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="arb arb-existing">
          <svg className="arb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M12 8v4l3 3"/>
          </svg>
          <div className="arb-text">
            <span className="arb-label">Revisões já agendadas</span>
            <span className="arb-sub">Este conteúdo já está na sua fila</span>
          </div>
        </div>
      </>
    );
  }

  // ── estado: erro ──
  if (estado === 'erro') {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <button type="button" className="arb arb-error" onClick={handleClick}>
          <svg className="arb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div className="arb-text">
            <span className="arb-label">Erro — clique para tentar novamente</span>
            {erro && <span className="arb-sub">{erro}</span>}
          </div>
        </button>
      </>
    );
  }

  // ── estado: carregando ──
  if (estado === 'loading') {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="arb arb-loading">
          <span className="arb-spinner" />
          <div className="arb-text">
            <span className="arb-label">Agendando revisões…</span>
            <span className="arb-sub">Calculando datas com seus horários</span>
          </div>
        </div>
      </>
    );
  }

  // ── estado: idle — botão principal ──
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <button
        type="button"
        className="arb arb-idle"
        onClick={handleClick}
      >
        <svg className="arb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
        </svg>
        <div className="arb-text">
          <span className="arb-label">Agendar revisões automáticas</span>
          <span className="arb-sub">4 revisões • curva de Ebbinghaus</span>
        </div>
        <svg className="arb-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </>
  );
}

const CSS = `
.arb {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px 10px 14px;
  border-radius: 12px;
  font-family: 'Atkinson Hyperlegible', 'Inter', sans-serif;
  border: 1.5px solid;
  transition: all 0.18s;
  text-align: left;
  user-select: none;
  white-space: nowrap;
}
.arb-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.arb-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.arb-label {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
}
.arb-sub {
  font-size: 10.5px;
  font-weight: 500;
  opacity: 0.72;
  letter-spacing: 0.01em;
}
.arb-arrow {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  margin-left: 2px;
  opacity: 0.6;
  transition: transform 0.15s;
}

/* idle — botão principal dourado */
.arb-idle {
  background: linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(232,208,138,0.08) 100%);
  border-color: rgba(201,168,76,0.5);
  color: #E8D08A;
  cursor: pointer;
  box-shadow: 0 0 0 0 rgba(201,168,76,0);
}
.arb-idle:hover {
  background: linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(232,208,138,0.14) 100%);
  border-color: rgba(201,168,76,0.75);
  box-shadow: 0 0 18px rgba(201,168,76,0.18);
  color: #F0DC9A;
}
.arb-idle:hover .arb-arrow {
  transform: translateX(3px);
  opacity: 1;
}
.arb-idle:active {
  transform: scale(0.98);
}

/* loading */
.arb-loading {
  background: rgba(201,168,76,0.07);
  border-color: rgba(201,168,76,0.28);
  color: #C9A84C;
  cursor: default;
}
.arb-spinner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(201,168,76,0.25);
  border-top-color: #C9A84C;
  flex-shrink: 0;
  animation: arb-spin 0.75s linear infinite;
}
@keyframes arb-spin { to { transform: rotate(360deg); } }

/* success */
.arb-success {
  background: linear-gradient(135deg, rgba(74,222,128,0.1) 0%, rgba(52,211,153,0.06) 100%);
  border-color: rgba(74,222,128,0.4);
  color: #4ADE80;
  cursor: default;
}

/* já existia */
.arb-existing {
  background: linear-gradient(135deg, rgba(74,179,255,0.08) 0%, rgba(74,179,255,0.04) 100%);
  border-color: rgba(74,179,255,0.32);
  color: #7BC8FF;
  cursor: default;
}

/* erro */
.arb-error {
  background: rgba(239,68,68,0.07);
  border-color: rgba(239,68,68,0.32);
  color: #FCA5A5;
  cursor: pointer;
}
.arb-error:hover {
  background: rgba(239,68,68,0.13);
}
`;
