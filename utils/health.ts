import type { WeightEntry } from '@/types/models';

export const poundsToKg = (pounds: number) => pounds * 0.45359237;
export const kgToPounds = (kg: number) => kg / 0.45359237;
export const feetInchesToCm = (feet: number, inches: number) => (feet * 12 + inches) * 2.54;
export const cmToFeetInches = (cm: number) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  return { feet, inches: Math.round(totalInches - feet * 12) };
};

export const calculateBmi = (weightKg: number, heightCm: number) => {
  if (weightKg <= 0 || heightCm <= 0) return null;
  const meters = heightCm / 100;
  return weightKg / (meters * meters);
};

export const bmiCategory = (bmi: number | null) => {
  if (bmi === null) return 'Not available';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Healthy weight';
  if (bmi < 30) return 'Overweight';
  return 'Obesity';
};

export const weightTrend = (entries: WeightEntry[]) => {
  if (entries.length < 2) return 0;
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  return (sorted.at(-1)?.value ?? 0) - (sorted[0]?.value ?? 0);
};

