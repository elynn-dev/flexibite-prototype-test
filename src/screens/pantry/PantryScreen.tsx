import { Tabs } from '../../components/Tabs';
import { SectionHeader } from '../../components/SectionHeader';
import { Link } from '../../components/Link';
import { Chip } from '../../components/Chip';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { SnackBar } from '../../components/Controls';
import { CartButton } from '../../components/GroceryBasket';
import { Icon } from '../../components/Icon';
import { MealRow } from '../../components/MealRow';
import { MainTabBar } from '../../components/TabBar';
import { RECIPES } from '../../data/recipes';
import type { PantryItem, PantryLocation, UsedIngredient } from '../../data/types';
import { usePlanner, usePlannerDispatch } from '../../state/PlannerContext';
import { IngredientSheet } from './IngredientSheet';
import styles from './Pantry.module.css';

const TABS: [PantryLocation, string][] = [
  ['storage', 'Storage'],
  ['fridge', 'Fridge'],
  ['freezer', 'Freezer'],
];

/** Storage rows hold 3, 2 and 2 cards (Figma Pantry-default); other tabs fill rows of 3. */
function rowsFor(items: PantryItem[], tab: PantryLocation): PantryItem[][] {
  const rows: PantryItem[][] = [];
  for (let i = 0, r = 0; i < items.length; r++) {
    const n = tab === 'storage' ? ([3, 2, 2][r] ?? 3) : 3;
    rows.push(items.slice(i, i + n));
    i += n;
  }
  return rows;
}

/** Pantry tab: what's at home, where it's stored, and recipes it can make. */
export function PantryScreen() {
  const { pantry, usedIngredients } = usePlanner();
  const dispatch = usePlannerDispatch();
  const [tab, setTab] = useState<PantryLocation>('storage');
  const [open, setOpen] = useState<string | null>(null);
  /** Snack bar text plus the pantry to go back to on Undo. */
  const [snack, setSnack] = useState<{ text: string; before: { pantry: PantryItem[]; used: UsedIngredient[] } } | null>(null);
  const snackTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(snackTimer.current), []);

  const showSnack = (text: string) => {
    setSnack({ text, before: { pantry, used: usedIngredients } });
    clearTimeout(snackTimer.current);
    snackTimer.current = setTimeout(() => setSnack(null), 5000);
  };

  const items = pantry
    .filter((p) => p.location === tab);

  const removeItem = (name: string) => dispatch({ type: 'setPantry', pantry: pantry.filter((p) => p.name !== name) });

  const applyUsed = (index: number) => {
    showSnack('1 ingredient removed');
    dispatch({ type: 'setPantry', pantry, used: usedIngredients.filter((_, i) => i !== index) });
  };

  const saveQuantity = (name: string, quantity: number) => {
    const item = pantry.find((p) => p.name === name);
    if (!item || item.quantity < 0 || item.quantity === quantity) return;
    showSnack('1 items updated');
    dispatch({
      type: 'setPantry',
      pantry: pantry.map((p) => (p.name === name ? { ...p, quantity, highlight: true } : { ...p, highlight: false })),
      used: usedIngredients.filter((u) => u.name !== name),
    });
  };

  const avocado = RECIPES['avocado-toast'];

  return (
    <section className={styles.screen} aria-label="Pantry">
      <div className={styles.scroll}>
        <div className={`${styles.used} hide-scrollbar`}>
          {usedIngredients.map((u, i) => (
            <span className={styles.usedChip} key={u.name}>
              {u.name}
              <span className={styles.usedQty}>
                <em>{u.quantity} -</em>
                <small>whole</small>
              </span>
              <button type="button" aria-label={`Apply ${u.name}`} onClick={() => applyUsed(i)}>
                <Icon name="close" size={20} />
              </button>
            </span>
          ))}
        </div>

        <Tabs
          type="pantry-nav"
          className={styles.tabs}
          items={TABS.map(([id, label]) => ({ id, label }))}
          value={tab}
          onChange={setTab}
        />

        <div className={styles.bar}>
          <Button variant="default" aria-label="Add ingredient">
            <Icon name="plusWhiteThick" size={20} />
          </Button>
          <div className={styles.barRight}>
            {/* Search isn't built yet: the button has no action */}
            <Button variant="outline" aria-label="Search">
              <Icon name="search" size={20} />
            </Button>
            <Button variant="outline" aria-label="Sort">
              <Icon name="sort" size={20} />
            </Button>
          </div>
        </div>

        <div className={styles.rows}>
          {rowsFor(items, tab).map((row, r) => (
            <div className={styles.row} key={r}>
              {row.map((it) => (
                <StockCard key={it.name} item={it} onOpen={() => setOpen(it.name)} onDelete={() => removeItem(it.name)} />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.recipes}>
          <SectionHeader
            className={styles.recipesHeader}
            title="Recipes from your staples"
            trailing={
              <Link variant="outline-all" onClick={() => dispatch({ type: 'navigate', screen: 'ideas' })}>
                See more
              </Link>
            }
          />
          <MealRow
            name={avocado.name}
            image={avocado.thumb}
            description="lorlam sumloram sumloram sumloram sum"
            trailing={<Chip type="default" label="Available" />}
            onClick={() => dispatch({ type: 'openRecipe', recipeId: 'avocado-toast', returnTo: 'pantry' })}
          />
        </div>
      </div>

      <div className={styles.dock}>
        {snack ? (
          <div className={styles.snack}>
            <SnackBar
              text={snack.text}
              onUndo={() => {
                dispatch({ type: 'setPantry', pantry: snack.before.pantry, used: snack.before.used });
                setSnack(null);
              }}
            />
          </div>
        ) : (
          <div className={styles.basket}>
            <CartButton />
          </div>
        )}
        <MainTabBar active="pantry" />
      </div>

      {open && (
        <IngredientSheet
          item={pantry.find((p) => p.name === open)!}
          onClose={() => setOpen(null)}
          onSave={(q) => saveQuantity(open, q)}
          onDelete={() => removeItem(open)}
        />
      )}
    </section>
  );
}

function StockCard({ item, onOpen, onDelete }: { item: PantryItem; onOpen: () => void; onDelete: () => void }) {
  const amount = item.quantity < 0 ? 'plenty' : `${item.quantity} ${item.unit}`;
  return (
    // Figma Components → Card → stock (state=default, orientation=vertical, size=sm)
    <div className={styles.stock}>
      <button type="button" className={styles.stockOpen} aria-label={`${item.name}, ${amount}`} onClick={onOpen}>
        <span className={styles.stockImage}>
          <img src={item.image} alt="" />
        </span>
        <span className={styles.stockName}>{item.name}</span>
        <span className={styles.stockQty}>
          {item.quantity < 0 ? (
            <b className={styles.plenty}>Plenty</b>
          ) : (
            <>
              <b className={item.highlight ? styles.highlight : undefined}>{item.quantity}</b>
              {item.unit}
            </>
          )}
        </span>
      </button>
      <button type="button" className={styles.stockDelete} aria-label={`Delete ${item.name}`} onClick={onDelete}>
        <Icon name="deleteCard" size={15.095} />
      </button>
    </div>
  );
}
