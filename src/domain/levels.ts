/** Level titles derived from cumulative points — purely for motivation, not
 * a claim about the quality of anyone's decisions. */
const LEVELS = [
  { min: 0, title: "New Decider" },
  { min: 50, title: "Clear Thinker" },
  { min: 150, title: "Sharp Reasoner" },
  { min: 350, title: "Strategic Mind" },
  { min: 700, title: "Master of Models" },
  { min: 1500, title: "Decision Sage" },
] as const;

export interface LevelInfo {
  title: string;
  min: number;
  next: { title: string; min: number } | null;
  pointsToNext: number | null;
}

export function levelFor(points: number): LevelInfo {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].min) index = i;
  }
  const current = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  return {
    title: current.title,
    min: current.min,
    next: next ? { title: next.title, min: next.min } : null,
    pointsToNext: next ? next.min - points : null,
  };
}
