import type { SavedDecision } from "../domain/types";

function historyKey(profileId: string): string {
  return `decidr.history.v1.${profileId}`;
}

/** Saved decisions are scoped per local profile, so a few people sharing one
 * device each see only their own history. */
export function loadHistory(profileId: string): SavedDecision[] {
  try {
    const raw = localStorage.getItem(historyKey(profileId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedDecision[]) : [];
  } catch {
    return [];
  }
}

export function appendHistory(profileId: string, entry: SavedDecision): SavedDecision[] {
  const all = [entry, ...loadHistory(profileId)];
  localStorage.setItem(historyKey(profileId), JSON.stringify(all));
  return all;
}

export function newDecisionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `d_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}
