import type { Meal, OnboardingAnswers } from '@/types/models';

const normal = (value: string) => value.trim().toLowerCase();

export function isAllergySafe(meal: Meal, allergies: string[]) {
  const ingredients = meal.ingredients.map(normal);
  return !allergies.some((allergy) => ingredients.some((ingredient) => ingredient.includes(normal(allergy))));
}

export function filterMeals(meals: Meal[], answers: OnboardingAnswers, category?: string) {
  return meals
    .filter((meal) => isAllergySafe(meal, answers.allergies))
    .filter((meal) => !category || category === 'All' || meal.category === category || meal.tags.includes(category))
    .filter((meal) => !answers.diet || answers.diet === 'No specific diet' || meal.diets.includes(answers.diet))
    .filter((meal) => !answers.dislikedFoods.some((food) => meal.ingredients.some((ingredient) => normal(ingredient).includes(normal(food)))))
    .sort((a, b) => {
      const likedA = answers.likedFoods.filter((food) => a.ingredients.some((ingredient) => normal(ingredient).includes(normal(food)))).length;
      const likedB = answers.likedFoods.filter((food) => b.ingredients.some((ingredient) => normal(ingredient).includes(normal(food)))).length;
      const goalA = answers.goals.filter((goal) => a.goalFit.includes(goal)).length;
      const goalB = answers.goals.filter((goal) => b.goalFit.includes(goal)).length;
      return likedB + goalB - likedA - goalA;
    });
}

