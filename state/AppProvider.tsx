import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { demoData, initialData } from '@/data/demo';
import type { AppData, AppSettings, MoodEntry, OnboardingAnswers, RecoveryCheckin, WeightEntry, WorkoutLog } from '@/types/models';
import { dateKey } from '@/utils/date';

const STORAGE_KEY = 'sober-plus-health:v2';

interface AppContextValue {
  data: AppData;
  ready: boolean;
  isDark: boolean;
  update: (recipe: (current: AppData) => AppData) => void;
  startDemo: () => void;
  createLocalAccount: (email: string, firstName: string) => void;
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
  logWorkout: (log: Omit<WorkoutLog, 'id' | 'date'>) => void;
  saveRecoveryCheckin: (entry: Omit<RecoveryCheckin, 'id' | 'date'>) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function AppProvider({ children }: React.PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [data, setData] = useState<AppData>(() => clone(initialData));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => stored && setData(JSON.parse(stored) as AppData))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => undefined);
  }, [data, ready]);

  const update = useCallback((recipe: (current: AppData) => AppData) => setData((current) => recipe(current)), []);
  const startDemo = useCallback(() => setData(clone(demoData)), []);
  const createLocalAccount = useCallback((email: string, firstName: string) => setData((current) => ({
    ...current,
    profile: { id: uid(), email, firstName, age: 18, heightCm: 170, units: 'imperial', onboardingComplete: false, demoMode: false, createdAt: dateKey() },
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
  const logWorkout = useCallback((log: Omit<WorkoutLog, 'id' | 'date'>) => setData((current) => ({ ...current, workoutLogs: [...current.workoutLogs, { ...log, id: uid(), date: dateKey() }] })), []);
  const saveRecoveryCheckin = useCallback((entry: Omit<RecoveryCheckin, 'id' | 'date'>) => setData((current) => ({ ...current, recoveryCheckins: [...current.recoveryCheckins.filter((item) => item.date !== dateKey()), { ...entry, id: uid(), date: dateKey() }] })), []);
  const updateSettings = useCallback((patch: Partial<AppSettings>) => setData((current) => ({ ...current, settings: { ...current.settings, ...patch } })), []);
  const isDark = data.settings.theme === 'dark' || (data.settings.theme === 'system' && systemScheme === 'dark');

  const value = useMemo(() => ({ data, ready, isDark, update, startDemo, createLocalAccount, signOut, resetData, updateOnboarding, completeOnboarding, logWeight, logMood, logWater, toggleHabit, toggleSavedMeal, dislikeMeal, logMeal, logWorkout, saveRecoveryCheckin, updateSettings }), [data, ready, isDark, update, startDemo, createLocalAccount, signOut, resetData, updateOnboarding, completeOnboarding, logWeight, logMood, logWater, toggleHabit, toggleSavedMeal, dislikeMeal, logMeal, logWorkout, saveRecoveryCheckin, updateSettings]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}

