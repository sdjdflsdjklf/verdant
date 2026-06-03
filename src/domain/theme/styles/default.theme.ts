export const DEFAULT_THEME_CSS = `/* Obsidian Garden */
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
}

/* ═══════════════════════════════════════════
   Navigation
   ═══════════════════════════════════════════ */
.garden-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(250, 249, 246, 0.82);
  backdrop-filter: blur(16px) saturate(1.8);
  -webkit-backdrop-filter: blur(16px) saturate(1.8);
  border-bottom: 1px solid var(--border);
}

.garden-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.garden-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.garden-logo {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  border-radius: 7px;
  display: grid;
  place-items: center;
  box-shadow: 0 1px 3px rgba(5, 150, 105, 0.3);
}

.garden-logo::after {
  content: "";
  width: 10px;
  height: 10px;
  border: 2px solid rgba(255,255,255,0.9);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
}

.garden-site-title {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.02em;
}

.garden-site-title:hover { color: var(--accent); }

.garden-menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
}

.garden-menu-toggle:hover { background: var(--bg-subtle); }

.garden-menu-icon {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  position: relative;
}

.garden-menu-icon::before,
.garden-menu-icon::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  left: 0;
  transition: 0.2s ease;
}

.garden-menu-icon::before { top: -6px; }
.garden-menu-icon::after { top: 6px; }

.garden-menu-active .garden-menu-icon { background: transparent; }
.garden-menu-active .garden-menu-icon::before { top: 0; transform: rotate(45deg); }
.garden-menu-active .garden-menu-icon::after { top: 0; transform: rotate(-45deg); }

.garden-nav-links { display: flex; gap: 4px; }

.garden-nav-link {
  padding: 6px 14px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.garden-nav-link:hover {
  color: var(--accent);
  background: var(--accent-subtle);
}

/* ═══════════════════════════════════════════
   Content
   ═══════════════════════════════════════════ */
.garden-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

/* ═══════════════════════════════════════════
   Home
   ═══════════════════════════════════════════ */
.garden-home-header {
  text-align: center;
  margin-bottom: 48px;
  padding-top: 16px;
}

.garden-home-description {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 28px;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.garden-search-container {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 380px;
  margin: 0 auto;
  position: relative;
}

.garden-search-input {
  flex: 1;
  padding: 10px 16px 10px 40px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: var(--font-sans);
  background: var(--bg-elevated);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a8a29e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 14px center;
  color: var(--text);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-1);
}

.garden-search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-ring), var(--shadow-2);
}

.garden-search-input::placeholder { color: var(--text-tertiary); }

.garden-search-results {
  display: none;
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 420px;
  overflow-y: auto;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-4);
  z-index: 40;
}

.garden-search-result-item {
  display: block;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: inherit;
  transition: background 0.12s ease;
}

.garden-search-result-item:last-child {
  border-bottom: none;
}

.garden-search-result-item:hover {
  background: var(--accent-subtle);
}

.garden-search-result-title {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
  line-height: 1.4;
}

.garden-search-result-excerpt {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.garden-search-result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.garden-search-result-tags .garden-tag {
  font-size: 0.7rem;
  padding: 2px 7px;
}

.garden-search-highlight {
  background: var(--warm-subtle);
  color: var(--warm);
  border-radius: 2px;
  padding: 0 2px;
  font-weight: 600;
}

.garden-search-empty,
.garden-search-error {
  padding: 24px 18px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.garden-search-error {
  color: var(--warm);
}

.garden-note-count {
  font-size: 0.82rem;
  color: var(--text-tertiary);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* ═══════════════════════════════════════════
   Cards
   ═══════════════════════════════════════════ */
.garden-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.garden-card {
  display: flex;
  flex-direction: column;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-1);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
}

.garden-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2.5px;
  background: linear-gradient(90deg, var(--warm), #f59e0b);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.garden-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-4);
  border-color: var(--border-strong);
}

.garden-card:hover::before { transform: scaleX(1); }

.garden-card-title {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.garden-card-excerpt {
  font-size: 0.87rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: auto;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.garden-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
}

.garden-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.garden-card-date {
  font-size: 0.78rem;
  color: var(--text-tertiary);
  white-space: nowrap;
}

/* ═══════════════════════════════════════════
   Tags
   ═══════════════════════════════════════════ */
.garden-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  background: var(--accent-subtle);
  color: var(--accent);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
}

a.garden-tag:hover {
  background: var(--accent);
  color: #fff;
}

/* ═══════════════════════════════════════════
   Note Page
   ═══════════════════════════════════════════ */
.garden-note {
  display: grid;
  grid-template-columns: 220px minmax(0, 720px);
  gap: 0 48px;
  max-width: 1040px;
  margin: 0 auto;
  align-items: start;
}

.garden-note-header {
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.garden-note-header h1 {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.garden-note-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.garden-note-meta::before {
  content: "";
  width: 6px;
  height: 6px;
  background: var(--warm);
  border-radius: 50%;
  flex-shrink: 0;
}

.garden-note-main {
  grid-column: 2;
}

/* ═══════════════════════════════════════════
   TOC Sidebar
   ═══════════════════════════════════════════ */
.garden-toc {
  grid-column: 1;
  grid-row: 1;
  position: sticky;
  top: 80px;
  padding-right: 16px;
}

.garden-toc-toggle {
  display: none;
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  text-align: left;
}

.garden-toc-arrow {
  float: right;
  width: 8px;
  height: 8px;
  border-right: 2px solid var(--text-secondary);
  border-bottom: 2px solid var(--text-secondary);
  transform: rotate(45deg);
  transition: transform 0.2s ease;
  margin-top: 4px;
}

.garden-toc-active .garden-toc-arrow {
  transform: rotate(-135deg);
  margin-top: 8px;
}

.garden-toc-nav {
  font-size: 0.83rem;
  line-height: 1.6;
}

.garden-toc-nav a {
  display: block;
  padding: 3px 0;
  color: var(--text-secondary);
  text-decoration: none;
  border-left: 2px solid transparent;
  padding-left: 12px;
  transition: all 0.15s ease;
}

.garden-toc-nav a:hover {
  color: var(--accent);
  border-left-color: var(--accent);
}

.garden-toc-nav a.garden-toc-active-link {
  color: var(--accent);
  border-left-color: var(--accent);
  font-weight: 500;
}

.garden-toc-nav .garden-toc-h2 { padding-left: 12px; }
.garden-toc-nav .garden-toc-h3 { padding-left: 28px; font-size: 0.8rem; }

.garden-note-body {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text);
}

.garden-note-body > *:first-child { margin-top: 0; }

.garden-note-body h1 {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  font-weight: 600;
  margin: 2.5rem 0 1rem;
  letter-spacing: -0.02em;
}

.garden-note-body h2 {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 600;
  margin: 2rem 0 0.75rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--border);
  scroll-margin-top: 80px;
}

.garden-note-body h3 {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.6rem;
  scroll-margin-top: 80px;
}

.garden-note-body h4 {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  margin: 1.3rem 0 0.5rem;
  color: var(--text-secondary);
}

.garden-note-body p { margin-bottom: 1.1rem; }

.garden-note-body a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid var(--accent-subtle);
  transition: border-color 0.15s ease;
}

.garden-note-body a:hover {
  border-bottom-color: var(--accent);
}

.garden-note-body strong { font-weight: 600; }

.garden-note-body ul,
.garden-note-body ol { margin: 0 0 1.1rem 1.5rem; }

.garden-note-body li { margin-bottom: 0.35rem; }

.garden-note-body li::marker { color: var(--warm); }

.garden-note-body code {
  background: var(--code-bg);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.84em;
  color: var(--accent-hover);
}

.garden-note-body pre {
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  padding: 1rem 1.2rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.2rem 0;
  line-height: 1.6;
}

.garden-note-body pre code {
  padding: 0;
  background: none;
  font-size: 0.86rem;
  color: var(--text);
}

.garden-note-body blockquote {
  border-left: 3px solid var(--warm);
  padding: 0.75rem 1.1rem;
  margin: 1.2rem 0;
  color: var(--text-secondary);
  font-style: italic;
  background: var(--warm-subtle);
  border-radius: 0 6px 6px 0;
}

.garden-note-body blockquote p:last-child { margin-bottom: 0; }

.garden-note-body img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: var(--shadow-2);
}

.garden-note-body hr {
  border: none;
  height: 1px;
  background: var(--border);
  margin: 2rem 0;
}

.garden-note-body table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 1.2rem 0;
  font-size: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}

.garden-note-body th {
  background: var(--bg-subtle);
  font-weight: 600;
  text-align: left;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.garden-note-body th,
.garden-note-body td {
  border-bottom: 1px solid var(--border);
  padding: 0.55rem 0.8rem;
}

.garden-note-body th:first-child, .garden-note-body td:first-child { padding-left: 1rem; }
.garden-note-body th:last-child, .garden-note-body td:last-child { padding-right: 1rem; }
.garden-note-body tbody tr:last-child td { border-bottom: none; }
.garden-note-body tbody tr:nth-child(even) { background: var(--bg-subtle); }

/* ═══════════════════════════════════════════
   Related Notes
   ═══════════════════════════════════════════ */
.garden-related {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.garden-related-heading {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 14px;
  color: var(--text);
}

.garden-related-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.garden-related-item a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: var(--text);
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.15s ease;
}

.garden-related-item a:hover {
  background: var(--accent-subtle);
  color: var(--accent);
}

.garden-related-item a::before {
  content: "";
  width: 4px;
  height: 4px;
  background: var(--warm);
  border-radius: 50%;
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════
   Comments
   ═══════════════════════════════════════════ */
.garden-comments {
  grid-column: 2;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

.garden-comments-heading {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text);
}

/* ═══════════════════════════════════════════
   Note Footer
   ═══════════════════════════════════════════ */
.garden-note-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.garden-note-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
  font-size: 0.9rem;
}

.garden-note-pagination a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;
}

.garden-note-pagination a:hover { color: var(--accent-hover); }

.garden-note-pagination .garden-pipe { color: var(--border); user-select: none; }

/* ═══════════════════════════════════════════
   Tags Page
   ═══════════════════════════════════════════ */
.garden-tags {
  max-width: 680px;
  margin: 0 auto;
}

.garden-tags h1 {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  margin-bottom: 28px;
  font-weight: 600;
}

.garden-tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: baseline;
}

.garden-tag-cloud .garden-tag {
  padding: 5px 14px;
  transition: all 0.2s ease;
}

.garden-tag-cloud .garden-tag:hover {
  transform: scale(1.06);
}

/* ═══════════════════════════════════════════
   Tag Detail
   ═══════════════════════════════════════════ */
.garden-tag-detail header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.garden-tag-detail header h1 {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  margin-bottom: 6px;
}

.garden-tag-detail header p { color: var(--text-secondary); font-size: 0.9rem; }

/* ═══════════════════════════════════════════
   Empty State
   ═══════════════════════════════════════════ */
.garden-empty-state {
  text-align: center;
  padding: 64px 24px;
  border: 2px dashed var(--border);
  border-radius: 16px;
  background: var(--bg-subtle);
}

.garden-empty-icon {
  display: block;
  margin: 0 auto 20px;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--warm-subtle), var(--accent-subtle));
  position: relative;
}

.garden-empty-icon::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 24px;
  border: 2.5px solid var(--warm);
  border-radius: 2px 2px 0 0;
  border-bottom-width: 0;
}

.garden-empty-icon::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  width: 10px;
  height: 2px;
  background: var(--warm);
}

.garden-empty-text {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  color: var(--text);
  margin-bottom: 6px;
}

.garden-empty-subtext { color: var(--text-secondary); font-size: 0.9rem; }

/* ═══════════════════════════════════════════
   Pagination
   ═══════════════════════════════════════════ */
.garden-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 48px;
  padding: 20px 0;
  flex-wrap: wrap;
}

.garden-pagination-prev,
.garden-pagination-next {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s ease;
}

.garden-pagination-prev:not(.garden-pagination-disabled),
.garden-pagination-next:not(.garden-pagination-disabled) {
  color: var(--accent);
  background: var(--accent-subtle);
}

.garden-pagination-prev:not(.garden-pagination-disabled):hover,
.garden-pagination-next:not(.garden-pagination-disabled):hover {
  background: var(--accent-ring);
}

.garden-pagination-disabled {
  color: var(--text-tertiary);
  background: var(--bg-subtle);
  cursor: default;
}

.garden-pagination-page {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  text-decoration: none;
  color: var(--text-secondary);
  transition: all 0.15s ease;
}

a.garden-pagination-page:hover {
  background: var(--accent-subtle);
  color: var(--accent);
}

.garden-pagination-active {
  background: var(--accent);
  color: #fff;
}

/* ═══════════════════════════════════════════
   Footer
   ═══════════════════════════════════════════ */
.garden-footer {
  text-align: center;
  padding: 40px 24px;
  color: var(--text-tertiary);
  font-size: 0.82rem;
  border-top: 1px solid var(--border);
  margin-top: 80px;
  background: var(--bg-subtle);
}

.garden-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.garden-footer a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.15s ease;
}

.garden-footer a:hover { color: var(--accent-hover); }

.garden-footer-stats { font-size: 0.78rem; opacity: 0.7; }

/* ═══════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════ */
@media (max-width: 640px) {
  .garden-menu-toggle { display: flex; align-items: center; }

  .garden-nav-links {
    display: none;
    flex-direction: column;
    width: 100%;
    gap: 4px;
    padding: 8px 0 12px;
  }

  .garden-nav-links.garden-nav-open { display: flex; }

  .garden-nav-header { flex-wrap: wrap; }

  .garden-card-grid { grid-template-columns: 1fr; }

  .garden-content { padding: 24px 16px 60px; }

  .garden-home-header { padding-top: 8px; margin-bottom: 32px; }

  .garden-search-container { max-width: none; }

  .garden-note-count { width: 100%; text-align: center; }

  .garden-note-header h1 { font-size: 1.7rem; }

  .garden-note {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  .garden-note-main { grid-column: 1; }

  .garden-toc {
    grid-column: 1;
    grid-row: auto;
    position: static;
    top: auto;
    padding-right: 0;
    margin-bottom: 24px;
  }

  .garden-toc-toggle { display: block; }

  .garden-toc-nav {
    display: none;
    padding: 8px 0;
  }

  .garden-toc-nav.garden-toc-open { display: block; }

  .garden-comments { grid-column: 1; }

  .garden-note-body h1 { font-size: 1.5rem; }
  .garden-note-body h2 { font-size: 1.2rem; }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .garden-content { padding: 40px 20px 60px; }
  .garden-card-grid { grid-template-columns: repeat(2, 1fr); }

  .garden-note {
    grid-template-columns: 1fr;
    max-width: 680px;
  }

  .garden-note-main { grid-column: 1; }

  .garden-toc {
    grid-column: 1;
    grid-row: auto;
    position: static;
    top: auto;
    padding-right: 0;
    margin-bottom: 24px;
  }

  .garden-toc-toggle { display: block; }

  .garden-toc-nav {
    display: none;
    padding: 8px 0;
  }

  .garden-toc-nav.garden-toc-open { display: block; }

  .garden-comments { grid-column: 1; }
}

@media (min-width: 1025px) {
  .garden-card-grid { grid-template-columns: repeat(3, 1fr); }
}

/* ═══════════════════════════════════════════
   Print
   ═══════════════════════════════════════════ */
@media print {
  .garden-nav, .garden-footer, .garden-note-pagination,
  .garden-toc, .garden-related, .garden-comments { display: none; }

  .garden-note-body { font-size: 11pt; line-height: 1.6; }

  .garden-note-body a::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: var(--text-secondary);
  }
}
`;