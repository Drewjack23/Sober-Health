import type { CustomBowlSelection, RecipeIngredient } from '@/types/models';

export interface BowlOption { id: string; label: string; calories: number; protein: number; carbs: number; fat: number; ingredient?: RecipeIngredient }

export const bowlBases: BowlOption[] = [
  { id: 'white-rice', label: 'White rice', calories: 205, protein: 4, carbs: 45, fat: 0, ingredient: { name: 'white rice', amount: 1, unit: 'cup', category: 'Grains & Bakery' } },
  { id: 'brown-rice', label: 'Brown rice', calories: 215, protein: 5, carbs: 45, fat: 2, ingredient: { name: 'brown rice', amount: 1, unit: 'cup', category: 'Grains & Bakery' } },
  { id: 'lettuce', label: 'Lettuce', calories: 20, protein: 1, carbs: 4, fat: 0, ingredient: { name: 'lettuce', amount: 2, unit: 'cup', category: 'Produce' } },
];
export const bowlProteins: BowlOption[] = [
  { id: 'chicken', label: 'Chicken', calories: 280, protein: 52, carbs: 0, fat: 6, ingredient: { name: 'chicken breast', amount: 8, unit: 'oz', category: 'Meat & Protein' } },
  { id: 'steak', label: 'Steak', calories: 340, protein: 46, carbs: 0, fat: 17, ingredient: { name: 'sirloin steak', amount: 7, unit: 'oz', category: 'Meat & Protein' } },
  { id: 'turkey', label: 'Ground turkey', calories: 270, protein: 43, carbs: 0, fat: 10, ingredient: { name: 'lean ground turkey', amount: 7, unit: 'oz', category: 'Meat & Protein' } },
  { id: 'tofu', label: 'Tofu', calories: 210, protein: 22, carbs: 6, fat: 12, ingredient: { name: 'extra-firm tofu', amount: 8, unit: 'oz', category: 'Meat & Protein' } },
];
export const bowlBeans: BowlOption[] = [
  { id: 'black-beans', label: 'Black beans', calories: 115, protein: 8, carbs: 20, fat: 1, ingredient: { name: 'black beans', amount: .5, unit: 'cup', category: 'Canned & Pantry' } },
  { id: 'pinto-beans', label: 'Pinto beans', calories: 120, protein: 8, carbs: 22, fat: 1, ingredient: { name: 'pinto beans', amount: .5, unit: 'cup', category: 'Canned & Pantry' } },
  { id: 'no-beans', label: 'No beans', calories: 0, protein: 0, carbs: 0, fat: 0 },
];
export const bowlToppings: BowlOption[] = [
  { id: 'fajita-veg', label: 'Fajita vegetables', calories: 45, protein: 1, carbs: 9, fat: 1, ingredient: { name: 'fajita vegetables', amount: 1, unit: 'cup', category: 'Produce' } },
  { id: 'corn', label: 'Corn', calories: 70, protein: 2, carbs: 16, fat: 1, ingredient: { name: 'corn', amount: .5, unit: 'cup', category: 'Canned & Pantry' } },
  { id: 'lettuce', label: 'Lettuce', calories: 10, protein: 1, carbs: 2, fat: 0, ingredient: { name: 'lettuce', amount: 1, unit: 'cup', category: 'Produce' } },
  { id: 'pico', label: 'Pico', calories: 20, protein: 1, carbs: 4, fat: 0, ingredient: { name: 'pico de gallo', amount: .25, unit: 'cup', category: 'Produce' } },
  { id: 'salsa', label: 'Salsa', calories: 20, protein: 0, carbs: 4, fat: 0, ingredient: { name: 'salsa', amount: .25, unit: 'cup', category: 'Canned & Pantry' } },
  { id: 'cheese', label: 'Cheese', calories: 110, protein: 7, carbs: 1, fat: 9, ingredient: { name: 'shredded cheese', amount: .25, unit: 'cup', category: 'Dairy & Refrigerated' } },
  { id: 'guacamole', label: 'Guacamole', calories: 100, protein: 1, carbs: 5, fat: 9, ingredient: { name: 'guacamole', amount: 2, unit: 'tbsp', category: 'Produce' } },
  { id: 'sour-cream', label: 'Sour cream', calories: 60, protein: 1, carbs: 1, fat: 6, ingredient: { name: 'sour cream', amount: 2, unit: 'tbsp', category: 'Dairy & Refrigerated' } },
  { id: 'cilantro', label: 'Cilantro', calories: 2, protein: 0, carbs: 0, fat: 0, ingredient: { name: 'cilantro', amount: 2, unit: 'tbsp', category: 'Produce' } },
  { id: 'lime', label: 'Lime', calories: 5, protein: 0, carbs: 2, fat: 0, ingredient: { name: 'lime', amount: .5, unit: 'whole', category: 'Produce' } },
];

export const defaultBowl: CustomBowlSelection = { base: 'brown-rice', protein: 'chicken', beans: 'black-beans', toppings: ['fajita-veg', 'pico', 'salsa', 'lime'] };

export function calculateBowl(selection: CustomBowlSelection) {
  const options = [bowlBases.find((option) => option.id === selection.base), bowlProteins.find((option) => option.id === selection.protein), bowlBeans.find((option) => option.id === selection.beans), ...selection.toppings.map((id) => bowlToppings.find((option) => option.id === id))].filter((option): option is BowlOption => Boolean(option));
  return {
    calories: options.reduce((sum, option) => sum + option.calories, 0),
    protein: options.reduce((sum, option) => sum + option.protein, 0),
    carbs: options.reduce((sum, option) => sum + option.carbs, 0),
    fat: options.reduce((sum, option) => sum + option.fat, 0),
    ingredients: options.flatMap((option) => option.ingredient ? [option.ingredient] : []),
    labels: options.map((option) => option.label),
  };
}
