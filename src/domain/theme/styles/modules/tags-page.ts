export const CSS_TAGS_PAGE = `/* ═══════════════════════════════════════════
   Tags Page
   ═══════════════════════════════════════════ */
.garden-tags {
  max-width: 680px;
  margin: 0 auto;
}

.garden-tags h1 {
  font-family: var(--font-serif);
  font-size: 1.8rem;
  margin-bottom: 28px;
  font-weight: 600;
}

.garden-tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: baseline;
}

.garden-tag-cloud .garden-tag {
  padding: 5px 14px;
  transition: all 0.2s ease;
}

.garden-tag-cloud .garden-tag:hover {
  transform: scale(1.06);
}`;
