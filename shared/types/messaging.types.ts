// shared/types/messaging.types.ts
import type { HistoryEntry, LayoutPreferences } from './flow.types';

export interface EventTS {
  'generate-flow': {
    yaml: string;
    mode: 'light' | 'dark';
    accentColor: string;
  };
  'generation-success': { message: string; };
  'generation-error': { message: string; };
  'parse-error': { message: string; lineNumber?: number; };
  'debug': { message: string; data?: string; };
  closePlugin: {};
  'get-history': {};
  'history-data': { history: string[] };
  'history-updated': { history: HistoryEntry[] };
  // 'add-history-entry': { yaml: string }; // Note: Plugin adds internally now
  'clear-history-request': {};
  'remove-history-entry': { id: string };
  
  // Layout Preferences Events (Fase 7)
  'get-layout-preferences': {};
  'set-layout-preferences': { preferences: LayoutPreferences };
  'reset-layout-preferences': {};
  'layout-preferences-updated': { preferences: LayoutPreferences };
  'layout-preferences-error': { message: string };
}