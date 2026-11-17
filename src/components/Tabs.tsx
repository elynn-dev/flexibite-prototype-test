import type { ReactNode } from 'react';
import styles from './Tabs.module.css';

export interface TabItem<T extends string> {
  id: T;
  label: ReactNode;
  /** 16px icon before the label (meal-idea nav). */
  icon?: ReactNode;
  /** Small red dot for new activity (join-in nav). */
  dot?: boolean;
}

interface TabsProps<T extends string> {
  /** Figma "tabs" type: pantry-nav (Storage/Fridge/Freezer), join-in-nav, meal-idea--nav. */
  type: 'pantry-nav' | 'join-in-nav' | 'meal-idea-nav';
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}

/** Design-system tabs (Figma: Components → Navigation → tabs, size=sm). */
export function Tabs<T extends string>({ type, items, value, onChange, className }: TabsProps<T>) {
  return (
    <div className={[styles.tabs, styles[type], className].filter(Boolean).join(' ')} role="tablist">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          role="tab"
          aria-selected={it.id === value}
          className={styles.tab}
          onClick={() => onChange(it.id)}
        >
          {it.icon}
          {it.label}
          {it.dot && <i className={styles.dot} aria-label="New activity" />}
        </button>
      ))}
    </div>
  );
}
