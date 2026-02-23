# Changelog

All notable changes to this project will be documented in this file.

## [2026-02-23]
### Added
- Cycle-safe positioning for bifurcated layout to avoid crashes on loops.
- Guide YAML `docs/guides/login-flow-sem-loop.yaml` (no loop, stable layout).
- Guide YAML `docs/guides/login-flow-com-loop-anchors.yaml` (loop supported via anchors/offsets).
- Environment-aware logging for plugin and UI (info/debug only in dev/test).
- Shared logger modules for plugin and UI to enforce logging policy.

### Changed
- Reduced verbose logs for HistoryStorage, App Handler/Render, Smart Layout, UserPreferences, Vertical Management, Bifurcated Connectors, and plugin message traces.

### Fixed
- Prevented layout crashes when topological sort skips nodes due to cycles.
