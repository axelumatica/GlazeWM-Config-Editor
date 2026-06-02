import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";
import type { WindowEffectsConfig, WindowEffectSet } from "@/types";

interface Props {
  config: WindowEffectsConfig;
  onChange: (c: WindowEffectsConfig) => void;
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-9 h-[18px] rounded-full transition-colors duration-200 shrink-0 ${
          value ? "bg-glaze-600" : "bg-surface-5"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-200 ${
            value ? "translate-x-[18px]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function parseOpacity(v: string | undefined): number {
  if (!v) return 95;
  const n = parseFloat(v);
  if (v.includes("%")) return Math.round(n);
  return Math.round(n * 100);
}

function EffectGroup({
  label,
  config,
  onChange,
}: {
  label: string;
  config: WindowEffectSet;
  onChange: (c: WindowEffectSet) => void;
}) {
  const border = config.border ?? { enabled: false, color: "#447aba", width: "2px" };
  const hideTitle = config.hide_title_bar ?? { enabled: false };
  const corner = config.corner_style ?? { enabled: false, style: "square" as const };
  const trans = config.transparency ?? { enabled: false, opacity: "95%" };
  const opacityVal = parseOpacity(trans.opacity);

  return (
    <div className="bg-surface-3 rounded-xl px-4 py-3 space-y-1 mb-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{label}</p>

      <div className="border-b border-surface-4 pb-3 mb-3">
        <Toggle
          label="Border"
          value={border.enabled ?? false}
          onChange={(v) => onChange({ ...config, border: { ...border, enabled: v } })}
        />
        {border.enabled && (
          <div className="pl-2 mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={border.color ?? "#447aba"}
                  onChange={(e) =>
                    onChange({ ...config, border: { ...border, color: e.target.value } })
                  }
                  className="w-8 h-7 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={border.color ?? "#447aba"}
                  onChange={(e) =>
                    onChange({ ...config, border: { ...border, color: e.target.value } })
                  }
                  className="input-field text-xs w-24 font-mono"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Width</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={parseInt(border.width ?? "2", 10) || 2}
                  onChange={(e) =>
                    onChange({ ...config, border: { ...border, width: `${e.target.value}px` } })
                  }
                  className="w-20 h-1.5 bg-surface-5 rounded appearance-none cursor-pointer accent-glaze-500"
                />
                <span className="text-xs text-gray-200 font-mono w-8 text-right">
                  {parseInt(border.width ?? "2", 10) || 2}px
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-b border-surface-4 pb-3 mb-3">
        <Toggle
          label="Hide title bar"
          value={hideTitle.enabled ?? false}
          onChange={(v) => onChange({ ...config, hide_title_bar: { enabled: v } })}
        />
      </div>

      <div className="border-b border-surface-4 pb-3 mb-3">
        <Toggle
          label="Corner style (Windows 11 only)"
          value={corner.enabled ?? false}
          onChange={(v) => onChange({ ...config, corner_style: { ...corner, enabled: v } })}
        />
        {corner.enabled && (
          <div className="flex items-center justify-between pl-2 mt-2">
            <span className="text-xs text-gray-400">Style</span>
            <select
              value={corner.style ?? "square"}
              onChange={(e) =>
                onChange({
                  ...config,
                  corner_style: { ...corner, style: e.target.value as "square" | "rounded" | "small_rounded" },
                })
              }
              className="input-field text-xs w-36"
            >
              <option value="square">Square</option>
              <option value="rounded">Rounded</option>
              <option value="small_rounded">Small rounded</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <Toggle
          label="Transparency"
          value={trans.enabled ?? false}
          onChange={(v) => onChange({ ...config, transparency: { ...trans, enabled: v } })}
        />
        {trans.enabled && (
          <div className="flex items-center justify-between pl-2 mt-2">
            <span className="text-xs text-gray-400">Opacity</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={opacityVal}
                onChange={(e) =>
                  onChange({
                    ...config,
                    transparency: { ...trans, opacity: `${e.target.value}%` },
                  })
                }
                className="w-20 h-1.5 bg-surface-5 rounded appearance-none cursor-pointer accent-glaze-500"
              />
              <span className="text-xs text-gray-200 font-mono w-10 text-right">{opacityVal}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function WindowEffectsSection({ config, onChange }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface-3 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Sparkles size={15} className="text-glaze-400" />
          <span className="text-sm font-semibold text-gray-100">Window Effects</span>
          <span className="text-xs text-gray-500">(Windows 11)</span>
        </div>
        {open ? (
          <ChevronDown size={14} className="text-gray-500" />
        ) : (
          <ChevronRight size={14} className="text-gray-500" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4">
          <EffectGroup
            label="Focused window"
            config={config.focused_window ?? {}}
            onChange={(v) => onChange({ ...config, focused_window: v })}
          />
          <EffectGroup
            label="Other windows"
            config={config.other_windows ?? {}}
            onChange={(v) => onChange({ ...config, other_windows: v })}
          />
        </div>
      )}
    </div>
  );
}
