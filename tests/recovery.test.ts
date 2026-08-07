import { describe, expect, it } from 'vitest';
import type { RecoveryCheckin } from '../types/models';
import { recoveryStats } from '../utils/recovery';

const entry = (date: string, status: RecoveryCheckin['status']): RecoveryCheckin => ({ id: date, date, status, mood: 3, craving: 1, triggers: [], strategies: [] });

describe('recovery streak calculations', () => {
  it('keeps difficult days in a streak', () => { const stats = recoveryStats('2026-01-01', [entry('2026-01-01', 'met'), entry('2026-01-02', 'difficult')], '2026-01-03'); expect(stats.currentStreak).toBe(3); expect(stats.totalMet).toBe(2); });
  it('resets current streak after a lapse without deleting historical progress', () => { const stats = recoveryStats('2026-01-01', [entry('2026-01-02', 'met'), entry('2026-01-03', 'lapse'), entry('2026-01-05', 'met')], '2026-01-06'); expect(stats.currentStreak).toBe(3); expect(stats.longestStreak).toBe(3); expect(stats.totalMet).toBe(2); });
  it('calculates check-in consistency from elapsed days', () => { const stats = recoveryStats('2026-01-01', [entry('2026-01-01', 'met'), entry('2026-01-03', 'met')], '2026-01-04'); expect(stats.consistency).toBe(50); expect(stats.successRate).toBe(100); });
});

