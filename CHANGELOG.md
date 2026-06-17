# Changelog

All notable changes to Verdant are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-06-06

### Changed
- Version bump to 1.0.2

## [1.0.0] - 2026-05-18

### Added

#### Publishing
- One-click publish from Obsidian to GitHub Pages
- Static site generator with Markdown → HTML conversion
- WikiLink (`[[Note]]`) support with cross-navigation
- Image and asset handling in published output
- Navigation tree generation from vault folder structure
- Tag aggregation pages with per-tag note listings
- Search index (JSON) for client-side search
- Incremental publishing via SHA256 diff engine — only changed files are uploaded
- Publish result with site URL, note count, and elapsed time
- Progress reporting through the publish pipeline (scan → generate → push → deploy)

#### GitHub Integration
- GitHub PAT-based authentication with token validation
- Repository existence check and auto-creation
- Git Tree / Blob / Commit / Ref API for batch file pushes (reduces API calls)
- File deletion via git tree with null SHA entries
- GitHub Pages auto-enablement on the publish branch
- Pages deployment status checking

#### Theme System
- Theme registry with built-in themes
- Default Light theme — clean, minimal design with purple accent
- Dark Mode theme — easy-on-the-eyes dark palette
- Theme renderer with template variable substitution (`{{title}}`, `{{content}}`, `{{baseUrl}}`, `{{navigation}}`, `{{themeStyles}}`)
- Theme service for switching and CSS caching
- Custom CSS support (Pro feature)

#### License & Monetization
- RSA-2048 license key generation script (`scripts/generate-license-key.mjs`)
- Local license validation via Web Crypto API — no network call, no backend
- License activation with signature verification
- Feature gate system (unlimited notes, custom domain, theme store, custom CSS)
- Free tier capped at 10 notes
- Pro tier at $19 one-time purchase

#### Settings Panel
- GitHub token input with Verify button
- GitHub username, repository name, and publish branch configuration
- Site title and description fields
- Theme selector dropdown
- License key input with Activate button
- License status display (Free / Pro)

#### Note Selector
- File tree view with collapsible folders (folders first, then alphabetical)
- Search input for filtering notes by name
- Checkbox-based multi-selection
- Select All / Clear buttons
- Selection counter with free-tier limit awareness

#### Publish Modal
- File summary display
- Progress bar with step description
- Success screen with site URL and "View Site" button
- Error screen with retry functionality

#### Developer Experience
- TypeScript strict mode across the entire codebase
- Hexagonal (ports & adapters) architecture with clear layer separation
- tsyringe dependency injection container
- esbuild bundler with watch mode
- Jest test suite with 99.9% coverage
- ESLint flat config with full type-aware rules
- Prettier formatting
- Husky + commitlint + lint-staged pre-commit hooks
- Comprehensive `.editorconfig`

#### Infrastructure
- HTTP client using global `fetch` with interceptor chain and timeout
- In-memory cache repository (file-based deferred to post-MVP)
- Logging service with structured log levels
- Storage repository for Obsidian plugin data
- Obsidian markdown renderer adapter
- Vault file reader adapter
- Plugin config service with typed getters, schema validation, and change events
- Error boundary with `wrap()` and `safeExecute()` utilities

#### Scripts
- `scripts/generate-license-key.mjs` — RSA key pair generation and license creation
- `scripts/version-bump.mjs` — version bump across manifest, package, and constants
- `scripts/release.mjs` — build, test, and release workflow

#### Testing
- 38 test suites with 378 tests
- Unit tests alongside source files (`*.spec.ts`)
- Integration tests in `tests/integration/`
- Mocks for GitHub API and Obsidian API in `tests/mocks/`
- MockGitHubApi with configurable return values for all endpoints

### Security

- GitHub PAT stored in Obsidian's encrypted plugin data store
- License validation fully local via RSA-2048 — no network calls
- No external servers, no telemetry, no data collection
- No files left behind after plugin disable

[v1.0.0]: https://github.com/verdant-pub/verdant/releases/tag/v1.0.0
