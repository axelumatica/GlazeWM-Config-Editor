export interface GlazeConfig {
  general?: GeneralConfig;
  gaps?: GapsConfig;
  focus_borders?: FocusBordersConfig;
  bar?: BarConfig;
  workspaces?: WorkspaceConfig[];
  window_rules?: WindowRule[];
  binding_modes?: BindingMode[];
  keybindings?: Keybinding[];
}

export interface GeneralConfig {
  focus_follows_cursor?: boolean;
  toggle_workspace_on_refocus?: boolean;
  cursor_follows_focus?: boolean;
  show_floating_on_top?: boolean;
  center_new_floating_windows?: boolean;
  window_animations?: "off" | "true" | string;
}

export interface GapsConfig {
  inner_gap?: number | string;
  outer_gap?: OuterGap | number | string;
}

export interface OuterGap {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
}

export interface FocusBordersConfig {
  active?: BorderConfig;
  inactive?: BorderConfig;
}

export interface BorderConfig {
  enabled?: boolean;
  color?: string;
  width?: number;
}

export interface BarConfig {
  height?: string | number;
  position?: "top" | "bottom";
  opacity?: number;
  background?: string;
  foreground?: string;
  font_family?: string;
  font_size?: string;
  padding?: string;
  offset_x?: string;
  offset_y?: string;
  border_radius?: string;
  components_left?: BarComponent[];
  components_center?: BarComponent[];
  components_right?: BarComponent[];
}

export interface BarComponent {
  type: string;
  template?: string;
  label_pinned?: string;
  label_not_pinned?: string;
  foreground?: string;
  background?: string;
  margin?: string;
  padding?: string;
  [key: string]: unknown;
}

export interface WorkspaceConfig {
  name: string;
  display_name?: string;
  keep_alive?: boolean;
  bind_to_monitor?: number;
}

export interface WindowRule {
  command: string;
  match_process_name?: string;
  match_class_name?: string;
  match_title?: string;
}

export interface BindingMode {
  name: string;
  keybindings?: Keybinding[];
}

export interface Keybinding {
  bindings: string[];
  command?: string;
  commands?: string[];
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
