import { injectable } from "tsyringe";
import type { SiteConfig } from "../../types/publisher.types";
import type { SiteGeneratedFile, TagEntry } from "../../types/publisher.types";
import type { RelatedNoteEntry } from "../publisher/link-graph.service";
import { LAYOUT_HTML } from "./templates/default/layout.template";
import { INDEX_HTML } from "./templates/default/index.template";
import { NOTE_HTML } from "./templates/default/note.template";
import { TAGS_HTML } from "./templates/default/tags.template";
import { TAG_DETAIL_HTML } from "./templates/default/tag-detail.template";
import { getCombinedCss } from "./styles/module-registry";
import { DARK_THEME_CSS } from "./styles/dark.theme";

declare const __FLEXSEARCH_BUNDLE__: string;

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[<>:"/\\|?*#[\]{}()@!$&+=,;'`~%^]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pathToUrl(relativePath: string): string {
  return relativePath.replace(/\/index\.html$/, "/");
}

export interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}

export interface FeedEntry {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
}

interface TocItem {
  level: number;
  text: string;
  id: string;
}

@injectable()
export class ThemeRenderer {
  private readonly cssMap: Map<string, string> = new Map();

  constructor() {
    this.cssMap.set("default", getCombinedCss());
    this.cssMap.set("dark", DARK_THEME_CSS);
  }

  public getFlexSearchBundle(): string {
    return __FLEXSEARCH_BUNDLE__;
  }

  public getCSS(themeId: string): string {
    return this.cssMap.get(themeId) ?? this.cssMap.get("default") ?? "";
  }

  private static readonly PAGE_SIZE: number = 9;

  public renderIndex(
    files: SiteGeneratedFile[],
    config: SiteConfig,
  ): string {
    return this.renderIndexPage(files, config, 1);
  }

  public renderIndexPage(
    files: SiteGeneratedFile[],
    config: SiteConfig,
    page: number,
  ): string {
    const totalPages: number = Math.max(1, Math.ceil(files.length / ThemeRenderer.PAGE_SIZE));
    const start: number = (page - 1) * ThemeRenderer.PAGE_SIZE;
    const end: number = Math.min(start + ThemeRenderer.PAGE_SIZE, files.length);
    const pageFiles: SiteGeneratedFile[] = files.slice(start, end);

    const noteCards = pageFiles
      .map((f) => this.renderCard(f, config.baseUrl))
      .join("\n");

    const isEmpty = files.length === 0;
    const paginationHtml = this.buildIndexPagination(page, totalPages, config.baseUrl);
    const paginationDisplay = totalPages > 1 ? "flex" : "none";

    const indexHtml = INDEX_HTML
      .replace(/\{\{siteTitle\}\}/g, this.escapeHtml(config.title))
      .replace(/\{\{description\}\}/g, this.escapeHtml(config.description))
      .replace(/\{\{noteCards\}\}/g, noteCards)
      .replace(/\{\{baseUrl\}\}/g, this.escapeHtml(config.baseUrl))
      .replace(/\{\{searchHtml\}\}/g, this.buildSearchHtml(config))
      .replace(/\{\{noteCount\}\}/g, String(files.length))
      .replace(/\{\{isEmptyDisplay\}\}/g, isEmpty ? "block" : "none")
      .replace(/\{\{paginationDisplay\}\}/g, paginationDisplay)
      .replace(/\{\{paginationHtml\}\}/g, paginationHtml)
      .replace(/\{\{searchResultsContainer\}\}/g, this.buildSearchResultsContainer(config));

    return this.wrapLayout(indexHtml, config, undefined, `${files.length} note${files.length !== 1 ? "s" : ""} published`);
  }

  public getTotalPages(fileCount: number): number {
    return Math.max(1, Math.ceil(fileCount / ThemeRenderer.PAGE_SIZE));
  }

  public renderNote(
    html: string,
    title: string,
    tags: string[],
    date: string | undefined,
    config: SiteConfig,
    relatedNotes?: RelatedNoteEntry[],
    giscusConfig?: GiscusConfig,
    prevTitle?: string,
    nextTitle?: string,
  ): string {
    const baseUrl = this.escapeHtml(config.baseUrl);
    const tagsHtml = tags
      .map((t) => `<a href="${baseUrl}/tags/${this.escapeHtml(t)}/" class="garden-tag">${this.escapeHtml(t)}</a>`)
      .join(" ");

    let dateStr = "";
    if (date) {
      try {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
          dateStr = `Published: ${d.toISOString().split("T")[0]}`;
        }
      } catch {
        dateStr = "";
      }
    }

