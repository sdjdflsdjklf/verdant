# Architecture Decision Record — Obsidian Garden

## Status

Accepted — applies to v1.0.0.

## Context

Obsidian Garden is an Obsidian community plugin for one-click publishing of notes as a website. It must meet the following constraints:

- **Zero backend** — no servers, no databases, no OAuth callback endpoints
- **Obsidian plugin review** — must pass community plugin review (isDesktopOnly: false, no files left behind, error handling)
- **Monetisation** — one-time $19 purchase, no subscriptions, no Gumroad webhook
- **Testability** — business logic must be testable without Obsidian runtime or network
- **Maintainability** — the codebase must scale as features grow post-MVP

## Decision: Hexagonal Architecture (Ports & Adapters)

We adopt hexagonal architecture (also known as ports and adapters) to enforce strict separation between business logic and external concerns.

### Layer Diagram

```
                    ┌──────────────────────┐
                    │    Presentation       │  (Obsidian-native DOM UI)
                    │  note-selector.view   │
                    │  publish-modal.view   │
                    │  settings-panel.view  │
                    └──────────┬───────────┘
                               │ depends on
                    ┌──────────▼───────────┐
                    │     Bootstrap         │  (DI wiring, initializer)
                    │  plugin-initializer   │
                    │  github-api.adapter   │
                    │  feature-gate         │
                    │  error-boundary       │
                    └──────────┬───────────┘
                               │ depends on
              ┌────────────────▼────────────────┐
              │       Infrastructure             │  (adapters)
              │  http.client  cache.repository   │
              │  vault.repository  logger        │
              │  markdown.renderer  storage      │
              └────────────────┬─────────────────┘
                               │ implements ports
              ┌────────────────▼────────────────┐
              │          Domain                  │  (business logic, pure)
              │  github/ publisher/ theme/       │
              │  license/ ports/                 │
              └────────────────┬─────────────────┘
                               │ uses types
              ┌────────────────▼────────────────┐
              │  Shared / Utils / Constants      │  (pure functions)
              │  crypto.utils  markdown.utils    │
              │  validators  constants           │
              └────────────────┬─────────────────┘
                               │ defines
              ┌────────────────▼────────────────┐
              │          Types                   │  (interfaces, DTOs)
              │  publisher.types  github.types   │
              │  theme.types  license.types      │
              └──────────────────────────────────┘
```

### Dependency Rule

Dependencies point **inward**. Code in an outer layer can depend on inner layers, but never the reverse.

- `types/` — no dependencies
- `constants/` — depends on `types/`
- `shared/` — no external dependencies beyond types; pure utility
- `domain/` — depends on `types/` and `shared/`; **zero** external npm packages (no obsidian, no @octokit)
- `infrastructure/` — implements `domain/ports/` interfaces; depends on `domain/`, `shared/`, `types/`
- `config/` — wraps Obsidian PluginData; depends on `types/`, `domain/ports/`
- `di/` — container configuration; depends on everything at registration time
- `bootstrap/` — wires DI, initializes services; depends on all above
- `presentation/` — calls domain services via DI-resolved ports; depends on `domain/`, `types/`

### Why Hexagonal

| Concern | Hexagonal | Alternative (Layered) |
|---|---|---|
| Testability | Domain is 100% testable without Obsidian or GitHub | Business logic leaks into framework code |
| Swap adapters | Swap HTTP client without touching domain | Global imports everywhere |
| Dependency inversion | Domain defines the port, infra implements it | Domain imports infra concretely |
| New delivery mechanism (e.g. mobile) | Plug in new adapters | Rewrite business logic |

## Key Decisions

### PAT Authentication vs OAuth (Zero Backend)

**Decision**: Personal Access Token only.

OAuth requires a backend server for the authorization code grant flow. Since we commit to zero backend, PAT is the only viable option. The token is stored in Obsidian's encrypted plugin data store (`Plugin.loadData`/`saveData`). Documentation guides users to create a token with `repo` scope.

**Trade-off**: Slightly higher setup friction for users (must create token manually) vs. zero infrastructure cost.

### GitHub Tree/Blob/Commit/Ref API vs Content API

**Decision**: Git Data API (Tree → Blob → Commit → Ref) over Content API.

The Content API requires one PUT request per file. For a site with 100 notes, that is 100 API calls. The Git Data API creates a single tree referencing multiple blobs, then one commit and one ref update — 4 API calls total plus 1 per file for blob creation. This translates to ~O(n) vs O(1) + O(n) in practice, but more importantly it enables atomic batch commits. Deleting files is also simpler (null SHA in tree entry).

**Trade-off**: More complex implementation (see `GithubRepoService.pushFiles()`) vs. significantly fewer API calls and atomicity.

