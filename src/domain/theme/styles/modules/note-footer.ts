export const CSS_NOTE_FOOTER = `/* ═══════════════════════════════════════════
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

.garden-note-pagination .garden-pipe { color: var(--border); user-select: none; }`;
