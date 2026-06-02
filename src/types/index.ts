export interface GlazeConfig {
  general?: GeneralConfig;
  gaps?: GapsConfig;
  window_effects?: WindowEffectsConfig;
  window_behavior?: WindowBehaviorConfig;
  workspaces?: WorkspaceConfig[];
  window_rules?: WindowRule[];
  binding_modes?: BindingMode[];
  keybindings?: Keybinding[];
}

export interface GeneralConfig {
  startup_commands?: string[];
  shutdown_commands?: string[];
  config_reload_commands?: string[];
  focus_follows_cursor?: boolean;
  toggle_workspace_on_refocus?: boolean;
  cursor_jump?: CursorJumpConfig;
  hide_method?: "cloak" | "hide";
  show_all_in_taskbar?: boolean;
}

export interface CursorJumpConfig {
  enabled?: boolean;
  trigger?: "monitor_focus" | "window_focus";
}

export interface GapsConfig {
  scale_with_dpi?: boolean;
  inner_gap?: string | number;
  outer_gap?: OuterGap | string | number;
}

export interface OuterGap {
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
}

export interface WindowEffectsConfig {
  focused_window?: WindowEffectSet;
  other_windows?: WindowEffectSet;
}

export interface WindowEffectSet {
  border?: BorderEffect;
  hide_title_bar?: { enabled?: boolean };
  corner_style?: CornerStyleEffect;
  transparency?: TransparencyEffect;
}

export interface BorderEffect {
  enabled?: boolean;
  color?: string;
  width?: string;
}

export interface CornerStyleEffect {
  enabled?: boolean;
  style?: "square" | "rounded" | "small_rounded";
}

export interface TransparencyEffect {
  enabled?: boolean;
  opacity?: string;
}

export interface WindowBehaviorConfig {
  initial_state?: "tiling" | "floating";
  state_defaults?: StateDefaults;
}

export interface StateDefaults {
  floating?: {
    centered?: boolean;
    shown_on_top?: boolean;
  };
  fullscreen?: {
    maximized?: boolean;
    shown_on_top?: boolean;
  };
}

export interface WorkspaceConfig {
  name: string;
  display_name?: string;
  keep_alive?: boolean;
  bind_to_monitor?: number;
}

export interface MatchCondition {
  window_process?: { equals?: string; regex?: string; not_regex?: string };
  window_class?: { equals?: string; regex?: string; not_regex?: string };
  window_title?: { equals?: string; regex?: string; not_regex?: string };
}

export interface WindowRule {
  commands: string[];
  match?: MatchCondition[];
}

export interface BindingMode {
  name: string;
  keybindings?: Keybinding[];
}

export interface Keybinding {
  bindings: string[];
  commands: string[];
}

export interface ConfigProfile {
  id: string;
  name: string;
  description?: string;
  yamlContent: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  yamlContent: string;
  label?: string;
}

export interface AppState {
  currentYaml: string;
  savedYaml: string;
  parsedConfig: GlazeConfig | null;
  parseError: string | null;
  profiles: ConfigProfile[];
  activeProfileId: string | null;
  history: HistoryEntry[];
  glazeWmStatus: "running" | "stopped" | "unknown";
  ipcConnected: boolean;
  undoStack: string[];
  redoStack: string[];
  showYamlEditor: boolean;
  isDirty: boolean;
}

export type Toast = {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
};
