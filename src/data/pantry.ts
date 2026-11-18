import type { PantryItem, UsedIngredient } from './types';
// Figma Components → Ingredients: one photo per ingredient (1024px), shown on the ingredient colour.
import onion from '../assets/ingredients/photos/onion.jpg';
import avocado from '../assets/ingredients/photos/avocado.jpg';
import banana from '../assets/ingredients/photos/banana.jpg';
import tomato from '../assets/ingredients/photos/tomato.jpg';
import lemon from '../assets/ingredients/photos/lemon.jpg';
import oliveOil from '../assets/ingredients/photos/olive-oil.jpg';
import salt from '../assets/ingredients/photos/salt.jpg';
import egg from '../assets/ingredients/photos/egg.jpg';
import eggplant from '../assets/ingredients/photos/eggplant.jpg';
import carrot from '../assets/ingredients/photos/carrot.jpg';
import pumpkin from '../assets/ingredients/photos/pumpkin.jpg';
import apple from '../assets/ingredients/photos/apple.jpg';

/** What's in the pantry when the app starts (Storage matches Figma Pantry-default). */
export const INITIAL_PANTRY: PantryItem[] = [
  { name: 'Onion', quantity: 1, unit: 'whole', image: onion, location: 'storage' },
  { name: 'Avocado', quantity: 4, unit: 'whole', image: avocado, location: 'storage' },
  { name: 'Banana', quantity: 1, unit: 'bunch', image: banana, location: 'storage' },
  { name: 'Tomato', quantity: 0, unit: 'whole', image: tomato, location: 'storage' },
  { name: 'Lemon', quantity: 0, unit: 'whole', image: lemon, location: 'storage' },
  { name: 'Olive Oil', quantity: -1, unit: '', image: oliveOil, location: 'storage' },
  { name: 'Salt', quantity: -1, unit: '', image: salt, location: 'storage' },
  { name: 'Eggs', quantity: 2, unit: 'Tray', image: egg, location: 'fridge' },
  { name: 'Eggplant', quantity: 4, unit: 'whole', image: eggplant, location: 'fridge' },
  { name: 'Carrot', quantity: 3, unit: 'whole', image: carrot, location: 'fridge' },
  { name: 'Pumpkin', quantity: 1, unit: 'whole', image: pumpkin, location: 'fridge' },
  { name: 'Apple', quantity: 3, unit: 'whole', image: apple, location: 'fridge' },
];

/** Ingredients the user cooked with recently, waiting to be taken off the pantry. */
export const INITIAL_USED: UsedIngredient[] = [
  { name: 'Onion', quantity: 1 },
  { name: 'Eggs', quantity: 2 },
];
