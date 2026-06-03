export const CSS_RELATED_NOTES = `/* ═══════════════════════════════════════════
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
}`;
