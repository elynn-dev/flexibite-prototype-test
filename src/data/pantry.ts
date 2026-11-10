import type { PantryItem, UsedIngredient } from './types';
import onion from '../assets/ingredients/onion.png';
import avocado from '../assets/ingredients/avocado.png';
import pumpkin from '../assets/ingredients/pumpkin.png';
import lemon from '../assets/ingredients/lemon.png';
import oliveOil from '../assets/ingredients/olive-oil.png';
import salt from '../assets/ingredients/salt.png';
import egg from '../assets/ingredients/egg.png';
import eggplant from '../assets/ingredients/eggplant.png';
import springOnion from '../assets/ingredients/spring-onion.png';
import carrot from '../assets/ingredients/carrot.png';
import broccoli from '../assets/ingredients/broccoli.png';

/** What's in the pantry when the app starts. */
export const INITIAL_PANTRY: PantryItem[] = [
  { name: 'Onion', quantity: 1, unit: 'whole', image: onion, location: 'storage' },
  { name: 'Avocado', quantity: 4, unit: 'whole', image: avocado, location: 'storage' },
  { name: 'Pumpkin', quantity: 0, unit: 'whole', image: pumpkin, location: 'storage' },
  { name: 'Lemon', quantity: 0, unit: 'whole', image: lemon, location: 'storage' },
  { name: 'Olive Oil', quantity: -1, unit: '', image: oliveOil, location: 'storage' },
  { name: 'Salt', quantity: -1, unit: '', image: salt, location: 'storage' },
  { name: 'Eggs', quantity: 2, unit: 'Tray', image: egg, location: 'fridge' },
  { name: 'Eggplant', quantity: 4, unit: 'whole', image: eggplant, location: 'fridge' },
  { name: 'Spring Onion', quantity: 3, unit: 'whole', image: springOnion, location: 'fridge' },
  { name: 'Carrot', quantity: 3, unit: 'whole', image: carrot, location: 'fridge' },
  { name: 'Broccoli', quantity: 3, unit: 'whole', image: broccoli, location: 'fridge' },
];

/** Ingredients the user cooked with recently, waiting to be taken off the pantry. */
export const INITIAL_USED: UsedIngredient[] = [
  { name: 'Onion', quantity: 1 },
  { name: 'Eggs', quantity: 2 },
];
