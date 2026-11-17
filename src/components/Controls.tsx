import type { ReactNode } from 'react';
import { Icon } from './Icon';
import { Link } from './Link';
import styles from './Controls.module.css';

/** On/off switch (Edit plans "Keep on current day"). */
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={styles.switch}
      onClick={() => onChange(!checked)}
    />
  );
}

/** Square checkbox drawn with the Figma icons. */
export function Checkbox({
  checked,
  onChange,
  label,
  size = 24,
  className,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  size?: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.checkbox} ${className ?? ''}`}
      style={{ width: size, height: size }}
      onClick={onChange}
    >
      <Icon name={checked ? 'checkboxSquareOn' : 'checkboxSquareOff'} size={size} />
    </button>
  );
}

/** − 3 + quantity row. */
export function Stepper({
  value,
  onChange,
  label,
  counter,
}: {
  value: ReactNode;
  onChange: (delta: number) => void;
  label: string;
  /** Figma "counter" look: 42px tall with a bottom line. */
  counter?: boolean;
}) {
  return (
    <div className={`${styles.stepper} ${counter ? styles.counter : ''}`}>
      <button type="button" aria-label={`Less ${label}`} onClick={() => onChange(-1)}>
        <Icon name="minus" size={20} />
      </button>
      <span>{value}</span>
      <button type="button" aria-label={`More ${label}`} onClick={() => onChange(1)}>
        <Icon name="plusBlack" size={20} />
      </button>
    </div>
  );
}

/** Figma Feedback → snack-bar (state success | error | info): message, then an Undo link or a description. */
export function SnackBar({
  text,
  onUndo,
  state = 'success',
  description,
}: {
  text: string;
  onUndo?: () => void;
  state?: 'success' | 'error' | 'info';
  description?: string;
}) {
  return (
    <div className={`${styles.snack} ${styles[state]}`} role="status">
      <span className={styles.snackMessage}>{text}</span>
      {onUndo && (
        <Link variant="outline-all" className={styles.snackLink} onClick={onUndo}>
          Undo
        </Link>
      )}
      {description && <span className={styles.snackDescription}>{description}</span>}
    </div>
  );
}

/** Top bar of full-screen overlays: optional back arrow on the left, × on the right. */
export function OverlayHeader({ onClose, onBack, height = 96 }: { onClose: () => void; onBack?: () => void; height?: number }) {
  return (
    <div className={styles.overlayHeader} style={{ height }}>
      {onBack && (
        <button type="button" className={styles.iconButton} aria-label="Back" onClick={onBack}>
          <Icon name="arrowLeft" size={24} />
        </button>
      )}
      <button type="button" className={`${styles.iconButton} ${styles.close}`} aria-label="Close" onClick={onClose}>
        <Icon name="close" size={24} />
      </button>
    </div>
  );
}
