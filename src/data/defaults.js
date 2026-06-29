import { today } from "../utils/date";

export const navItems = [
  { id: "today", label: "Today" },
  { id: "sobriety", label: "Sobriety" },
  { id: "mind", label: "Mind" },
  { id: "body", label: "Body" },
  { id: "habits", label: "Habits" },
  { id: "profile", label: "Profile" },
  { id: "settings", label: "Settings" },
];

export const recipes = [
  { id: "salmon-bowl", title: "Salmon rice bowl", calories: 610, protein: 38, note: "Omega-3 rich, steady energy" },
  { id: "chicken-quinoa", title: "Lemon chicken quinoa", calories: 540, protein: 42, note: "High protein, meal-prep friendly" },
  { id: "lentil-soup", title: "Tomato lentil soup", calories: 380, protein: 23, note: "Fiber-forward, grounding" },
  { id: "berry-bowl", title: "Berry cottage bowl", calories: 320, protein: 28, note: "Fast breakfast, no cooking" },
];

export const journalPrompts = [
  "What supported my health today?",
  "What felt difficult, and what helped me stay steady?",
  "What is one action I want to repeat tomorrow?",
  "What am I learning about my triggers and recovery?",
];

export const defaultHabits = [
  { id: "h-water", name: "Drink water", cadence: "Daily", target: 1, completions: {} },
  { id: "h-walk", name: "Move for 20 minutes", cadence: "Daily", target: 1, completions: {} },
  { id: "h-journal", name: "Write a reflection", cadence: "Daily", target: 1, completions: {} },
];

export const defaultHealth = {
  water: 4,
  waterGoal: 8,
  sleep: 7,
  exercise: 20,
  energy: 6,
  stress: 4,
  anxiety: 3,
  medication: false,
  nutrition: "Balanced",
  vitals: { bp: "118/76", restingHr: 64 },
  history: [{ date: today(), water: 4, sleep: 7, exercise: 20, energy: 6 }],
};

export const defaultSettings = {
  theme: "system",
  reminders: true,
  milestoneAlerts: true,
  privateMode: false,
  weeklyReview: true,
};

export const storageKeys = [
  "addictions:v1",
  "weights:v1",
  "bmi:ft",
  "bmi:in",
  "bmi:w",
  "goal:weight",
  "recipes:basket",
  "mealplan:v1",
  "mind:moods:v1",
  "mind:journals:v1",
  "health:v1",
  "habits:v1",
  "settings:v1",
];
