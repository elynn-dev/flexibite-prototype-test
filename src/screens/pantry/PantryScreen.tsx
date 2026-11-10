import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { MiniButton, Pill, SnackBar } from '../../components/Controls';
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

/** Storage shows 2 per row; the fridge shows 1, then rows of 4 (as in Figma). */
function rowsFor(items: PantryItem[], tab: PantryLocation): PantryItem[][] {
  const rows: PantryItem[][] = [];
  for (let i = 0, r = 0; i < items.length; r++) {
    const n = tab === 'fridge' ? ([1, 4][r] ?? 4) : 2;
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
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
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
    .filter((p) => p.location === tab)
    .filter((p) => !query || p.name.toLowerCase().includes(query.toLowerCase()));

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
          <span className={styles.usedLabel}>Used ingredients</span>
          {usedIngredients.map((u, i) => (
            <span className={styles.usedChip} key={u.name}>
              {u.name} <em>{u.quantity} -</em>
              <small>whole</small>
              <button type="button" aria-label={`Apply ${u.name}`} onClick={() => applyUsed(i)}>
                <Icon name="close" size={20} />
              </button>
            </span>
          ))}
        </div>

        <div className={styles.tabs} role="tablist">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={styles.tab}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.bar}>
          <Button variant="dark" className={styles.square} aria-label="Add ingredient">
            <Icon name="plusWhiteThick" size={20} />
          </Button>
          <div className={styles.barRight}>
            <Button
              className={styles.square}
              aria-label="Search"
              aria-pressed={searching}
              onClick={() => {
                setSearching((s) => !s);
                setQuery('');
              }}
            >
              <Icon name="search" size={20} />
            </Button>
            <Button className={styles.square} aria-label="Sort">
              <Icon name="sort" size={20} />
            </Button>
          </div>
        </div>
        {searching && (
          <input
            className={styles.search}
            type="search"
            aria-label="Search ingredients"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}

        <div className={styles.rows}>
          {rowsFor(items, tab).map((row, r) => (
            <div className={`${styles.row} ${row.length === 4 ? styles.four : ''}`} key={r}>
              {row.map((it) => (
                <StockCard key={it.name} item={it} onOpen={() => setOpen(it.name)} onDelete={() => removeItem(it.name)} />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.recipes}>
          <h2>
            <span>
              <Icon name="edit" size={16} />
              Recipes from your staples
            </span>
            <MiniButton className={styles.seeMore} onClick={() => dispatch({ type: 'navigate', screen: 'ideas' })}>
              See More
            </MiniButton>
          </h2>
          <MealRow
            name={avocado.name}
            image={avocado.thumb}
            description="lorlam sumloram sumloram sumloram sum"
            trailing={<Pill tone="dark">Available</Pill>}
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
    <div className={styles.stock}>
      <button type="button" className={styles.stockOpen} aria-label={`${item.name}, ${amount}`} onClick={onOpen}>
        <span className={styles.stockName}>{item.name}</span>
        <img src={item.image} alt="" />
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
        <Icon name="trash" size={13} />
      </button>
    </div>
  );
}
