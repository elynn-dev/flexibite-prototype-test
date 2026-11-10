import { useEffect } from 'react';
import { Button } from '../components/Button';
import { Checkbox, Stepper } from '../components/Controls';
import { Icon } from '../components/Icon';
import { usePlanner, usePlannerDispatch } from '../state/PlannerContext';
import styles from './ShoppingList.module.css';

/** Grocery list that opens from the basket button. */
export function ShoppingList() {
  const { cart } = usePlanner();
  const dispatch = usePlannerDispatch();
  const close = () => dispatch({ type: 'setOverlay', overlay: null });
  const checked = cart.filter((c) => c.checked).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dispatch({ type: 'setOverlay', overlay: null });
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [dispatch]);

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && close()}>
      <div className={styles.panel} role="dialog" aria-label="Shopping list">
        <h2 className="heading-h6">Shopping list</h2>
        <div className={styles.rows}>
          {cart.map((c, i) => (
            <div className={`${styles.row} ${c.checked ? '' : styles.off}`} key={c.name}>
              <Checkbox
                className={styles.check}
                checked={c.checked}
                label={c.name}
                onChange={() => dispatch({ type: 'toggleCartItem', index: i })}
              />
              <div className={styles.main}>
                <span className={`${styles.name} label-lg-medium`}>{c.name}</span>
                <span className={`${styles.unit} label-xs-regular-upper`}>
                  {c.unit}
                  <Icon name="chevronDownXs" size={16} />
                </span>
              </div>
              <div className={styles.quantity}>
                <Stepper
                  value={c.quantity}
                  label={c.name}
                  onChange={(delta) => dispatch({ type: 'changeCartQuantity', index: i, delta })}
                />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.add}>
          <Button aria-label="Add item" className={styles.addButton}>
            <Icon name="plusSm" size={14} />
          </Button>
        </div>
        <div className={styles.footer}>
          <Button className={styles.square} aria-label="Remove checked items" onClick={() => dispatch({ type: 'removeCheckedCartItems' })}>
            <Icon name="trash" size={20} />
          </Button>
          <Button variant="dark" onClick={() => dispatch({ type: 'navigate', screen: 'pantry' })}>
            {checked} Items to pantry
          </Button>
        </div>
      </div>
    </div>
  );
}
