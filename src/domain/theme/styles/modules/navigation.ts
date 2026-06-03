export const CSS_NAVIGATION = `/* ═══════════════════════════════════════════
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
}`;
