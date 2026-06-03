# Design: Obsidian Garden — Generated Site Themes

## Status

Updated — 2026-05-20. All phases complete. Pagination + Pro full-text search (flexsearch local deployment) added. Aligned with product roadmap (`2026-05-19-obsidian-garden-product-roadmap.md`).

## Context

The generated website is the **only thing users see** after publishing. The current implementation has:

- HTML hardcoded as strings in `site-generator.service.ts`
- `ThemeRenderer` / `ThemeRegistry` / `ThemeService` exist but are **never called** by the site generator
- CSS stored as a string constant in `publisher.service.ts` — architecturally wrong
- No responsive design, no multi-note layout thinking, no visual polish
- Both built-in themes produce identical "1980s-style" output

This makes the plugin unsellable. A $19 plugin must produce a site that looks good enough to show publicly.

### Product Strategy Note

Per the roadmap, themes are **not** a Pro selling point. Instead:
- Everyone gets 1 beautiful default theme (light + dark)
- Pro users get **AI style assistant** (in publish wizard, describe your desired style → AI generates CSS)
- No pre-built theme store — deferred indefinitely
- The template system described below supports all required features: TOC, comments, RSS, prev/next navigation

## Design Philosophy

1. **Content-first** — typography and whitespace do the heavy lifting
2. **Zero-config beauty** — default templates look great out of the box
3. **Theme as CSS variables** — light/dark is a palette swap, not a template rewrite
4. **Responsive by default** — mobile, tablet, desktop all look intentional
5. **Fast by default** — no JS framework, no web font loading (system font stack), minimal bytes

## Page Inventory

| Page | Route | Purpose |
|---|---|---|---|
| Home | `/` | Note listing, search, navigation |
| Note detail | `/<slug>/` | Rendered markdown with TOC, comments, prev/next |
| Tags overview | `/tags/` | Tag cloud + per-tag note count |
| Tag detail | `/tags/<tag>/` | Notes filtered by a single tag |
| Search results | `/search/` | Full-text search results (Pro only) |
| RSS feed | `/feed.xml` | XML feed for blog subscribers |

## Visual Design System

### Typography

| Element | Stack | Size | Weight |
|---|---|---|---|
| Body | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | 16px (1rem) | 400 |
| h1 | System stack | 2.25rem | 700 |
| h2 | System stack | 1.5rem | 600 |
| h3 | System stack | 1.25rem | 600 |
| Code / pre | `"SF Mono", "Fira Code", "Cascadia Code", monospace` | 0.9rem | 400 |
| Nav links | System stack | 0.9rem | 500 |
| Small / meta | System stack | 0.8rem | 400 |

Line-height: 1.7 (body), 1.3 (headings). Max line width: 720px for readability.

### Color Palette (Default Light)

| Role | Token | Value |
|---|---|---|
| Background | `--color-bg` | `#ffffff` |
| Surface (cards, nav) | `--color-surface` | `#f8f9fa` |
| Text primary | `--color-text` | `#1a1a2e` |
| Text secondary | `--color-text-muted` | `#6b7280` |
| Accent / links | `--color-accent` | `#4361ee` |
| Accent hover | `--color-accent-hover` | `#3a0ca3` |
| Border | `--color-border` | `#e5e7eb` |
| Code background | `--color-code-bg` | `#f1f3f5` |
| Blockquote border | `--color-blockquote` | `#4361ee` |

### Color Palette (Dark)

| Token | Value |
|---|---|
| `--color-bg` | `#0f172a` |
| `--color-surface` | `#1e293b` |
| `--color-text` | `#e2e8f0` |
| `--color-text-muted` | `#94a3b8` |
| `--color-accent` | `#60a5fa` |
| `--color-accent-hover` | `#93c5fd` |
| `--color-border` | `#334155` |
| `--color-code-bg` | `#1e293b` |
| `--color-blockquote` | `#60a5fa` |

### Spacing Scale

`0.25rem, 0.5rem, 0.75rem, 1rem, 1.5rem, 2rem, 3rem, 4rem, 6rem`

### Border Radius

- Cards: 12px
- Buttons / inputs: 8px
- Code blocks: 6px
- Inline code: 4px

### Shadows

- Card: `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)`
- Card hover: `0 4px 12px rgba(0,0,0,0.1)`
- Dark mode shadows: use same with reduced opacity

