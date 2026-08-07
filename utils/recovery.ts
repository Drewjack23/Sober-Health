import type { RecoveryCheckin } from '@/types/models';
import { addDays, dateKey, dayDifference } from './date';

export function recoveryStats(startDate: string | undefined, checkins: RecoveryCheckin[], through = dateKey()) {
  if (!startDate) return { currentStreak: 0, longestStreak: 0, totalMet: 0, consistency: 0, successRate: 0 };
  const relevant = checkins.filter((item) => item.date >= startDate && item.date <= through);
  const byDate = new Map(relevant.map((item) => [item.date, item.status]));
  let current = 0;
  let longest = 0;
  let running = 0;
  const elapsed = dayDifference(startDate, through) + 1;
  for (let index = 0; index < elapsed; index += 1) {
    const status = byDate.get(addDays(startDate, index));
    if (status === 'lapse') running = 0;
    else {
      running += 1;
      longest = Math.max(longest, running);
    }
  }
  current = running;
  const totalMet = relevant.filter((item) => item.status === 'met' || item.status === 'difficult').length;
  const logged = relevant.length;
  return {
    currentStreak: current,
    longestStreak: longest,
    totalMet,
    consistency: elapsed ? (logged / elapsed) * 100 : 0,
    successRate: logged ? (totalMet / logged) * 100 : 0,
  };
}

