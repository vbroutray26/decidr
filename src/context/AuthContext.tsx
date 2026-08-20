import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  clearCurrentProfileId,
  createProfile,
  deleteProfile,
  getCurrentProfileId,
  loadProfiles,
  setCurrentProfileId,
} from "../store/auth";
import type { UserProfile } from "../domain/types";

interface AuthState {
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  signIn: (id: string) => void;
  addProfile: (name: string, email?: string) => UserProfile;
  removeProfile: (id: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => loadProfiles());
  const [currentId, setCurrentId] = useState<string | null>(() => getCurrentProfileId());

  const value = useMemo<AuthState>(() => {
    const currentProfile = profiles.find((p) => p.id === currentId) ?? null;
    return {
      profiles,
      currentProfile,
      signIn: (id) => {
        setCurrentProfileId(id);
        setCurrentId(id);
      },
      addProfile: (name, email) => {
        const profile = createProfile(name, email);
        setProfiles((prev) => [...prev, profile]);
        setCurrentProfileId(profile.id);
        setCurrentId(profile.id);
        return profile;
      },
      removeProfile: (id) => {
        deleteProfile(id);
        setProfiles((prev) => prev.filter((p) => p.id !== id));
        if (currentId === id) setCurrentId(null);
      },
      signOut: () => {
        clearCurrentProfileId();
        setCurrentId(null);
      },
    };
  }, [profiles, currentId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
