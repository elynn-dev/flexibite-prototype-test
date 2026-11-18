// Figma Components → Ingredients: one photo per ingredient (1024px). Each sits on its
// ingredient colour style (#D1C0BB, var(--ingredient-bg)).
import apple from '../assets/ingredients/photos/apple.jpg';
import avocado from '../assets/ingredients/photos/avocado.jpg';
import banana from '../assets/ingredients/photos/banana.jpg';
import bread from '../assets/ingredients/photos/bread.jpg';
import carrot from '../assets/ingredients/photos/carrot.jpg';
import egg from '../assets/ingredients/photos/egg.jpg';
import eggplant from '../assets/ingredients/photos/eggplant.jpg';
import lemon from '../assets/ingredients/photos/lemon.jpg';
import oliveOil from '../assets/ingredients/photos/olive-oil.jpg';
import onion from '../assets/ingredients/photos/onion.jpg';
import pumpkin from '../assets/ingredients/photos/pumpkin.jpg';
import salt from '../assets/ingredients/photos/salt.jpg';
import tomato from '../assets/ingredients/photos/tomato.jpg';

export interface CatalogIngredient {
  name: string;
  image: string;
  unit: string;
}

/** Everything that can be added to the pantry, A–Z. */
export const INGREDIENT_CATALOG: CatalogIngredient[] = (
  [
  { name: 'Avocado', image: avocado, unit: 'whole' },
  { name: 'Apple', image: apple, unit: 'whole' },
  { name: 'Banana', image: banana, unit: 'bunch' },
  { name: 'Bread', image: bread, unit: 'whole' },
  { name: 'Egg', image: egg, unit: 'whole' },
  { name: 'Eggplant', image: eggplant, unit: 'whole' },
  { name: 'Carrot', image: carrot, unit: 'whole' },
  { name: 'Lemon', image: lemon, unit: 'whole' },
  { name: 'Olive Oil', image: oliveOil, unit: 'tbs' },
  { name: 'Onion', image: onion, unit: 'whole' },
  { name: 'Pumpkin', image: pumpkin, unit: 'whole' },
  { name: 'Salt', image: salt, unit: 'ts' },
  { name: 'Tomato', image: tomato, unit: 'whole' },
  ] as CatalogIngredient[]
).sort((a, b) => a.name.localeCompare(b.name));

export const INGREDIENT_PHOTO = { apple, avocado, banana, bread, carrot, egg, eggplant, lemon, oliveOil, onion, pumpkin, salt, tomato };
