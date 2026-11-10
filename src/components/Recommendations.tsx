import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { RECIPES } from '../data/recipes';
import { CroppedImage } from './CroppedImage';
import tileMore from '../assets/images/cucumber-sandwich-tall.jpg';
import styles from './Recommendations.module.css';

interface RecommendationsProps {
  onAddWithSuggestions: () => void;
  onEditPlans: () => void;
  onMoreIdeas: () => void;
}

/**
 * Figma "recommendations": a black + button. Opening it shows
 * add / edit buttons and a row of suggested meals.
 */
export function Recommendations({ onAddWithSuggestions, onEditPlans, onMoreIdeas }: RecommendationsProps) {
  const [open, setOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rowRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const then = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  return (
    <div ref={rowRef} className={`${styles.row} ${open ? styles.open : ''}`}>
      {open && (
        <div className={styles.left}>
          <div className={styles.buttons}>
            <Button aria-label="Add with suggestions" onClick={then(onAddWithSuggestions)}>
              <Icon name="magicAdd" size={20} />
            </Button>
            <Button aria-label="Edit plans" onClick={then(onEditPlans)}>
              <Icon name="magicEdit" size={20} />
            </Button>
          </div>
          <div className={styles.tiles}>
            <button type="button" className={styles.tile} aria-label="Recommended meal">
              <CroppedImage src={RECIPES['pineapple-fried-rice'].image} crop={RECIPES['pineapple-fried-rice'].cardCrop} />
            </button>
            <button type="button" className={styles.tile} aria-label="Avocado Toast">
              <CroppedImage src={RECIPES['avocado-toast'].image} crop={RECIPES['avocado-toast'].cardCrop} />
            </button>
            <button type="button" className={`${styles.tile} ${styles.more}`} aria-label="More meal ideas" onClick={then(onMoreIdeas)}>
              <CroppedImage src={tileMore} />
              <span>More</span>
            </button>
          </div>
        </div>
      )}
      <Button
        variant="dark"
        className={styles.toggle}
        aria-label={open ? 'Close recommendations' : 'Recommendations, open'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name={open ? 'closeWhite' : 'plusWhite'} size={20} />
      </Button>
    </div>
  );
}
