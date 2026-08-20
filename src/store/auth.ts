import type { UserProfile } from "../domain/types";

const PROFILES_KEY = "decidr.profiles.v1";
const CURRENT_KEY = "decidr.currentProfile.v1";

export function loadProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UserProfile[]) : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles: UserProfile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

function newProfileId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `p_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function createProfile(name: string, email?: string): UserProfile {
  const profile: UserProfile = {
    id: newProfileId(),
    name: name.trim(),
    email: email?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };
  saveProfiles([...loadProfiles(), profile]);
  return profile;
}

export function deleteProfile(id: string) {
  saveProfiles(loadProfiles().filter((p) => p.id !== id));
  if (getCurrentProfileId() === id) clearCurrentProfileId();
}

export function getCurrentProfileId(): string | null {
  return localStorage.getItem(CURRENT_KEY);
}

export function setCurrentProfileId(id: string) {
  localStorage.setItem(CURRENT_KEY, id);
}

export function clearCurrentProfileId() {
  localStorage.removeItem(CURRENT_KEY);
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
