import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import styles from './ServingSelect.module.css';

const OPTIONS = [1, 2, 3];

interface ServingSelectProps {
  value: number;
  onChange: (servings: number) => void;
}

/** Figma "serving-dropdown container": reset button + "1 SERVING" select. */
export function ServingSelect({ value, onChange }: ServingSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
    <div className={styles.serving}>
      <Button size="sm" className={styles.reset} aria-label="Reset serving" onClick={() => onChange(1)}>
        <Icon name="reset" size={16} />
      </Button>
      <div className={styles.select} ref={ref}>
        <button
          ref={triggerRef}
          type="button"
          className={styles.option}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`${value} serving`}
          onClick={() => setOpen((o) => !o)}
        >
          <b>{value}</b>
          <span>Serving</span>
          <Icon name="chevronDown" size={16} className={open ? styles.flipped : undefined} />
        </button>
        {open && (
          <div className={styles.list} role="listbox" aria-label="Servings">
            {OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                role="option"
                aria-selected={n === value}
                className={styles.option}
                onClick={() => {
                  onChange(n);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                <b>{n}</b>
                <span>Serving</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
