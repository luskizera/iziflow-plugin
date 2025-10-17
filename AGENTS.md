# Repository Guidelines

## Project Structure & Module Organization
- `src/` — React UI for the plugin (`index-react.tsx`, components, styles, Tailwind).
- `src-code/` — Figma plugin code (`code.ts`), configs, utilities. Built to `code.js`.
- `shared/` — Cross-cutting `schemas/` and `types/`. Aliases: `@/*` → `src/*`, `@shared/*` → `shared/*`.
- Output: `.tmp/` (intermediate) and `dist/` (final `index.html`, `code.js`, `manifest.json`).
- Config: `vite.config.ts` (UI), `vite.config.code.ts` (plugin code), `figma.config.ts` (manifest + build prefs).

## Build, Test, and Development
- `npm run dev` — Watch UI build to `.tmp/` (integrates with vite-figma-plugin).
- `npm run devcode` — Watch plugin code build to `.tmp/code.js`.
- `npm run hmr` — Vite dev server for rapid UI iteration.
- `npm run build` / `npm run buildcode` — Production builds for UI and plugin code.
- `npm run preview` — Preview the built UI in a local server.
- `npm run zip` — Build a distributable ZIP (sets `MODE=zip`).
- `npm run test:validate` — TypeScript validation for the test runner (lightweight).
- `npm run test:build` — Sanity check that both bundles build cleanly.

## Coding Style & Naming Conventions
- Language: TypeScript (strict), React 19, Vite 5, Tailwind 4.
- Formatting: Prettier + `prettier-plugin-tailwindcss`; 2‑space indentation.
- Linting: ESLint with `@typescript-eslint` and `@figma/figma-plugins` rules.
- Naming: PascalCase React components; camelCase variables/functions; UPPER_SNAKE_CASE constants.
- Files: `.tsx` for UI components, `.ts` for logic/utilities; keep paths using `@/` and `@shared/` aliases.

## Testing Guidelines
- Current tests focus on type and build validation. Run `npm run test:build` in CI.
- Recommended (when adding tests):
  - UI: `*.test.tsx` colocated with components under `src/`.
  - Plugin code: `*.spec.ts` colocated under `src-code/`.
- Aim for meaningful unit coverage around parsing, layout, and messaging utilities.

## Commit & Pull Request Guidelines
- Use Conventional Commits where possible: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
- Commits should be small and focused; reference issues like `#123`.
- PRs must include: clear description, rationale, testing steps, and screenshots/GIFs for UI changes. Note any manifest/config changes.

## Security & Configuration Tips
- The manifest allows `networkAccess: "*"`. Avoid embedding secrets; prefer runtime configuration.
- Keep Figma typings up to date and ensure fonts/assets are licensed for distribution.
- Do not commit build artifacts from `dist/` unless explicitly required for release.

