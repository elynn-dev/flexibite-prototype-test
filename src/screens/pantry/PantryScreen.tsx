import { Tabs } from '../../components/Tabs';
import { SectionHeader } from '../../components/SectionHeader';
import { Link } from '../../components/Link';
import { Chip } from '../../components/Chip';
import { DataDisplay } from '../../components/DataDisplay';
import avocadoNoBg from '../../assets/ingredients/no-bg/avocado.png';
import eggNoBg from '../../assets/ingredients/no-bg/egg.png';
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { Button } from '../../components/Button';
import { SnackBar } from '../../components/Controls';
import { CartButton } from '../../components/GroceryBasket';
import { Icon } from '../../components/Icon';
import { MealRow } from '../../components/MealRow';
import { MainTabBar } from '../../components/TabBar';
import { RECIPES } from '../../data/recipes';
import type { PantryItem, PantryLocation, PantryShelf, UsedIngredient } from '../../data/types';
import { usePlanner, usePlannerDispatch } from '../../state/PlannerContext';
import { IngredientSheet } from './IngredientSheet';
import styles from './Pantry.module.css';

const TABS: [PantryLocation, string][] = [
  ['storage', 'Storage'],
  ['fridge', 'Fridge'],
  ['freezer', 'Freezer'],
];

/** Used-ingredient pictures as placed in Figma Pantry-default (image style "…-no-background" and its crop). */
const USED_IMAGE: Record<string, { src: string; crop: CSSProperties }> = {
  Onion: { src: avocadoNoBg, crop: { left: '-18.6%', top: '-18.53%', width: '137.14%', height: '137.14%' } },
  Eggs: { src: eggNoBg, crop: { left: '-18.88%', top: '-14.11%', width: '137.74%', height: '137.74%' } },
};

/** Each shelf is one row of cards (Figma Pantry-default: Top 3, Middle 2, Bottom 2). */
const SHELVES: PantryShelf[] = ['Top', 'Middle', 'Bottom'];

/** How long a card is held before it lifts, and how far a finger can move before that counts as a scroll. */
const HOLD_MS = 350;
const MOVE_SLOP = 8;

interface Drag {
  name: string;
  /** Pointer position inside the screen, and where on the card it was grabbed. */
  x: number;
  y: number;
  grabX: number;
  grabY: number;
  over: PantryShelf | null;
}

