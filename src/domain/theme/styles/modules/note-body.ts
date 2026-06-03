export const CSS_NOTE_BODY = `/* ═══════════════════════════════════════════
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
.garden-note-body tbody tr:nth-child(even) { background: var(--bg-subtle); }`;
