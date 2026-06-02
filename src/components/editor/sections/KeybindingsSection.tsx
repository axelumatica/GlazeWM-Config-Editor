import { ChevronDown, ChevronRight, Keyboard, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Keybinding } from "@/types";

interface Props {
  keybindings: Keybinding[];
  onChange: (kb: Keybinding[]) => void;
}

export function KeybindingsSection({ keybindings, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const add = () =>
    onChange([...keybindings, { bindings: ["alt+"], commands: [""] }]);

  const remove = (i: number) => onChange(keybindings.filter((_, idx) => idx !== i));

  const update = (i: number, kb: Keybinding) => {
    const updated = [...keybindings];
    updated[i] = kb;
    onChange(updated);
  };

  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface-3 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Keyboard size={15} className="text-glaze-400" />
          <span className="text-sm font-semibold text-gray-100">Keybindings</span>
          <span className="badge badge-blue">{keybindings.length}</span>
        </div>
        {open ? (
          <ChevronDown size={14} className="text-gray-500" />
        ) : (
          <ChevronRight size={14} className="text-gray-500" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4">
          <div className="space-y-2 mb-3">
            {keybindings.map((kb, i) => (
              <div key={i} className="bg-surface-3 rounded-lg px-3 py-2.5 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="shrink-0">
                    <label className="text-xs text-gray-500 block mb-1">Key(s)</label>
                    <input
                      type="text"
                      value={kb.bindings.join(", ")}
                      onChange={(e) =>
                        update(i, {
                          ...kb,
                          bindings: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="alt+h, alt+left"
                      className="input-field text-xs font-mono w-40 py-1"
                    />
                  </div>
                  <span className="text-gray-600 text-sm mt-4 shrink-0">→</span>
                  <div className="flex-1 min-w-0">
                    <label className="text-xs text-gray-500 block mb-1">Command(s)</label>
                    <input
                      type="text"
                      value={kb.commands.join("; ")}
                      onChange={(e) =>
                        update(i, {
                          ...kb,
                          commands: e.target.value.split(";").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="focus --direction left"
                      className="input-field text-xs w-full py-1 font-mono"
                    />
                  </div>
                  <button
                    onClick={() => remove(i)}
                    className="text-gray-600 hover:text-red-400 transition-colors shrink-0 mt-4"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                {kb.commands.length > 1 && (
                  <p className="text-xs text-gray-500 pl-1">
                    {kb.commands.length} commands — separate with semicolons
                  </p>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={add}
            className="btn-ghost flex items-center gap-1.5 text-xs w-full justify-center border border-dashed border-surface-5 py-2"
          >
            <Plus size={13} />
            Add keybinding
          </button>
        </div>
      )}
    </div>
  );
}
