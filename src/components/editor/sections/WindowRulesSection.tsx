import { ChevronDown, ChevronRight, Filter, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { WindowRule, MatchCondition } from "@/types";

interface Props {
  rules: WindowRule[];
  onChange: (r: WindowRule[]) => void;
}

type MatchType = "equals" | "regex" | "not_regex";
type MatchField = "window_process" | "window_class" | "window_title";

function getMatchValue(
  cond: MatchCondition,
  field: MatchField
): { type: MatchType; value: string } {
  const f = cond[field];
  if (!f) return { type: "equals", value: "" };
  if (f.equals !== undefined) return { type: "equals", value: f.equals };
  if (f.regex !== undefined) return { type: "regex", value: f.regex };
  if (f.not_regex !== undefined) return { type: "not_regex", value: f.not_regex };
  return { type: "equals", value: "" };
}

function setMatchValue(
  cond: MatchCondition,
  field: MatchField,
  type: MatchType,
  value: string
): MatchCondition {
  if (!value) {
    const copy = { ...cond };
    delete copy[field];
    return copy;
  }
  return { ...cond, [field]: { [type]: value } };
}

const COMMANDS = [
  "ignore",
  "set-floating",
  "set-tiling",
  "minimize",
  "move --workspace 1",
  "move --workspace 2",
];

export function WindowRulesSection({ rules, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const add = () =>
    onChange([
      ...rules,
      { commands: ["ignore"], match: [{ window_process: { equals: "" } }] },
    ]);

  const remove = (i: number) => onChange(rules.filter((_, idx) => idx !== i));

  const updateRule = (i: number, r: WindowRule) => {
    const updated = [...rules];
    updated[i] = r;
    onChange(updated);
  };

  const updateMatch = (ruleIdx: number, matchIdx: number, cond: MatchCondition) => {
    const rule = rules[ruleIdx];
    const match = [...(rule.match ?? [])];
    match[matchIdx] = cond;
    updateRule(ruleIdx, { ...rule, match });
  };

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
            {rules.map((rule, i) => {
              const match0 = rule.match?.[0] ?? {};
              const proc = getMatchValue(match0, "window_process");
              const cls = getMatchValue(match0, "window_class");
              const title = getMatchValue(match0, "window_title");

              return (
                <div key={i} className="bg-surface-3 rounded-lg px-3 py-3 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">Rule {i + 1}</span>
                    <button
                      onClick={() => remove(i)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Commands</label>
                    <input
                      type="text"
                      value={rule.commands.join("; ")}
                      onChange={(e) =>
                        updateRule(i, {
                          ...rule,
                          commands: e.target.value.split(";").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="ignore"
                      list={`cmd-list-${i}`}
                      className="input-field text-xs w-full font-mono"
                    />
                    <datalist id={`cmd-list-${i}`}>
                      {COMMANDS.map((c) => <option key={c} value={c} />)}
                    </datalist>
                  </div>

                  {(["window_process", "window_class", "window_title"] as MatchField[]).map((field) => {
                    const mv = field === "window_process" ? proc : field === "window_class" ? cls : title;
                    const label = field === "window_process" ? "Process name" : field === "window_class" ? "Window class" : "Window title";
                    return (
                      <div key={field} className="grid grid-cols-[1fr_auto_1fr] gap-1.5 items-end">
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                          <input
                            type="text"
                            value={mv.value}
                            onChange={(e) =>
                              updateMatch(
                                i,
                                0,
                                setMatchValue(match0, field, mv.type, e.target.value)
                              )
                            }
                            placeholder={field === "window_title" ? "regex pattern" : "e.g. Firefox"}
                            className="input-field text-xs w-full font-mono"
                          />
                        </div>
                        <div className="pb-0.5">
                          <select
                            value={mv.type}
                            onChange={(e) =>
                              updateMatch(
                                i,
                                0,
                                setMatchValue(match0, field, e.target.value as MatchType, mv.value)
                              )
                            }
                            className="input-field text-xs h-7"
                          >
                            <option value="equals">equals</option>
                            <option value="regex">regex</option>
                            <option value="not_regex">not regex</option>
                          </select>
                        </div>
                        <div />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <button
            onClick={add}
            className="btn-ghost flex items-center gap-1.5 text-xs w-full justify-center border border-dashed border-surface-5 py-2"
          >
            <Plus size={13} />
            Add rule
          </button>
        </div>
      )}
    </div>
  );
}