    const bodyWithIds: string = this.addHeadingIds(html);
    const tocHtml: string = this.buildTocHtml(bodyWithIds);
    const relatedNotesHtml: string = this.buildRelatedNotesHtml(relatedNotes ?? [], baseUrl);
    const commentsHtml: string = this.buildCommentsHtml(giscusConfig);

    const noteHtml = NOTE_HTML
      .replace(/\{\{title\}\}/g, this.escapeHtml(title))
      .replace(/\{\{bodyHtml\}\}/g, bodyWithIds)
      .replace(/\{\{date\}\}/g, dateStr)
      .replace(/\{\{tagsHtml\}\}/g, tagsHtml)
      .replace(/\{\{tocHtml\}\}/g, tocHtml)
      .replace(/\{\{relatedNotesHtml\}\}/g, relatedNotesHtml)
      .replace(/\{\{commentsHtml\}\}/g, commentsHtml);

    const pagination = this.buildPagination(prevTitle, nextTitle, config.baseUrl);
    const noteWithPagination = noteHtml
      .replace(/\{\{pagination\}\}/g, pagination);

    return this.wrapLayout(noteWithPagination, config, title);
  }

  public renderTags(
    tags: Record<string, TagEntry[]>,
    config: SiteConfig,
  ): string {
    const entries = Object.entries(tags).sort(([a], [b]) => a.localeCompare(b));
    const maxCount = Math.max(1, ...entries.map(([, e]) => e.length));
    const minCount = Math.min(...entries.map(([, e]) => e.length));
    const range = maxCount - minCount || 1;

    const tagCloud = entries
      .map(([tag, tagEntries]): string => {
        const size = tagEntries.length;
        const scale = maxCount === minCount ? 1 : (size - minCount) / range;
        const fontSize = 0.85 + scale * 0.65;
        const href = `${this.escapeHtml(config.baseUrl)}/tags/${this.escapeHtml(tag)}/`;
        return `<a href="${href}" class="garden-tag" style="font-size:${fontSize.toFixed(2)}rem">${this.escapeHtml(tag)} (${size})</a>`;
      })
      .join("\n");

    const html = TAGS_HTML
      .replace(/\{\{tagCloud\}\}/g, tagCloud);

    return this.wrapLayout(html, config, undefined, `${Object.keys(tags).length} tags`);
  }

  public renderTagDetail(
    files: SiteGeneratedFile[],
    tag: string,
    config: SiteConfig,
  ): string {
    const noteCards = files
      .map((f) => this.renderCard(f, config.baseUrl))
      .join("\n");

    const html = TAG_DETAIL_HTML
      .replace(/\{\{tag\}\}/g, this.escapeHtml(tag))
      .replace(/\{\{count\}\}/g, String(files.length))
      .replace(/\{\{noteCards\}\}/g, noteCards);

    return this.wrapLayout(html, config, undefined, `${files.length} notes`);
  }

  public renderFeed(
    entries: FeedEntry[],
    config: SiteConfig,
  ): string {
    const now: string = new Date().toISOString();
    const baseUrl: string = this.escapeHtml(config.baseUrl);
    const siteTitle: string = this.escapeHtml(config.title);

    const entryXml: string = entries
      .map((e: FeedEntry): string => {
        const entryDate: string = new Date(e.date).toISOString();
        const title: string = this.escapeXml(e.title);
        const excerpt: string = this.escapeXml(e.excerpt);
        const url: string = `${baseUrl}/${this.escapeXml(e.slug)}/`;
        return `  <entry>
    <title>${title}</title>
    <link href="${url}"/>
    <id>${url}</id>
    <published>${entryDate}</published>
    <updated>${entryDate}</updated>
    <summary>${excerpt}</summary>
  </entry>`;
      })
      .join("\n");

    return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${siteTitle}</title>
  <link href="${baseUrl}/"/>
  <link rel="self" href="${baseUrl}/feed.xml"/>
  <updated>${now}</updated>
  <id>${baseUrl}/</id>
${entryXml}
</feed>`;
  }

  public buildTocHtml(html: string): string {
    const headingRegex: RegExp = /<h([2-3])\b[^>]*>(.+?)<\/h[2-3]>/gi;
    const tocItems: TocItem[] = [];
    let match: RegExpExecArray | null;

    while ((match = headingRegex.exec(html)) !== null) {
      const [, levelStr, rawHeadingText] = match as unknown as [string, string, string];
      const level: number = parseInt(levelStr, 10);
      const rawText: string = rawHeadingText.replace(/<[^>]+>/g, "").trim();
      const id: string = slugify(rawText);
      if (rawText.length > 0) {
        tocItems.push({ level, text: rawText, id });
      }
    }

    if (tocItems.length < 2) {
      return "";
    }

    return tocItems
      .map((item: TocItem): string => {
        const cls: string = item.level === 2 ? "garden-toc-h2" : "garden-toc-h3";
        return `<a href="#${this.escapeHtml(item.id)}" class="${cls}">${this.escapeHtml(item.text)}</a>`;
      })
      .join("\n");
  }

  public addHeadingIds(html: string): string {
    const headingRegex = /<(h[2-3])(\b[^>]*)>([\s\S]*?)<\/h[2-3]>/gi;
    const usedIds: Record<string, number> = {};

    return html.replace(headingRegex, (_match: string, tag: string, attrs: string, content: string): string => {
      if (/\bid\s*=/i.test(attrs)) {
        return _match;
      }
      const rawText: string = content.replace(/<[^>]+>/g, "").trim();
      let id: string = slugify(rawText);
      if (usedIds[id] !== undefined) {
        usedIds[id] = (usedIds[id] ?? 0) + 1;
        id = `${id}-${usedIds[id]}`;
      } else {
        usedIds[id] = 0;
      }
      return `<${tag}${attrs} id="${this.escapeHtml(id)}">${content}</${tag}>`;
    });
  }

  public buildRelatedNotesHtml(
    relatedNotes: RelatedNoteEntry[],
    baseUrl: string,
  ): string {
    if (relatedNotes.length === 0) {
      return "";
    }
    return `<ul class="garden-related-list">
${relatedNotes.map((r: RelatedNoteEntry): string => `      <li class="garden-related-item"><a href="${this.escapeHtml(baseUrl)}/${this.escapeHtml(r.slug)}/">${this.escapeHtml(r.title)}</a></li>`).join("\n")}
    </ul>`;
  }

  public buildCommentsHtml(config?: GiscusConfig): string {
    if (!config) {
      return "";
    }
    return `<script src="https://giscus.app/client.js"
        data-repo="${this.escapeHtml(config.repo)}"
        data-repo-id="${this.escapeHtml(config.repoId)}"
        data-category="${this.escapeHtml(config.category)}"
        data-category-id="${this.escapeHtml(config.categoryId)}"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="preferred_color_scheme"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>`;
  }

  private renderCard(file: SiteGeneratedFile, baseUrl: string): string {
    const tagsHtml = file.tags
      .map((t: string) => `<span class="garden-tag">${this.escapeHtml(t)}</span>`)
      .join(" ");

    const fileDate = file.date;
    const dateStr: string = fileDate
      ? (new Date(fileDate).toISOString().split("T")[0] ?? "")
      : "";

    const url = `${this.escapeHtml(baseUrl)}/${pathToUrl(file.relativePath)}`;

    return `<a href="${url}" class="garden-card" data-title="${this.escapeHtml(file.title)}" data-excerpt="${this.escapeHtml(file.excerpt)}" data-tags="${file.tags.map((t) => this.escapeHtml(t)).join(" ")}">
      <div class="garden-card-title">${this.escapeHtml(file.title)}</div>
      <div class="garden-card-excerpt">${this.escapeHtml(file.excerpt)}</div>
      <div class="garden-card-meta">
        <div class="garden-card-tags">${tagsHtml}</div>
        <div class="garden-card-date">${dateStr}</div>
      </div>
    </a>`;
  }

  private wrapLayout(content: string, config: SiteConfig, pageTitle?: string, stats?: string): string {
    const titleTag = pageTitle
      ? `${this.escapeHtml(pageTitle)} — ${this.escapeHtml(config.title)}`
      : this.escapeHtml(config.title);

    const themeId: string = this.escapeHtml(config.themeId ?? "default");
    const inlineStyles: string = config.customCss ?? "";
    const stylesheetLink: string = inlineStyles.length === 0
      ? `<link rel="stylesheet" href="${this.escapeHtml(config.baseUrl)}/assets/theme.css">`
      : "";
    const layout = LAYOUT_HTML
      .replace(/\{\{content\}\}/g, content)
      .replace(/\{\{title\}\}/g, titleTag)
      .replace(/\{\{siteTitle\}\}/g, this.escapeHtml(config.title))
      .replace(/\{\{description\}\}/g, this.escapeHtml(config.description))
      .replace(/\{\{baseUrl\}\}/g, this.escapeHtml(config.baseUrl))
      .replace(/\{\{navLinks\}\}/g, this.buildNavLinks(config))
      .replace(/\{\{stats\}\}/g, stats ?? "")
      .replace(/\{\{stylesheetLink\}\}/g, stylesheetLink)
      .replace(/\{\{inlineStyles\}\}/g, inlineStyles)
      .replace(/\{\{searchScript\}\}/g, this.buildSearchScript(config))
      .replace('<html lang="en">', `<html lang="en" data-theme="${themeId}">`);

    return layout;
  }

  private buildNavLinks(config: SiteConfig): string {
    return `<a href="${this.escapeHtml(config.baseUrl)}/" class="garden-nav-link">Notes</a>
<a href="${this.escapeHtml(config.baseUrl)}/tags/" class="garden-nav-link">Tags</a>`;
  }

  private buildSearchHtml(config: SiteConfig): string {
    if (config.isPro) {
      return `<input type="search" class="garden-search-input garden-search-pro" placeholder="Search all notes..." aria-label="Search all notes" autocomplete="off">`;
    }
    return `<input type="search" class="garden-search-input" placeholder="Search notes..." aria-label="Search notes">`;
  }

  private buildSearchResultsContainer(config: SiteConfig): string {
    if (!config.isPro) {
      return "";
    }
    return `<div class="garden-search-results" id="garden-search-results"></div>`;
  }

  private buildSearchScript(config: SiteConfig): string {
    if (!config.isPro) {
      return "";
    }
    const baseUrl = this.escapeHtml(config.baseUrl);
    return `<script src="${baseUrl}/assets/flexsearch.bundle.js"></script>
<script>
(function() {
  var input = document.querySelector('.garden-search-pro');
  var resultsContainer = document.getElementById('garden-search-results');
  var noteCount = document.querySelector('.garden-note-count');
  var cards = document.querySelectorAll('.garden-card');
  var index = null;
  var documents = [];
  var loaded = false;

  function loadIndex() {
    if (loaded) return Promise.resolve();
    return fetch('${baseUrl}/search.json')
      .then(function(r) { return r.json(); })
      .then(function(data) {
        documents = data;
        index = new FlexSearch.Document({
          document: {
            id: 'path',
            index: [
              { field: 'title', tokenize: 'forward', resolution: 9 },
              { field: 'excerpt', tokenize: 'forward', resolution: 5 },
              { field: 'tags', tokenize: 'forward', resolution: 7 }
            ],
            store: ['title', 'path', 'tags', 'excerpt']
          },
          charset: 'latin:extra',
          cache: true
        });
        for (var i = 0; i < data.length; i++) {
          index.add(data[i]);
        }
        loaded = true;
      })
      .catch(function() {
        resultsContainer.innerHTML = '<div class="garden-search-error">Failed to load search index</div>';
        resultsContainer.style.display = 'block';
      });
  }

  function highlightMatch(text, query) {
    if (!query) return text;
    var escaped = query.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
    var re = new RegExp('(' + escaped + ')', 'gi');
    return text.replace(re, '<mark class="garden-search-highlight">$1</mark>');
  }

  function search(query) {
    if (!index || !query) {
      resultsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
      if (noteCount) {
        noteCount.textContent = documents.length + ' note' + (documents.length !== 1 ? 's' : '');
      }
      cards.forEach(function(c) { c.style.display = ''; });
      return;
    }

    var titleResults = index.search(query, { field: 'title', limit: 20, enrich: true });
    var excerptResults = index.search(query, { field: 'excerpt', limit: 20, enrich: true });
    var tagResults = index.search(query, { field: 'tags', limit: 20, enrich: true });

    var seen = {};
    var results = [];

    function collect(resultSet) {
      for (var i = 0; i < resultSet.length; i++) {
        var items = resultSet[i].result;
        for (var j = 0; j < items.length; j++) {
          var doc = items[j].doc;
          if (doc && !seen[doc.path]) {
            seen[doc.path] = true;
            results.push(doc);
          }
        }
      }
    }

    collect(titleResults);
    collect(excerptResults);
    collect(tagResults);

    cards.forEach(function(c) { c.style.display = 'none'; });

    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="garden-search-empty">No results found for "' + query.replace(/</g, '&lt;') + '"</div>';
      resultsContainer.style.display = 'block';
      if (noteCount) noteCount.textContent = '0 notes';
      return;
    }

    function escapeHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }
    var html = '';
    for (var k = 0; k < results.length; k++) {
      var r = results[k];
      var url = '${baseUrl}/' + r.path.replace(/\\\\/g, '/').replace(/\\/index\\.html$/, '/');
      var titleHtml = highlightMatch(escapeHtml(r.title || ''), query);
      var excerptHtml = highlightMatch(escapeHtml(r.excerpt ? r.excerpt.substring(0, 120) : ''), query);
      var tagsHtml = r.tags ? r.tags.map(function(t) { return '<span class="garden-tag">' + escapeHtml(t) + '</span>'; }).join(' ') : '';
      html += '<a href="' + url + '" class="garden-search-result-item">' +
        '<div class="garden-search-result-title">' + titleHtml + '</div>' +
        '<div class="garden-search-result-excerpt">' + excerptHtml + '</div>' +
        (tagsHtml ? '<div class="garden-search-result-tags">' + tagsHtml + '</div>' : '') +
        '</a>';
    }
    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
    if (noteCount) noteCount.textContent = results.length + ' note' + (results.length !== 1 ? 's' : '');
  }

  if (input && resultsContainer) {
    var debounceTimer = null;
    input.addEventListener('focus', function() {
      loadIndex();
    });
    input.addEventListener('input', function(e) {
      var query = e.target.value.trim();
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        if (!loaded) {
          loadIndex().then(function() { search(query); });
        } else {
          search(query);
        }
      }, 200);
    });
    document.addEventListener('click', function(e) {
      if (!input.contains(e.target) && !resultsContainer.contains(e.target)) {
        resultsContainer.style.display = 'none';
        if (input.value === '') {
          cards.forEach(function(c) { c.style.display = ''; });
          if (noteCount) noteCount.textContent = documents.length + ' note' + (documents.length !== 1 ? 's' : '');
        }
      }
    });
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        resultsContainer.style.display = 'none';
        input.blur();
      }
    });
  }
})();
</script>`;
  }

  private buildPagination(prevTitle: string | undefined, nextTitle: string | undefined, baseUrl: string): string {
    if (!prevTitle && !nextTitle) {
      return "";
    }
    const prevHtml = prevTitle
      ? `<a href="${this.escapeHtml(baseUrl)}/${slugify(prevTitle)}/">← ${this.escapeHtml(prevTitle)}</a>`
      : "<span></span>";
    const nextHtml = nextTitle
      ? `<a href="${this.escapeHtml(baseUrl)}/${slugify(nextTitle)}/">${this.escapeHtml(nextTitle)} →</a>`
      : "<span></span>";
    const pipe = prevTitle && nextTitle ? `<span class="garden-pipe"> | </span>` : "";
    return prevHtml + pipe + nextHtml;
  }

  private buildIndexPagination(currentPage: number, totalPages: number, baseUrl: string): string {
    if (totalPages <= 1) {
      return "";
    }

    const parts: string[] = [];

    if (currentPage > 1) {
      const prevHref = currentPage === 2
        ? `${this.escapeHtml(baseUrl)}/`
        : `${this.escapeHtml(baseUrl)}/page/${currentPage - 1}/`;
      parts.push(`<a href="${prevHref}" class="garden-pagination-prev" aria-label="Previous page">← Prev</a>`);
    } else {
      parts.push(`<span class="garden-pagination-prev garden-pagination-disabled">← Prev</span>`);
    }

    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        parts.push(`<span class="garden-pagination-page garden-pagination-active">${i}</span>`);
      } else {
        const href = i === 1
          ? `${this.escapeHtml(baseUrl)}/`
          : `${this.escapeHtml(baseUrl)}/page/${i}/`;
        parts.push(`<a href="${href}" class="garden-pagination-page">${i}</a>`);
      }
    }

    if (currentPage < totalPages) {
      parts.push(`<a href="${this.escapeHtml(baseUrl)}/page/${currentPage + 1}/" class="garden-pagination-next" aria-label="Next page">Next →</a>`);
    } else {
      parts.push(`<span class="garden-pagination-next garden-pagination-disabled">Next →</span>`);
    }

    return parts.join("\n");
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
}