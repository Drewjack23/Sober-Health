import { describe, expect, it } from 'vitest';
import { meals } from '../data/catalog';
import { emptyOnboarding } from '../data/demo';
import { filterMeals, isAllergySafe } from '../utils/nutrition';

describe('meal safety and filtering', () => {
  it('filters any meal containing a recorded allergen', () => { const smoothie = meals.find((meal) => meal.id === 'smoothie')!; expect(isAllergySafe(smoothie, ['peanut'])).toBe(false); });
  it('matches allergens case-insensitively', () => { const oats = meals.find((meal) => meal.id === 'berry-oats')!; expect(isAllergySafe(oats, ['GREEK YOGURT'])).toBe(false); });
  it('filters by vegan preference', () => { const result = filterMeals(meals, { ...emptyOnboarding, diet: 'Vegan' }); expect(result.length).toBeGreaterThan(0); expect(result.every((meal) => meal.diets.includes('Vegan'))).toBe(true); });
  it('excludes disliked ingredients and ranks liked foods', () => { const result = filterMeals(meals, { ...emptyOnboarding, likedFoods: ['salmon'], dislikedFoods: ['olives'] }); expect(result[0]?.id).toBe('salmon-bowl'); expect(result.every((meal) => !meal.ingredients.some((ingredient) => ingredient.name === 'olives'))).toBe(true); });
});
