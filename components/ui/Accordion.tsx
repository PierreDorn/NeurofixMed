'use client';

import { useCallback, useId, useState } from 'react';

export type AccordionItem = {
  id: string;
  title: React.ReactNode;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  mode?: 'single' | 'multiple';
  defaultOpen?: string[];
  value?: string[];
  onChange?: (openIds: string[]) => void;
};

export function Accordion({
  items,
  mode = 'single',
  defaultOpen = [],
  value,
  onChange,
}: AccordionProps) {
  const groupId = useId();
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultOpen);
  const isControlled = value !== undefined;
  const open = isControlled ? value! : uncontrolled;

  const toggle = useCallback(
    (id: string) => {
      const isOpen = open.includes(id);
      let next: string[];
      if (mode === 'single') {
        next = isOpen ? [] : [id];
      } else {
        next = isOpen ? open.filter((x) => x !== id) : [...open, id];
      }
      if (isControlled) {
        onChange?.(next);
      } else {
        setUncontrolled(next);
        onChange?.(next);
      }
    },
    [open, mode, isControlled, onChange],
  );

  return (
    <div className="v73-accordion">
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const btnId = `${groupId}-h-${item.id}`;
        const panelId = `${groupId}-p-${item.id}`;
        return (
          <div key={item.id} className="accordion-item">
            <button
              type="button"
              id={btnId}
              aria-controls={panelId}
              aria-expanded={isOpen}
              onClick={() => toggle(item.id)}
              className="accordion-header"
              style={{
                width: '100%',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                font: 'inherit',
              }}
            >
              <span>{item.title}</span>
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  transition: 'transform 180ms ease',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                ▾
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="accordion-body"
            >
              {isOpen && item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
