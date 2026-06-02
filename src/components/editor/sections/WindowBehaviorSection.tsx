import { ChevronDown, ChevronRight, AppWindow } from "lucide-react";
import { useState } from "react";
import type { WindowBehaviorConfig } from "@/types";

interface Props {
  config: WindowBehaviorConfig;
  onChange: (c: WindowBehaviorConfig) => void;
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
    <div className="flex items-center justify-between py-2">
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

export function WindowBehaviorSection({ config, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const floating = config.state_defaults?.floating ?? { centered: true, shown_on_top: true };
  const fullscreen = config.state_defaults?.fullscreen ?? { maximized: false, shown_on_top: false };

  const setFloating = (key: keyof typeof floating, val: boolean) =>
    onChange({
      ...config,
      state_defaults: {
        ...config.state_defaults,
        floating: { ...floating, [key]: val },
      },
    });

  const setFullscreen = (key: keyof typeof fullscreen, val: boolean) =>
    onChange({
      ...config,
      state_defaults: {
        ...config.state_defaults,
        fullscreen: { ...fullscreen, [key]: val },
      },
    });

  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface-3 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <AppWindow size={15} className="text-glaze-400" />
          <span className="text-sm font-semibold text-gray-100">Window Behavior</span>
        </div>
        {open ? (
          <ChevronDown size={14} className="text-gray-500" />
        ) : (
          <ChevronRight size={14} className="text-gray-500" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4">
          <div className="config-row border-b border-surface-4 pb-3 mb-3">
            <div>
              <p className="text-sm text-gray-200">Initial state</p>
              <p className="text-xs text-gray-500 mt-0.5">New windows are created in this state</p>
            </div>
            <select
              value={config.initial_state ?? "tiling"}
              onChange={(e) =>
                onChange({ ...config, initial_state: e.target.value as "tiling" | "floating" })
              }
              className="input-field text-xs w-28"
            >
              <option value="tiling">Tiling</option>
              <option value="floating">Floating</option>
            </select>
          </div>

          <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">Floating defaults</p>
          <Toggle
            label="Center floating windows"
            description="New floating windows appear centered on screen"
            value={floating.centered ?? true}
            onChange={(v) => setFloating("centered", v)}
          />
          <Toggle
            label="Show floating on top"
            description="Floating windows always render above tiled ones"
            value={floating.shown_on_top ?? true}
            onChange={(v) => setFloating("shown_on_top", v)}
          />

          <p className="text-xs text-gray-500 mb-2 mt-3 font-medium uppercase tracking-wide">Fullscreen defaults</p>
          <Toggle
            label="Maximize if possible"
            description="Use native maximize instead of fullscreen when available"
            value={fullscreen.maximized ?? false}
            onChange={(v) => setFullscreen("maximized", v)}
          />
          <Toggle
            label="Show fullscreen on top"
            description="Fullscreen windows render above everything"
            value={fullscreen.shown_on_top ?? false}
            onChange={(v) => setFullscreen("shown_on_top", v)}
          />
        </div>
      )}
    </div>
  );
}
