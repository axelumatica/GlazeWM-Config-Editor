use chrono::Local;
use std::fs;
use std::path::PathBuf;

/// Returns the default GlazeWM config path on Windows:
/// %USERPROFILE%\.glaze-wm\config.yaml
#[tauri::command]
fn get_glaze_config_path() -> Result<String, String> {
    let home = dirs::home_dir().ok_or("Cannot determine home directory")?;
    let path = home.join(".glaze-wm").join("config.yaml");
    Ok(path.to_string_lossy().to_string())
}

/// Archive (copy) the current config file to a history directory with a timestamp.
/// Returns the path of the created archive file.
#[tauri::command]
async fn archive_config(config_path: String, archive_dir: String) -> Result<String, String> {
    let src = PathBuf::from(&config_path);
    if !src.exists() {
        return Err(format!("Config file not found: {}", config_path));
    }

    let dir = PathBuf::from(&archive_dir);
    fs::create_dir_all(&dir).map_err(|e| format!("Cannot create archive dir: {e}"))?;

    let timestamp = Local::now().format("%Y%m%d_%H%M%S").to_string();
    let dest = dir.join(format!("config_{}.yaml", timestamp));

    fs::copy(&src, &dest).map_err(|e| format!("Archive copy failed: {e}"))?;
    Ok(dest.to_string_lossy().to_string())
}

/// Checks whether the glazewm process is currently running.
#[tauri::command]
async fn check_glazewm_running() -> bool {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        let output = Command::new("tasklist")
            .args(["/FI", "IMAGENAME eq glazewm.exe", "/NH"])
            .output();

        match output {
            Ok(out) => {
                let stdout = String::from_utf8_lossy(&out.stdout);
                stdout.to_lowercase().contains("glazewm")
            }
            Err(_) => false,
        }
    }
    #[cfg(not(target_os = "windows"))]
    {
        false
    }
}

/// Send a reload command to GlazeWM via its named pipe / WebSocket IPC.
/// GlazeWM listens on a named pipe: \\.\pipe\glazewm
#[tauri::command]
async fn send_ipc_reload() -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        // GlazeWM v3 uses a WebSocket on a dynamic port.
        // Fallback: try to find the port from the lock file or use the default.
        // For simplicity we issue a command via the glazewm CLI if it is on PATH.
        let status = std::process::Command::new("glazewm")
            .args(["command", "--command", "wm-reload-config"])
            .status()
            .map_err(|e| format!("Failed to run glazewm CLI: {e}"))?;

        if !status.success() {
            return Err("glazewm reload command failed".into());
        }
        Ok(())
    }
    #[cfg(not(target_os = "windows"))]
    {
        Err("IPC reload is only supported on Windows".into())
    }
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_glaze_config_path,
            archive_config,
            check_glazewm_running,
            send_ipc_reload,
        ])
        .setup(|_app| {
            #[cfg(debug_assertions)]
            {
                use tauri::Manager;
                let window = _app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
