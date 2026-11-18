import type { CSSProperties, ReactNode } from 'react';
import { Chip } from './Chip';
import { Icon } from './Icon';
import styles from './DataDisplay.module.css';

interface DataDisplayProps {
  /**
   * Figma "type": outline = rounded pill, transparent = underlined row,
   * edit = 46px ingredient photo with name, quantity select and stock chip.
   */
  type?: 'outline' | 'transparent' | 'edit';
  disabled?: boolean;
  /** outline / transparent: 24px cut-out picture. edit: 46px photo on the ingredient colour. */
  image?: string;
  /** How the 24px picture is zoomed inside its box (Figma crop). */
  imageStyle?: CSSProperties;
  /** Shown between the picture and the label (e.g. the meal-time shape). */
  marker?: ReactNode;
  label: ReactNode;
  /** Medium 14 number (outline / transparent) or Regular 12 number (edit). */
  quantity?: ReactNode;
  quantityClassName?: string;
  unit?: ReactNode;
  /** edit: blue "info" chip at the right (Figma stock-info). */
  chip?: ReactNode;
  /** The × at the end; shown when there's an action for it. */
  onRemove?: () => void;
  removeLabel?: string;
  /** Makes the whole display a button (e.g. a quick-pick day). */
  onClick?: () => void;
  pressed?: boolean;
  className?: string;
}

/**
 * Design-system data display (Figma Components → Data Display → data-display,
 * type outline | transparent | edit, state default | hover | focus | disabled).
 */
export function DataDisplay({
  type = 'outline',
  disabled,
  image,
  imageStyle,
  marker,
  label,
  quantity,
  quantityClassName,
  unit,
  chip,
  onRemove,
  removeLabel,
  onClick,
  pressed,
  className,
}: DataDisplayProps) {
  const cls = [styles.display, styles[type], disabled ? styles.disabled : '', onClick ? styles.clickable : '', className]
    .filter(Boolean)
    .join(' ');

  const remove = onRemove && (
    <button type="button" className={styles.remove} aria-label={removeLabel} disabled={disabled} onClick={onRemove}>
      <Icon name="close" size={20} />
    </button>
  );

  const content =
    type === 'edit' ? (
      <>
        <span className={styles.photo}>{image && <img src={image} alt="" />}</span>
        <span className={styles.stock}>
          <span className={styles.quantityContainer}>
            <span className={styles.label}>{label}</span>
            {(quantity != null || unit != null) && (
              <span className={styles.option}>
                {quantity != null && <span className={`${styles.optionQty} ${quantityClassName ?? ''}`}>{quantity}</span>}
                {unit != null && <span className={styles.optionUnit}>{unit}</span>}
                <Icon name="chevronDownXs" size={16} />
              </span>
            )}
          </span>
          {(chip || remove) && (
            <span className={styles.stockInfo}>
              {chip && <Chip type="info" disabled={disabled} label={chip} />}
              {remove}
            </span>
          )}
        </span>
      </>
    ) : (
      <>
        <span className={styles.container}>
          {image && (
            <span className={styles.image}>
              <img src={image} alt="" style={imageStyle} />
            </span>
          )}
          {marker}
          <span className={styles.label}>{label}</span>
        </span>
        {(quantity != null || unit != null) && (
          <span className={styles.quantityUnit}>
            {quantity != null && <span className={`${styles.quantity} ${quantityClassName ?? ''}`}>{quantity}</span>}
            {unit != null && <span className={styles.unit}>{unit}</span>}
          </span>
        )}
        {remove}
      </>
    );

  if (onClick) {
    return (
      <button type="button" className={cls} disabled={disabled} aria-pressed={pressed} onClick={onClick}>
        {content}
      </button>
    );
  }
  return <span className={cls}>{content}</span>;
}
