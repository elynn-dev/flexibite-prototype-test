import type { PantryItem, UsedIngredient } from './types';
import { INGREDIENT_PHOTO } from './ingredients';

const { onion, avocado, banana, tomato, lemon, oliveOil, salt, egg, eggplant, carrot, pumpkin, apple } = INGREDIENT_PHOTO;

/** What's in the pantry when the app starts (Storage matches Figma Pantry-default). */
export const INITIAL_PANTRY: PantryItem[] = [
  { name: 'Onion', quantity: 1, unit: 'whole', image: onion, location: 'storage', shelf: 'Top' },
  { name: 'Avocado', quantity: 4, unit: 'whole', image: avocado, location: 'storage', shelf: 'Top' },
  { name: 'Banana', quantity: 1, unit: 'bunch', image: banana, location: 'storage', shelf: 'Top' },
  { name: 'Tomato', quantity: 0, unit: 'whole', image: tomato, location: 'storage', shelf: 'Middle' },
  { name: 'Lemon', quantity: 0, unit: 'whole', image: lemon, location: 'storage', shelf: 'Middle' },
  { name: 'Olive Oil', quantity: -1, unit: '', image: oliveOil, location: 'storage', shelf: 'Bottom' },
  { name: 'Salt', quantity: -1, unit: '', image: salt, location: 'storage', shelf: 'Bottom' },
  { name: 'Eggs', quantity: 2, unit: 'Tray', image: egg, location: 'fridge', shelf: 'Top' },
  { name: 'Eggplant', quantity: 4, unit: 'whole', image: eggplant, location: 'fridge', shelf: 'Top' },
  { name: 'Carrot', quantity: 3, unit: 'whole', image: carrot, location: 'fridge', shelf: 'Top' },
  { name: 'Pumpkin', quantity: 1, unit: 'whole', image: pumpkin, location: 'fridge', shelf: 'Middle' },
  { name: 'Apple', quantity: 3, unit: 'whole', image: apple, location: 'fridge', shelf: 'Middle' },
];

/** Ingredients the user cooked with recently, waiting to be taken off the pantry. */
export const INITIAL_USED: UsedIngredient[] = [
  { name: 'Onion', quantity: 1 },
  { name: 'Eggs', quantity: 2 },
];
