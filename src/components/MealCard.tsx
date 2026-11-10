import type { ReactNode } from 'react';
import type { ImageCrop } from '../data/types';
import { CroppedImage } from './CroppedImage';
import styles from './MealCard.module.css';

interface MealCardProps {
  name: string;
  image: string;
  /** Crop from Figma. Without it the photo is centred and fills the square. */
  crop?: ImageCrop;
  onClick?: () => void;
  disabled?: boolean;
}

/** Figma "meal-card" (horizontal): 74px photo + recipe name. */
export function MealCard({ name, image, crop, onClick, disabled }: MealCardProps) {
  return (
    <button type="button" className={styles.card} onClick={onClick} disabled={disabled} aria-label={name}>
      <span className={styles.inner}>
        <span className={styles.photo}>
          <CroppedImage src={image} crop={crop} />
        </span>
        <span className={`${styles.name} label-lg-medium`}>{name}</span>
      </span>
    </button>
  );
}

interface MealTileProps {
  label: string;
  image: string;
  /** Crop from Figma; the same crop as the horizontal card works because Figma uses percentages. */
  crop?: ImageCrop;
  onClick?: () => void;
  /** Small icon in the top-left corner (e.g. heart). */
  badge?: ReactNode;
  /** Shown on hover over the photo. Can contain line breaks. */
  caption?: ReactNode;
  /** Darkened "MORE" tile at the end of a row. */
  more?: boolean;
}

/** Figma "meal-card" (vertical): 124 × 164 photo tile. */
export function MealTile({ label, image, crop, onClick, badge, caption, more }: MealTileProps) {
  return (
    <button type="button" className={`${styles.tile} ${more ? styles.more : ''}`} onClick={onClick} aria-label={label}>
      <CroppedImage src={image} crop={crop} />
      {badge && <span className={styles.badge}>{badge}</span>}
      {more ? <span className={styles.moreText}>MORE</span> : <span className={styles.caption}>{caption ?? label}</span>}
    </button>
  );
}
