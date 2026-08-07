import type { Meal, OnboardingAnswers } from '@/types/models';

const normal = (value: string) => value.trim().toLowerCase();

export function isAllergySafe(meal: Meal, allergies: string[]) {
  const ingredients = meal.ingredients.map((ingredient) => normal(ingredient.name));
  return !allergies.some((allergy) => ingredients.some((ingredient) => ingredient.includes(normal(allergy))));
}

const goalFilter: Record<string, string> = { 'Weight Loss': 'Lose weight', 'Muscle Gain': 'Build muscle', 'Weight Gain': 'Gain healthy weight' };

export function filterMeals(meals: Meal[], answers: OnboardingAnswers, category?: string, favoriteIds: string[] = []) {
  const favorites = meals.filter((meal) => favoriteIds.includes(meal.id));
  const favoriteTerms = new Set(favorites.flatMap((meal) => [meal.cuisine ?? '', ...meal.ingredients.map((ingredient) => ingredient.name.toLowerCase())]).filter(Boolean));
  return meals
    .filter((meal) => isAllergySafe(meal, answers.allergies))
    .filter((meal) => !category || category === 'All' || meal.category === category || meal.tags.some((tag) => normal(tag) === normal(category)) || (goalFilter[category] ? meal.goalFit.includes(goalFilter[category]) : false))
    .filter((meal) => !answers.diet || answers.diet === 'No specific diet' || meal.diets.includes(answers.diet))
    .filter((meal) => !answers.dislikedFoods.some((food) => meal.ingredients.some((ingredient) => normal(ingredient.name).includes(normal(food)))))
    .sort((a, b) => {
      const likedA = answers.likedFoods.filter((food) => a.ingredients.some((ingredient) => normal(ingredient.name).includes(normal(food)))).length;
      const likedB = answers.likedFoods.filter((food) => b.ingredients.some((ingredient) => normal(ingredient.name).includes(normal(food)))).length;
      const goalA = answers.goals.filter((goal) => a.goalFit.includes(goal)).length;
      const goalB = answers.goals.filter((goal) => b.goalFit.includes(goal)).length;
      const favoriteA = a.ingredients.filter((ingredient) => favoriteTerms.has(ingredient.name.toLowerCase())).length + (a.cuisine && favoriteTerms.has(a.cuisine) ? 2 : 0);
      const favoriteB = b.ingredients.filter((ingredient) => favoriteTerms.has(ingredient.name.toLowerCase())).length + (b.cuisine && favoriteTerms.has(b.cuisine) ? 2 : 0);
      return likedB * 2 + goalB * 3 + favoriteB - likedA * 2 - goalA * 3 - favoriteA;
    });
}
