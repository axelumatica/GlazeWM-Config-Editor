import { ChevronDown, ChevronRight, Settings } from "lucide-react";
import { useState } from "react";
import type { GeneralConfig } from "@/types";

interface Props {
  config: GeneralConfig;
  onChange: (c: GeneralConfig) => void;
}

function Toggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="config-row">
      <div>
        <p className="text-sm text-gray-200">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${
          value ? "bg-glaze-600" : "bg-surface-5"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function CommandsInput({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const text = value.join(", ");
  return (
    <div className="py-2.5 border-b border-surface-4 last:border-0">
      <p className="text-sm text-gray-200 mb-0.5">{label}</p>
      {description && <p className="text-xs text-gray-500 mb-1.5">{description}</p>}
      <input
        type="text"
        value={text}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          )
        }
        placeholder="e.g. shell-exec zebar"
        className="input-field text-xs w-full font-mono"
      />
    </div>
  );
}

export function GeneralSection({ config, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const set = <K extends keyof GeneralConfig>(key: K, val: GeneralConfig[K]) =>
    onChange({ ...config, [key]: val });

  const cursorJump = config.cursor_jump ?? { enabled: true, trigger: "window_focus" };

  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface-3 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Settings size={15} className="text-glaze-400" />
          <span className="text-sm font-semibold text-gray-100">General</span>
        </div>
        {open ? (
          <ChevronDown size={14} className="text-gray-500" />
        ) : (
          <ChevronRight size={14} className="text-gray-500" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4">
          <CommandsInput
            label="Startup commands"
            description="Run when GlazeWM starts (comma-separated)"
            value={config.startup_commands ?? []}
            onChange={(v) => set("startup_commands", v)}
          />
          <CommandsInput
            label="Shutdown commands"
            description="Run just before GlazeWM exits"
            value={config.shutdown_commands ?? []}
            onChange={(v) => set("shutdown_commands", v)}
          />
          <CommandsInput
            label="Config reload commands"
            description="Run after config is reloaded"
            value={config.config_reload_commands ?? []}
            onChange={(v) => set("config_reload_commands", v)}
          />

          <div className="mt-1">
            <Toggle
              label="Focus follows cursor"
              description="Window focus follows the mouse cursor"
              value={config.focus_follows_cursor ?? true}
              onChange={(v) => set("focus_follows_cursor", v)}
            />
            <Toggle
              label="Toggle workspace on re-focus"
              description="Focusing an active workspace navigates back to previous"
              value={config.toggle_workspace_on_refocus ?? false}
              onChange={(v) => set("toggle_workspace_on_refocus", v)}
            />
            <Toggle
              label="Show all windows in taskbar"
              description="Show windows from all workspaces in the Windows taskbar"
              value={config.show_all_in_taskbar ?? false}
              onChange={(v) => set("show_all_in_taskbar", v)}
            />
          </div>

          <div className="border-t border-surface-4 mt-1 pt-3">
            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Cursor jump</p>
            <Toggle
              label="Enable cursor jump"
              description="Auto-move cursor when focus changes"
              value={cursorJump.enabled ?? true}
              onChange={(v) => set("cursor_jump", { ...cursorJump, enabled: v })}
            />
            {cursorJump.enabled && (
              <div className="config-row mt-1">
                <div>
                  <p className="text-sm text-gray-200">Trigger</p>
                  <p className="text-xs text-gray-500 mt-0.5">When to jump the cursor</p>
                </div>
                <select
                  value={cursorJump.trigger ?? "window_focus"}
                  onChange={(e) =>
                    set("cursor_jump", {
                      ...cursorJump,
                      trigger: e.target.value as "monitor_focus" | "window_focus",
                    })
                  }
                  className="input-field text-xs w-36"
                >
                  <option value="window_focus">Window focus</option>
                  <option value="monitor_focus">Monitor focus</option>
                </select>
              </div>
            )}
          </div>

          <div className="border-t border-surface-4 mt-1 pt-3 space-y-0">
            <div className="config-row">
              <div>
                <p className="text-sm text-gray-200">Hide method</p>
                <p className="text-xs text-gray-500 mt-0.5">How windows are hidden when switching workspaces</p>
              </div>
              <select
                value={config.hide_method ?? "cloak"}
                onChange={(e) =>
                  set("hide_method", e.target.value as "cloak" | "hide")
                }
                className="input-field text-xs w-24"
              >
                <option value="cloak">Cloak</option>
                <option value="hide">Hide</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
