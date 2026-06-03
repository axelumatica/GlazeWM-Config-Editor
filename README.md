# ⚙️ GlazeWM Config Editor

<div align="center">

<!-- TODO: Add project logo -->

[![GitHub stars](https://img.shields.io/github/stars/axelumatica/GlazeWM-Config-Editor?style=for-the-badge)](https://github.com/axelumatica/GlazeWM-Config-Editor/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/axelumatica/GlazeWM-Config-Editor?style=for-the-badge)](https://github.com/axelumatica/GlazeWM-Config-Editor/network)
[![GitHub issues](https://img.shields.io/github/issues/axelumatica/GlazeWM-Config-Editor?style=for-the-badge)](https://github.com/axelumatica/GlazeWM-Config-Editor/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](https://github.com/axelumatica/GlazeWM-Config-Editor/blob/master/LICENSE) <!-- TODO: Verify actual license file exists and is MIT, otherwise update -->

**A modern, cross-platform desktop application for intuitively configuring GlazeWM.**

</div>

## 📖 Overview

The GlazeWM Config Editor provides a user-friendly graphical interface to simplify the configuration of GlazeWM, a tiling window manager for Windows. Traditionally, GlazeWM configuration involves editing complex TOML files. This application abstracts away that complexity, allowing users to effortlessly customize their window management setup through a reactive, modern desktop experience. Built with a React frontend and powered by Tauri for cross-platform desktop deployment, it aims to make GlazeWM accessible to a wider audience.

## ✨ Features

-   🎯 **Intuitive Configuration Interface**: Edit GlazeWM settings through a clean and responsive UI.
-   🚀 **Cross-Platform Compatibility**: Available for Windows, macOS, and Linux thanks to Tauri.
-   ⚡ **Real-time Updates**: Potentially allows for immediate feedback on configuration changes (actual implementation details may vary).
-   🎨 **Modern Frontend Experience**: Crafted with React, TypeScript, and styled using Tailwind CSS.
-   StateManager **Robust State Management**: Utilizes Zustand for efficient and predictable application state.
-   💾 **File System Interaction**: Seamlessly read and write GlazeWM configuration files on your local system.

## 🖥️ Screenshots

<!-- TODO: Add actual screenshots of the application in action -->
<!-- ![Main Window](path-to-main-screenshot.png) -->
<!-- ![Configuration Section](path-to-config-screenshot.png) -->

## 🛠️ Tech Stack

**Frontend:**
-   **React** (for UI components) [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
-   **TypeScript** (for type safety) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
-   **Tailwind CSS** (for styling) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
-   **Zustand** (for state management) [![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=github&logoColor=white)](https://zustand-bear.netlify.app/)
-   **TanStack Query** (for data fetching/caching) [![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)](https://tanstack.com/query)

**Desktop Runtime:**
-   **Tauri** (for building cross-platform desktop apps) [![Tauri](https://img.shields.io/badge/Tauri-24C8D9?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app/)
-   **Rust** (for the backend logic of Tauri) [![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)

**Build & Development Tools:**
-   **Vite** (for fast development and bundling) [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
-   **PostCSS** (for CSS transformations) [![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)](https://postcss.org/)

## 🚀 Quick Start

Follow these steps to get the GlazeWM Config Editor up and running on your local machine.

### Prerequisites

Ensure you have the following installed:
-   **Node.js**: `^18.x` or higher (LTS recommended)
-   **npm**: Comes with Node.js
-   **Rust**: Follow the [Rust installation guide](https://www.rust-lang.org/tools/install)
-   **Tauri Prerequisites**: Specific system dependencies for your OS (e.g., `WebView2` for Windows, `Xcode` for macOS, `webkit2gtk` for Linux). Refer to the [Tauri setup guide](https://tauri.app/v1/guides/getting-started/prerequisites) for details.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/axelumatica/GlazeWM-Config-Editor.git
    cd GlazeWM-Config-Editor
    ```

2.  **Install frontend dependencies**
    ```bash
    npm install
    ```

### Running the Application

1.  **Start development server**
    To run the application in development mode (with hot-reloading for frontend changes):
    ```bash
    npm run tauri dev
    ```
    This will open the desktop application window.

2.  **Build and run the production application**
    To create a production-ready executable for your operating system:
    ```bash
    npm run tauri build
    ```
    The generated executable can typically be found in `src-tauri/target/release` or `src-tauri/target/debug` (for debug builds).

## 📁 Project Structure

```
GlazeWM-Config-Editor/
├── .github/              # GitHub Actions workflows and other configurations
├── .gitignore            # Files/directories to ignore in Git
├── CHANGELOG.md          # Project change log
├── index.html            # Main HTML file for the frontend
├── package.json          # Node.js project metadata and scripts
├── postcss.config.js     # PostCSS configuration for styling
├── src-tauri/            # Tauri application backend (Rust code, tauri.conf.json)
│   ├── src/              # Rust source files
│   ├── Cargo.toml        # Rust package manifest
│   └── tauri.conf.json   # Tauri configuration file
├── src/                  # Frontend source code (React, TypeScript)
│   ├── assets/           # Static assets like images, icons
│   ├── components/       # Reusable React components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Application pages/views
│   ├── styles/           # Global styles or Tailwind CSS directives
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main React application component
│   └── main.tsx          # Frontend entry point
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build tool configuration
```

## ⚙️ Configuration

### Frontend Configuration
-   `tailwind.config.js`: Customize your Tailwind CSS theme, plugins, and utility classes.
-   `postcss.config.js`: Configure PostCSS plugins, typically for Tailwind CSS integration.
-   `vite.config.ts`: Adjust Vite build options, development server settings, and plugins.
-   `tsconfig.json`: Manage TypeScript compiler options for the frontend.

### Tauri Configuration
-   `src-tauri/tauri.conf.json`: This file defines the core behavior of your Tauri application, including window settings, plugins, capabilities, and build options.

## 🔧 Development

### Available Scripts

In the project directory, you can run:

| Command                | Description                                                          |
| :--------------------- | :------------------------------------------------------------------- |
| `npm run dev`          | Starts the Vite development server for the frontend.                 |
| `npm run build`        | Builds the frontend for production to the `dist` folder.             |
| `npm run preview`      | Serves the production build locally for testing.                     |
| `npm run check`        | Runs TypeScript type checking.                                       |
| `npm run lint`         | Lints the project files using ESLint.                                |
| `npm run tauri dev`    | Starts the Tauri application with the frontend in development mode.  |
| `npm run tauri build`  | Builds the production-ready Tauri desktop application executable.    |

## 🚀 Deployment

The application is deployed by building an executable using Tauri.

### Production Build

To create optimized executables for your target platform:
```bash
npm run tauri build
```
After the build completes, the installers and executables will be located in the `src-tauri/target/release` directory (or similar, depending on your OS and build options). These can then be distributed to users.

## 🤝 Contributing

We welcome contributions to improve the GlazeWM Config Editor! If you have suggestions, bug reports, or want to contribute code, please refer to our [Contributing Guide](CONTRIBUTING.md) <!-- TODO: Create a CONTRIBUTING.md file --> for details.

### Development Setup for Contributors

1.  Follow the [Quick Start](#🚀-quick-start) instructions to get the project running locally.
2.  Make your changes in the `src/` (frontend) or `src-tauri/` (Rust backend) directories.
3.  Test your changes using `npm run tauri dev`.
4.  Ensure your code passes linting and type checks: `npm run lint` and `npm run check`.
5.  Submit a pull request with a clear description of your changes.

## 📄 License

This project is currently without an explicit license in the repository. Please contact the author for licensing details. <!-- TODO: Add a LICENSE file, e.g., MIT, and update this section -->

## 🙏 Acknowledgments

-   **GlazeWM**: For providing an excellent tiling window manager for Windows.
-   **Tauri**: For enabling cross-platform desktop application development with web technologies.
-   **React**: For the powerful and flexible UI library.
-   **Vite**: For the blazing-fast development experience.
-   **Tailwind CSS**: For simplifying CSS and enabling rapid UI development.
-   **Zustand** and **TanStack Query**: For efficient state and data management.

## 📞 Support & Contact

-   🐛 **Issues**: If you encounter any bugs or have feature requests, please open an issue on [GitHub Issues](https://github.com/axelumatica/GlazeWM-Config-Editor/issues).
-   📧 **Contact**: For other inquiries, you can reach out to axelumatica via their GitHub profile.

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [axelumatica](https://github.com/axelumatica)

</div>
