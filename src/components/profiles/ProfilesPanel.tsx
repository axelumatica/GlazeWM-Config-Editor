import { useState } from "react";
import { Layers, Plus, Trash2, Check, Save, X } from "lucide-react";
import type { ConfigProfile } from "@/types";
import { formatTimestamp } from "@/lib/yaml-utils";

interface Props {
  profiles: ConfigProfile[];
  activeProfileId: string | null;
  onSwitch: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: (name: string, description: string) => void;
  onUpdate: (id: string) => void;
}

export function ProfilesPanel({
  profiles,
  activeProfileId,
  onSwitch,
  onDelete,
  onCreate,
  onUpdate,
}: Props) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName.trim(), newDesc.trim());
    setNewName("");
    setNewDesc("");
    setCreating(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-4">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-glaze-400" />
          <span className="text-sm font-semibold text-gray-100">Config Profiles</span>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="btn-ghost flex items-center gap-1 text-xs py-1"
        >
          <Plus size={13} />
          New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {creating && (
          <div className="bg-surface-3 border border-glaze-500/30 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-300">New Profile</p>
            <input
              autoFocus
              type="text"
              placeholder="Profile name (e.g. Gaming, Work)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="input-field w-full text-sm"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="input-field w-full text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="btn-primary flex items-center gap-1 text-xs py-1.5 flex-1"
              >
                <Check size={13} />
                Create from current config
              </button>
              <button
                onClick={() => setCreating(false)}
                className="btn-ghost text-xs py-1.5 px-3"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        )}

        {profiles.length === 0 && !creating && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Layers size={28} className="text-gray-600 mb-3" />
            <p className="text-sm text-gray-500">No profiles yet</p>
            <p className="text-xs text-gray-600 mt-1">
              Create a profile to save and switch between different configurations
            </p>
          </div>
        )}

        {profiles.map((p) => {
          const isActive = p.id === activeProfileId;
          return (
            <div
              key={p.id}
              className={`rounded-xl border p-4 transition-all cursor-pointer ${
                isActive
                  ? "bg-glaze-600/15 border-glaze-500/40"
                  : "bg-surface-2 border-surface-4 hover:border-surface-5"
              }`}
              onClick={() => onSwitch(p.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {isActive && (
                      <span className="badge badge-blue">Active</span>
                    )}
                    <span className="text-sm font-medium text-gray-100 truncate">
                      {p.name}
                    </span>
                  </div>
                  {p.description && (
                    <p className="text-xs text-gray-500 truncate">{p.description}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">
                    Updated {formatTimestamp(p.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {isActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdate(p.id);
                      }}
                      title="Save current config to this profile"
                      className="text-gray-500 hover:text-glaze-400 transition-colors p-1"
                    >
                      <Save size={13} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(p.id);
                    }}
                    className="text-gray-600 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
