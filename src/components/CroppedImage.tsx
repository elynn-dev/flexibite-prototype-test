import type { ImageCrop } from '../data/types';
import styles from './CroppedImage.module.css';

/**
 * A photo that fills its box. With a Figma crop it is positioned exactly as in the design
 * (sizes and offsets are percentages of the box); without one it is centred and covers the box.
 * The parent sets the size and must be position: relative / absolute.
 */
export function CroppedImage({ src, crop, alt = '' }: { src: string; crop?: ImageCrop; alt?: string }) {
  const style = crop
    ? { width: `${crop.width}%`, height: `${crop.height}%`, left: `${crop.left}%`, top: `${crop.top}%` }
    : undefined;
  return (
    <span className={styles.box}>
      <img src={src} alt={alt} draggable={false} style={style} className={crop ? styles.cropped : styles.cover} />
    </span>
  );
}
