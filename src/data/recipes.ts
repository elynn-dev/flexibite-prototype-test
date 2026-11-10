import type { MealTime, Recipe, RecipeId } from './types';

import granolaImg from '../assets/images/granola-yogurt-bowl.jpg';
import granolaThumb from '../assets/images/granola-yogurt-bowl-sq.jpg';
import avocadoToastImg from '../assets/images/avocado-toast.jpg';
import friedRiceImg from '../assets/images/pineapple-fried-rice.jpg';
import chickenSaladImg from '../assets/images/baked-chicken-salad.jpg';
import step1 from '../assets/images/step-1.png';
import step2 from '../assets/images/step-2.png';
import step3 from '../assets/images/step-3.png';
import step4 from '../assets/images/step-4.png';

export const RECIPES: Record<RecipeId, Recipe> = {
  'granola-yogurt-bowl': {
    id: 'granola-yogurt-bowl',
    name: 'Granola Yogurt Bowl',
    info: ['Quick meal', '5min to cook', '310kcal'],
    image: granolaImg,
    cardCrop: { width: 114, height: 133.11, left: -6.89, top: -12.16 },
    tallCrop: { width: 114, height: 133.11, left: -6.89, top: -12.16 },
    thumb: granolaThumb,
    steps: [],
    ingredients: [],
  },
  'avocado-toast': {
    id: 'avocado-toast',
    name: 'Avocado Toast',
    info: ['Go-to meal', '20min to cook', '234kcal'],
    image: avocadoToastImg,
    cardCrop: { width: 102.92, height: 146.97, left: -2.02, top: -33.58 },
    thumb: avocadoToastImg,
    steps: [
      { text: '1. Mash avocado and season with a salt and olive oil', image: step1 },
      { text: '2. Cook a poached egg', image: step2 },
      { text: '3. Toast a piece of bread until golden', image: step3 },
      { text: '4. Spread avocado on toast, add the egg on top', image: step4 },
    ],
    ingredients: [
      { id: 'avocado', name: 'Avocado', amount: 1, unit: 'whole' },
      { id: 'bread', name: 'Bread', amount: 1, unit: 'whole' },
      { id: 'egg', name: 'Egg', amount: 2, unit: 'whole' },
      { id: 'olive-oil', name: 'Olive Oil', amount: 1, unit: 'tbs' },
      { id: 'salt', name: 'Salt', amount: 1, unit: 'ts' },
    ],
  },
  'pineapple-fried-rice': {
    id: 'pineapple-fried-rice',
    name: 'Pineapple Fried Rice',
    info: ['Weeknight meal', '25min to cook', '420kcal'],
    image: friedRiceImg,
    cardCrop: { width: 189.73, height: 212.16, left: -44.55, top: -66.19 },
    tallCrop: { width: 189.73, height: 212.16, left: -44.55, top: -66.19 },
    thumb: friedRiceImg,
    steps: [],
    ingredients: [],
  },
  'baked-chicken-salad': {
    id: 'baked-chicken-salad',
    name: 'Baked Chicken Salad',
    info: ['Go-to meal', '30min to cook', '380kcal'],
    image: chickenSaladImg,
    thumb: chickenSaladImg,
    steps: [],
    ingredients: [],
  },
};

/** The recipe a meal time gets when the user plans it without picking a recipe (assistant, edit). */
export const DEFAULT_RECIPE: Record<MealTime, RecipeId> = {
  breakfast: 'granola-yogurt-bowl',
  lunch: 'avocado-toast',
  dinner: 'pineapple-fried-rice',
};

/** Only Avocado Toast has a full recipe page in the prototype. */
export function hasRecipePage(id: RecipeId): boolean {
  return RECIPES[id].steps.length > 0;
}
