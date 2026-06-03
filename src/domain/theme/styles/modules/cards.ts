export const CSS_CARDS = `/* ═══════════════════════════════════════════
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
}`;
