import { ChevronDown, ChevronRight, Maximize2 } from "lucide-react";
import { useState } from "react";
import type { GapsConfig } from "@/types";

interface Props {
  config: GapsConfig;
  onChange: (c: GapsConfig) => void;
}

function parseNum(v: string | number | undefined, fallback = 0): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") return parseInt(v, 10) || fallback;
  return fallback;
}

function GapSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
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
        <span className="text-sm text-gray-200 w-14 text-right font-mono">
          {value}
          <span className="text-gray-500 text-xs ml-0.5">px</span>
        </span>
      </div>
    </div>
  );
}

export function GapsSection({ config, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const innerGap = parseNum(config.inner_gap, 7);
  const outer =
    typeof config.outer_gap === "object" && config.outer_gap !== null
      ? config.outer_gap
      : {
          top: parseNum(config.outer_gap, 8),
          right: parseNum(config.outer_gap, 8),
          bottom: parseNum(config.outer_gap, 8),
          left: parseNum(config.outer_gap, 8),
        };

  const setOuter = (key: "top" | "right" | "bottom" | "left", val: number) =>
    onChange({ ...config, outer_gap: { ...outer, [key]: `${val}px` } });

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
          <div className="config-row py-2.5 border-b border-surface-4 mb-1">
            <div>
              <p className="text-sm text-gray-200">Scale with DPI</p>
              <p className="text-xs text-gray-500 mt-0.5">Scale gaps with monitor DPI</p>
            </div>
            <button
              onClick={() => onChange({ ...config, scale_with_dpi: !(config.scale_with_dpi ?? true) })}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${
                (config.scale_with_dpi ?? true) ? "bg-glaze-600" : "bg-surface-5"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  (config.scale_with_dpi ?? true) ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="border-b border-surface-4 mb-3 pb-1">
            <GapSlider
              label="Inner gap (between windows)"
              value={innerGap}
              onChange={(v) => onChange({ ...config, inner_gap: `${v}px` })}
            />
          </div>
          <p className="text-xs text-gray-500 mb-1 mt-1 font-medium uppercase tracking-wide">Outer gaps (screen edges)</p>

          <div className="grid grid-cols-2 gap-x-6">
            <GapSlider label="Top" value={parseNum(outer.top, 8)} onChange={(v) => setOuter("top", v)} />
            <GapSlider label="Right" value={parseNum(outer.right, 8)} onChange={(v) => setOuter("right", v)} />
            <GapSlider label="Bottom" value={parseNum(outer.bottom, 8)} onChange={(v) => setOuter("bottom", v)} />
            <GapSlider label="Left" value={parseNum(outer.left, 8)} onChange={(v) => setOuter("left", v)} />
          </div>
        </div>
      )}
    </div>
  );
}
