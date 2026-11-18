import type { ReactNode } from 'react';
import type { MealTime } from '../data/types';
import { Icon } from './Icon';
import { Link } from './Link';
import { MealMarker } from './MealTime';
import styles from './ListItem.module.css';

interface ListItemProps {
  /** Figma "Label" text. */
  label: ReactNode;
  /** Figma "image": the 48px picture (left out = image off). */
  image?: string;
  /** Colour behind the picture (Figma image styles put ingredient photos on #D1C0BB). */
  imageBackground?: string;
  /** Figma "icon": the meal-time shape before the label. */
  mealTime?: MealTime;
  /** Figma "link": link-small, variant outline-all. */
  link?: { label: string; onClick: () => void };
  /** Figma "icon-button": the 24px delete (close-x-exit) button. */
  onDelete?: () => void;
  deleteLabel?: string;
  /** Figma state=disabled. */
  disabled?: boolean;
  /** Instance override: no #F4F4F4 fill (rows sitting on a grey box). */
  noFill?: boolean;
  className?: string;
}

/**
 * Design-system list item (Figma Components → .list-items, state default | hover | focus | disabled):
 * picture, then over a thin line the meal-time shape, label, link and delete button.
 */
export function ListItem({
  label,
  image,
  imageBackground,
  mealTime,
  link,
  onDelete,
  deleteLabel,
  disabled,
  noFill,
  className,
}: ListItemProps) {
  const cls = [
    styles.item,
    noFill && styles.noFill,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      {image && (
        <span className={styles.image} style={{ background: imageBackground }}>
          <img src={image} alt="" />
        </span>
      )}
      <span className={styles.labelContainer}>
        {mealTime && <MealMarker meal={mealTime} size="md" />}
        <span className={styles.label}>{label}</span>
        {(link || onDelete) && (
          <span className={styles.actions}>
            {link && (
              <Link variant="outline-all" className={styles.link} disabled={disabled} onClick={link.onClick}>
                {link.label}
              </Link>
            )}
            {onDelete && (
              <button type="button" className={styles.delete} aria-label={deleteLabel} disabled={disabled} onClick={onDelete}>
                <Icon name="close" size={24} />
              </button>
            )}
          </span>
        )}
      </span>
    </div>
  );
}
