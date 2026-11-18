import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { Stepper } from '../../components/Controls';
import { Icon } from '../../components/Icon';
import { ListItem } from '../../components/ListItem';
import { Select } from '../../components/Select';
import { INGREDIENT_CATALOG, type CatalogIngredient } from '../../data/ingredients';
import type { PantryItem, PantryLocation, PantryShelf } from '../../data/types';
import styles from './Pantry.module.css';

/** Nutrition facts (only Onion has them in the design; the rest show the Figma Default values). */
const NUTRITION: Record<string, [string, string][]> = {
  Onion: [
    ['1 Whole', 'Medium'],
    ['70Kcal', 'Total'],
    ['0g', 'Carbs'],
    ['6 g', 'Protein'],
    ['5g', 'Fat'],
  ],
};
const DEFAULT_NUTRITION: [string, string][] = [
  ['Unit', 'Placeholder'],
  ['Kcal', 'Total'],
  ['0g', 'Carbs'],
  ['0 g', 'Protein'],
  ['0g', 'Fat'],
];

const LOCATIONS: { value: PantryLocation; label: string }[] = [
  { value: 'storage', label: 'Storage' },
  { value: 'fridge', label: 'Fridge' },
  { value: 'freezer', label: 'Freezer' },
];
const SHELVES = (['Top', 'Middle', 'Bottom'] as PantryShelf[]).map((s) => ({ value: s, label: s }));

interface IngredientSheetProps {
  /** The ingredient to edit, or null to add a new one (Figma "Create an Ingredient-1/-2"). */
  item: PantryItem | null;
  /** Where a new ingredient goes by default (the open pantry tab). */
  location: PantryLocation;
  /** Pantry items, so picking one that's already there edits it instead. */
  pantry: PantryItem[];
  onClose: () => void;
  onSave: (item: PantryItem) => void;
  onDelete: (name: string) => void;
}

/**
 * Bottom sheet for one pantry ingredient (Figma "Default": photo, name, unit, nutrition,
 * where it's stored and how many). Opened with no item, it starts with the ingredient search.
 */
export function IngredientSheet({ item, location, pantry, onClose, onSave, onDelete }: IngredientSheetProps) {
  const [current, setCurrent] = useState<PantryItem | null>(item);
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

  const pick = (c: CatalogIngredient) =>
    setCurrent(pantry.find((p) => p.name === c.name || p.image === c.image) ?? { name: c.name, quantity: 0, unit: c.unit, image: c.image, location });

  return (
    <div
      className={`${styles.sheetBackdrop} ${closing ? styles.fade : ''}`}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className={`${styles.sheet} ${closing ? styles.sheetOut : ''}`} role="dialog" aria-label={current?.name ?? 'Add an ingredient'}>
        {current ? (
          <IngredientForm
            key={current.name}
            item={current}
            onSave={(next) => close(() => onSave(next))}
            onDelete={() => close(() => item && onDelete(item.name))}
          />
        ) : (
          <IngredientSearch onPick={pick} onSave={() => close()} />
        )}
      </div>
    </div>
  );
}

