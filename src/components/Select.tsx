import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './Select.module.css';

export interface SelectOption<T> {
  value: T;
  /** Small number before the label (Figma ".option" quantity), e.g. the 1 in "1 SERVING". */
  quantity?: ReactNode;
  label: ReactNode;
  disabled?: boolean;
}

interface SelectProps<T> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

/**
 * Design-system select (Figma: Components → Dropdown → select, with ".option" rows).
 * Closed: one option with a chevron. Open: the options drop below with the Figma shadow.
 */
export function Select<T>({ value, options, onChange, ariaLabel, className }: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={`${styles.select} ${className ?? ''}`} ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.option} ${styles.trigger}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
      >
        {current.quantity != null && <span className={styles.quantity}>{current.quantity}</span>}
        <span className={styles.label}>{current.label}</span>
        <Icon name={open ? 'chevronUp' : 'chevronDown'} size={16} />
      </button>
      {open && (
        <div className={styles.list} role="listbox" aria-label={ariaLabel}>
          {options.map((o, i) => (
            <button
              key={i}
              type="button"
              role="option"
              aria-selected={o.value === value}
              disabled={o.disabled}
              className={styles.option}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              {o.quantity != null && <span className={styles.quantity}>{o.quantity}</span>}
              <span className={styles.label}>{o.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
