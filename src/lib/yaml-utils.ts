import yaml from "js-yaml";
import type { GlazeConfig } from "@/types";

export function parseYaml(content: string): {
  config: GlazeConfig | null;
  error: string | null;
} {
  if (!content.trim()) {
    return { config: {}, error: null };
  }
  try {
    const parsed = yaml.load(content) as GlazeConfig;
    if (typeof parsed !== "object" || parsed === null) {
      return { config: null, error: "YAML must represent an object/map" };
    }
    return { config: parsed, error: null };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { config: null, error: msg };
  }
}

export function stringifyYaml(config: GlazeConfig): string {
  return yaml.dump(config, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const DEFAULT_CONFIG_YAML = `general:
  focus_follows_cursor: false
  toggle_workspace_on_refocus: true
  cursor_follows_focus: false
  show_floating_on_top: false
  center_new_floating_windows: true
  window_animations: "off"

gaps:
  inner_gap: 8
  outer_gap:
    top: 40
    right: 8
    bottom: 8
    left: 8

focus_borders:
  active:
    enabled: true
    color: "#6272f3"
    width: 2
  inactive:
    enabled: false
    color: "#343444"
    width: 1

bar:
  height: "30px"
  position: "top"
  opacity: 1.0
  background: "#0e0e12"
  foreground: "#e8e8f0"
  font_family: "JetBrains Mono"
  font_size: "12px"
  components_left:
    - type: "workspaces"
  components_center:
    - type: "window title"
  components_right:
    - type: "tiling direction"
      label_tiling: "[ ]"
      label_floating: "[~]"
    - type: "clock"
      time_formatting: "HH:mm  ddd d MMM"

workspaces:
  - name: "1"
  - name: "2"
  - name: "3"
  - name: "4"
  - name: "5"
  - name: "6"
  - name: "7"
  - name: "8"
  - name: "9"

window_rules:
  - command: "ignore"
    match_process_name: "Taskmgr"
  - command: "ignore"
    match_process_name: "ScreenClippingHost"

keybindings:
  - bindings: ["Alt+H"]
    command: "focus left"
  - bindings: ["Alt+J"]
    command: "focus down"
  - bindings: ["Alt+K"]
    command: "focus up"
  - bindings: ["Alt+L"]
    command: "focus right"
  - bindings: ["Alt+Shift+H"]
    command: "move left"
  - bindings: ["Alt+Shift+J"]
    command: "move down"
  - bindings: ["Alt+Shift+K"]
    command: "move up"
  - bindings: ["Alt+Shift+L"]
    command: "move right"
  - bindings: ["Alt+Q"]
    command: "close"
  - bindings: ["Alt+Space"]
    command: "toggle floating"
  - bindings: ["Alt+1"]
    command: "focus workspace 1"
  - bindings: ["Alt+2"]
    command: "focus workspace 2"
  - bindings: ["Alt+3"]
    command: "focus workspace 3"
  - bindings: ["Alt+Shift+E"]
    command: "quit"
`;
