import { invoke } from "@tauri-apps/api/core";
import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";

const isTauri = () => "__TAURI_INTERNALS__" in window;

export async function readConfigFile(path: string): Promise<string> {
  if (!isTauri()) throw new Error("Not running in Tauri");
  return await readTextFile(path);
}

export async function writeConfigFile(
  path: string,
  content: string
): Promise<void> {
  if (!isTauri()) throw new Error("Not running in Tauri");
  await writeTextFile(path, content);
}

export async function openFileDialog(): Promise<string | null> {
  if (!isTauri()) return null;
  const result = await open({
    filters: [{ name: "YAML Config", extensions: ["yaml", "yml"] }],
    multiple: false,
  });
  return typeof result === "string" ? result : null;
}

export async function saveFileDialog(defaultPath?: string): Promise<string | null> {
  if (!isTauri()) return null;
  const result = await save({
    defaultPath,
    filters: [{ name: "YAML Config", extensions: ["yaml", "yml"] }],
  });
  return result ?? null;
}

export async function getGlazeConfigPath(): Promise<string | null> {
  if (!isTauri()) return null;
  try {
    return await invoke<string>("get_glaze_config_path");
  } catch {
    return null;
  }
}

export async function sendIpcReload(): Promise<boolean> {
  if (!isTauri()) return false;
  try {
    await invoke("send_ipc_reload");
    return true;
  } catch {
    return false;
  }
}

export async function checkGlazeWmRunning(): Promise<boolean> {
  if (!isTauri()) return false;
  try {
    return await invoke<boolean>("check_glazewm_running");
  } catch {
    return false;
  }
}

export async function getAppDataDir(): Promise<string | null> {
  if (!isTauri()) return null;
  try {
    return await invoke<string>("get_app_data_dir");
  } catch {
    return null;
  }
}

export async function archiveConfig(
  configPath: string,
  archiveDir: string
): Promise<string> {
  if (!isTauri()) throw new Error("Not running in Tauri");
  return await invoke<string>("archive_config", { configPath, archiveDir });
}
