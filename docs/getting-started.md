## About

IziFlow is a Figma and FigJam plugin that automates user flow creation from a **simple textual description using the IziFlow Markdown syntax**.

## Main Documentation

- **[IziFlow Markdown Syntax](docs/markdown-syntax.md)** <--- **START HERE!**
- [Usage Workflow](docs/workflow.md)
- [Architecture](docs/architecture.md)
- [Generated Node Structure](docs/components.md) (Technical details of created elements)
- [AI Assistant (GPT)](docs/ai-instructions.md) (Instructions for using GPT to define flows)

# Quick Guide for Developers

This section is for anyone who wants to contribute to IziFlow’s development.

## Installation (Development)

1.  Clone the IziFlow repository.
2.  Open your terminal and navigate to the project folder.
3.  Install dependencies:
    ```bash
    npm install # or pnpm install / yarn install
    ```

## Prerequisites (Development)

- Node.js (recommended version listed in `package.json`, e.g., 18+)
- Package manager: NPM, PNPM, or Yarn
- Figma Desktop App installed (required to run and test plugins locally)
- Figma account (free or paid) with developer permissions enabled (if applicable)

## Local Development

To run the plugin locally while developing, you’ll need two processes running in separate terminals:

1.  **Compile the UI (React/Vite) in watch mode:**
    ```bash
    npm run dev
    ```
    This compiles the user interface and automatically reloads it (HMR) whenever you make changes inside the `src/` folder.

2.  **Compile the Plugin Code (Figma API/TypeScript) in watch mode:**
    ```bash
    npm run devcode
    ```
    This compiles the code that interacts with the Figma API (inside `src-code/`) whenever you save a change.  
    **Note:** Changes here require you to manually reload the plugin inside Figma.

### Development mode includes:
- Hot Module Replacement (HMR) for the UI
- Automatic recompilation of plugin code upon saving
- Source maps for easier debugging via Figma/Navigator console
- Preserved `console.log` outputs

## Production Build

To generate the final optimized version of the plugin for distribution:

1.  **Build the UI:**
    ```bash
    npm run build
    ```
2.  **Build the Plugin Code:**
    ```bash
    npm run buildcode
    ```
3.  **Package for Distribution:**
    ```bash
    npm run zip
    ```
    This command combines the compiled assets (UI + plugin code) and the `manifest.json` into a `.zip` file inside the `/zip` folder — ready to be published to the Figma Community or shared privately.

## Available Scripts

| Command            | Description                                                |
| :----------------- | :--------------------------------------------------------- |
| `npm run dev`      | Compiles the UI in watch mode (development)                |
| `npm run devcode`  | Compiles the plugin code in watch mode (development)       |
| `npm run build`    | Builds the UI for production                               |
| `npm run buildcode`| Builds the plugin code for production                      |
| `npm run zip`      | Generates the final ZIP file for distribution in `/zip`    |

## Adding to Figma (Development Mode)

1.  Make sure both `dev` and `devcode` processes are running.
2.  Open the Figma Desktop App.
3.  Go to the main menu: **Plugins > Development > Import plugin from manifest…**
4.  Navigate to your IziFlow project folder and select the `manifest.json` file (usually found in the `dist/` or `.tmp/` folder after the first build — check your build config).
5.  The “IziFlow V2” plugin (or your manifest name) will appear in your development plugins list, ready to run inside Figma or FigJam.

### Developing Inside Figma

- **Reload Plugin:** Press `Ctrl/Cmd + Alt + P` to quickly close and reopen the plugin after editing `src-code/` (recompiled by `npm run devcode`).
- **Open Console:** Press `Ctrl/Cmd + Alt + I` (or go to *Plugins > Development > Open Console*) to view `console.log` outputs from your plugin code (`src-code/`).  
  For UI logs (`src/`), inspect the plugin window/iframe via browser DevTools or Figma’s internal DevTools.

## Project Structure

```

shared/     # Types, Schemas, and Utilities shared between UI and Plugin
src/        # UI source code (React, CSS, Assets)
src-code/   # Plugin code (Figma API interactions, Core Logic)
docs/       # Project documentation
.tmp/       # Temporary development/intermediate builds
dist/       # Final build output (pre-zip) - may vary

```

## Next Steps

- Learn the **[IziFlow Markdown Syntax](docs/markdown-syntax.md)**.
- Understand the [Usage Workflow](docs/workflow.md).
- Explore the project’s detailed [Architecture](docs/architecture.md).