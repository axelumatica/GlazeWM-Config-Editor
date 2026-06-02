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
    onChange([...keybindings, { bindings: ["Alt+"], command: "" }]);

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
              <div
                key={i}
                className="flex items-center gap-2 bg-surface-3 rounded-lg px-3 py-2"
              >
                <input
                  type="text"
                  value={kb.bindings.join(", ")}
                  onChange={(e) =>
                    update(i, {
                      ...kb,
                      bindings: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  placeholder="Alt+H"
                  className="input-field text-xs font-mono w-32 py-1 shrink-0"
                />
                <span className="text-gray-600 text-xs shrink-0">→</span>
                <input
                  type="text"
                  value={kb.command ?? kb.commands?.join("; ") ?? ""}
                  onChange={(e) =>
                    update(i, { ...kb, command: e.target.value, commands: undefined })
                  }
                  placeholder="focus left"
                  className="input-field text-xs flex-1 py-1"
                />
                <button
                  onClick={() => remove(i)}
                  className="text-gray-600 hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={add} className="btn-ghost flex items-center gap-1.5 text-xs w-full justify-center border border-dashed border-surface-5 py-2">
            <Plus size={13} />
            Add keybinding
          </button>
        </div>
      )}
    </div>
  );
}