### esbuild vs webpack

**Decision**: esbuild.

The Obsidian plugin ecosystem standardises on esbuild. It is faster by an order of magnitude, has zero configuration overhead for our use case, and is recommended by the Obsidian sample plugin. The `esbuild.config.mjs` bundles `src/main.ts` → `main.js`, marking `obsidian` as external.

**Trade-off**: No code splitting or dynamic imports (not needed for MVP).

### tsyringe vs Manual DI

**Decision**: tsyringe with `@singleton()` / `@injectable()` decorators.

Manual DI (passing dependencies through constructors manually) works for small projects but becomes unwieldy as the service graph grows. tsyringe integrates with `reflect-metadata` and supports constructor injection via `@inject()` tokens, which matches our hexagonal architecture well — each service depends on port interfaces identified by `DI_TOKENS`.

**Trade-off**: Requires `reflect-metadata` polyfill and decorator support in esbuild (enabled via `tsconfig.json` `experimentalDecorators`).

### RSA-2048 Local Validation vs Server Verification

**Decision**: RSA-2048 signature verification fully in-plugin via Web Crypto API.

The license key is a base64-encoded JSON blob containing email, timestamp, and an RSA-2048 signature. The public key is bundled in the plugin. Validation uses `crypto.subtle.verify()` with RSASSA-PKCS1-v1_5/SHA-256. No network request is made — the plugin never phones home.

**Trade-off**: Public key is embedded (anyone could extract it and create their own validator). However, generating a valid signature without the private key is computationally infeasible. This is the same model used by JetBrains, Sublime Text, and many other offline-licensed products.

### In-Memory Cache vs File-Based Cache

**Decision**: In-memory cache for MVP, file-based deferred to post-MVP.

For incremental publishing, we need to track which files have been published and their SHA256 hashes. An in-memory `Map<string, CacheFileEntry>` suffices for the MVP because increment publishing within a single session is a reasonable starting point. A file-based cache (stored alongside the plugin data) will be added when cross-session incremental detection is needed.

**Trade-off**: Cache is lost on Obsidian restart, forcing a full re-publish. Acceptable for MVP.

### Raw DOM API vs UI Framework

**Decision**: Raw DOM API (`createEl`, `createDiv`, `createSpan`) — no React, no JSX, no Svelte.

Obsidian's plugin UI convention is to use the native DOM API. All built-in Obsidian settings tabs and views use `createEl` / `createDiv`. Using a framework would introduce a build dependency, increase bundle size, and look visually inconsistent with the rest of Obsidian.

**Trade-off**: More boilerplate for complex UI (e.g., the file tree in `NoteSelectorView`) vs. native look-and-feel and zero extra dependencies.

## File Naming Conventions

| Pattern | Example | Purpose |
|---|---|---|
| `*.service.ts` | `publisher.service.ts` | Domain business logic |
| `*.repository.ts` | `cache.repository.ts` | Data access / persistence |
| `*.client.ts` | `http.client.ts` | External system adapter |
| `*.types.ts` | `publisher.types.ts` | TypeScript interfaces and DTOs |
| `*.constants.ts` | `limits.constants.ts` | App-wide constants |
| `*.utils.ts` | `crypto.utils.ts` | Pure utility functions |
| `*.helper.ts` | `path.helper.ts` | Formatting / transformation helpers |
| `*.view.ts` | `note-selector.view.ts` | Obsidian UI view components |
| `*.port.ts` | `cache.port.ts` | Domain port interface |
| `*.spec.ts` | `publisher.service.spec.ts` | Jest unit tests |
| `*.mock.ts` | `github-api.mock.ts` | Test mock implementations |
| `*.adapter.ts` | `github-api.adapter.ts` | Bridge between layers |

## Consequences

### Positive

- Domain logic is fully testable without Obsidian or GitHub — all tests run via Jest with mocked ports
- Adding a new delivery channel (e.g., Netlify deploy) requires only a new adapter implementing `GitHubApiPort`
- Swapping the HTTP client (e.g., from `fetch` to `axios`) requires zero domain changes
- The license validation system can be audited independently of the rest of the plugin
- New developers can understand the codebase by following the dependency direction

### Negative

- More files than a layered architecture — the domain/infrastructure split doubles the number of service files
- DI container configuration must be kept in sync with token declarations
- The `GithubApiAdapter` bridge adds one extra indirection layer between `PluginInitializer` and the three GitHub services

## Related

- [ADR-NNN: Theme Store Architecture] (deferred to post-MVP)
- [ADR-NNN: File-Based Cache] (deferred to post-MVP)
- [ADR-NNN: Netlify Deploy Adapter] (deferred to V2)
