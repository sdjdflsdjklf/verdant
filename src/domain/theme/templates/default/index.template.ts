export const INDEX_HTML = `<div class="garden-home">
  <header class="garden-home-header">
    <p class="garden-home-description">{{description}}</p>
    <div class="garden-search-container">
      {{searchHtml}}
      <span class="garden-note-count">{{noteCount}} notes</span>
      {{searchResultsContainer}}
    </div>
  </header>

  <section class="garden-card-grid">
    {{noteCards}}
  </section>

  <div class="garden-empty-state" style="display:{{isEmptyDisplay}}">
    <span class="garden-empty-icon"></span>
    <p class="garden-empty-text">No notes published yet</p>
    <p class="garden-empty-subtext">Your first note marks the beginning of your garden.</p>
  </div>

  <nav class="garden-pagination" style="display:{{paginationDisplay}}">
    {{paginationHtml}}
  </nav>
</div>`;