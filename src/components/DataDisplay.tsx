import type { CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';
import styles from './DataDisplay.module.css';

interface DataDisplayProps {
  /** Figma "type": outline = rounded pill, transparent = underlined row. */
  type?: 'outline' | 'transparent';
  disabled?: boolean;
  /** 24px picture before the label (ingredient image style, no background). */
  image?: string;
  /** How the picture is zoomed inside its 24px box (Figma crop). */
  imageStyle?: CSSProperties;
  label: ReactNode;
  /** Medium 14 number (e.g. "1 -"), coloured by the caller when it's a change. */
  quantity?: ReactNode;
  quantityClassName?: string;
  unit?: ReactNode;
  /** The × at the end; shown when there's an action for it. */
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}

/**
 * Design-system data display (Figma Components → Data Display → data-display,
 * type outline | transparent, state default | hover | focus | disabled).
 */
export function DataDisplay({
  type = 'outline',
  disabled,
  image,
  imageStyle,
  label,
  quantity,
  quantityClassName,
  unit,
  onRemove,
  removeLabel,
  className,
}: DataDisplayProps) {
  const cls = [styles.display, styles[type], disabled ? styles.disabled : '', className].filter(Boolean).join(' ');
  return (
    <span className={cls}>
      <span className={styles.container}>
        {image && (
          <span className={styles.image}>
            <img src={image} alt="" style={imageStyle} />
          </span>
        )}
        <span className={styles.label}>{label}</span>
      </span>
      {(quantity != null || unit != null) && (
        <span className={styles.quantityUnit}>
          {quantity != null && <span className={`${styles.quantity} ${quantityClassName ?? ''}`}>{quantity}</span>}
          {unit != null && <span className={styles.unit}>{unit}</span>}
        </span>
      )}
      {onRemove && (
        <button type="button" className={styles.remove} aria-label={removeLabel} disabled={disabled} onClick={onRemove}>
          <Icon name="close" size={20} />
        </button>
      )}
    </span>
  );
}
