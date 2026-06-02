import { ChevronDown, ChevronRight, Filter, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { WindowRule } from "@/types";

interface Props {
  rules: WindowRule[];
  onChange: (r: WindowRule[]) => void;
}

export function WindowRulesSection({ rules, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const add = () =>
    onChange([...rules, { command: "ignore", match_process_name: "" }]);

  const remove = (i: number) => onChange(rules.filter((_, idx) => idx !== i));

  const update = (i: number, r: WindowRule) => {
    const updated = [...rules];
    updated[i] = r;
    onChange(updated);
  };

  const COMMANDS = [
    "ignore",
    "float",
    "move to workspace 1",
    "move to workspace 2",
    "minimize",
  ];

  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface-3 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Filter size={15} className="text-glaze-400" />
          <span className="text-sm font-semibold text-gray-100">Window Rules</span>
          <span className="badge badge-blue">{rules.length}</span>
        </div>
        {open ? (
          <ChevronDown size={14} className="text-gray-500" />
        ) : (
          <ChevronRight size={14} className="text-gray-500" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4">
          <div className="space-y-3 mb-3">
            {rules.map((rule, i) => (
              <div key={i} className="bg-surface-3 rounded-lg px-3 py-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">Rule {i + 1}</span>
                  <button
                    onClick={() => remove(i)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Command</label>
                    <select
                      value={rule.command}
                      onChange={(e) => update(i, { ...rule, command: e.target.value })}
                      className="input-field text-xs w-full"
                    >
                      {COMMANDS.map((cmd) => (
                        <option key={cmd} value={cmd}>
                          {cmd}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Match process</label>
                    <input
                      type="text"
                      value={rule.match_process_name ?? ""}
                      onChange={(e) =>
                        update(i, { ...rule, match_process_name: e.target.value || undefined })
                      }
                      placeholder="e.g. Taskmgr"
                      className="input-field text-xs w-full"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 mb-1 block">Match title (regex)</label>
                    <input
                      type="text"
                      value={rule.match_title ?? ""}
                      onChange={(e) =>
                        update(i, { ...rule, match_title: e.target.value || undefined })
                      }
                      placeholder="e.g. .*Settings.*"
                      className="input-field text-xs w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={add} className="btn-ghost flex items-center gap-1.5 text-xs w-full justify-center border border-dashed border-surface-5 py-2">
            <Plus size={13} />
            Add rule
          </button>
        </div>
      )}
    </div>
  );
}
