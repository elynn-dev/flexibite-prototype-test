import type { ReactNode } from 'react';
import styles from './MealRow.module.css';

interface MealRowProps {
  name: ReactNode;
  image: string;
  description?: string;
  /** Right-hand side: a pill, a button, a bell... */
  trailing?: ReactNode;
  /** 74px (default) or 48px picture. */
  size?: 74 | 48;
  onClick?: () => void;
  ariaLabel?: string;
}

/**
 * Figma "meal-card" (list layout): picture on the left, name (+ description) over a thin
 * bottom line, and something on the right. A button when it has onClick, otherwise a plain row.
 */
export function MealRow({ name, image, description, trailing, size = 74, onClick, ariaLabel }: MealRowProps) {
  const content = (
    <>
      <span className={styles.picture} style={{ width: size, height: size }}>
        <img src={image} alt="" />
      </span>
      <span className={styles.text} style={{ height: size }}>
        <span>
          <span className={styles.name} style={{ fontSize: size === 48 ? 14 : undefined }}>
            {name}
          </span>
          {description && <span className={styles.description}>{description}</span>}
        </span>
        {trailing}
      </span>
    </>
  );
  return onClick ? (
    <button type="button" className={`${styles.row} ${styles.clickable}`} onClick={onClick} aria-label={ariaLabel}>
      {content}
    </button>
  ) : (
    <div className={styles.row}>{content}</div>
  );
}