## Layout Specifications

### Home Page (`index.html`)

```
┌──────────────────────────────────┐
│  🌱 Garden Title                 │  ← nav bar, sticky top
│  Subtitle / description          │
│  [Search...]  Notes | Tags       │
├──────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐   │  ← card grid (auto-fill)
│  │ Title │  │ Title │  │ Title │   │     minmax(300px, 1fr)
│  │ excerpt│  │ excerpt│  │ excerpt│   │
│  │ #tag   │  │ #tag   │  │ #tag   │   │
│  │ 2026-05│  │ 2026-05│  │ 2026-05│   │
│  └──────┘  └──────┘  └──────┘   │
│  ┌──────┐  ┌──────┐             │
│  │ Title │  │ Title │             │
│  │ ...   │  │ ...   │             │
│  └──────┘  └──────┘             │
├──────────────────────────────────┤
│  Powered by Obsidian Garden      │  ← footer, subtle
│  10 notes published              │
└──────────────────────────────────┘
```

- Nav bar: fixed height 56px, site title left, nav links right
- Search input: full-width on mobile 320px max on desktop, with icon
- Card grid: CSS Grid `grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))`
- Card content: title (truncate 2 lines), excerpt (truncate 3 lines), tags row, date
- Empty state: "No notes yet" illustration/emoji

### Note Detail Page

```
┌──────────────────────────────────────┐
│  ← Garden              #tag1 #tag2   │  ← nav bar
├──────────────────────────────────────┤
│  ┌──────────────────────────────┐    │
│  │  TOC                         │    │  ← auto-generated table of contents
│  │  ├─ Introduction             │    │     sticky on desktop
│  │  ├─ Getting Started          │    │
│  │  └─ Advanced Usage           │    │
│  └──────────────────────────────┘    │
│                                      │
│  # Note Title                        │  ← max-width: 720px centered
│                                      │
│  Published: 2026-05-19             │  ← meta line, muted
│                                      │
│  ─── content ───                    │
│                                      │
│  Rendered markdown with proper       │
│  typography, code highlighting,      │
│  blockquotes, images, etc.           │
│                                      │
│  ─── end ───                        │
│                                      │
│  Tags: [tag1] [tag2] [tag3]         │  ← clickable tag badges
│                                      │
│  ── Related Notes ──                │  ← backlinks from [[wiki links]]
│  [Related Note 1]                    │
│  [Related Note 2]                    │
│  [Related Note 3]                    │
│                                      │
│  ← Previous Note  |  Next Note →    │  ← sorted by link relevance
│                                      │
├──────────────────────────────────────┤
│  ── Comments ──                     │  ← giscus integration
│  [giscus iframe]                     │
│                                      │
├──────────────────────────────────────┤
│  Footer                              │
└──────────────────────────────────────┘
```

### Key Layout Decisions

- **TOC**: Left sidebar on desktop (sticky), collapsible top on mobile. Only rendered if the note has 2+ headings.
- **Related Notes**: Extracted from `[[wiki links]]` in the note. Displayed as a card list below content. If there are 0 related notes, this section is omitted entirely.
- **Prev / Next**: Sorted by link relevance (number of mutual `[[links]]` between notes), not by filename or date. If no linked notes exist, falls back to alphabetical.
- **Comments**: Loaded via giscus (GitHub Discussions). Requires the user to have giscus configured in settings. Section is hidden if not configured.

- Article body: max-width 720px, centered with auto margins
- Code blocks: syntax highlighting via `<span class="hl-*">` tokens, dark code background
- Blockquotes: left accent border, slightly smaller text, subtle background
- Images: max-width 100%, rounded corners, centered
- Tables: full-width, alternating row colors, sticky header
- Pagination: only show if prev/next exists, "← Title" / "Title →"

### Tags Overview Page

```
┌──────────────────────────────────┐
│  Tags                            │  ← nav bar
├──────────────────────────────────┤
│                                  │
│  [tag1] (5)  [tag2] (3)         │  ← tag cloud, size by count
│  [tag3] (8)  [tag4] (1)         │
│  [tag5] (2)                      │
│                                  │
├──────────────────────────────────┤
│  Footer                          │
└──────────────────────────────────┘
```

- Tags as clickable badges/pills
- Font size scales with count (min 0.85rem, max 1.5rem)
- Each tag shows count in parentheses

