import { DEFAULT_THEME_CSS } from "./default.theme";

const DARK_OVERRIDES = `
:root {
  --bg: #0c0a09;
  --bg-elevated: #1c1917;
  --bg-subtle: #292524;
  --text: #fafaf9;
  --text-secondary: #a8a29e;
  --text-tertiary: #78716c;
  --accent: #818cf8;
  --accent-hover: #a5b4fc;
  --accent-subtle: rgba(129, 140, 248, 0.12);
  --accent-ring: rgba(129, 140, 248, 0.25);
  --warm: #fbbf24;
  --warm-subtle: rgba(251, 191, 36, 0.1);
  --border: #44403c;
  --border-strong: #57534e;
  --code-bg: #292524;
  --shadow-1: 0 1px 2px 0 rgba(0,0,0,0.3);
  --shadow-2: 0 1px 3px 0 rgba(0,0,0,0.35), 0 1px 2px -1px rgba(0,0,0,0.25);
  --shadow-3: 0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3);
  --shadow-4: 0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.35);
}

body { background: var(--bg); }

.garden-nav { background: rgba(12, 10, 9, 0.85); }

.garden-card { background: var(--bg-elevated); }

.garden-search-input {
  background-color: var(--bg-elevated);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E");
}

.garden-search-input:focus { background-color: var(--bg-subtle); }

.garden-search-results { background: var(--bg-elevated); }

.garden-search-result-item:hover { background: var(--accent-subtle); }

.garden-search-highlight { background: var(--warm-subtle); color: var(--warm); }

.garden-note-body pre { background: var(--bg); }

.garden-empty-state { border-color: var(--border-strong); }
`;

export const DARK_THEME_CSS = DEFAULT_THEME_CSS + DARK_OVERRIDES;