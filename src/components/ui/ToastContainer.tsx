import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import type { Toast } from "@/types";

interface Props {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={16} className="text-emerald-400" />,
  error: <XCircle size={16} className="text-red-400" />,
  warning: <AlertTriangle size={16} className="text-amber-400" />,
  info: <Info size={16} className="text-glaze-400" />,
};

export function ToastContainer({ toasts, onRemove }: Props) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-in pointer-events-auto flex items-center gap-3 bg-surface-3 border border-surface-5 rounded-xl px-4 py-3 shadow-xl min-w-[260px] max-w-[380px]"
        >
          {icons[t.type]}
          <span className="text-sm text-gray-200 flex-1">{t.message}</span>
          <button
            onClick={() => onRemove(t.id)}
            className="text-gray-500 hover:text-gray-300 transition-colors ml-2"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
