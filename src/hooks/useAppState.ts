import { useReducer, useCallback, useEffect } from "react";
import type { AppState, GlazeConfig, ConfigProfile, HistoryEntry } from "@/types";
import { parseYaml, generateId, DEFAULT_CONFIG_YAML } from "@/lib/yaml-utils";
import {
  loadProfiles,
  saveProfiles,
  loadActiveProfileId,
  saveActiveProfileId,
  loadHistory,
  addHistoryEntry,
  loadCurrentYaml,
  persistCurrentYaml,
  loadSavedYaml,
  persistSavedYaml,
  createProfile,
} from "@/lib/storage";

type Action =
  | { type: "SET_YAML"; yaml: string }
  | { type: "SET_PARSED"; config: GlazeConfig | null; error: string | null }
  | { type: "MARK_SAVED"; yaml: string }
  | { type: "SET_PROFILES"; profiles: ConfigProfile[] }
  | { type: "SET_ACTIVE_PROFILE"; id: string | null }
  | { type: "ADD_HISTORY"; entry: HistoryEntry }
  | { type: "SET_GLAZE_STATUS"; status: "running" | "stopped" | "unknown" }
  | { type: "SET_IPC_CONNECTED"; connected: boolean }
  | { type: "TOGGLE_YAML_EDITOR" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "PUSH_UNDO"; yaml: string }
  | { type: "SET_HISTORY"; history: HistoryEntry[] };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_YAML": {
      const { config, error } = parseYaml(action.yaml);
      return {
        ...state,
        currentYaml: action.yaml,
        parsedConfig: config,
        parseError: error,
        isDirty: action.yaml !== state.savedYaml,
      };
    }
    case "SET_PARSED":
      return { ...state, parsedConfig: action.config, parseError: action.error };
    case "MARK_SAVED":
      return {
        ...state,
        savedYaml: action.yaml,
        currentYaml: action.yaml,
        isDirty: false,
      };
    case "SET_PROFILES":
      return { ...state, profiles: action.profiles };
    case "SET_ACTIVE_PROFILE":
      return { ...state, activeProfileId: action.id };
    case "ADD_HISTORY":
      return { ...state, history: [action.entry, ...state.history].slice(0, 50) };
    case "SET_HISTORY":
      return { ...state, history: action.history };
    case "SET_GLAZE_STATUS":
      return { ...state, glazeWmStatus: action.status };
    case "SET_IPC_CONNECTED":
      return { ...state, ipcConnected: action.connected };
    case "TOGGLE_YAML_EDITOR":
      return { ...state, showYamlEditor: !state.showYamlEditor };
    case "PUSH_UNDO":
      return {
        ...state,
        undoStack: [...state.undoStack, action.yaml].slice(-100),
        redoStack: [],
      };
    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const prev = state.undoStack[state.undoStack.length - 1];
      const { config, error } = parseYaml(prev);
      return {
        ...state,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, state.currentYaml],
        currentYaml: prev,
        parsedConfig: config,
        parseError: error,
        isDirty: prev !== state.savedYaml,
      };
    }
    case "REDO": {
      if (state.redoStack.length === 0) return state;
      const next = state.redoStack[state.redoStack.length - 1];
      const { config, error } = parseYaml(next);
      return {
        ...state,
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack, state.currentYaml],
        currentYaml: next,
        parsedConfig: config,
        parseError: error,
        isDirty: next !== state.savedYaml,
      };
    }
    default:
      return state;
  }
}

function buildInitialState(): AppState {
  const savedYaml = loadSavedYaml() ?? DEFAULT_CONFIG_YAML;
  const currentYaml = loadCurrentYaml() ?? savedYaml;
  const { config, error } = parseYaml(currentYaml);
  const profiles = loadProfiles();
  const activeProfileId = loadActiveProfileId();
  const history = loadHistory();

  return {
    currentYaml,
    savedYaml,
    parsedConfig: config,
    parseError: error,
    profiles,
    activeProfileId,
    history,
    glazeWmStatus: "unknown",
    ipcConnected: false,
    undoStack: [],
    redoStack: [],
    showYamlEditor: false,
    isDirty: currentYaml !== savedYaml,
  };
}

