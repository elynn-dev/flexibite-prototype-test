import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../components/Icon';
import { MealMarker } from '../../components/MealTime';
import { MEAL_LABEL, MEAL_TIMES, type MealTime } from '../../data/types';
import styles from './MealTimeSelect.module.css';

interface MealTimeSelectProps {
  value: MealTime;
  onChange: (meal: MealTime) => void;
}

/** Figma "select" above each Edit mode card: meal shape, meal time and a chevron; opens a list to change it. */
export function MealTimeSelect({ value, onChange }: MealTimeSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
    <div className={styles.select} ref={ref}>
      <button
        type="button"
        className={styles.option}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Meal time: ${MEAL_LABEL[value]}`}
        onClick={() => setOpen((o) => !o)}
      >
        <MealMarker meal={value} size="md" />
        <span className={styles.label}>{MEAL_LABEL[value]}</span>
        <Icon name={open ? 'chevronUp' : 'chevronDown'} size={16} />
      </button>
      {open && (
        <div className={styles.list} role="listbox" aria-label="Meal time">
          {MEAL_TIMES.map((m) => (
            <button
              key={m}
              type="button"
              role="option"
              aria-selected={m === value}
              className={styles.item}
              onClick={() => {
                setOpen(false);
                if (m !== value) onChange(m);
              }}
            >
              <MealMarker meal={m} size="md" />
              <span className={styles.label}>{MEAL_LABEL[m]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
