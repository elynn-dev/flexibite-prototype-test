import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import { Stepper } from '../../components/Controls';
import { Icon } from '../../components/Icon';
import type { PantryItem } from '../../data/types';
import styles from './Pantry.module.css';

/** Nutrition facts shown in the sheet (only Onion has them in the design). */
const NUTRITION: Record<string, [string, string][]> = {
  Onion: [
    ['1 Whole', 'Medium'],
    ['70Kcal', 'Total'],
    ['0g', 'Carbs'],
    ['6 g', 'Protein'],
    ['5g', 'Fat'],
  ],
};

interface IngredientSheetProps {
  item: PantryItem;
  onClose: () => void;
  onSave: (quantity: number) => void;
  onDelete: () => void;
}

/** Bottom sheet with one pantry ingredient: picture, nutrition, where it's stored and how many. */
export function IngredientSheet({ item, onClose, onSave, onDelete }: IngredientSheetProps) {
  const plenty = item.quantity < 0;
  const [quantity, setQuantity] = useState(Math.max(item.quantity, 0));
  const [closing, setClosing] = useState(false);

  const close = (after?: () => void) => {
    setClosing(true);
    setTimeout(() => {
      after?.();
      onClose();
    }, 300);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={`${styles.sheetBackdrop} ${closing ? styles.fade : ''}`}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className={`${styles.sheet} ${closing ? styles.sheetOut : ''}`} role="dialog" aria-label={item.name}>
        <div className={styles.sheetMain}>
          <div className={styles.sheetInfo}>
            <div className={styles.sheetImage}>
              <img src={item.image} alt="" />
            </div>
            <div className={styles.sheetHead}>
              <h2>{item.name}</h2>
              <span className={styles.select}>
                {plenty ? 'Plenty' : 'Whole'}
                <Icon name="chevronDownDark" size={16} />
              </span>
            </div>
            {NUTRITION[item.name] && (
              <div className={styles.nutrition}>
                {NUTRITION[item.name].map(([value, label]) => (
                  <div key={label}>
                    {value}
                    <small>{label}</small>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.sheetInputs}>
            <div className={styles.storedIn}>
              <span>Stored in</span>
              <div>
                <span className={styles.select}>
                  Storage
                  <Icon name="chevronDownDark" size={16} />
                </span>
                <span className={styles.select}>
                  Top
                  <Icon name="chevronDownDark" size={16} />
                </span>
              </div>
            </div>
            <div className={styles.quantityRow}>
              <div className={styles.quantity}>
                {plenty ? (
                  <span className={styles.plentyLabel}>Plenty</span>
                ) : (
                  <Stepper value={quantity} label={item.name} onChange={(d) => setQuantity((q) => Math.max(0, q + d))} />
                )}
              </div>
              <Button className={styles.squareMd} aria-label={`Delete ${item.name}`} onClick={() => close(onDelete)}>
                <Icon name="trash" size={20} />
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.sheetFooter}>
          <Button variant="dark" size="lg" onClick={() => close(() => onSave(quantity))}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
