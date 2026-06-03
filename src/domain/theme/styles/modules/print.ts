export const CSS_PRINT = `/* ═══════════════════════════════════════════
   Print
   ═══════════════════════════════════════════ */
@media print {
  .garden-nav, .garden-footer, .garden-note-pagination,
  .garden-toc, .garden-related, .garden-comments { display: none; }

  .garden-note-body { font-size: 11pt; line-height: 1.6; }

  .garden-note-body a::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: var(--text-secondary);
  }
}`;
