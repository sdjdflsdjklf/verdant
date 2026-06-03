export const NOTE_HTML = `<article class="garden-note">
  <aside class="garden-toc">
    <button class="garden-toc-toggle" aria-expanded="false">
      Table of Contents
      <span class="garden-toc-arrow"></span>
    </button>
    <nav class="garden-toc-nav">
      {{tocHtml}}
    </nav>
  </aside>

  <div class="garden-note-main">
    <header class="garden-note-header">
      <h1>{{title}}</h1>
      <div class="garden-note-meta">
        {{date}}
      </div>
    </header>

    <div class="garden-note-body">
      {{bodyHtml}}
    </div>

    <div class="garden-note-tags">
      {{tagsHtml}}
    </div>

    <section class="garden-related">
      <h2 class="garden-related-heading">Related Notes</h2>
      {{relatedNotesHtml}}
    </section>

    <nav class="garden-note-pagination">
      {{pagination}}
    </nav>
  </div>

  <section class="garden-comments">
    <h2 class="garden-comments-heading">Comments</h2>
    {{commentsHtml}}
  </section>
</article>

<script>
(function() {
  var tocToggle = document.querySelector('.garden-toc-toggle');
  var tocNav = document.querySelector('.garden-toc-nav');
  if (tocToggle && tocNav) {
    if (!tocNav.innerHTML.trim()) {
      tocToggle.style.display = 'none';
    } else {
      tocToggle.addEventListener('click', function() {
        var expanded = tocToggle.getAttribute('aria-expanded') === 'true';
        tocToggle.setAttribute('aria-expanded', !expanded);
        tocNav.classList.toggle('garden-toc-open');
        tocToggle.classList.toggle('garden-toc-active');
      });
    }
  }

  var relatedSection = document.querySelector('.garden-related');
  if (relatedSection && !relatedSection.querySelector('.garden-related-item')) {
    relatedSection.style.display = 'none';
  }

  var commentsSection = document.querySelector('.garden-comments');
  if (commentsSection && !commentsSection.querySelector('.giscus')) {
    commentsSection.style.display = 'none';
  }
})();
</script>`;