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
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
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

export function GeneralSection({ config, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const set = (key: keyof GeneralConfig, val: boolean | string) =>
    onChange({ ...config, [key]: val });

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
          <Toggle
            label="Focus follows cursor"
            description="Window focus follows the mouse cursor"
            value={config.focus_follows_cursor ?? false}
            onChange={(v) => set("focus_follows_cursor", v)}
          />
          <Toggle
            label="Cursor follows focus"
            description="Mouse cursor moves to the focused window"
            value={config.cursor_follows_focus ?? false}
            onChange={(v) => set("cursor_follows_focus", v)}
          />
          <Toggle
            label="Toggle workspace on re-focus"
            description="Focusing an already-active workspace navigates back"
            value={config.toggle_workspace_on_refocus ?? true}
            onChange={(v) => set("toggle_workspace_on_refocus", v)}
          />
          <Toggle
            label="Show floating windows on top"
            description="Floating windows always render above tiled ones"
            value={config.show_floating_on_top ?? false}
            onChange={(v) => set("show_floating_on_top", v)}
          />
          <Toggle
            label="Center new floating windows"
            description="New floating windows appear centered on screen"
            value={config.center_new_floating_windows ?? true}
            onChange={(v) => set("center_new_floating_windows", v)}
          />
          <div className="config-row">
            <div>
              <p className="text-sm text-gray-200">Window animations</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Enable or disable window transition animations
              </p>
            </div>
            <select
              value={config.window_animations ?? "off"}
              onChange={(e) => set("window_animations", e.target.value)}
              className="input-field text-xs w-24"
            >
              <option value="off">Off</option>
              <option value="true">On</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
