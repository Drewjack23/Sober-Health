import type { GroceryItem, GrocerySource, Meal, RecipeIngredient } from '@/types/models';

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
const itemKey = (ingredient: Pick<RecipeIngredient, 'name' | 'unit'>) => `${normalize(ingredient.name)}:${normalize(ingredient.unit)}`;
const round = (value: number) => Math.round(value * 100) / 100;

export function addIngredients(items: GroceryItem[], ingredients: RecipeIngredient[], source: Omit<GrocerySource, 'amount'>) {
  const next = items.map((item) => ({ ...item, sources: [...item.sources] }));
  for (const ingredient of ingredients) {
    const key = itemKey(ingredient);
    const existing = next.find((item) => itemKey(item) === key);
    if (existing) {
      const prior = existing.sources.find((entry) => entry.id === source.id);
      if (prior) {
        existing.amount = round(existing.amount - prior.amount + ingredient.amount);
        prior.amount = ingredient.amount;
        prior.label = source.label;
      } else {
        existing.amount = round(existing.amount + ingredient.amount);
        existing.sources.push({ ...source, amount: ingredient.amount });
      }
      existing.checked = false;
    } else {
      next.push({
        id: `${key}:${Date.now()}:${next.length}`,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        category: ingredient.category,
        checked: false,
        sources: [{ ...source, amount: ingredient.amount }],
      });
    }
  }
  return next;
}

export function addMealIngredients(items: GroceryItem[], meal: Meal, sourceId = `recipe:${meal.id}`) {
  return addIngredients(items, meal.ingredients, { id: sourceId, label: meal.title });
}

export function removeSource(items: GroceryItem[], sourceId: string) {
  return items.flatMap((item) => {
    const removed = item.sources.filter((source) => source.id === sourceId).reduce((sum, source) => sum + source.amount, 0);
    if (!removed) return [item];
    const sources = item.sources.filter((source) => source.id !== sourceId);
    const amount = round(item.amount - removed);
    return amount > 0 && sources.length ? [{ ...item, amount, sources }] : [];
  });
}

export function createPlanGroceryList(items: GroceryItem[], plannedMeals: { meal: Meal; sourceId: string }[]) {
  let next = items.filter((item) => item.sources.some((source) => !source.id.startsWith('plan:')))
    .map((item) => ({ ...item, amount: round(item.sources.filter((source) => !source.id.startsWith('plan:')).reduce((sum, source) => sum + source.amount, 0)), sources: item.sources.filter((source) => !source.id.startsWith('plan:')) }))
    .filter((item) => item.sources.length > 0);
  for (const entry of plannedMeals) next = addIngredients(next, entry.meal.ingredients, { id: entry.sourceId, label: `${entry.meal.title} · weekly plan` });
  return next;
}

export function formatQuantity(amount: number, unit: string) {
  const formatted = Number.isInteger(amount) ? String(amount) : amount.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  return `${formatted}${unit ? ` ${unit}` : ''}`;
}
