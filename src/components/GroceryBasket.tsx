import { useEffect, useState } from 'react';
import { usePlanner, usePlannerDispatch } from '../state/PlannerContext';
import { Icon } from './Icon';
import styles from './GroceryBasket.module.css';

interface GroceryBasketProps {
  count: number;
  /** Change this number to play the "bump" animation on the count. */
  bump: number;
  onOpen?: () => void;
}

/** The basket wired to the app: shows the grocery list size and opens/closes the list. */
export function CartButton() {
  const { cart, basketBump, overlay } = usePlanner();
  const dispatch = usePlannerDispatch();
  return (
    <GroceryBasket
      count={cart.length}
      bump={basketBump}
      onOpen={() => dispatch({ type: 'setOverlay', overlay: overlay === 'cart' ? null : 'cart' })}
    />
  );
}

/** Figma "grocery-list" basket button with the red item count. */
export function GroceryBasket({ count, bump, onOpen }: GroceryBasketProps) {
  const [bumping, setBumping] = useState(false);

  useEffect(() => {
    if (!bump) return;
    setBumping(true);
    const t = setTimeout(() => setBumping(false), 500);
    return () => clearTimeout(t);
  }, [bump]);

  return (
    <div className={styles.basket}>
      <button
        type="button"
        className={styles.button}
        aria-label={`Grocery list, ${count} items`}
        onClick={onOpen}
      >
        <Icon name="basket" size={20} />
      </button>
      <span className={`${styles.count} ${bumping ? styles.bump : ''}`} aria-hidden="true">
        {count}
      </span>
    </div>
  );
}
