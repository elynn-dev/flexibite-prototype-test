import { Icon } from '../../components/Icon';
import type { IngredientId, RecipeIngredient } from '../../data/types';
import { INGREDIENT_PHOTO } from '../../data/ingredients';
import styles from './IngredientStock.module.css';

const INGREDIENT_IMAGE: Record<IngredientId, string> = {
  avocado: INGREDIENT_PHOTO.avocado,
  bread: INGREDIENT_PHOTO.bread,
  egg: INGREDIENT_PHOTO.egg,
  'olive-oil': INGREDIENT_PHOTO.oliveOil,
  salt: INGREDIENT_PHOTO.salt,
};

interface IngredientStockProps {
  ingredient: RecipeIngredient;
  servings: number;
  /** How many the user has in the pantry. */
  inPantry?: number;
}

/** Figma "stock": ingredient picture, name, how much the recipe needs and how much is in the pantry. */
export function IngredientStock({ ingredient, servings, inPantry = 0 }: IngredientStockProps) {
  const need = Math.round(ingredient.amount * servings * 100) / 100;
  return (
    <div className={styles.stock}>
      {/* image-container: 66px photo on the ingredient colour style */}
      <span className={styles.picture}>
        <img src={INGREDIENT_IMAGE[ingredient.id]} alt="" />
      </span>
      <div className={styles.content}>
        <div className={`${styles.name} label-md-regular`}>{ingredient.name}</div>
        <div className={styles.amounts}>
          <div className={styles.need}>
            <span className="label-xs-regular">Need</span>
            <span className={styles.quantity}>
              <b>{need}</b>
              <span className="label-xs-regular">{ingredient.unit}</span>
            </span>
          </div>
          <div className={styles.pantry}>
            <Icon name="pantry" size={16} />
            <span className={styles.count} aria-label={`${inPantry} in pantry`}>
              {inPantry}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
