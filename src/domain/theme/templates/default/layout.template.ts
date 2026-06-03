export const LAYOUT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{{description}}">
  <title>{{title}}</title>
  {{stylesheetLink}}
  <style>{{inlineStyles}}</style>
</head>
<body>
  <header class="garden-nav">
    <div class="garden-nav-header">
      <div class="garden-brand">
        <div class="garden-logo"></div>
        <a href="{{baseUrl}}/" class="garden-site-title">{{siteTitle}}</a>
      </div>
      <button class="garden-menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span class="garden-menu-icon"></span>
      </button>
      <div class="garden-nav-links">
        {{navLinks}}
      </div>
    </div>
  </header>

  <main class="garden-content">{{content}}</main>

  <footer class="garden-footer">
    <div class="garden-footer-inner">
      <p>Cultivated with <a href="https://obsidian-garden.ai" target="_blank" rel="noopener">Obsidian Garden</a></p>
      <p class="garden-footer-stats">{{stats}}</p>
    </div>
  </footer>

  <script>
(function() {
  var toggle = document.querySelector('.garden-menu-toggle');
  var navLinks = document.querySelector('.garden-nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function() {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('garden-nav-open');
      toggle.classList.toggle('garden-menu-active');
    });
  }

  var searchInput = document.querySelector('.garden-search-input:not(.garden-search-pro)');
  var cards = document.querySelectorAll('.garden-card');
  var noteCount = document.querySelector('.garden-note-count');

  if (searchInput && cards.length > 0) {
    searchInput.addEventListener('input', function(e) {
      var query = e.target.value.toLowerCase().trim();
      var visibleCount = 0;

      cards.forEach(function(card) {
        var title = card.getAttribute('data-title') || '';
        var excerpt = card.getAttribute('data-excerpt') || '';
        var tags = card.getAttribute('data-tags') || '';
        var match = query === '' ||
          title.toLowerCase().indexOf(query) !== -1 ||
          excerpt.toLowerCase().indexOf(query) !== -1 ||
          tags.toLowerCase().indexOf(query) !== -1;

        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      if (noteCount) {
        noteCount.textContent = visibleCount + ' note' + (visibleCount !== 1 ? 's' : '');
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('garden-nav-open')) {
      navLinks.classList.remove('garden-nav-open');
      if (toggle) {
        toggle.classList.remove('garden-menu-active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
})();
  </script>
  {{searchScript}}
</body>
</html>`;