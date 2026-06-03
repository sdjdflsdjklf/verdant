# Obsidian Garden Theme Redesign — Implementation Plan

> **Last updated**: 2026-05-20 — All phases complete. Pagination + Pro full-text search (flexsearch local deployment) added.
> **For Claude**: REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal**: Replace hardcoded HTML/CSS in site generator with a proper template system driven by ThemeRenderer, with beautiful default light and dark themes.

**Status**: ✅ ALL PHASES COMPLETE

**Architecture:** 
- ThemeRenderer in domain layer handles all template rendering
- Templates stored as string constants in src/domain/theme/templates/
- CSS as string constants in src/domain/theme/styles/
- SiteGeneratorService delegates to ThemeRenderer instead of building HTML strings
- PublisherService gets CSS from ThemeRenderer.getCSS()
- New: LinkGraphService parses `[[wiki links]]` for related notes and prev/next ordering
- New: TOC generation from markdown headings
- New: giscus comments integration
- New: RSS feed generation

**Tech Stack:** TypeScript, CSS custom properties, HTML templates as string constants

**Product context (see docs/plans/2026-05-19-obsidian-garden-product-roadmap.md):**
- TOC, comments, RSS, prev/next navigation — all users (Free + Pro)
- Full-text search — Pro only
- AI style assistant — Pro only (replaces pre-built theme store)
- No theme store — deferred indefinitely

---

## Phase 0: Link Graph Infrastructure

### Task 0.1: Create LinkGraphService

**Files:**
- Create: `src/domain/publisher/link-graph.service.ts`
- Create: `src/domain/publisher/link-graph.service.spec.ts`

Parses `[[wiki links]]` across all published notes and builds a bidirectional link graph.

**API:**
```typescript
class LinkGraphService {
  buildGraph(notes: PublishFile[]): LinkGraph;
  getRelatedNotes(slug: string, graph: LinkGraph): RelatedNote[];
  getPrevNext(slug: string, graph: LinkGraph): { prev?: string; next?: string };
}
```

**Step 1: Write tests for link parsing and graph building**

**Step 2: Implement regex-based `[[link]]` extraction (no frontmatter parsing needed)**

**Step 3: Implement related notes ranking (by mutual link count, then total links)**

**Step 4: Wire into SiteGeneratorService — pass link graph to ThemeRenderer.renderNote()**

---

## Phase 1: Template Infrastructure

### Task 1: Create template files directory and basic template structure

**Files:**
- Create: `src/domain/theme/templates/default/layout.template.ts`
- Create: `src/domain/theme/templates/default/index.template.ts`
- Create: `src/domain/theme/templates/default/note.template.ts`
- Create: `src/domain/theme/templates/default/tags.template.ts`
- Create: `src/domain/theme/templates/default/tag-detail.template.ts`
- Create: `src/domain/theme/styles/default.theme.ts`
- Create: `src/domain/theme/styles/dark.theme.ts`

**Step 1: Write the template files with basic structure**

layout.template.ts:
```typescript
export const LAYOUT_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{title}}</title>
  <link rel="stylesheet" href="{{baseUrl}}/assets/theme.css" />
</head>
<body>
  <nav class="garden-nav">
    <a href="{{baseUrl}}/">{{siteTitle}}</a>
    <div class="garden-nav-links">{{navLinks}}</div>
  </nav>
  <main class="garden-content">{{content}}</main>
  <footer class="garden-footer">{{footerHtml}}</footer>
</body>
</html>`;
```

**Step 2: Run lint to verify no syntax errors**

**Step 3: Commit**
```bash
git add src/domain/theme/templates/
```

### Task 2: Rewrite ThemeRenderer with template rendering methods

**Files**:
- Modify: `src/domain/theme/theme.renderer.ts`

**Step 1: Write failing test**

**Step 2: Implement minimal ThemeRenderer**

**Step 3: Verify tests pass**

**Step 4: Commit**

### Task 3: Write full HTML templates

**Files**:
- Modify: `src/domain/theme/templates/default/layout.template.ts` (full implementation)
- Modify: `src/domain/theme/templates/default/index.template.ts` (full implementation)
- Modify: `src/domain/theme/templates/default/note.template.ts` (full implementation — with TOC, related notes, comments)
- Modify: `src/domain/theme/templates/default/tags.template.ts` (full implementation)
- Modify: `src/domain/theme/templates/default/tag-detail.template.ts` (full implementation)

**Step 1: Write full layout.template.ts with nav, footer, search, card grid**

**Step 2: Write full index.template.ts with card grid**

**Step 3: Write full note.template.ts with:**

```
- TOC sidebar (left, sticky on desktop, collapsible on mobile)
  Condition: only show if note has 2+ headings
