import { useRef, useCallback } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  error: string | null;
}

export function YamlEditor({ value, onChange, error }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newVal = value.substring(0, start) + "  " + value.substring(end);
        onChange(newVal);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    },
    [value, onChange]
  );

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-2 mx-4">
          <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
          <span className="text-xs text-red-400 font-mono break-all">{error}</span>
        </div>
      )}
      <div className="flex-1 min-h-0 relative">
        {/* Line numbers */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-3 pt-4 overflow-hidden pointer-events-none select-none">
          {value.split("\n").map((_, i) => (
            <span
              key={i}
              className="text-xs text-gray-600 font-mono leading-relaxed"
              style={{ lineHeight: "1.6", fontSize: "13px" }}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="yaml-editor pl-14 pr-4 pt-4 pb-4 absolute inset-0"
          style={{
            background: "transparent",
            color: error ? "#f87171" : "#c8d3f5",
          }}
        />
      </div>
    </div>
  );
}
