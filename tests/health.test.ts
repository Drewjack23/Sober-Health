import { describe, expect, it } from 'vitest';
import { bmiCategory, calculateBmi, cmToFeetInches, feetInchesToCm, kgToPounds, poundsToKg, weightTrend } from '../utils/health';

describe('adult BMI screening', () => {
  it('calculates BMI using kilograms and meters', () => expect(calculateBmi(70, 175)).toBeCloseTo(22.86, 2));
  it('returns null for invalid inputs', () => expect(calculateBmi(0, 175)).toBeNull());
  it.each([[18.4, 'Underweight'], [18.5, 'Healthy weight'], [24.9, 'Healthy weight'], [25, 'Overweight'], [29.9, 'Overweight'], [30, 'Obesity']] as const)('categorizes %s as %s', (bmi, category) => expect(bmiCategory(bmi)).toBe(category));
});

describe('measurement conversions', () => {
  it('round trips pounds and kilograms', () => expect(kgToPounds(poundsToKg(180))).toBeCloseTo(180, 5));
  it('converts feet and inches to centimeters', () => expect(feetInchesToCm(5, 10)).toBeCloseTo(177.8, 1));
  it('converts centimeters to feet and inches', () => expect(cmToFeetInches(177.8)).toEqual({ feet: 5, inches: 10 }));
});

describe('weight trends', () => {
  it('sorts entries before finding the change', () => expect(weightTrend([{ id: '2', date: '2026-02-01', value: 79, unit: 'kg' }, { id: '1', date: '2026-01-01', value: 81, unit: 'kg' }])).toBe(-2));
  it('does not imply a trend from one entry', () => expect(weightTrend([{ id: '1', date: '2026-01-01', value: 81, unit: 'kg' }])).toBe(0));
});

