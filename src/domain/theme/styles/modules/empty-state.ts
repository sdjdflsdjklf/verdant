export const CSS_EMPTY_STATE = `/* ═══════════════════════════════════════════
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

.garden-empty-subtext { color: var(--text-secondary); font-size: 0.9rem; }`;
