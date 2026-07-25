'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

type Size = 'sm' | 'md' | 'lg';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  size?: Size;
  dismissOnBackdrop?: boolean;
  dismissOnEsc?: boolean;
  labelledBy?: string;
  children: React.ReactNode;
};

const SIZE_MAX: Record<Size, string> = {
  sm: '520px',
  md: '760px',
  lg: '1040px',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  title,
  footer,
  size = 'md',
  dismissOnBackdrop = true,
  dismissOnEsc = true,
  labelledBy,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    previousActiveRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const t = window.setTimeout(() => {
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      focusables?.[0]?.focus();
    }, 40);

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && dismissOnEsc) {
        e.stopPropagation();
        handleClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (nodes.length === 0) {
          e.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previousActiveRef.current?.focus?.();
    };
  }, [open, dismissOnEsc, handleClose]);

  if (!open || typeof document === 'undefined') return null;

  const titleId = labelledBy ?? (title ? 'v73-modal-title' : undefined);

  return createPortal(
    <div
      className="summary-modal-overlay"
      onMouseDown={(e) => {
        if (dismissOnBackdrop && e.target === e.currentTarget) handleClose();
      }}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="summary-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ maxWidth: SIZE_MAX[size] }}
      >
        {title && (
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px 12px',
              borderBottom: '1px solid rgba(201,164,85,0.14)',
            }}
          >
            <h2 id={titleId} style={{ margin: 0, fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {title}
            </h2>
            <button
              type="button"
              className="summary-close-btn"
              onClick={handleClose}
              aria-label="Fechar"
            >
              ✕
            </button>
          </header>
        )}
        <div style={{ padding: '20px 24px' }}>{children}</div>
        {footer && (
          <footer
            style={{
              padding: '12px 24px 20px',
              borderTop: '1px solid rgba(201,164,85,0.14)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
