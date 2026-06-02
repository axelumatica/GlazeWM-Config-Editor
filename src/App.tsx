import { useState, useCallback } from "react";
import {
  Save,
  Undo2,
  Redo2,
  Code2,
  Eye,
  Layers,
  History,
  Wifi,
  WifiOff,
  AlertCircle,
  FolderOpen,
  Download,
} from "lucide-react";
import { useAppState } from "@/hooks/useAppState";
import { useToast } from "@/hooks/useToast";
import { VisualEditor } from "@/components/editor/VisualEditor";
import { YamlEditor } from "@/components/editor/YamlEditor";
import { ProfilesPanel } from "@/components/profiles/ProfilesPanel";
import { HistoryPanel } from "@/components/history/HistoryPanel";
import { ToastContainer } from "@/components/ui/ToastContainer";

type SidePanel = "profiles" | "history" | null;

export default function App() {
  const {
    state,
    setYaml,
    saveConfig,
    undo,
    redo,
    toggleYamlEditor,
    createNewProfile,
    switchProfile,
    deleteProfile,
    updateProfileYaml,
    restoreHistory,
    canUndo,
    canRedo,
  } = useAppState();

  const { toasts, addToast, removeToast } = useToast();
  const [sidePanel, setSidePanel] = useState<SidePanel>(null);

  const handleSave = useCallback(() => {
    saveConfig("Manual save");
    addToast("success", "Config saved — restore point created");
  }, [saveConfig, addToast]);

  const handleOpenFile = useCallback(async () => {
    try {
      const { openFileDialog, readConfigFile } = await import("@/lib/tauri-bridge");
      const path = await openFileDialog();
      if (!path) return;
      const content = await readConfigFile(path);
      setYaml(content);
      addToast("success", `Loaded: ${path.split(/[\\/]/).pop()}`);
    } catch {
      addToast("error", "Could not open file — are you running the desktop app?");
    }
  }, [setYaml, addToast]);

  const handleExport = useCallback(async () => {
    try {
      const { saveFileDialog, writeConfigFile } = await import("@/lib/tauri-bridge");
      const path = await saveFileDialog("config.yaml");
      if (!path) return;
      await writeConfigFile(path, state.currentYaml);
      addToast("success", `Exported to: ${path.split(/[\\/]/).pop()}`);
    } catch {
      const blob = new Blob([state.currentYaml], { type: "text/yaml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "config.yaml";
      a.click();
      URL.revokeObjectURL(url);
      addToast("info", "Downloaded config.yaml");
    }
  }, [state.currentYaml, addToast]);

  const handleRestoreHistory = useCallback(
    (entry: Parameters<typeof restoreHistory>[0]) => {
      restoreHistory(entry);
      addToast("info", `Restored version from ${new Date(entry.timestamp).toLocaleTimeString()}`);
    },
    [restoreHistory, addToast]
  );

  const handleCreateProfile = useCallback(
    (name: string, description: string) => {
      createNewProfile(name, description);
      addToast("success", `Profile "${name}" created`);
    },
    [createNewProfile, addToast]
  );

  const handleSwitchProfile = useCallback(
    (id: string) => {
      if (state.isDirty) {
        if (!confirm("You have unsaved changes. Discard and switch profile?")) return;
      }
      switchProfile(id);
      const p = state.profiles.find((p) => p.id === id);
      addToast("info", `Switched to "${p?.name ?? id}"`);
    },
    [state.isDirty, state.profiles, switchProfile, addToast]
  );

  const handleUpdateProfile = useCallback(
    (id: string) => {
      updateProfileYaml(id);
      const p = state.profiles.find((p) => p.id === id);
      addToast("success", `Profile "${p?.name ?? id}" updated`);
    },
    [state.profiles, updateProfileYaml, addToast]
  );

  const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId);

  return (
    <div className="flex flex-col h-screen bg-surface-0 select-none">
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-5 h-11 bg-surface-1 border-b border-surface-3 shrink-0"
        data-tauri-drag-region
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-sm font-semibold text-gray-200 ml-2">
            GlazeWM Config Editor
          </span>
          {activeProfile && (
            <span className="badge badge-blue text-xs">{activeProfile.name}</span>
          )}
          {state.isDirty && (
            <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes" />
          )}
        </div>

        {/* IPC status */}
        <div className="flex items-center gap-2">
          {state.glazeWmStatus === "running" ? (
            <div className="flex items-center gap-1.5">
              <Wifi size={13} className="text-emerald-400" />
              <span className="text-xs text-emerald-400">GlazeWM running</span>
            </div>
          ) : state.glazeWmStatus === "stopped" ? (
            <div className="flex items-center gap-1.5">
              <WifiOff size={13} className="text-gray-500" />
              <span className="text-xs text-gray-500">GlazeWM offline</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <AlertCircle size={13} className="text-gray-600" />
              <span className="text-xs text-gray-600">Status unknown</span>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 h-10 bg-surface-1 border-b border-surface-3 shrink-0">
        {/* File actions */}
        <button onClick={handleOpenFile} className="btn-ghost flex items-center gap-1.5 text-xs py-1">
          <FolderOpen size={13} />
          Open
        </button>
        <button onClick={handleExport} className="btn-ghost flex items-center gap-1.5 text-xs py-1">
          <Download size={13} />
          Export
        </button>

        <div className="w-px h-5 bg-surface-4 mx-1" />

        {/* Undo / Redo */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className="btn-ghost p-1.5 disabled:opacity-30"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={14} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="btn-ghost p-1.5 disabled:opacity-30"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={14} />
        </button>

        <div className="w-px h-5 bg-surface-4 mx-1" />

        {/* Visual / YAML toggle */}
        <button
          onClick={toggleYamlEditor}
          className={`btn-ghost flex items-center gap-1.5 text-xs py-1 ${
            !state.showYamlEditor ? "text-glaze-300" : ""
          }`}
        >
          <Eye size={13} />
          Visual
        </button>
        <button
          onClick={toggleYamlEditor}
          className={`btn-ghost flex items-center gap-1.5 text-xs py-1 ${
            state.showYamlEditor ? "text-glaze-300" : ""
          }`}
        >
          <Code2 size={13} />
          YAML
        </button>

        <div className="flex-1" />

        {/* Side panel toggles */}
        <button
          onClick={() => setSidePanel(sidePanel === "profiles" ? null : "profiles")}
          className={`btn-ghost flex items-center gap-1.5 text-xs py-1 ${
            sidePanel === "profiles" ? "text-glaze-300 bg-surface-3" : ""
          }`}
        >
          <Layers size={13} />
          Profiles
        </button>
        <button
          onClick={() => setSidePanel(sidePanel === "history" ? null : "history")}
          className={`btn-ghost flex items-center gap-1.5 text-xs py-1 ${
            sidePanel === "history" ? "text-glaze-300 bg-surface-3" : ""
          }`}
        >
          <History size={13} />
          History
        </button>

        <div className="w-px h-5 bg-surface-4 mx-1" />

        {/* Save button — floats and pulses when dirty */}
        <button
          onClick={handleSave}
          disabled={!state.isDirty && state.parseError === null}
          className={`btn-primary flex items-center gap-1.5 text-xs py-1.5 ${
            state.isDirty && !state.parseError ? "save-pulse" : ""
          }`}
        >
          <Save size={13} />
          {state.isDirty ? "Save*" : "Saved"}
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Editor area */}
        <div className="flex-1 min-w-0 flex">
          {/* Visual editor */}
          <div
            className={`flex-1 min-w-0 transition-all duration-200 ${
              state.showYamlEditor ? "w-1/2" : "w-full"
            }`}
          >
            {state.parsedConfig ? (
              <VisualEditor
                config={state.parsedConfig}
                onYamlChange={setYaml}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <AlertCircle size={28} className="text-red-400" />
                <p className="text-sm text-red-400">Invalid YAML — fix errors in the editor</p>
                <p className="text-xs text-gray-600 max-w-sm text-center font-mono">
                  {state.parseError}
                </p>
              </div>
            )}
          </div>

          {/* YAML editor — split pane */}
          {state.showYamlEditor && (
            <div className="w-1/2 border-l border-surface-3 bg-surface-1 flex flex-col min-h-0 slide-in-right">
              <div className="flex items-center gap-2 px-4 h-8 border-b border-surface-3 shrink-0">
                <Code2 size={12} className="text-gray-500" />
                <span className="text-xs text-gray-500 font-mono">config.yaml</span>
                {state.parseError && (
                  <span className="badge badge-red ml-auto">Parse error</span>
                )}
                {!state.parseError && (
                  <span className="badge badge-green ml-auto">Valid YAML</span>
                )}
              </div>
              <div className="flex-1 min-h-0">
                <YamlEditor
                  value={state.currentYaml}
                  onChange={setYaml}
                  error={state.parseError}
                />
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        {sidePanel && (
          <div className="w-72 border-l border-surface-3 bg-surface-1 shrink-0 slide-in-right overflow-hidden flex flex-col">
            {sidePanel === "profiles" && (
              <ProfilesPanel
                profiles={state.profiles}
                activeProfileId={state.activeProfileId}
                onSwitch={handleSwitchProfile}
                onDelete={deleteProfile}
                onCreate={handleCreateProfile}
                onUpdate={handleUpdateProfile}
              />
            )}
            {sidePanel === "history" && (
              <HistoryPanel
                history={state.history}
                onRestore={handleRestoreHistory}
              />
            )}
          </div>
        )}
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
