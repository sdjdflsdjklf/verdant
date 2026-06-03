export const CSS_HOME = `/* ═══════════════════════════════════════════
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
}`;
