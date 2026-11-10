import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './MealCardMenu.module.css';

interface MealCardMenuProps {
  children: ReactNode;
  /** Vertical tiles put the menu button a little lower and further in. */
  vertical?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

/** Figma "meal-card-menu": a ⋮ button on the card's corner that opens Edit / Delete. */
export function MealCardMenu({ children, vertical, onEdit, onDelete }: MealCardMenuProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const choose = (fn?: () => void) => () => {
    setOpen(false);
    fn?.();
  };

  return (
    <div ref={wrapRef} className={`${styles.wrap} ${vertical ? styles.vertical : ''}`}>
      {children}
      <button
        type="button"
        className={styles.trigger}
        aria-label="Meal options"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        <KebabIcon />
      </button>
      {open && (
        <div className={styles.menu} role="menu" id={menuId}>
          <button type="button" role="menuitem" className={styles.item} onClick={choose(onEdit)}>
            <Icon name="menuEdit" size={16} />
            <span>Edit</span>
          </button>
          <button type="button" role="menuitem" className={styles.item} onClick={choose(onDelete)}>
            <Icon name="menuDelete" size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}

/** ⋮ drawn inline so its colour can follow the card (currentColor). */
function KebabIcon() {
  return (
    <svg viewBox="0 0 18 18" width="17.4" height="17.4" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M8.7014 4.71341C9.3021 4.71341 9.78906 4.22644 9.78906 3.62575C9.78906 3.02505 9.3021 2.53809 8.7014 2.53809C8.1007 2.53809 7.61374 3.02505 7.61374 3.62575C7.61374 4.22644 8.1007 4.71341 8.7014 4.71341ZM8.7014 14.8649C9.3021 14.8649 9.78906 14.3779 9.78906 13.7773C9.78906 13.1766 9.3021 12.6896 8.7014 12.6896C8.1007 12.6896 7.61374 13.1766 7.61374 13.7773C7.61374 14.3779 8.1007 14.8649 8.7014 14.8649ZM8.7014 9.78918C9.3021 9.78918 9.78906 9.30221 9.78906 8.70152C9.78906 8.10082 9.3021 7.61386 8.7014 7.61386C8.1007 7.61386 7.61374 8.10082 7.61374 8.70152C7.61374 9.30221 8.1007 9.78918 8.7014 9.78918Z"
      />
    </svg>
  );
}
