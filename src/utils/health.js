import { daysBetween, today } from "./date";

export const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `id-${Math.random().toString(36).slice(2)}`;
}

export function getBMICategory(bmi) {
  if (!bmi) return "";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "In range";
  if (bmi < 30) return "Elevated";
  return "High";
}

export function getBmi({ heightFt, heightIn, weight }) {
  const inches = Number(heightFt) * 12 + Number(heightIn);
  return inches > 0 ? (Number(weight) * 703) / (inches * inches) : 0;
}

export function getBestStreak(trackers) {
  return trackers.reduce((best, item) => Math.max(best, daysBetween(item.resetAt)), 0);
}

export function getHabitCompletion(habits, date = today()) {
  const completed = habits.filter((habit) => habit.completions?.[date]).length;
  return {
    completed,
    total: habits.length,
    percent: habits.length ? clamp((completed / habits.length) * 100) : 0,
  };
}

export function getTodayScore({ health, habits, moods }) {
  const latestMood = moods.at(-1)?.mood ?? 0;
  const habitScore = getHabitCompletion(habits).percent / 100;
  const waterScore = health.water / Math.max(health.waterGoal, 1);
  const sleepScore = health.sleep / 8;
  const moodScore = latestMood / 10;
  return clamp(Math.round((waterScore + sleepScore + habitScore + moodScore) * 25));
}

export function getDailyBrief({ trackers, health, habits, moods, journals }) {
  const bestStreak = getBestStreak(trackers);
  const latestMood = moods.at(-1);
  const habit = getHabitCompletion(habits);

  if (!trackers.length && !moods.length && !journals.length) {
    return "Begin with one clear entry today. A streak, a mood check-in, or a single habit is enough to make the system useful.";
  }

  if (latestMood?.anxiety >= 7 || health.stress >= 7) {
    return "Your stress signal is high. Keep the plan narrow: hydration, one completed habit, and a short private reflection.";
  }

  if (habit.percent >= 75 && bestStreak >= 7) {
    return "Your routines are carrying momentum. Keep the day simple and protect the habits that are already working.";
  }

  if (bestStreak > 0) {
    return `Your strongest active streak is ${bestStreak} days. The next healthy decision matters more than a perfect day.`;
  }

  return "Choose one visible win for today. Small, repeatable actions build trust with yourself.";
}
