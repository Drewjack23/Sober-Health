import type { AppData } from '../types/models';
import { addDays, dateKey } from '../utils/date';

const today = dateKey();
const id = (prefix: string, index: number) => `${prefix}-${index}`;

export const emptyOnboarding = {
  units: 'imperial' as const,
  goals: [], fitnessInterests: [], equipment: [], allergies: [], likedFoods: [], dislikedFoods: [], wellnessAreas: [],
};

export const initialData: AppData = {
  profile: null,
  onboarding: emptyOnboarding,
  weights: [], water: [], moods: [], mealLogs: [], savedMeals: [], dislikedMeals: [], groceryItems: [], mealPlan: [], savedBowls: [], workoutLogs: [], recoveryCheckins: [],
  recovery: { enabled: false, goal: 'Live alcohol-free today', motivation: '', copingStrategies: ['Take a walk', 'Call someone I trust', 'Breathe for one minute'] },
  habits: [
    { id: 'water', title: 'Reach water goal', completedDates: [] },
    { id: 'move', title: 'Move for 20 minutes', completedDates: [] },
    { id: 'reflect', title: 'Evening reflection', completedDates: [] },
    { id: 'meditation', title: 'Weekly Meditation', completedDates: [] },
    { id: 'Skincare', title: 'Nightly Debriefing', completedDates: [] },
  ],
  achievements: [
    { id: 'first-workout', title: 'First Workout', detail: 'A strong first step.', icon: 'barbell' },
    { id: 'seven-recovery', title: '7 Days', detail: 'Seven days of showing up.', icon: 'sparkles' },
    { id: 'seven-checkins', title: '7 Check-ins', detail: 'You made space to notice.', icon: 'heart' },
  ],
  settings: { theme: 'system', privateNotifications: true, milestoneNotifications: false, biometricLock: false, dashboardCards: ['weight', 'recovery', 'water', 'activity', 'mood', 'habits'] },
};

export const demoData: AppData = {
  ...initialData,
  profile: { id: 'demo-user', email: 'andrew@example.com', firstName: 'Andrew', age: 34, heightCm: 178, units: 'imperial', onboardingComplete: true, demoMode: true, createdAt: today },
  onboarding: {
    ...emptyOnboarding,
    age: 34, heightCm: 178, currentWeightKg: 81.2, goals: ['Improve overall health', 'Build muscle'], progressVision: 'Fitness consistency', activityLevel: 'Moderately active', fitnessInterests: ['Walking', 'Weightlifting'], equipment: ['Dumbbells', 'Full gym'], diet: 'No specific diet', allergies: [], likedFoods: ['salmon', 'berries', 'Mexican'], dislikedFoods: ['olives'], wellnessAreas: ['Stress', 'Sleep', 'Staying consistent'], recoveryChoice: 'yes', recoveryCategory: 'Alcohol', soberStartDate: addDays(today, -46), motivation: 'My future',
  },
  weights: Array.from({ length: 9 }, (_, i) => ({ id: id('w', i), date: addDays(today, i * 5 - 40), value: Number((83.1 - i * 0.24 + (i % 3) * 0.08).toFixed(1)), unit: 'kg' as const })),
  water: Array.from({ length: 14 }, (_, i) => ({ id: id('water', i), date: addDays(today, i - 13), value: 1750 + (i % 4) * 250, unit: 'ml' as const })),
  moods: Array.from({ length: 21 }, (_, i) => ({ id: id('mood', i), date: addDays(today, i - 20), value: 3 + (i % 3), stress: 2 + (i % 4), sleepHours: 6.5 + (i % 3) * 0.5, tags: i % 2 ? ['workout'] : ['sleep'] })),
  workoutLogs: Array.from({ length: 11 }, (_, i) => ({ id: id('workout', i), workoutId: i % 2 ? 'walk-20' : 'full-body-20', title: i % 2 ? 'Mood-Boost Walk' : 'Strong Start', date: addDays(today, i * 4 - 40), minutes: i % 2 ? 24 : 30, completed: true })),
  recovery: { enabled: true, startDate: addDays(today, -46), category: 'Alcohol', goal: 'Live alcohol-free today', motivation: 'I want a clear, healthy future with the people I love.', trustedContact: 'Jordan', copingStrategies: ['Call Jordan', 'Take a walk', 'Start a short workout', 'Attend a support meeting'] },
  recoveryCheckins: Array.from({ length: 39 }, (_, i) => ({ id: id('recovery', i), date: addDays(today, i - 38), status: i === 17 ? 'difficult' as const : 'met' as const, mood: 3 + (i % 3), craving: i === 17 ? 4 : i % 3, triggers: i === 17 ? ['Stress'] : [], strategies: i === 17 ? ['Call someone', 'Take a walk'] : [] })),
  mealLogs: ['berry-oats', 'turkey-wrap'],
  savedMeals: ['salmon-bowl', 'lentil-soup'],
  habits: initialData.habits.map((habit, index) => ({ ...habit, completedDates: Array.from({ length: 9 - index }, (_, i) => addDays(today, -i)) })),
  achievements: initialData.achievements.map((item, index) => ({ ...item, earnedAt: index < 3 ? addDays(today, -index * 7) : undefined })),
};
