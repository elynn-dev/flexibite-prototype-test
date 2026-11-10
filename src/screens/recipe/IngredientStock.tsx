import { Icon } from '../../components/Icon';
import type { IngredientId, RecipeIngredient } from '../../data/types';
import avocado from '../../assets/ingredients/avocado.svg';
import bread from '../../assets/ingredients/bread.svg';
import egg from '../../assets/ingredients/egg-48.svg';
import oliveOil from '../../assets/ingredients/olive-oil.svg';
import salt from '../../assets/ingredients/salt.svg';
import styles from './IngredientStock.module.css';

const INGREDIENT_IMAGE: Record<IngredientId, string> = {
  avocado,
  bread,
  egg,
  'olive-oil': oliveOil,
  salt,
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
      <img src={INGREDIENT_IMAGE[ingredient.id]} alt="" className={styles.picture} />
      <div className={styles.content}>
        <div className={`${styles.name} label-md-regular`}>{ingredient.name}</div>
        <div className={styles.amounts}>
          <div className={styles.need}>
            <span className="label-xs-regular">Need</span>
            <span className={styles.quantity}>
              <b className="label-md-regular">{need}</b>
              <span className="label-xs-regular">{ingredient.unit}</span>
            </span>
          </div>
          <div className={styles.pantry}>
            <Icon name="pantry" size={16} />
            <span className="label-md-regular" aria-label={`${inPantry} in pantry`}>
              {inPantry}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
