import type { PointsBreakdown, UserStats } from "../domain/types";

const DEFAULT_STATS: UserStats = { totalPoints: 0, decisionsCount: 0, currentStreak: 0, longestStreak: 0, lastSavedDate: null };

function statsKey(profileId: string): string {
  return `decidr.stats.v1.${profileId}`;
}

export function loadStats(profileId: string): UserStats {
  try {
    const raw = localStorage.getItem(statsKey(profileId));
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

function saveStats(profileId: string, stats: UserStats) {
  localStorage.setItem(statsKey(profileId), JSON.stringify(stats));
}

function dateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function todayStr(): string {
  return dateStr(new Date());
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateStr(d);
}

/**
 * Points for completing a decision (§13 "activation"/"trust signal" made
 * tangible): a flat base for finishing the flow, a bonus for engaging with
 * the bias-flag checklist, a bonus for actually adjusting a model's numbers
 * rather than accepting the defaults, and a streak bonus for coming back on
 * consecutive days.
 */
export function recordDecision(
  profileId: string,
  input: { biasesChecked: number; engagedWithVisuals: boolean },
): { stats: UserStats; earned: PointsBreakdown } {
  const prev = loadStats(profileId);
  const today = todayStr();

  let streak: number;
  if (prev.lastSavedDate === today) {
    streak = Math.max(prev.currentStreak, 1);
  } else if (prev.lastSavedDate === yesterdayStr()) {
    streak = prev.currentStreak + 1;
  } else {
    streak = 1;
  }

  const base = 20;
  const biasBonus = Math.min(input.biasesChecked, 3) * 5;
  const engagementBonus = input.engagedWithVisuals ? 10 : 0;
  const streakBonus = streak > 1 ? 10 : 0;
  const total = base + biasBonus + engagementBonus + streakBonus;

  const stats: UserStats = {
    totalPoints: prev.totalPoints + total,
    decisionsCount: prev.decisionsCount + 1,
    currentStreak: streak,
    longestStreak: Math.max(prev.longestStreak, streak),
    lastSavedDate: today,
  };
  saveStats(profileId, stats);

  return { stats, earned: { base, biasBonus, engagementBonus, streakBonus, total } };
}
