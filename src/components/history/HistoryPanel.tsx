import { History, RotateCcw, Clock } from "lucide-react";
import type { HistoryEntry } from "@/types";
import { formatTimestamp } from "@/lib/yaml-utils";

interface Props {
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
}

export function HistoryPanel({ history, onRestore }: Props) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-surface-4">
        <History size={15} className="text-glaze-400" />
        <span className="text-sm font-semibold text-gray-100">Save History</span>
        <span className="badge badge-blue ml-auto">{history.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock size={28} className="text-gray-600 mb-3" />
            <p className="text-sm text-gray-500">No save history yet</p>
            <p className="text-xs text-gray-600 mt-1">
              Every save creates a restore point here
            </p>
          </div>
        )}

        <div className="space-y-2">
          {history.map((entry, i) => (
            <div
              key={entry.id}
              className="group relative bg-surface-2 hover:bg-surface-3 border border-surface-4 hover:border-surface-5 rounded-xl px-4 py-3 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {i === 0 && (
                      <span className="badge badge-green">Latest</span>
                    )}
                    <span className="text-xs text-gray-400 font-mono">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </div>
                  {entry.label && (
                    <p className="text-xs text-gray-300 font-medium mb-1">
                      {entry.label}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 font-mono truncate">
                    {entry.yamlContent.slice(0, 60).trim()}…
                  </p>
                </div>
                <button
                  onClick={() => onRestore(entry)}
                  title="Restore this version"
                  className="shrink-0 flex items-center gap-1 text-xs btn-ghost opacity-0 group-hover:opacity-100 transition-opacity py-1"
                >
                  <RotateCcw size={12} />
                  Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
