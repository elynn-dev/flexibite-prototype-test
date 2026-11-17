import type { ReactNode } from 'react';
import styles from './Menu.module.css';

export interface MenuEntry {
  label: ReactNode;
  icon?: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
}

/** Design-system menu (Figma: Components → Dropdown → menu, built from ".menu items"). */
export function Menu({ items, id, className }: { items: MenuEntry[]; id?: string; className?: string }) {
  return (
    <div className={`${styles.menu} ${className ?? ''}`} role="menu" id={id}>
      {items.map((it, i) => (
        <button key={i} type="button" role="menuitem" className={styles.item} disabled={it.disabled} onClick={it.onSelect}>
          {it.icon}
          <span>{it.label}</span>
        </button>
      ))}
    </div>
  );
}
