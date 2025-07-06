# IziFlow

IziFlow is a Figma/FigJam plugin designed to automate the creation of user flow diagrams using a simple Markdown-based syntax. It allows designers and developers to quickly translate textual descriptions of user flows into visual representations directly within their design environment.

## Project Purpose and Context

The primary goal of IziFlow is to streamline the process of designing and documenting user flows. By using an intuitive text-based input, users can avoid the manual and often time-consuming task of creating diagrams with traditional design tools. This is particularly useful for:

*   Rapidly prototyping and iterating on user flows.
*   Ensuring consistency in visual documentation.
*   Facilitating collaboration between designers, developers, and product managers.
*   Allowing for easy version control and updates to flow diagrams.

## Technologies Used

IziFlow is built with a modern web technology stack:

*   **UI Framework**: [React](https://react.dev/) for building the plugin's user interface.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) for type safety and improved developer experience in both the UI and the Figma plugin code.
*   **Build Tool**: [Vite](https://vitejs.dev/) for fast development and optimized builds for both the UI (`vite.config.ts`) and the Figma plugin code (`vite.config.code.ts`).
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS styling, configured in `tailwind.config.js` and processed with `postcss.config.js`.
*   **Figma Plugin API**: Utilizes Figma's plugin API to interact with the Figma and FigJam canvas.
*   **Package Manager**: Likely npm or pnpm (based on `package.json` and `package-lock.json`).

## Repository Structure

The repository is organized into several key directories:

```
.
├── .tmp/                   # Temporary directory for build outputs
├── docs/                   # Project documentation
│   ├── flows/              # Business flow documentation
│   ├── modules/            # Module-specific documentation
│   └── theme/              # Theme and design system documentation
├── public/                 # Static assets for the plugin UI (if any)
├── shared/                 # Code shared between the plugin UI and Figma plugin code
│   ├── schemas/            # Zod schema definitions (e.g., schema.ts)
│   └── types/              # TypeScript type definitions (e.g., flow.types.ts)
├── src/                    # Source code for the plugin UI (React components)
│   ├── components/         # UI components (reusable and feature-specific)
│   ├── lib/                # Utility functions for the UI
│   ├── primitives/         # Base styling files (e.g., colors.css)
│   ├── types/              # UI-specific TypeScript types
│   └── main.tsx            # Entry point for the React application
├── src-code/               # Source code for the Figma plugin (runs in Figma's sandbox)
│   ├── assets/             # SVG icons and other assets for the plugin
│   ├── config/             # Configuration files for the plugin (icons, layout, styles)
│   ├── lib/                # Core logic for the plugin (node creation, layout)
│   ├── utils/              # Utility functions for the plugin code
│   └── code.ts             # Main entry point for the Figma plugin logic
├── index.html              # HTML entry point for the plugin UI
├── package.json            # Project metadata, dependencies, and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration for the project
├── vite.config.ts          # Vite configuration for the UI
└── vite.config.code.ts     # Vite configuration for the Figma plugin code
```

*   **`docs/`**: Contains all project documentation, including details on modules, business flows, and the design system.
*   **`shared/`**: Holds TypeScript types and schemas (`zod`) that are used by both the plugin UI (`src/`) and the core plugin logic (`src-code/`). This ensures consistency in data structures.
*   **`src/`**: Contains the React-based user interface for the plugin. This is what the user interacts with in the Figma plugin panel.
    *   `components/`: Reusable UI elements and components specific to plugin features.
    *   `lib/`: Utility functions primarily for the UI.
    *   `main.tsx`: The main entry point for the React application.
*   **`src-code/`**: Contains the core TypeScript logic that interacts with the Figma API. This code runs in Figma's sandboxed plugin environment.
    *   `assets/`: Stores SVG icons and other graphical assets.
    *   `config/`: Configuration for aspects like node styling, layout parameters, and icon mappings.
    *   `lib/`: Core functionalities like creating Figma nodes (frames, text, connectors), parsing Markdown, and applying layouts.
    *   `utils/`: Helper functions for the plugin's backend logic.
    *   `code.ts`: The entry point for the plugin's execution within Figma.
*   **Configuration Files**:
    *   `vite.config.ts` and `vite.config.code.ts`: Configure the Vite build process for the UI and plugin code, respectively.
    *   `tailwind.config.js`: Configures Tailwind CSS, including custom themes, colors, and fonts.
    *   `tsconfig.json` (and variants): Define TypeScript compiler options.

## How to Set Up and Run the Project

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm)
*   [Figma Desktop App](https://www.figma.com/downloads/)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd iziflowv2
    ```

2.  **Install dependencies:**
    The project uses npm for package management.
    ```bash
    npm install
    ```
    (If you prefer `pnpm` or `yarn`, you can use `pnpm install` or `yarn install` respectively, assuming `package-lock.json` is compatible or you remove it and `node_modules` first.)

### Development

To run the plugin in development mode with hot-reloading for both the UI and the plugin code:

1.  **Build and watch UI changes:**
    This command compiles the React UI and watches for changes.
    ```bash
    npm run dev
    ```

2.  **Build and watch plugin code changes:**
    This command compiles the Figma plugin code (`src-code/code.ts`) and watches for changes.
    ```bash
    npm run devcode
    ```

3.  **Load the plugin in Figma:**
    *   Open the Figma desktop app.
    *   Go to **Plugins** > **Development** > **Import plugin from manifest...**
    *   Navigate to your project directory and select the `.tmp/manifest.json` file. (Note: The original README mentioned `dist/manifest.json`, but Vite builds typically output to `dist` by default. The `vite.config.ts` specifies `.tmp` as `outDir`. Please verify the correct manifest location after the first build if issues arise).

    Once imported, you can run the plugin from the Figma/FigJam plugin menu. Changes to your UI or plugin code should trigger a rebuild, and you can reload the plugin in Figma to see the updates.

### Production Build

To create a production-ready version of the plugin:

1.  **Build the UI:**
    ```bash
    npm run build
    ```

2.  **Build the plugin code:**
    ```bash
    npm run buildcode
    ```
    This will generate optimized files in the `.tmp/` directory (or your configured output directory), ready for distribution or packaging.

### Available Scripts

Refer to the `scripts` section in `package.json` for all available commands:

*   `npm run dev`: Starts the Vite development server for the UI with HMR.
*   `npm run devcode`: Starts the Vite development server for the plugin code with HMR.
*   `npm run build`: Builds the UI for production.
*   `npm run buildcode`: Builds the plugin code for production.
*   `npm run preview`: Serves the production build locally for preview.
*   `npm run hmr`: Alias for `vite` (likely for UI development).
*   `npm run zip`: (If configured) Creates a zip file for distribution.

This `README.md` provides a comprehensive overview of the IziFlow project. For more detailed information on specific modules, business flows, and design system conventions, please refer to the documentation in the `/docs` directory.