/** Pantry tab: what's at home, where it's stored, and recipes it can make. */
export function PantryScreen() {
  const { pantry, usedIngredients } = usePlanner();
  const dispatch = usePlannerDispatch();
  const [tab, setTab] = useState<PantryLocation>('storage');
  /** The ingredient sheet: an item's name, 'new' for the add flow, or closed. */
  const [open, setOpen] = useState<string | null>(null);
  /** Snack bar text plus the pantry to go back to on Undo. */
  const [snack, setSnack] = useState<{ text: string; before: { pantry: PantryItem[]; used: UsedIngredient[] } } | null>(null);
  const snackTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(snackTimer.current), []);

  // --- Hold a card, then drag it onto another shelf -------------------------
  const screenRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Partial<Record<PantryShelf, HTMLDivElement | null>>>({});
  const [drag, setDrag] = useState<Drag | null>(null);
  const dragRef = useRef<Drag | null>(null);
  /** The click that ends a drag must not open the ingredient sheet. */
  const justDragged = useRef(false);
  const cleanup = useRef<() => void>(() => {});

  useEffect(() => () => cleanup.current(), []);

  const shelfAt = (clientY: number): PantryShelf | null => {
    let best: PantryShelf | null = null;
    let bestDist = Infinity;
    for (const sh of SHELVES) {
      const el = rowRefs.current[sh];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const dist = clientY < r.top ? r.top - clientY : clientY > r.bottom ? clientY - r.bottom : 0;
      if (dist < bestDist) {
        bestDist = dist;
        best = sh;
      }
    }
    return bestDist < 60 ? best : null;
  };

  const startPress = (e: ReactPointerEvent, item: PantryItem) => {
    if (e.button !== 0) return;
    const card = e.currentTarget as HTMLElement;
    const startX = e.clientX;
    const startY = e.clientY;
    let lifted = false;

    const toScreen = (cx: number, cy: number) => {
      const r = screenRef.current!.getBoundingClientRect();
      return { x: cx - r.left, y: cy - r.top };
    };

    const timer = setTimeout(() => {
      lifted = true;
      const cr = card.getBoundingClientRect();
      const p = toScreen(startX, startY);
      const d: Drag = { name: item.name, ...p, grabX: startX - cr.left, grabY: startY - cr.top, over: item.shelf ?? 'Top' };
      dragRef.current = d;
      setDrag(d);
      navigator.vibrate?.(10);
    }, HOLD_MS);

    const onMove = (ev: PointerEvent) => {
      if (!lifted) {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > MOVE_SLOP) finish();
        return;
      }
      // Scroll the list when the card is held near its top or bottom edge.
      const sr = scrollRef.current?.getBoundingClientRect();
      if (sr) {
        if (ev.clientY < sr.top + 56) scrollRef.current!.scrollBy(0, -8);
        else if (ev.clientY > sr.bottom - 160) scrollRef.current!.scrollBy(0, 8);
      }
      const d = { ...dragRef.current!, ...toScreen(ev.clientX, ev.clientY), over: shelfAt(ev.clientY) };
      dragRef.current = d;
      setDrag(d);
    };
    const onUp = () => {
      const d = dragRef.current;
      finish();
      if (!lifted || !d) return;
      justDragged.current = true;
      setTimeout(() => (justDragged.current = false), 0);
      if (d.over && d.over !== (item.shelf ?? 'Top')) moveToShelf(item.name, d.over);
    };
    // While a card is lifted, a finger drag moves the card instead of scrolling the page.
    const onTouchMove = (ev: TouchEvent) => lifted && ev.preventDefault();
    const finish = () => {
      clearTimeout(timer);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', finish);
      window.removeEventListener('touchmove', onTouchMove);
      dragRef.current = null;
      setDrag(null);
      cleanup.current = () => {};
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', finish);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    cleanup.current = finish;
  };

  /** Put the card at the end of the shelf it was dropped on; the sheet's shelf menu follows. */
  const moveToShelf = (name: string, shelf: PantryShelf) => {
    const moved = pantry.find((p) => p.name === name);
    if (!moved) return;
    const rest = pantry.filter((p) => p.name !== name);
    // After the last card on this shelf (or a shelf above it) in the same place, else at the end.
    const target = SHELVES.indexOf(shelf);
    let before = -1;
    rest.forEach((p, i) => {
      if (p.location === moved.location && SHELVES.indexOf(p.shelf ?? 'Top') <= target) before = i;
    });
    const at = before >= 0 ? before + 1 : rest.length;
    showSnack(`Moved to ${shelf.toLowerCase()} shelf`);
    dispatch({ type: 'setPantry', pantry: [...rest.slice(0, at), { ...moved, shelf }, ...rest.slice(at)] });
  };

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

  const saveItem = (next: PantryItem) => {
    const before = pantry.find((p) => p.name === next.name);
    if (!before) {
      showSnack('1 ingredient added');
      dispatch({ type: 'setPantry', pantry: [...pantry.map((p) => ({ ...p, highlight: false })), { ...next, highlight: true }] });
      setTab(next.location);
      return;
    }
    const changed =
      before.quantity !== next.quantity || before.location !== next.location || before.unit !== next.unit || before.shelf !== next.shelf;
    if (!changed) return;
    showSnack('1 items updated');
    dispatch({
      type: 'setPantry',
      pantry: pantry.map((p) => (p.name === next.name ? { ...next, highlight: before.quantity !== next.quantity } : { ...p, highlight: false })),
      used: before.quantity !== next.quantity ? usedIngredients.filter((u) => u.name !== next.name) : usedIngredients,
    });
  };

  const avocado = RECIPES['avocado-toast'];

  return (
    <section ref={screenRef} className={`${styles.screen} ${drag ? styles.dragging : ''}`} aria-label="Pantry">
      <div ref={scrollRef} className={styles.scroll}>
        <div className={`${styles.used} hide-scrollbar`}>
          {usedIngredients.map((u, i) => (
            // Figma data-display (type=outline) with the ingredient's no-background image style
            <DataDisplay
              key={u.name}
              className={styles.usedChip}
              image={USED_IMAGE[u.name]?.src}
              imageStyle={USED_IMAGE[u.name]?.crop}
              label={u.name}
              quantity={`${u.quantity} -`}
              quantityClassName={styles.usedQty}
              unit="whole"
              onRemove={() => applyUsed(i)}
              removeLabel={`Apply ${u.name}`}
            />
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
          <Button variant="default" aria-label="Add ingredient" onClick={() => setOpen('new')}>
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
          {SHELVES.map((shelf) => {
            const row = items.filter((it) => (it.shelf ?? 'Top') === shelf);
            // Empty shelves only show up while a card is being moved, as somewhere to drop it.
            if (!row.length && !drag) return null;
            return (
              <div
                key={shelf}
                ref={(el) => {
                  rowRefs.current[shelf] = el;
                }}
                className={`${styles.row} ${drag?.over === shelf ? styles.rowOver : ''} ${row.length ? '' : styles.rowEmpty}`}
                aria-label={`${shelf} shelf`}
                role="group"
              >
                {row.map((it) => (
                  <StockCard
                    key={it.name}
                    item={it}
                    lifted={drag?.name === it.name}
                    onPress={(e) => startPress(e, it)}
                    onOpen={() => !justDragged.current && setOpen(it.name)}
                    onDelete={() => removeItem(it.name)}
                  />
                ))}
                {!row.length && <span className={styles.rowHint}>{shelf} shelf</span>}
              </div>
            );
          })}
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

      {drag && (() => {
        const it = pantry.find((p) => p.name === drag.name);
        return it ? (
          <div className={styles.floating} style={{ left: drag.x - drag.grabX, top: drag.y - drag.grabY }} aria-hidden="true">
            <StockCard item={it} />
          </div>
        ) : null;
      })()}

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
          item={open === 'new' ? null : (pantry.find((p) => p.name === open) ?? null)}
          location={tab}
          pantry={pantry}
          onClose={() => setOpen(null)}
          onSave={saveItem}
          onDelete={removeItem}
        />
      )}
    </section>
  );
}

function StockCard({
  item,
  lifted,
  onPress,
  onOpen,
  onDelete,
}: {
  item: PantryItem;
  /** The card is being dragged: it stays as a faded spot in its row. */
  lifted?: boolean;
  onPress?: (e: ReactPointerEvent) => void;
  onOpen?: () => void;
  onDelete?: () => void;
}) {
  const amount = item.quantity < 0 ? 'plenty' : `${item.quantity} ${item.unit}`;
  return (
    // Figma Components → Card → stock (state=default, orientation=vertical, size=sm)
    <div
      className={`${styles.stock} ${lifted ? styles.stockLifted : ''}`}
      onPointerDown={onPress}
      onContextMenu={(e) => onPress && e.preventDefault()}
      // Holding the photo must lift the whole card, not start the browser's own image drag.
      onDragStart={(e) => e.preventDefault()}
    >
      <button type="button" className={styles.stockOpen} aria-label={`${item.name}, ${amount}`} onClick={onOpen}>
        <span className={styles.stockImage}>
          <img src={item.image} alt="" draggable={false} />
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
