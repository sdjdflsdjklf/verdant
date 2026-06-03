export const CSS_PAGINATION = `/* ═══════════════════════════════════════════
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
}`;
