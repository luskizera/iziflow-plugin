## About

IziFlow is a FigJam plugin that automates user flow creation from a **structured YAML description (IziFlow YAML syntax)**.

## Main Documentation

- **[IziFlow YAML Syntax](docs/yaml-syntax.md)** <--- **START HERE!**
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

To run the plugin locally while developing, open a terminal and run the following command:

```bash
npm run dev
```

This single command starts a process that watches and compiles both the UI (`src/`) and the plugin's main code (`src-code/`) simultaneously. Changes to the UI will reload automatically (HMR). Changes to the plugin code require a manual reload of the plugin within Figma.

### Development mode includes:
- Hot Module Replacement (HMR) for the UI
- Automatic recompilation of plugin code upon saving
- Source maps for easier debugging
- Preserved `console.log` outputs

## Production Build

To generate the final, optimized version of the plugin for distribution, run:

```bash
npm run build
```
This single command bundles both the UI and the plugin code, making them ready for packaging.

## Available Scripts

| Command         | Description                                          |
| :-------------- | :--------------------------------------------------- |
| `npm run dev`   | Compiles UI and plugin code in watch mode.           |
| `npm run build` | Builds the UI and plugin code for production.        |
| `npm run preview`| Serves the production UI locally for inspection.     |
| `npm run hmr`   | Starts a hot-reloading dev server for the UI only.   |

## Adding to Figma (Development Mode)

1.  Make sure the `npm run dev` process is running.
2.  Open the Figma Desktop App.
3.  Go to the main menu: **Plugins > Development > Import plugin from manifest…**
4.  Navigate to your IziFlow project folder and select the `manifest.json` file (usually found in the `dist/` or `.tmp/` folder after the first build — check your build config).
5.  The “IziFlow V2” plugin (or your manifest name) will appear in your development plugins list, ready to run inside FigJam.

### Developing Inside Figma

- **Reload Plugin:** Press `Ctrl/Cmd + Alt + P` to quickly close and reopen the plugin after editing `src-code/`.
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

- Learn the **[IziFlow YAML Syntax](docs/yaml-syntax.md)**.
- Understand the [Usage Workflow](docs/workflow.md).
- Explore the project’s detailed [Architecture](docs/architecture.md).
