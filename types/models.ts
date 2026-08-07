export type Units = 'imperial' | 'metric';
export type ThemePreference = 'system' | 'light' | 'dark';
export type RecoveryStatus = 'met' | 'difficult' | 'lapse' | 'unlogged';

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  age: number;
  heightCm: number;
  units: Units;
  onboardingComplete: boolean;
  demoMode: boolean;
  createdAt: string;
}

export interface OnboardingAnswers {
  age?: number;
  heightCm?: number;
  currentWeightKg?: number;
  units: Units;
  goals: string[];
  progressVision?: string;
  targetWeightKg?: number;
  activityLevel?: string;
  fitnessInterests: string[];
  equipment: string[];
  diet?: string;
  allergies: string[];
  likedFoods: string[];
  dislikedFoods: string[];
  wellnessAreas: string[];
  recoveryChoice?: 'yes' | 'later' | 'no';
  recoveryCategory?: string;
  soberStartDate?: string;
  motivation?: string;
}

export interface DatedValue { id: string; date: string; value: number }
export interface WeightEntry extends DatedValue { unit: 'kg' }
export interface WaterEntry extends DatedValue { unit: 'ml' }
export interface MoodEntry extends DatedValue { stress?: number; sleepHours?: number; tags?: string[] }

export interface Meal {
  id: string;
  title: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Pre-workout' | 'Post-workout';
  description: string;
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  time: number;
  prepTime: number;
  cookTime: number;
  servingSize: string;
  servings: number;
  difficulty: 'Easy' | 'Moderate';
  image: string;
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
  diets: string[];
  goalFit: string[];
  cuisine?: string;
  budget?: boolean;
}

export type GroceryCategory = 'Produce' | 'Meat & Protein' | 'Grains & Bakery' | 'Dairy & Refrigerated' | 'Canned & Pantry' | 'Frozen' | 'Other';
export interface RecipeIngredient { name: string; amount: number; unit: string; category: GroceryCategory }
export interface GrocerySource { id: string; label: string; amount: number }
export interface GroceryItem { id: string; name: string; amount: number; unit: string; category: GroceryCategory; checked: boolean; sources: GrocerySource[] }
export type MealPlanDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type MealPlanSlot = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
export interface MealPlanEntry { id: string; day: MealPlanDay; slot: MealPlanSlot; mealId: string }
export interface CustomBowlSelection { base: string; protein: string; beans: string; toppings: string[] }
export interface SavedBowl { id: string; title: string; selection: CustomBowlSelection; calories: number; protein: number; carbs: number; fat: number; createdAt: string }

export interface Workout {
  id: string;
  title: string;
  category: string;
  duration: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  exercises: string[];
}

export interface WorkoutLog { id: string; workoutId: string; title: string; date: string; minutes: number; completed: boolean }

export interface RecoveryProfile {
  enabled: boolean;
  startDate?: string;
  category?: string;
  goal: string;
  motivation: string;
  trustedContact?: string;
  copingStrategies: string[];
}

export interface RecoveryCheckin {
  id: string;
  date: string;
  status: RecoveryStatus;
  mood: number;
  craving: number;
  triggers: string[];
  strategies: string[];
  note?: string;
}

export interface Habit { id: string; title: string; completedDates: string[] }
export interface Achievement { id: string; title: string; detail: string; icon: string; earnedAt?: string }

export interface AppSettings {
  theme: ThemePreference;
  privateNotifications: boolean;
  milestoneNotifications: boolean;
  biometricLock: boolean;
  dashboardCards: string[];
}

export interface AppData {
  profile: Profile | null;
  onboarding: OnboardingAnswers;
  weights: WeightEntry[];
  water: WaterEntry[];
  moods: MoodEntry[];
  mealLogs: string[];
  savedMeals: string[];
  dislikedMeals: string[];
  groceryItems: GroceryItem[];
  mealPlan: MealPlanEntry[];
  savedBowls: SavedBowl[];
  workoutLogs: WorkoutLog[];
  recovery: RecoveryProfile;
  recoveryCheckins: RecoveryCheckin[];
  habits: Habit[];
  achievements: Achievement[];
  settings: AppSettings;
}
