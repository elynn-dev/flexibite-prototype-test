import type { ReactNode } from 'react';
import styles from './Chip.module.css';

export type ChipType = 'default' | 'outline' | 'info';

interface ChipProps {
  /** Figma "type": default = black, outline = light with a border, info = blue. */
  type?: ChipType;
  /** Figma "size": sm = 24px uppercase label, lg = 36px. */
  size?: 'sm' | 'lg';
  disabled?: boolean;
  label: ReactNode;
  /** Red count after the label, e.g. "3+". */
  quantity?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

/** Design-system Chip (Figma: Components → input → chip). Display only. */
export function Chip({ type = 'default', size = 'sm', disabled, label, quantity, leftIcon, rightIcon, className }: ChipProps) {
  const cls = [styles.chip, styles[type], styles[size], disabled ? styles.disabled : '', className].filter(Boolean).join(' ');
  return (
    <span className={cls}>
      {leftIcon}
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {quantity != null && <span className={styles.quantity}>{quantity}</span>}
      </span>
      {rightIcon}
    </span>
  );
}
