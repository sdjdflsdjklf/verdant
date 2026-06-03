export const CSS_VARIABLES = `/* Obsidian Garden */
:root {
  --bg: #faf9f6;
  --bg-elevated: #ffffff;
  --bg-subtle: #f2f0eb;
  --text: #1c1917;
  --text-secondary: #78716c;
  --text-tertiary: #a8a29e;
  --accent: #4f46e5;
  --accent-hover: #4338ca;
  --accent-subtle: rgba(79, 70, 229, 0.08);
  --accent-ring: rgba(79, 70, 229, 0.2);
  --warm: #d97706;
  --warm-subtle: rgba(217, 119, 6, 0.1);
  --border: #e7e5e4;
  --border-strong: #d6d3d1;
  --code-bg: #f5f5f4;
  --shadow-1: 0 1px 2px 0 rgba(0,0,0,0.04);
  --shadow-2: 0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.04);
  --shadow-3: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.04);
  --shadow-4: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.03);
  --font-serif: "Source Serif 4", Georgia, "Times New Roman", serif;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SF Mono", "Fira Code", "JetBrains Mono", Consolas, monospace;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; -webkit-text-size-adjust: 100%; }

body {
  font-family: var(--font-sans);
  line-height: 1.75;
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}`;