/** Figma "Default" ingredient page. */
function IngredientForm({ item, onSave, onDelete }: { item: PantryItem; onSave: (item: PantryItem) => void; onDelete: () => void }) {
  const [plenty, setPlenty] = useState(item.quantity < 0);
  const [quantity, setQuantity] = useState(Math.max(item.quantity, 0));
  const [where, setWhere] = useState<PantryLocation>(item.location);
  const [shelf, setShelf] = useState<PantryShelf>(item.shelf ?? 'Top');
  const unit = item.unit || 'whole';
  const nutrition = NUTRITION[item.name] ?? DEFAULT_NUTRITION;

  return (
    <>
      <div className={styles.sheetMain}>
        <div className={styles.sheetInfo}>
          <div className={styles.sheetImage}>
            <img src={item.image} alt="" />
          </div>
          <div className={styles.sheetHead}>
            <h2>{item.name}</h2>
            <Select
              className={styles.menu}
              ariaLabel="Unit"
              value={plenty ? 'plenty' : 'unit'}
              options={[
                { value: 'unit', label: unit },
                { value: 'plenty', label: 'Plenty' },
              ]}
              onChange={(v) => setPlenty(v === 'plenty')}
            />
          </div>
          {/* nutrition container: unit, kcal, then carbs / protein / fat spread to the right */}
          <div className={styles.nutrition}>
            <div className={styles.nutrientUnit}>
              {nutrition[0][0]}
              <small>{nutrition[0][1]}</small>
            </div>
            <div className={styles.nutrientRest}>
              <div className={styles.nutrientKcal}>
                {nutrition[1][0]}
                <small>{nutrition[1][1]}</small>
              </div>
              <div className={styles.nutrientMacros}>
                {nutrition.slice(2).map(([value, label]) => (
                  <div key={label}>
                    {value}
                    <small>{label}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sheetInputs}>
          <div className={styles.storedIn}>
            <span>Stored in</span>
            <div>
              <Select className={styles.menu} ariaLabel="Stored in" value={where} options={LOCATIONS} onChange={setWhere} />
              <Select className={styles.menu} ariaLabel="Shelf" value={shelf} options={SHELVES} onChange={setShelf} />
            </div>
          </div>
          <div className={styles.quantityRow}>
            <div className={styles.quantity}>
              {plenty ? (
                <span className={styles.plentyLabel}>Plenty</span>
              ) : (
                <Stepper counter value={quantity} label={item.name} onChange={(d) => setQuantity((q) => Math.max(0, q + d))} />
              )}
            </div>
            <Button variant="outline" className={styles.squareMd} aria-label={`Delete ${item.name}`} onClick={onDelete}>
              <Icon name="trash" size={20} />
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.sheetFooter}>
        <Button
          variant="default"
          size="lg"
          onClick={() => onSave({ ...item, quantity: plenty ? -1 : quantity, unit: plenty ? '' : unit, location: where, shelf })}
        >
          Save
        </Button>
      </div>
    </>
  );
}

/** Figma "Create an Ingredient-1/-2": empty photo area, then the ingredient search and its list. */
function IngredientSearch({ onPick, onSave }: { onPick: (c: CatalogIngredient) => void; onSave: () => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  // Hovering a row in the list shows its photo in the picture area.
  const [preview, setPreview] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !searchRef.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  const q = query.trim().toLowerCase();
  const results = INGREDIENT_CATALOG.filter((c) => !q || c.name.toLowerCase().includes(q));

  return (
    <>
      <div className={styles.sheetMain}>
        <div className={styles.sheetInfo}>
          <div className={`${styles.sheetImage} ${styles.sheetImageEmpty}`}>{preview && <img src={preview} alt="" />}</div>
          <div className={styles.ingSearch} ref={searchRef}>
            <label className={`${styles.ingSearchBar} ${open ? styles.ingSearchActive : ''}`}>
              <Icon name="search" size={20} />
              <input
                type="text"
                placeholder="Search ingredients"
                aria-label="Search ingredients"
                value={query}
                onFocus={() => setOpen(true)}
                onClick={() => setOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
              />
            </label>
            {open && (
              <div className={styles.ingList} onPointerLeave={() => setPreview(null)}>
                <div className={styles.ingListItems}>
                  {results.map((c) => (
                    <div key={c.name} onPointerEnter={() => setPreview(c.image)} onFocus={() => setPreview(c.image)}>
                      <ListItem
                        label={c.name}
                        image={c.image}
                        imageBackground="var(--ingredient-bg)"
                        link={{ label: 'Add to plan', onClick: () => onPick(c) }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.sheetFooter}>
        <Button variant="default" size="lg" onClick={onSave}>
          Save
        </Button>
      </div>
    </>
  );
}