### Tag Detail Page

```
┌──────────────────────────────────┐
│  ← Tags     #tag1 (5 notes)     │  ← nav bar
├──────────────────────────────────┤
│                                  │
│  ┌──────┐  ┌──────┐             │  ← same card grid as home
│  │ Card  │  │ Card  │             │     but filtered by tag
│  └──────┘  └──────┘             │
│  ┌──────┐  ┌──────┐             │
│  │ Card  │  │ Card  │             │
│  └──────┘  └──────┘             │
│                                  │
├──────────────────────────────────┤
│  Footer                          │
└──────────────────────────────────┘
```

### RSS Feed (`/feed.xml`)

Standard Atom feed generated from published notes. Used by RSS readers (Feedly, Inoreader, etc.) and email newsletter tools.

```xml
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Site Title</title>
  <link href="https://example.com/"/>
  <updated>2026-05-19T00:00:00Z</updated>
  <id>https://example.com/</id>
  <entry>
    <title>Note Title</title>
    <link href="https://example.com/note-slug/"/>
    <id>https://example.com/note-slug/</id>
    <published>2026-05-18T00:00:00Z</published>
    <summary>Note excerpt or first paragraph</summary>
  </entry>
</feed>
```

Generated as a static file during `buildGitFiles()`, pushed to the repo like any other file.

---

## Responsive Breakpoints

| Breakpoint | Width | Layout change |
|---|---|---|
| Mobile | < 640px | Single column cards, stacked nav, full-width content |
| Tablet | 640–1024px | 2-column cards, side nav |
| Desktop | > 1024px | 3-column cards, max-width constrained |

Nav bar transforms to hamburger menu on mobile (< 640px).

## Template Architecture

### Directory Structure

```
src/domain/theme/templates/
  default/                  ← shared HTML templates
    layout.html             ← outer shell (<html>, <head>, nav, footer)
    index.html              ← home page (cards grid)
    note.html               ← single note
    tags.html               ← tags overview
    tag-detail.html         ← notes filtered by tag
  default/
    theme.css               ← light mode (CSS custom properties)
  dark/
    theme.css               ← dark mode (overrides CSS custom properties only)
```

### Template Variables

| Variable | Available In | Description |
|---|---|---|
| `{{title}}` | All | Page title |
| `{{siteTitle}}` | All | Site name from config |
| `{{description}}` | All | Site description |
| `{{baseUrl}}` | All | Site base URL |
| `{{content}}` | layout.html | Inner page content slot |
| `{{navLinks}}` | layout.html | Navigation links HTML |
| `{{noteCards}}` | index.html, tag-detail.html | Card grid HTML |
| `{{searchHtml}}` | index.html | Search input HTML |
| `{{searchResultsHtml}}` | search.html | Search results (Pro only) |
| `{{tagCloud}}` | tags.html | Tag badge HTML |
| `{{bodyHtml}}` | note.html | Rendered markdown |
| `{{tocHtml}}` | note.html | Auto-generated table of contents |
| `{{noteMeta}}` | note.html | Date, reading time |
| `{{noteTags}}` | note.html | Tag badge HTML |
| `{{relatedNotes}}` | note.html | Related notes from `[[links]]` |
| `{{pagination}}` | note.html | Prev/next links |
| `{{commentsHtml}}` | note.html | giscus embed HTML |

### CSS Variable System

All visual properties are driven by CSS custom properties defined in `theme.css`. The HTML templates use semantic class names that reference these variables. Switching from light to dark means:

1. Load the same `layout.html`, `index.html`, etc.
2. Replace `theme.css` with `dark/theme.css` which only overrides `--color-*` variables

This means **zero template duplication** between themes. A theme = a CSS file (plus optional template overrides).

## Component Library (CSS Classes)

### `.garden-card`
- Background: `var(--color-surface)`
- Border-radius: 12px
- Padding: 1.5rem
- Hover: translateY(-2px), shadow increase, 200ms transition

### `.garden-tag`
- Inline-block pill
- Padding: 0.2rem 0.75rem
- Border-radius: 999px
- Font-size: 0.8rem
- Background tinted with accent color at 10% opacity

### `.garden-btn`
- Inline-flex, center aligned
- Padding: 0.5rem 1rem
- Border-radius: 8px
- Font-weight: 500
- Primary variant: accent background, white text
- Ghost variant: transparent, accent text on hover

