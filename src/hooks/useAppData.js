import { useEffect } from "react";
import { defaultHabits, defaultHealth, defaultSettings } from "../data/defaults";
import { getBmi, getBMICategory } from "../utils/health";
import { useLocalStorage } from "./useLocalStorage";

export function useAppData() {
  const [settings, setSettings] = useLocalStorage("settings:v1", defaultSettings);
  const [legacyTheme] = useLocalStorage("ui:theme", "system");
  const [trackers, setTrackers] = useLocalStorage("addictions:v1", []);
  const [weights, setWeights] = useLocalStorage("weights:v1", []);
  const [heightFt, setHeightFt] = useLocalStorage("bmi:ft", 5);
  const [heightIn, setHeightIn] = useLocalStorage("bmi:in", 10);
  const [weight, setWeight] = useLocalStorage("bmi:w", 180);
  const [weightGoal, setWeightGoal] = useLocalStorage("goal:weight", 0);
  const [moods, setMoods] = useLocalStorage("mind:moods:v1", []);
  const [journals, setJournals] = useLocalStorage("mind:journals:v1", []);
  const [health, setHealth] = useLocalStorage("health:v1", defaultHealth);
  const [habits, setHabits] = useLocalStorage("habits:v1", defaultHabits);

  useEffect(() => {
    if (!localStorage.getItem("settings:v1") && legacyTheme) {
      setSettings((next) => ({ ...next, theme: legacyTheme }));
    }
  }, [legacyTheme, setSettings]);

  useEffect(() => {
    const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const dark = settings.theme === "dark" || (settings.theme === "system" && systemDark);
    document.documentElement.classList.toggle("dark", dark);
  }, [settings.theme]);

  const bmi = getBmi({ heightFt, heightIn, weight });

  return {
    settings,
    setSettings,
    trackers,
    setTrackers,
    weights,
    setWeights,
    heightFt,
    setHeightFt,
    heightIn,
    setHeightIn,
    weight,
    setWeight,
    weightGoal,
    setWeightGoal,
    moods,
    setMoods,
    journals,
    setJournals,
    health,
    setHealth,
    habits,
    setHabits,
    bmi,
    bmiCategory: getBMICategory(bmi),
  };
}
