import { ChevronDown, ChevronRight, Square } from "lucide-react";
import { useState } from "react";
import type { FocusBordersConfig, BorderConfig } from "@/types";

interface Props {
  config: FocusBordersConfig;
  onChange: (c: FocusBordersConfig) => void;
}

function BorderRow({
  label,
  config,
  onChange,
}: {
  label: string;
  config: BorderConfig;
  onChange: (c: BorderConfig) => void;
}) {
  return (
    <div className="py-3 border-b border-surface-4 last:border-0">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-200">{label} border</span>
        <button
          onClick={() => onChange({ ...config, enabled: !config.enabled })}
          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
            config.enabled ? "bg-glaze-600" : "bg-surface-5"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
              config.enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      {config.enabled && (
        <div className="space-y-3 pl-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.color ?? "#6272f3"}
                onChange={(e) => onChange({ ...config, color: e.target.value })}
                className="w-8 h-7 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <input
                type="text"
                value={config.color ?? "#6272f3"}
                onChange={(e) => onChange({ ...config, color: e.target.value })}
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
                value={config.width ?? 2}
                onChange={(e) => onChange({ ...config, width: Number(e.target.value) })}
                className="w-20 h-1.5 bg-surface-5 rounded appearance-none cursor-pointer accent-glaze-500"
              />
              <span className="text-sm text-gray-200 font-mono w-8 text-right">
                {config.width ?? 2}px
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FocusBordersSection({ config, onChange }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface-3 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Square size={15} className="text-glaze-400" />
          <span className="text-sm font-semibold text-gray-100">Focus Borders</span>
        </div>
        {open ? (
          <ChevronDown size={14} className="text-gray-500" />
        ) : (
          <ChevronRight size={14} className="text-gray-500" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-2">
          <BorderRow
            label="Active"
            config={config.active ?? { enabled: true, color: "#6272f3", width: 2 }}
            onChange={(b) => onChange({ ...config, active: b })}
          />
          <BorderRow
            label="Inactive"
            config={config.inactive ?? { enabled: false, color: "#343444", width: 1 }}
            onChange={(b) => onChange({ ...config, inactive: b })}
          />
        </div>
      )}
    </div>
  );
}
