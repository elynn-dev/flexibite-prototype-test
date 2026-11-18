import type { ReactNode } from 'react';
import styles from './MealRow.module.css';

interface MealRowProps {
  name: ReactNode;
  image: string;
  description?: string;
  /** Right-hand side: a pill, a button, a bell... */
  trailing?: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  /** Colour behind the picture (Figma image styles put ingredient photos on #D1C0BB). */
  imageBackground?: string;
  className?: string;
}

/**
 * Figma "meal-card" (type=detail, 325 × 74): picture on the left, name (+ description) over a thin
 * bottom line, and something on the right. A button when it has onClick, otherwise a plain row.
 */
export function MealRow({ name, image, description, trailing, onClick, ariaLabel, imageBackground, className }: MealRowProps) {
  const content = (
    <>
      <span className={styles.picture} style={{ width: 74, height: 74, background: imageBackground }}>
        <img src={image} alt="" />
      </span>
      <span className={styles.text} style={{ height: 74 }}>
        <span className={styles.labels}>
          <span className={styles.name}>
            {name}
          </span>
          {description && <span className={styles.description}>{description}</span>}
        </span>
        {trailing}
      </span>
    </>
  );
  return onClick ? (
    <button type="button" className={`${styles.row} ${styles.clickable} ${className ?? ''}`} onClick={onClick} aria-label={ariaLabel}>
      {content}
    </button>
  ) : (
    <div className={`${styles.row} ${className ?? ''}`}>{content}</div>
  );
}
