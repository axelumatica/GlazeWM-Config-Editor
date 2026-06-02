# GlazeWM Config Editor

A visual desktop application for editing [GlazeWM](https://github.com/glazewm/glazewm) configuration files. Built with Tauri (Rust) + React + TypeScript.

## Features

- **Visual GUI editor** — sliders, toggles, and color pickers for all common settings
- **Raw YAML editor** — split-pane view, synchronized with the visual editor in real-time
- **Save history** — every save creates a restore point; one-click rollback to any past state
- **Config profiles** — save and switch between multiple named configurations (Work, Gaming, etc.)
- **Undo / Redo** — full session history
- **Atomic save** — archives current config before writing, so you never lose data
- **GlazeWM IPC** — detects if GlazeWM is running; sends `wm-reload-config` after save
- **YAML validation** — errors highlighted in real-time, Save disabled until fixed

---

## Getting the Windows installer (easiest way)

> **You don't need to install anything.** Just push this project to GitHub and GitHub Actions will build the `.msi` installer for you automatically.

### Step 1 — Push to GitHub

1. Create a new **public** repository on [github.com](https://github.com/new)
2. Download/clone this project folder to your Windows machine
3. Run these commands in the project folder:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2 — Trigger a build

Push a tag to trigger the release workflow:

```bash
git tag v0.1.0
git push origin v0.1.0
```

### Step 3 — Download the installer

1. Go to your GitHub repository
2. Click the **Actions** tab — you'll see the build running (takes ~10–15 minutes)
3. When done, go to the **Releases** tab
4. Download the `.msi` file and run it!

---

## Building locally (optional)

**Prerequisites:**
- [Node.js 20+](https://nodejs.org)
- [Rust stable](https://rustup.rs) — install via `rustup`
- Windows 11 or 10

```bash
# Install JS dependencies
npm install

# Run in development mode (hot reload)
npm run tauri dev

# Build the installer (.msi)
npm run tauri build
# Output: src-tauri/target/release/bundle/msi/
```

---

## Project structure

```
glaze-wm-config-editor/
├── src/                    # React frontend
│   ├── App.tsx             # Main app layout
│   ├── components/
│   │   ├── editor/         # Visual + YAML editors
│   │   ├── profiles/       # Profile manager panel
│   │   └── history/        # Save history panel
│   ├── hooks/              # App state, toasts
│   ├── lib/                # YAML utils, storage, Tauri bridge
│   └── types/              # TypeScript types
├── src-tauri/              # Rust backend
│   ├── src/lib.rs          # Tauri commands (IPC, file ops)
│   └── tauri.conf.json     # App config (name, window size, etc.)
└── .github/workflows/
    ├── release.yml         # Builds .msi on git tag push
    └── ci.yml              # Checks code on every push
```

---

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+S` | Save (add this via keybinding if desired) |
| `Tab` | Indent in YAML editor |
