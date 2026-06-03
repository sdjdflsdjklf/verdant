export const CSS_NOTE_PAGE = `/* ═══════════════════════════════════════════
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
}`;
