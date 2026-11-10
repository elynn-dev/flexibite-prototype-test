import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './Controls.module.css';

/** Figma "mini button": 32px tall outline button with small text. */
export function MiniButton({ className, type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={`${styles.mini} ${className ?? ''}`} {...rest} />;
}

/** Rounded tag: "Available", "Needs 3+", dates, etc. */
export function Pill({ tone = 'outline', children }: { tone?: 'outline' | 'dark' | 'off'; children: ReactNode }) {
  return <span className={`${styles.pill} ${styles[tone]}`}>{children}</span>;
}

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
export function Stepper({ value, onChange, label }: { value: ReactNode; onChange: (delta: number) => void; label: string }) {
  return (
    <div className={styles.stepper}>
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

/** Green bar above the tab bar with an Undo button. */
export function SnackBar({ text, onUndo }: { text: string; onUndo?: () => void }) {
  return (
    <div className={styles.snack} role="status">
      <span>{text}</span>
      {onUndo && (
        <button type="button" onClick={onUndo}>
          Undo
        </button>
      )}
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
