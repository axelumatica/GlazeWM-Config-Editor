import { ChevronDown, ChevronRight, LayoutGrid, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { WorkspaceConfig } from "@/types";

interface Props {
  workspaces: WorkspaceConfig[];
  onChange: (ws: WorkspaceConfig[]) => void;
}

export function WorkspacesSection({ workspaces, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const addWorkspace = () => {
    const next = String(workspaces.length + 1);
    onChange([...workspaces, { name: next }]);
  };

  const removeWorkspace = (i: number) => {
    onChange(workspaces.filter((_, idx) => idx !== i));
  };

  const updateWorkspace = (i: number, ws: WorkspaceConfig) => {
    const updated = [...workspaces];
    updated[i] = ws;
    onChange(updated);
  };

  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface-3 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <LayoutGrid size={15} className="text-glaze-400" />
          <span className="text-sm font-semibold text-gray-100">Workspaces</span>
          <span className="badge badge-blue">{workspaces.length}</span>
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
            {workspaces.map((ws, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-surface-3 rounded-lg px-3 py-2"
              >
                <div className="w-6 h-6 rounded bg-glaze-600/30 flex items-center justify-center text-xs font-mono text-glaze-300 font-medium shrink-0">
                  {ws.name}
                </div>
                <input
                  type="text"
                  placeholder="Display name (optional)"
                  value={ws.display_name ?? ""}
                  onChange={(e) =>
                    updateWorkspace(i, { ...ws, display_name: e.target.value || undefined })
                  }
                  className="input-field flex-1 text-xs py-1"
                />
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ws.keep_alive ?? false}
                      onChange={(e) =>
                        updateWorkspace(i, { ...ws, keep_alive: e.target.checked })
                      }
                      className="w-3.5 h-3.5 rounded accent-glaze-500"
                    />
                    <span className="text-xs text-gray-400">Keep alive</span>
                  </label>
                  <button
                    onClick={() => removeWorkspace(i)}
                    className="text-gray-600 hover:text-red-400 transition-colors ml-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addWorkspace} className="btn-ghost flex items-center gap-1.5 text-xs w-full justify-center border border-dashed border-surface-5 py-2">
            <Plus size={13} />
            Add workspace
          </button>
        </div>
      )}
    </div>
  );
}