- Rendered markdown content
- Tags section
- Related notes cards (from [[wiki links]])
  Condition: only show if 1+ related notes exist
- Prev / Next links (sorted by link relevance)
- giscus comments embed
  Condition: only show if giscus is configured in settings
```

**Step 4: Write full tags.template.ts with tag cloud**

**Step 5: Write full tag-detail.template.ts**

**Step 6: Run lint**

**Step 7: Commit**

### Task 4: Write beautiful CSS themes

**Files**:
- Create: `src/domain/theme/styles/default.theme.ts` (complete CSS)
- Create: `src/domain/theme/styles/dark.theme.ts` (complete CSS)

**Step 1: Write default.theme.ts with full design system**

**Step 2: Write dark.theme.ts with dark mode overrides**

**Step 3: Run lint**

**Step 4: Commit**

## Phase 2: Wire into SiteGeneratorService

### Task 5: Inject ThemeRenderer into SiteGeneratorService

**Files**:
- Modify: `src/domain/publisher/site-generator.service.ts`
- Modify: `src/domain/publisher/site-generator.service.spec.ts`

**Step 1: Add ThemeRenderer to constructor**

**Step 2: Replace generateFile() HTML string with ThemeRenderer.renderNote()**

**Step 3: Replace generateIndexHtml() with ThemeRenderer.renderIndex()**

**Step 4: Replace tags HTML with ThemeRenderer.renderTags()**

**Step 5: Run tests**

**Step 6: Commit**

### Task 6: Remove DEFAULT_THEME_CSS from PublisherService

**Files:**
- Modify: `src/domain/publisher/publisher.service.ts`

**Step 1: Remove DEFAULT_THEME_CSS constant**

**Step 2: Replace buildGitFiles CSS push with ThemeRenderer.getCSS()**

**Step 3: Run lint and tests**

**Step 4: Commit**

### Task 7: Wire templates/CSS registration in PluginInitializer

**Files:**
- Modify: `src/bootstrap/plugin-initializer.ts`

**Step 1: After registerInfrastructure(), resolve ThemeRenderer and register templates**

**Step 2: Register CSS for both default and dark themes**

**Step 3: Run tests**

**Step 4: Commit**

## Phase 3: Testing and Cleanup

### Task 8: Add RSS feed generation

**Files:**
- Add: `src/domain/theme/templates/default/feed.template.ts`
- Modify: `src/domain/theme/theme.renderer.ts` (add `renderFeed()` method)
- Modify: `src/domain/publisher/publisher.service.ts` (call renderFeed in buildGitFiles)

**Step 1: Write feed.template.ts with Atom XML structure**

**Step 2: Add renderFeed() to ThemeRenderer**

**Step 3: Wire feed generation into buildGitFiles()**

**Step 4: Run tests**

### Task 9: Update all affected tests

**Files:**
- Modify: `tests/integration/publish-flow.integration.spec.ts`
- Modify: `tests/e2e/full-publish.e2e.spec.ts`
- Create: `src/domain/theme/theme.renderer.spec.ts` (new unit tests)
- Create: `src/domain/publisher/link-graph.service.spec.ts` (link graph tests)

**Step 1: Write LinkGraphService unit tests**

**Step 2: Write ThemeRenderer unit tests (including TOC, related notes, comments, feed)**

**Step 3: Run full test suite**

**Step 4: Commit**

### Task 10: Build and verify

**Step 1: npm run lint**

**Step 2: npm run typecheck**

**Step 3: npm run test**

**Step 4: npm run build**

**Step 5: Restart Obsidian and verify site looks correct**

**Step 6: Commit**

---

Plan complete and saved to `docs/plans/2026-05-18-obsidian-garden-theme-design.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?