### `.garden-input`
- Full-width
- Padding: 0.6rem 1rem
- Border-radius: 8px
- Border: 1px solid `var(--color-border)`
- Focus ring: 2px accent with 30% opacity

## Integration with Existing Architecture

### Data Flow

```
PublisherService.publish()
  └─ SiteGeneratorService.generateSite()
       ├─ Parse [[wiki links]] across all notes → build link graph
       │
       ├─ For each note:
       │    └─ ThemeRenderer.renderNote(content, config, themeId, linkGraph)
       │         ├─ [[links]] → related notes list
       │         ├─ headings → TOC HTML
       │         └─ template.html + {{variables}} → filled HTML
       │
       ├─ ThemeRenderer.renderIndex(files, config, themeId)
       │    └─ index.html + {{noteCards}} → index page HTML
       │
       ├─ ThemeRenderer.renderTags(tags, config, themeId)
       │
       ├─ ThemeRenderer.renderSearchResults(config, themeId) ← Pro only
       │    └─ search.html with lunr.js/flexsearch index
       │
       ├─ ThemeRenderer.renderFeed(files, config) ← RSS Atom feed
       │    └─ feed.xml
       │
       └─ ThemeRenderer.getCSS(themeId) → CSS string
  └─ PublisherService.buildGitFiles()
       ├─ generated site files (from ThemeRenderer)
       ├─ assets/theme.css (from ThemeRenderer.getCSS())
       ├─ feed.xml
       ├─ search.json (lunr index data, Pro only)
       └─ .nojekyll
```

### Key Changes

1. **`SiteGeneratorService`** — `generateFile()` and `generateIndexHtml()` now delegate to `ThemeRenderer` instead of building HTML strings. `ThemeRenderer` is injected. Also responsible for parsing `[[wiki links]]` across all notes to build the link graph.

2. **`ThemeRenderer`** — Add `renderNote()`, `renderIndex()`, `renderTags()`, `renderTagDetail()`, `renderFeed()`, `getCSS()` methods. Template strings stored as private constants (or loaded from bundled files). Must be injectable.

3. **`ThemeService`** — Add `getThemeCSS(themeId)` that returns the full CSS for a theme. Currently `cssCache` is populated by `setThemeCSS()` but nothing calls it; need to wire this up.

4. **`PublisherService.buildGitFiles()`** — Remove `DEFAULT_THEME_CSS` constant. Instead get CSS from `ThemeRenderer.getCSS(config.themeId)`.

5. **`PluginInitializer`** — Register templates and CSS on startup via `ThemeRenderer.setTemplate()` and `ThemeService.setThemeCSS()`.

6. **New: Link graph module** (`src/domain/publisher/link-graph.service.ts`) — Parses all notes' `[[wiki links]]`, builds bidirectional link map, computes "related notes" ranking (by mutual link count), and determines prev/next order.

## Implementation Order

### Phase A: Template System (current priority)

1. Build `LinkGraphService` — parse `[[wiki links]]` across all notes, compute related notes ranking
2. Rewrite `ThemeRenderer` with complete template rendering methods (renderNote, renderIndex, etc.)
3. Write the five HTML templates (layout, index, note, tags, tag-detail) for default theme
4. Write default `theme.css` (light) and dark `theme.css` (dark)
5. Wire `ThemeRenderer` into `SiteGeneratorService`
6. Remove hardcoded HTML from `SiteGeneratorService`
7. Remove `DEFAULT_THEME_CSS` from `PublisherService`
8. Wire `ThemeRenderer.getCSS()` into `buildGitFiles()`
9. Add TOC generation to `renderNote()`
10. Integrate giscus comment HTML into note template
11. Generate `feed.xml` in `buildGitFiles()`
12. Update tests

### Phase B: Pro Search (post-launch)

1. Integrate lunr.js or flexsearch for client-side full-text search
2. Render search page template with search results
3. Generate search index JSON during publish
4. Pro-gate search UI

## Testing

| Area | What to test |
|---|---|
| Template rendering | Each template renders with valid variables; missing variables produce empty string |
| Theme switch | `getCSS("default")` ≠ `getCSS("dark")`; both are non-empty |
| Site generation | Generated HTML contains correct class names, tag links, card structure |
| Responsive mock | CSS media queries are present (unit test by checking stylesheet text) |