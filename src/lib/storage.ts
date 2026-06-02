import type { ConfigProfile, HistoryEntry } from "@/types";
import { generateId } from "./yaml-utils";

const STORAGE_KEYS = {
  profiles: "glaze-profiles",
  activeProfile: "glaze-active-profile",
  history: "glaze-history",
  currentYaml: "glaze-current-yaml",
  savedYaml: "glaze-saved-yaml",
};

const MAX_HISTORY = 50;

export function loadProfiles(): ConfigProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.profiles);
    if (!raw) return [];
    return JSON.parse(raw) as ConfigProfile[];
  } catch {
    return [];
  }
}

export function saveProfiles(profiles: ConfigProfile[]): void {
  localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify(profiles));
}

export function loadActiveProfileId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.activeProfile);
}

export function saveActiveProfileId(id: string | null): void {
  if (id) localStorage.setItem(STORAGE_KEYS.activeProfile, id);
  else localStorage.removeItem(STORAGE_KEYS.activeProfile);
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryEntry[]): void {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
}

export function addHistoryEntry(
  history: HistoryEntry[],
  yaml: string,
  label?: string
): HistoryEntry[] {
  const entry: HistoryEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    yamlContent: yaml,
    label,
  };
  const updated = [entry, ...history].slice(0, MAX_HISTORY);
  saveHistory(updated);
  return updated;
}

export function loadCurrentYaml(): string | null {
  return localStorage.getItem(STORAGE_KEYS.currentYaml);
}

export function persistCurrentYaml(yaml: string): void {
  localStorage.setItem(STORAGE_KEYS.currentYaml, yaml);
}

export function loadSavedYaml(): string | null {
  return localStorage.getItem(STORAGE_KEYS.savedYaml);
}

export function persistSavedYaml(yaml: string): void {
  localStorage.setItem(STORAGE_KEYS.savedYaml, yaml);
}

export function createProfile(
  name: string,
  description: string,
  yaml: string
): ConfigProfile {
  return {
    id: generateId(),
    name,
    description,
    yamlContent: yaml,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
