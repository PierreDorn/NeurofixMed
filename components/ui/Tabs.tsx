'use client';

import { useCallback, useId, useRef } from 'react';

type TabItem = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

type TabsProps = {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  children?: React.ReactNode;
};

export function Tabs({ items, value, onChange, ariaLabel, children }: TabsProps) {
  const groupId = useId();
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const move = useCallback(
    (dir: 1 | -1) => {
      const enabled = items.filter((i) => !i.disabled);
      const idx = enabled.findIndex((i) => i.value === value);
      const next = enabled[(idx + dir + enabled.length) % enabled.length];
      if (next) {
        onChange(next.value);
        btnRefs.current[next.value]?.focus();
      }
    },
    [items, value, onChange],
  );

  return (
    <div>
      <div role="tablist" aria-label={ariaLabel} className="v73-tabs">
        {items.map((item) => {
          const active = item.value === value;
          return (
            <button
              key={item.value}
              ref={(el) => {
                btnRefs.current[item.value] = el;
              }}
              type="button"
              role="tab"
              id={`${groupId}-tab-${item.value}`}
              aria-selected={active}
              aria-controls={`${groupId}-panel-${item.value}`}
              tabIndex={active ? 0 : -1}
              disabled={item.disabled}
              onClick={() => !item.disabled && onChange(item.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  move(1);
                } else if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  move(-1);
                }
              }}
              className={`pill${active ? ' active' : ''}`}
              style={{ cursor: item.disabled ? 'not-allowed' : 'pointer' }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {children && (
        <div
          role="tabpanel"
          id={`${groupId}-panel-${value}`}
          aria-labelledby={`${groupId}-tab-${value}`}
          style={{ marginTop: '16px' }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default Tabs;
