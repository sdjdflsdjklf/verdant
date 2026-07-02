# Verdant Future Development Plan

> **Date**: 2026-06-24
> **Scope**: Verdant Free, Verdant Pro
> **Core Goal**: Continuously improve the product — make Free users stick around, make Pro users feel the value
> **Document Type**: Feature iteration roadmap, source of truth for future development

---

## 1. Current State

**Verdant Free**
- One-click publish to GitHub Pages
- Note selector (file tree)
- Basic themes (Light/Dark)
- WikiLink support, tag aggregation pages, navigation tree
- Incremental publishing (only pushes changed files)
- RSS feed
- 10-note limit

**Verdant Pro** ($19 one-time)
- All Free features
- Unlimited notes
- AI Style Agent (natural language site customization)
- Full-text search
- Custom CSS
- Custom domain (planned)

---

## 2. Free vs Pro Feature Plan

**Verdant Free includes:**
- One-click publish to GitHub Pages
- Note selector (file tree)
- Basic themes (Light/Dark)
- WikiLinks, tag aggregation, navigation tree
- Incremental publishing
- RSS feed
- Up to 10 notes

**Verdant Pro adds ($19 one-time):**
- Unlimited notes
- AI Style Agent (natural language site customization)
- Full-text search
- Custom CSS
- Custom domain
- Visitor analytics
- SEO enhancement suite
- Multi-site management

---

## 3. Phased Execution Plan

### Phase 1: Data-Driven Publishing & SEO (Weeks 1-4)

> Goal: Let users see results after publishing, get sites indexed by search engines.

#### 1.1 Visitor Analytics Panel (Pro)
- [ ] Lightweight stats mechanism in the repo on publish
- [ ] In-plugin "Visitor Analytics" panel: 7/30-day page views, top 10 notes, referrer breakdown
- [ ] Data visualization

#### 1.2 SEO Enhancement Suite (Pro)
- [ ] Auto-generate `sitemap.xml`
- [ ] Auto-generate `robots.txt`
- [ ] Note frontmatter supports `seo_title` / `seo_description` / `og_image`, injected as `<meta>` tags
- [ ] Auto-generate Open Graph cards
- [ ] Auto-generate JSON-LD structured data (Article schema)
- [ ] Auto-generate canonical URLs

#### 1.3 Comments Enhancement
- [ ] Giscus theme follows site theme (light/dark)
- [ ] Support Utterances (GitHub Issues-based) as Giscus alternative
- [ ] Comment count displayed on note cards

#### 1.4 Subscription
- [ ] Add subscription form component to site homepage (via Buttondown/Substack embed)

**Phase 1 done when**: Users can see visitor data, SEO performance, and reader comments.

---

### Phase 2: Creation Experience Deepening (Weeks 5-10)

> Goal: Expand AI from CSS assistant to full creative partner, richer themes.

#### 2.1 AI Capability Expansion (Pro)
- [ ] **AI Content Assistant**: note summary generation, tag recommendation, title optimization, SEO description generation, related note suggestions
- [ ] **AI Publish Assistant**: pre-publish checklist (link validity, image completeness), auto-generate site description
- [ ] **AI Translation**: one-click translate notes to multiple languages

#### 2.2 Preview Experience Upgrade
- [ ] Real-time preview: sidebar shows published result while editing
- [ ] Mobile preview: simulate phone screen size
- [ ] Dark mode preview toggle
- [ ] Clickable links in preview

#### 2.3 Theme System Enhancement
- [ ] Theme marketplace (community-contributed themes, one-click install in plugin)
- [ ] Theme customization panel (visual adjustment of colors/fonts/spacing/border-radius)
- [ ] Theme import/export (JSON config sharing)

#### 2.4 Publish Flow Optimization
- [ ] Auto-publish: auto-incremental publish on note save (configurable trigger conditions)
- [ ] Scheduled publish: frontmatter supports `publish_date`, auto-publish when due
- [ ] Draft mode: notes with `draft: true` are not published
- [ ] Exclude rules: `.gardenignore` file support
- [ ] Publish history: record changes per publish (based on Git commit)

**Phase 2 done when**: AI deeply integrated into creation workflow, themes are rich and customizable, publishing is automated.

---

### Phase 3: Site Growth Enablement (Weeks 11-18)

> Goal: Make users' sites truly "alive" — become personal brand assets.

#### 3.1 Custom Domain (Pro)
- [ ] Settings panel adds domain config (CNAME content + DNS setup guide)
- [ ] Auto-write CNAME file on publish
- [ ] Auto-enable HTTPS
- [ ] Domain status detection and error prompts

#### 3.2 Multi-Site Management (Pro)
- [ ] One plugin manages multiple publish targets (multiple GitHub repos)
- [ ] Independent config per site (theme/domain/note collection)
- [ ] Site dashboard (overview of all sites: note count, last publish time)

