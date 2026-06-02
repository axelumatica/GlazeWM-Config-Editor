import { ChevronDown, ChevronRight, Maximize2 } from "lucide-react";
import { useState } from "react";
import type { GapsConfig } from "@/types";

interface Props {
  config: GapsConfig;
  onChange: (c: GapsConfig) => void;
}

function NumberInput({
  label,
  value,
  onChange,
  unit = "px",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="80"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-28 h-1.5 bg-surface-5 rounded appearance-none cursor-pointer accent-glaze-500"
        />
        <span className="text-sm text-gray-200 w-12 text-right font-mono">
          {value}
          <span className="text-gray-500 text-xs ml-0.5">{unit}</span>
        </span>
      </div>
    </div>
  );
}

function parseNum(v: number | string | undefined, fallback = 0): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseInt(v, 10) || fallback;
  return fallback;
}

export function GapsSection({ config, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const innerGap = parseNum(config.inner_gap, 8);
  const outer =
    typeof config.outer_gap === "object" && config.outer_gap !== null
      ? config.outer_gap
      : { top: parseNum(config.outer_gap, 8), right: parseNum(config.outer_gap, 8), bottom: parseNum(config.outer_gap, 8), left: parseNum(config.outer_gap, 8) };

  const setOuter = (key: "top" | "right" | "bottom" | "left", val: number) =>
    onChange({ ...config, outer_gap: { ...outer, [key]: val } });

  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface-3 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Maximize2 size={15} className="text-glaze-400" />
          <span className="text-sm font-semibold text-gray-100">Gaps</span>
        </div>
        {open ? (
          <ChevronDown size={14} className="text-gray-500" />
        ) : (
          <ChevronRight size={14} className="text-gray-500" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4">
          <div className="border-b border-surface-4 mb-3 pb-3">
            <NumberInput
              label="Inner gap (between windows)"
              value={innerGap}
              onChange={(v) => onChange({ ...config, inner_gap: v })}
            />
          </div>
          <p className="text-xs text-gray-500 mb-2 mt-1">Outer gaps (screen edges)</p>
          <NumberInput label="Top" value={parseNum(outer.top, 40)} onChange={(v) => setOuter("top", v)} />
          <NumberInput label="Right" value={parseNum(outer.right, 8)} onChange={(v) => setOuter("right", v)} />
          <NumberInput label="Bottom" value={parseNum(outer.bottom, 8)} onChange={(v) => setOuter("bottom", v)} />
          <NumberInput label="Left" value={parseNum(outer.left, 8)} onChange={(v) => setOuter("left", v)} />
        </div>
      )}
    </div>
  );
}
