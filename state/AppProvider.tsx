import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { calculateBowl } from '@/data/bowl';
import { meals } from '@/data/catalog';
import { demoData, initialData } from '@/data/demo';
import type { AppData, AppSettings, CustomBowlSelection, GroceryCategory, MealPlanDay, MealPlanSlot, MoodEntry, OnboardingAnswers, RecoveryCheckin, WeightEntry, WorkoutLog } from '@/types/models';
import { dateKey } from '@/utils/date';
import { addIngredients, addMealIngredients, createPlanGroceryList, removeSource } from '@/utils/grocery';

const STORAGE_KEY = 'sober-plus-health:v2';

interface AppContextValue {
  data: AppData;
  ready: boolean;
  isDark: boolean;
  update: (recipe: (current: AppData) => AppData) => void;
  startDemo: () => void;
  createLocalAccount: (email: string, firstName: string, options?: { id?: string; onboardingComplete?: boolean }) => void;
  signOut: () => void;
  resetData: () => Promise<void>;
  updateOnboarding: (patch: Partial<OnboardingAnswers>) => void;
  completeOnboarding: () => void;
  logWeight: (kg: number) => void;
  logMood: (mood: number, stress?: number) => void;
  logWater: (ml: number) => void;
  toggleHabit: (id: string) => void;
  toggleSavedMeal: (id: string) => void;
  dislikeMeal: (id: string) => void;
  logMeal: (id: string) => void;
  addMealToGrocery: (id: string, sourceId?: string) => void;
  toggleGroceryItem: (id: string) => void;
  addCustomGroceryItem: (name: string, amount: number, unit: string, category: GroceryCategory) => void;
  updateGroceryAmount: (id: string, amount: number) => void;
  removeGroceryItem: (id: string) => void;
  removeGrocerySource: (sourceId: string) => void;
  clearCompletedGroceries: () => void;
  clearGroceryList: () => void;
  setMealPlan: (day: MealPlanDay, slot: MealPlanSlot, mealId?: string) => void;
  createGroceryFromPlan: () => void;
  saveBowl: (title: string, selection: CustomBowlSelection) => void;
  addBowlToGrocery: (title: string, selection: CustomBowlSelection) => void;
  logBowl: (title: string) => void;
  logWorkout: (log: Omit<WorkoutLog, 'id' | 'date'>) => void;
  saveRecoveryCheckin: (entry: Omit<RecoveryCheckin, 'id' | 'date'>) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
const hydrate = (stored: Partial<AppData>): AppData => ({ ...clone(initialData), ...stored, onboarding: { ...clone(initialData.onboarding), ...stored.onboarding }, recovery: { ...clone(initialData.recovery), ...stored.recovery }, settings: { ...clone(initialData.settings), ...stored.settings }, groceryItems: stored.groceryItems ?? [], mealPlan: stored.mealPlan ?? [], savedBowls: stored.savedBowls ?? [] });

export function AppProvider({ children }: React.PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [data, setData] = useState<AppData>(() => clone(initialData));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => stored && setData(hydrate(JSON.parse(stored) as Partial<AppData>)))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => undefined);
  }, [data, ready]);

  const update = useCallback((recipe: (current: AppData) => AppData) => setData((current) => recipe(current)), []);
  const startDemo = useCallback(() => setData(clone(demoData)), []);
  const createLocalAccount = useCallback((email: string, firstName: string, options?: { id?: string; onboardingComplete?: boolean }) => setData((current) => ({
    ...current,
    profile: { id: options?.id ?? uid(), email, firstName, age: current.onboarding.age ?? 18, heightCm: current.onboarding.heightCm ?? 170, units: current.onboarding.units, onboardingComplete: options?.onboardingComplete ?? false, demoMode: false, createdAt: dateKey() },
  })), []);
  const signOut = useCallback(() => setData((current) => ({ ...current, profile: null })), []);
  const resetData = useCallback(async () => { await AsyncStorage.removeItem(STORAGE_KEY); setData(clone(initialData)); router.replace('/welcome'); }, []);
  const updateOnboarding = useCallback((patch: Partial<OnboardingAnswers>) => setData((current) => ({ ...current, onboarding: { ...current.onboarding, ...patch } })), []);
  const completeOnboarding = useCallback(() => setData((current) => ({
    ...current,
    profile: current.profile ? { ...current.profile, age: current.onboarding.age ?? 18, heightCm: current.onboarding.heightCm ?? 170, units: current.onboarding.units, onboardingComplete: true } : null,
    recovery: { ...current.recovery, enabled: current.onboarding.recoveryChoice === 'yes', startDate: current.onboarding.soberStartDate, category: current.onboarding.recoveryCategory, motivation: current.onboarding.motivation ?? '' },
    weights: current.onboarding.currentWeightKg ? [{ id: uid(), date: dateKey(), value: current.onboarding.currentWeightKg, unit: 'kg' }] : current.weights,
  })), []);
  const logWeight = useCallback((kg: number) => setData((current) => ({ ...current, weights: [...current.weights.filter((item) => item.date !== dateKey()), { id: uid(), date: dateKey(), value: kg, unit: 'kg' } as WeightEntry] })), []);
  const logMood = useCallback((value: number, stress?: number) => setData((current) => ({ ...current, moods: [...current.moods.filter((item) => item.date !== dateKey()), { id: uid(), date: dateKey(), value, stress } as MoodEntry] })), []);
  const logWater = useCallback((ml: number) => setData((current) => ({ ...current, water: [...current.water.filter((item) => item.date !== dateKey()), { id: uid(), date: dateKey(), value: ml, unit: 'ml' }] })), []);
  const toggleHabit = useCallback((id: string) => setData((current) => ({ ...current, habits: current.habits.map((habit) => habit.id === id ? { ...habit, completedDates: habit.completedDates.includes(dateKey()) ? habit.completedDates.filter((date) => date !== dateKey()) : [...habit.completedDates, dateKey()] } : habit) })), []);
  const toggleSavedMeal = useCallback((id: string) => setData((current) => ({ ...current, savedMeals: current.savedMeals.includes(id) ? current.savedMeals.filter((item) => item !== id) : [...current.savedMeals, id] })), []);
  const dislikeMeal = useCallback((id: string) => setData((current) => ({ ...current, dislikedMeals: [...new Set([...current.dislikedMeals, id])], savedMeals: current.savedMeals.filter((item) => item !== id) })), []);
  const logMeal = useCallback((id: string) => setData((current) => ({ ...current, mealLogs: [...current.mealLogs, `${dateKey()}:${id}`] })), []);
  const addMealToGrocery = useCallback((id: string, sourceId?: string) => setData((current) => { const selected = meals.find((item) => item.id === id); return selected ? { ...current, groceryItems: addMealIngredients(current.groceryItems, selected, sourceId) } : current; }), []);
  const toggleGroceryItem = useCallback((id: string) => setData((current) => ({ ...current, groceryItems: current.groceryItems.map((item) => item.id === id ? { ...item, checked: !item.checked } : item) })), []);
  const addCustomGroceryItem = useCallback((name: string, amount: number, unit: string, category: GroceryCategory) => setData((current) => ({ ...current, groceryItems: addIngredients(current.groceryItems, [{ name, amount, unit, category }], { id: `custom:${uid()}`, label: 'Personal item' }) })), []);
  const updateGroceryAmount = useCallback((id: string, amount: number) => setData((current) => ({ ...current, groceryItems: current.groceryItems.map((item) => { if (item.id !== id || amount <= 0) return item; const ratio = amount / item.amount; return { ...item, amount, sources: item.sources.map((source) => ({ ...source, amount: source.amount * ratio })) }; }) })), []);
  const removeGroceryItem = useCallback((id: string) => setData((current) => ({ ...current, groceryItems: current.groceryItems.filter((item) => item.id !== id) })), []);
  const removeGrocerySource = useCallback((sourceId: string) => setData((current) => ({ ...current, groceryItems: removeSource(current.groceryItems, sourceId) })), []);
  const clearCompletedGroceries = useCallback(() => setData((current) => ({ ...current, groceryItems: current.groceryItems.filter((item) => !item.checked) })), []);
  const clearGroceryList = useCallback(() => setData((current) => ({ ...current, groceryItems: [] })), []);
  const setMealPlan = useCallback((day: MealPlanDay, slot: MealPlanSlot, mealId?: string) => setData((current) => { const existing = current.mealPlan.find((entry) => entry.day === day && entry.slot === slot); const without = current.mealPlan.filter((entry) => entry !== existing); const groceryItems = existing ? removeSource(current.groceryItems, `plan:${existing.id}`) : current.groceryItems; return { ...current, groceryItems, mealPlan: mealId ? [...without, { id: uid(), day, slot, mealId }] : without }; }), []);
  const createGroceryFromPlan = useCallback(() => setData((current) => ({ ...current, groceryItems: createPlanGroceryList(current.groceryItems, current.mealPlan.flatMap((entry) => { const selected = meals.find((mealItem) => mealItem.id === entry.mealId); return selected ? [{ meal: selected, sourceId: `plan:${entry.id}` }] : []; })) })), []);
  const saveBowl = useCallback((title: string, selection: CustomBowlSelection) => setData((current) => { const nutrition = calculateBowl(selection); return { ...current, savedBowls: [...current.savedBowls, { id: uid(), title, selection, calories: nutrition.calories, protein: nutrition.protein, carbs: nutrition.carbs, fat: nutrition.fat, createdAt: dateKey() }] }; }), []);
  const addBowlToGrocery = useCallback((title: string, selection: CustomBowlSelection) => setData((current) => { const nutrition = calculateBowl(selection); return { ...current, groceryItems: addIngredients(current.groceryItems, nutrition.ingredients, { id: `bowl:${uid()}`, label: title }) }; }), []);
  const logBowl = useCallback((title: string) => setData((current) => ({ ...current, mealLogs: [...current.mealLogs, `${dateKey()}:bowl:${title}`] })), []);
  const logWorkout = useCallback((log: Omit<WorkoutLog, 'id' | 'date'>) => setData((current) => ({ ...current, workoutLogs: [...current.workoutLogs, { ...log, id: uid(), date: dateKey() }] })), []);
  const saveRecoveryCheckin = useCallback((entry: Omit<RecoveryCheckin, 'id' | 'date'>) => setData((current) => ({ ...current, recoveryCheckins: [...current.recoveryCheckins.filter((item) => item.date !== dateKey()), { ...entry, id: uid(), date: dateKey() }] })), []);
  const updateSettings = useCallback((patch: Partial<AppSettings>) => setData((current) => ({ ...current, settings: { ...current.settings, ...patch } })), []);
  const isDark = data.settings.theme === 'dark' || (data.settings.theme === 'system' && systemScheme === 'dark');

  const value = useMemo(() => ({ data, ready, isDark, update, startDemo, createLocalAccount, signOut, resetData, updateOnboarding, completeOnboarding, logWeight, logMood, logWater, toggleHabit, toggleSavedMeal, dislikeMeal, logMeal, addMealToGrocery, toggleGroceryItem, addCustomGroceryItem, updateGroceryAmount, removeGroceryItem, removeGrocerySource, clearCompletedGroceries, clearGroceryList, setMealPlan, createGroceryFromPlan, saveBowl, addBowlToGrocery, logBowl, logWorkout, saveRecoveryCheckin, updateSettings }), [data, ready, isDark, update, startDemo, createLocalAccount, signOut, resetData, updateOnboarding, completeOnboarding, logWeight, logMood, logWater, toggleHabit, toggleSavedMeal, dislikeMeal, logMeal, addMealToGrocery, toggleGroceryItem, addCustomGroceryItem, updateGroceryAmount, removeGroceryItem, removeGrocerySource, clearCompletedGroceries, clearGroceryList, setMealPlan, createGroceryFromPlan, saveBowl, addBowlToGrocery, logBowl, logWorkout, saveRecoveryCheckin, updateSettings]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