#### 3.3 Image Smart Processing (Pro)
- [ ] Auto image compression (compress to WebP on publish)
- [ ] Image lazy loading (`loading="lazy"`)
- [ ] Responsive images (`srcset` multiple sizes)
- [ ] EXIF data stripping (privacy protection)

#### 3.4 Performance Optimization
- [ ] HTML/CSS/JS minification on publish
- [ ] Font subsetting (only bundle used characters)
- [ ] Critical CSS inlining (above-the-fold optimization)
- [ ] Resource preloading (`<link rel="preload">`)
- [ ] Lighthouse score integration (auto-detect and display after publish)

#### 3.5 Social Sharing
- [ ] Social share buttons on note pages
- [ ] Open Graph card optimization (ensure美观 previews when shared)

**Phase 3 done when**: Sites have custom domains, high performance, and multi-site management.

---

### Phase 4: Ecosystem & Community (Weeks 19-28)

> Goal: Evolve from a single tool to an ecosystem, let users stay for the community.

#### 4.1 Theme Marketplace
- [ ] Community theme repository
- [ ] In-plugin theme browser (preview screenshots + one-click install)
- [ ] Theme version management and update notifications

#### 4.2 Site Component Marketplace
- [ ] Shareable "site components" (enhanced code highlighting, math formulas, Mermaid diagrams, timelines, photo galleries)
- [ ] Component marketplace browsing and installation

#### 4.3 Template Marketplace
- [ ] Site templates (complete bundles of notes + theme + config)
- [ ] Use case templates: personal blog / academic homepage / project docs / reading notes / digital garden
- [ ] One-click template import and publish

#### 4.4 Community Showcase
- [ ] Official site gallery of "Sites built with Verdant"
- [ ] Showcase categories (digital garden / academic / portfolio / docs)
- [ ] User submission entry point

#### 4.5 Documentation & Tutorials
- [ ] Official docs site (built with Verdant itself — dogfooding)
- [ ] Best practices guides (how to organize a digital garden, SEO tips, AI-assisted writing)

**Phase 4 done when**: Theme/component/template ecosystem formed, community showcase drives new users.

---

### Phase 5: Long-Term Vision (Week 28+)

#### 5.1 Multi-Platform Publishing
- [ ] Netlify / Vercel / Cloudflare Pages support
- [ ] Self-hosted static file export (download ZIP)
- [ ] WordPress export (XML)

#### 5.2 Collaboration (Pro)
- [ ] Multiple people maintain one site (GitHub collaboration-based)
- [ ] Comment moderation collaboration

#### 5.3 Deep AI Integration
- [ ] AI-generated full note outlines
- [ ] AI knowledge graph visualization (semantic relationships between notes)
- [ ] AI chatbot (RAG based on all site notes)
- [ ] AI auto internal link suggestions (suggest linking to existing notes while writing)

#### 5.4 Mobile Enhancement
- [ ] Mobile publish flow optimization (touch-friendly)
- [ ] Mobile preview
- [ ] PWA support (site installable as app)

---

## 4. Technical Optimization Plan

### 4.1 Architecture Debt Cleanup

- **In-memory cache lost across sessions** (high priority): persist to Obsidian plugin data, support incremental publishing
- **slugify defined 3 times** (medium priority): extract to `shared/helpers/slug.helper.ts`
- **publish-wizard uses `container.resolve()` directly** (low priority): switch to constructor injection (maintain architecture purity)
- **`__FLEXSEARCH_BUNDLE__` not defined** (high priority): add define to esbuild.config.mjs + declare flexsearch dependency

### 4.2 Performance Optimization

- [ ] **Publish speed**: increase blob upload concurrency from 5 to 10 (configurable), batch commits for large repos
- [ ] **Site loading**: CSS/JS minification, font subsetting, image lazy loading (Phase 3)
- [ ] **Plugin startup**: lazy-load domain services (resolve on first use, not at startup)
- [ ] **Preview speed**: cache preview HTML, re-render only changed parts
- [ ] **Search speed**: persist FlexSearch index to IndexedDB (avoid rebuilding on every load)

### 4.3 Quality Assurance

- [ ] E2E tests covering full publish flow (Free + Pro paths)
- [ ] Add Lighthouse CI (check site performance score before each publish)
- [ ] Add a11y audit (axe-core integration)
- [ ] Cross-platform test matrix (macOS/Windows/Linux + desktop/mobile)

---

## 5. Priority Ranking

**Do Now**
- Visitor analytics
- SEO enhancement

**Plan For**
- AI expansion
- Theme enhancement
- Custom domain

**Defer**
- Multi-site, collaboration, ecosystem marketplaces

### Recommended Execution Order

1. **Weeks 1-4**: Phase 1 — Visitor analytics + SEO enhancement
2. **Weeks 5-10**: Phase 2 — AI expansion + theme enhancement
3. **Weeks 11-18**: Phase 3 — Custom domain + image processing + performance optimization
4. **Week 19+**: Phase 4-5 — Adjust priority based on market feedback

---

*This plan is based on the product state as of 2026-06-24 and will be iterated based on user feedback and technical evolution.*
