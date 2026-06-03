export const CSS_RESPONSIVE = `/* ═══════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════ */
@media (max-width: 640px) {
  .garden-menu-toggle { display: flex; align-items: center; }

  .garden-nav-links {
    display: none;
    flex-direction: column;
    width: 100%;
    gap: 4px;
    padding: 8px 0 12px;
  }

  .garden-nav-links.garden-nav-open { display: flex; }

  .garden-nav-header { flex-wrap: wrap; }

  .garden-card-grid { grid-template-columns: 1fr; }

  .garden-content { padding: 24px 16px 60px; }

  .garden-home-header { padding-top: 8px; margin-bottom: 32px; }

  .garden-search-container { max-width: none; }

  .garden-note-count { width: 100%; text-align: center; }

  .garden-note-header h1 { font-size: 1.7rem; }

  .garden-note {
    grid-template-columns: 1fr;
    max-width: 100%;
  }

  .garden-note-main { grid-column: 1; }

  .garden-toc {
    grid-column: 1;
    grid-row: auto;
    position: static;
    top: auto;
    padding-right: 0;
    margin-bottom: 24px;
  }

  .garden-toc-toggle { display: block; }

  .garden-toc-nav {
    display: none;
    padding: 8px 0;
  }

  .garden-toc-nav.garden-toc-open { display: block; }

  .garden-comments { grid-column: 1; }

  .garden-note-body h1 { font-size: 1.5rem; }
  .garden-note-body h2 { font-size: 1.2rem; }
}

@media (min-width: 641px) and (max-width: 1024px) {
  .garden-content { padding: 40px 20px 60px; }
  .garden-card-grid { grid-template-columns: repeat(2, 1fr); }

  .garden-note {
    grid-template-columns: 1fr;
    max-width: 680px;
  }

  .garden-note-main { grid-column: 1; }

  .garden-toc {
    grid-column: 1;
    grid-row: auto;
    position: static;
    top: auto;
    padding-right: 0;
    margin-bottom: 24px;
  }

  .garden-toc-toggle { display: block; }

  .garden-toc-nav {
    display: none;
    padding: 8px 0;
  }

  .garden-toc-nav.garden-toc-open { display: block; }

  .garden-comments { grid-column: 1; }
}

@media (min-width: 1025px) {
  .garden-card-grid { grid-template-columns: repeat(3, 1fr); }
}`;
