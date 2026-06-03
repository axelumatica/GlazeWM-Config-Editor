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
    quotingType: "'",
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
  startup_commands: ['shell-exec zebar']
  shutdown_commands: []
  config_reload_commands: []
  focus_follows_cursor: true
  toggle_workspace_on_refocus: false
  cursor_jump:
    enabled: true
    trigger: 'window_focus'
  hide_method: 'cloak'
  show_all_in_taskbar: false

gaps:
  scale_with_dpi: true
  inner_gap: '7px'
  outer_gap:
    top: '8px'
    right: '8px'
    bottom: '8px'
    left: '8px'

window_effects:
  focused_window:
    border:
      enabled: true
      color: '#447aba'
      width: '2px'
    hide_title_bar:
      enabled: false
    corner_style:
      enabled: true
      style: 'square'
    transparency:
      enabled: false
      opacity: '95%'
  other_windows:
    border:
      enabled: true
      color: '#3c3c3c'
    hide_title_bar:
      enabled: false
    corner_style:
      enabled: false
      style: 'rounded'
    transparency:
      enabled: false
      opacity: '100%'

window_behavior:
  initial_state: 'tiling'
  state_defaults:
    floating:
      centered: true
      shown_on_top: true
    fullscreen:
      maximized: false
      shown_on_top: false

workspaces:
  - name: '1'
  - name: '2'
  - name: '3'
  - name: '4'
  - name: '5'
  - name: '6'
  - name: '7'
  - name: '8'
  - name: '9'

window_rules:
  - commands: ['ignore']
    match:
      - window_process: { equals: 'Taskmgr' }
  - commands: ['ignore']
    match:
      - window_title: { regex: '[Pp]icture.in.[Pp]icture' }
        window_class: { regex: 'Chrome_WidgetWin_1|MozillaDialogClass' }

binding_modes:
  - name: 'resize'
    keybindings:
      - commands: ['resize --width -2%']
        bindings: ['h', 'left']
      - commands: ['resize --width +2%']
        bindings: ['l', 'right']
      - commands: ['resize --height +2%']
        bindings: ['k', 'up']
      - commands: ['resize --height -2%']
        bindings: ['j', 'down']
      - commands: ['wm-disable-binding-mode --name resize']
        bindings: ['escape', 'enter']

keybindings:
  # Focus
  - commands: ['focus --direction left']
    bindings: ['alt+h', 'alt+left']
  - commands: ['focus --direction right']
    bindings: ['alt+l', 'alt+right']
  - commands: ['focus --direction up']
    bindings: ['alt+k', 'alt+up']
  - commands: ['focus --direction down']
    bindings: ['alt+j', 'alt+down']

  # Move
  - commands: ['move --direction left']
    bindings: ['alt+shift+h', 'alt+shift+left']
  - commands: ['move --direction right']
    bindings: ['alt+shift+l', 'alt+shift+right']
  - commands: ['move --direction up']
    bindings: ['alt+shift+k', 'alt+shift+up']
  - commands: ['move --direction down']
    bindings: ['alt+shift+j', 'alt+shift+down']

  # Resize
  - commands: ['resize --width -2%']
    bindings: ['alt+u']
  - commands: ['resize --width +2%']
    bindings: ['alt+p']
  - commands: ['resize --height +2%']
    bindings: ['alt+o']
  - commands: ['resize --height -2%']
    bindings: ['alt+i']
  - commands: ['wm-enable-binding-mode --name resize']
    bindings: ['alt+r']

  # Window state
  - commands: ['toggle-floating --centered']
    bindings: ['alt+shift+space']
  - commands: ['wm-cycle-focus']
    bindings: ['alt+space']
  - commands: ['toggle-tiling']
    bindings: ['alt+t']
  - commands: ['toggle-fullscreen']
    bindings: ['alt+f']
  - commands: ['toggle-minimized']
    bindings: ['alt+m']
  - commands: ['toggle-tiling-direction']
    bindings: ['alt+v']

  # WM actions
  - commands: ['close']
    bindings: ['alt+q']
  - commands: ['wm-exit']
    bindings: ['alt+shift+e']
  - commands: ['wm-reload-config']
    bindings: ['alt+shift+r']
  - commands: ['wm-redraw']
    bindings: ['alt+shift+w']
  - commands: ['wm-toggle-pause']
    bindings: ['alt+shift+p']

  # Launch apps
  - commands: ['shell-exec wt']
    bindings: ['alt+enter']

  # Workspace focus
  - commands: ['focus --next-active-workspace']
    bindings: ['alt+shift+s']
  - commands: ['focus --prev-active-workspace']
    bindings: ['alt+a']
  - commands: ['focus --recent-workspace']
    bindings: ['alt+d']
  - commands: ['focus --workspace 1']
    bindings: ['alt+1']
  - commands: ['focus --workspace 2']
    bindings: ['alt+2']
  - commands: ['focus --workspace 3']
    bindings: ['alt+3']
  - commands: ['focus --workspace 4']
    bindings: ['alt+4']
  - commands: ['focus --workspace 5']
    bindings: ['alt+5']
  - commands: ['focus --workspace 6']
    bindings: ['alt+6']
  - commands: ['focus --workspace 7']
    bindings: ['alt+7']
  - commands: ['focus --workspace 8']
    bindings: ['alt+8']
  - commands: ['focus --workspace 9']
    bindings: ['alt+9']

  # Move workspace to monitor
  - commands: ['move-workspace --direction left']
    bindings: ['alt+shift+a']
  - commands: ['move-workspace --direction right']
    bindings: ['alt+shift+f']
  - commands: ['move-workspace --direction up']
    bindings: ['alt+shift+d']

  # Move window to workspace
  - commands: ['move --workspace 1', 'focus --workspace 1']
    bindings: ['alt+shift+1']
  - commands: ['move --workspace 2', 'focus --workspace 2']
    bindings: ['alt+shift+2']
  - commands: ['move --workspace 3', 'focus --workspace 3']
    bindings: ['alt+shift+3']
  - commands: ['move --workspace 4', 'focus --workspace 4']
    bindings: ['alt+shift+4']
  - commands: ['move --workspace 5', 'focus --workspace 5']
    bindings: ['alt+shift+5']
  - commands: ['move --workspace 6', 'focus --workspace 6']
    bindings: ['alt+shift+6']
  - commands: ['move --workspace 7', 'focus --workspace 7']
    bindings: ['alt+shift+7']
  - commands: ['move --workspace 8', 'focus --workspace 8']
    bindings: ['alt+shift+8']
  - commands: ['move --workspace 9', 'focus --workspace 9']
    bindings: ['alt+shift+9']
`;
