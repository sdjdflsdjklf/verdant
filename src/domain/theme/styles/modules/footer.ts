export const CSS_FOOTER = `/* ═══════════════════════════════════════════
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

.garden-footer-stats { font-size: 0.78rem; opacity: 0.7; }`;
