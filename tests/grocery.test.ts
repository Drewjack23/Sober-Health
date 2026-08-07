import { describe, expect, it } from 'vitest';
import { calculateBowl, defaultBowl } from '../data/bowl';
import { meals } from '../data/catalog';
import { addIngredients, addMealIngredients, createPlanGroceryList, removeSource } from '../utils/grocery';

describe('smart grocery list', () => {
  it('combines matching ingredient quantities while retaining both recipe sources', () => {
    const bowl = meals.find((meal) => meal.id === 'chicken-burrito-bowl')!;
    const tacos = meals.find((meal) => meal.id === 'chicken-tacos')!;
    const items = addMealIngredients(addMealIngredients([], bowl), tacos);
    const chicken = items.find((item) => item.name === 'chicken breast');
    expect(chicken?.amount).toBe(14);
    expect(chicken?.sources).toHaveLength(2);
  });

  it('subtracts only one recipe contribution when its source is removed', () => {
    const bowl = meals.find((meal) => meal.id === 'chicken-burrito-bowl')!;
    const tacos = meals.find((meal) => meal.id === 'chicken-tacos')!;
    const items = addMealIngredients(addMealIngredients([], bowl), tacos);
    const remaining = removeSource(items, `recipe:${bowl.id}`);
    expect(remaining.find((item) => item.name === 'chicken breast')?.amount).toBe(6);
  });

  it('rebuilds planned contributions without removing personal items', () => {
    const custom = addIngredients([], [{ name: 'coffee', amount: 1, unit: 'package', category: 'Canned & Pantry' }], { id: 'custom:1', label: 'Personal item' });
    const meal = meals.find((item) => item.id === 'steak-tacos')!;
    const first = createPlanGroceryList(custom, [{ meal, sourceId: 'plan:1' }]);
    const second = createPlanGroceryList(first, [{ meal, sourceId: 'plan:1' }]);
    expect(second.find((item) => item.name === 'coffee')).toBeTruthy();
    expect(second.find((item) => item.name === 'sirloin steak')?.amount).toBe(6);
  });

  it('calculates bowl nutrition and ingredients from selections', () => {
    const base = calculateBowl(defaultBowl);
    const loaded = calculateBowl({ ...defaultBowl, toppings: [...defaultBowl.toppings, 'cheese', 'guacamole'] });
    expect(loaded.calories).toBeGreaterThan(base.calories);
    expect(loaded.ingredients.some((ingredient) => ingredient.name === 'shredded cheese')).toBe(true);
  });
});

describe('recipe catalog completeness', () => {
  it('contains a large collection with complete recipe details', () => {
    expect(meals.length).toBeGreaterThan(35);
    expect(meals.every((meal) => meal.image && meal.ingredients.length >= 2 && meal.instructions.length >= 4 && meal.calories > 0)).toBe(true);
  });
});