export function useAppState() {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  useEffect(() => {
    persistCurrentYaml(state.currentYaml);
  }, [state.currentYaml]);

  const setYaml = useCallback(
    (yaml: string) => {
      dispatch({ type: "PUSH_UNDO", yaml: state.currentYaml });
      dispatch({ type: "SET_YAML", yaml });
    },
    [state.currentYaml]
  );

  const saveConfig = useCallback(
    (label?: string) => {
      const updated = addHistoryEntry(state.history, state.currentYaml, label);
      dispatch({ type: "SET_HISTORY", history: updated });
      dispatch({ type: "MARK_SAVED", yaml: state.currentYaml });
      persistSavedYaml(state.currentYaml);
      return updated[0];
    },
    [state.currentYaml, state.history]
  );

  const undo = useCallback(() => dispatch({ type: "UNDO" }), []);
  const redo = useCallback(() => dispatch({ type: "REDO" }), []);
  const toggleYamlEditor = useCallback(
    () => dispatch({ type: "TOGGLE_YAML_EDITOR" }),
    []
  );

  const setGlazeStatus = useCallback(
    (status: "running" | "stopped" | "unknown") =>
      dispatch({ type: "SET_GLAZE_STATUS", status }),
    []
  );

  const createNewProfile = useCallback(
    (name: string, description: string) => {
      const profile = createProfile(name, description, state.currentYaml);
      const updated = [...state.profiles, profile];
      saveProfiles(updated);
      saveActiveProfileId(profile.id);
      dispatch({ type: "SET_PROFILES", profiles: updated });
      dispatch({ type: "SET_ACTIVE_PROFILE", id: profile.id });
      return profile;
    },
    [state.currentYaml, state.profiles]
  );

  const switchProfile = useCallback(
    (profileId: string) => {
      const profile = state.profiles.find((p) => p.id === profileId);
      if (!profile) return;
      saveActiveProfileId(profileId);
      dispatch({ type: "SET_ACTIVE_PROFILE", id: profileId });
      dispatch({ type: "PUSH_UNDO", yaml: state.currentYaml });
      dispatch({ type: "SET_YAML", yaml: profile.yamlContent });
    },
    [state.profiles, state.currentYaml]
  );

  const deleteProfile = useCallback(
    (profileId: string) => {
      const updated = state.profiles.filter((p) => p.id !== profileId);
      saveProfiles(updated);
      dispatch({ type: "SET_PROFILES", profiles: updated });
      if (state.activeProfileId === profileId) {
        saveActiveProfileId(null);
        dispatch({ type: "SET_ACTIVE_PROFILE", id: null });
      }
    },
    [state.profiles, state.activeProfileId]
  );

  const updateProfileYaml = useCallback(
    (profileId: string) => {
      const updated = state.profiles.map((p) =>
        p.id === profileId
          ? { ...p, yamlContent: state.currentYaml, updatedAt: new Date().toISOString() }
          : p
      );
      saveProfiles(updated);
      dispatch({ type: "SET_PROFILES", profiles: updated });
    },
    [state.profiles, state.currentYaml]
  );

  const restoreHistory = useCallback(
    (entry: HistoryEntry) => {
      dispatch({ type: "PUSH_UNDO", yaml: state.currentYaml });
      dispatch({ type: "SET_YAML", yaml: entry.yamlContent });
    },
    [state.currentYaml]
  );

  return {
    state,
    setYaml,
    saveConfig,
    undo,
    redo,
    toggleYamlEditor,
    setGlazeStatus,
    createNewProfile,
    switchProfile,
    deleteProfile,
    updateProfileYaml,
    restoreHistory,
    canUndo: state.undoStack.length > 0,
    canRedo: state.redoStack.length > 0,
  };
}
