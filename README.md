<p align="center">
  <img src="resources/icons/icon.png" alt="OGarden" width="128" height="128" />
</p>

# OGarden

<p align="center">
  <a href="https://github.com/obsidian-garden/obsidian-garden/actions"><img src="https://img.shields.io/github/actions/workflow/status/obsidian-garden/obsidian-garden/ci.yml?branch=main&style=flat-square" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/obsidian-garden"><img src="https://img.shields.io/github/package-json/v/obsidian-garden/obsidian-garden?style=flat-square" alt="Version" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" /></a>
  <a href="https://coveralls.io/github/obsidian-garden/obsidian-garden"><img src="https://img.shields.io/coverallsCoverage/github/obsidian-garden/obsidian-garden?style=flat-square" alt="Coverage" /></a>
  <a href="https://obsidian.md/plugins"><img src="https://img.shields.io/badge/Obsidian-Plugin-8A2BE2?style=flat-square" alt="Obsidian Plugin" /></a>
</p>

<p align="center">
  <strong>Publish your Obsidian notes as a beautiful website — with one click.</strong>
  <br />
  Free tier (10 notes) · Pro $19 one-time · Zero backend
</p>

---

## English

### Features

- **One-click publish** — Select notes in Obsidian and publish to GitHub Pages instantly
- **Full Markdown support** — WikiLinks (`[[Note]]`), images, YAML frontmatter, tags
- **Theme system** — Default light and dark themes included, custom CSS support
- **Incremental publishing** — SHA256 diff engine uploads only changed files
- **Built-in search** — Search index and tag aggregation pages generated automatically
- **Navigation tree** — Auto-generated folder-based navigation
- **Free tier** — Publish up to 10 notes for free
- **Pro upgrade** — $19 one-time purchase unlocks unlimited notes, custom domain, custom CSS
- **Zero backend** — GitHub PAT authentication, RSA-2048 local license validation
- **Privacy-first** — No external servers, no user tracking, no data collection
- **Hexagonal architecture** — 99.9% test coverage, TypeScript strict mode

### Quick Start

1. Install **OGarden** from the Obsidian Community Plugins browser
2. Open Settings → OGarden
3. Enter your GitHub Personal Access Token (requires `repo` scope)
4. Configure your repository name and publish branch (default: `gh-pages`)
5. Click the globe icon in the ribbon or use the command palette to open the Note Selector
6. Choose notes to publish and click **Publish**

Your site will be live at `https://<username>.github.io/<repo>/` within minutes.

### Screenshots

| Note Selector | Publish Modal | Settings Panel |
|---|---|---|
| Select notes to publish via the sidebar picker | Review changes and publish with one click | Configure GitHub token, repo, and theme |

### Configuration

#### GitHub Token

Generate a [Personal Access Token (classic)](https://github.com/settings/tokens) with the `repo` scope. Fine-grained tokens also work with the `Contents` and `Pages` permissions.

#### Repository

The plugin can create a new repository or use an existing one. The publish branch (default `gh-pages`) must have GitHub Pages enabled — the plugin does this automatically.

#### Themes

Choose between **Default Light** and **Dark Mode** in the settings panel. Custom themes can be added programmatically via the Theme Registry API.

#### License

Enter your Pro license key in the settings panel to unlock unlimited notes. License validation is fully local using RSA-2048 — no network call, no backend, no data sent anywhere.

### Development

```bash
# Clone and install
git clone https://github.com/obsidian-garden/obsidian-garden.git
cd obsidian-garden
npm install

# Build for production
npm run build

# Development with watch mode
npm run dev

# Run tests
npm test

# Lint and typecheck
npm run lint
npm run typecheck
```

### Architecture

```
src/
├── types/          # TypeScript type definitions
├── constants/      # App-wide constants (limits, GitHub config)
├── shared/         # Pure utility functions (crypto, markdown, validators)
├── domain/         # Business logic (ports + services)
│   ├── ports/      # Interface definitions (dependency inversion)
│   ├── github/     # GitHub auth, repo, Pages services
│   ├── publisher/  # Site generator, diff engine, publish orchestration
│   ├── theme/      # Theme registry, renderer, service
│   └── license/    # RSA-2048 license validation
├── infrastructure/ # Adapter implementations (HTTP, cache, Obsidian API)
├── config/         # Plugin settings with schema validation
├── di/             # tsyringe dependency injection container
├── bootstrap/      # Plugin initializer, error boundary, feature gate
└── presentation/   # Obsidian-native UI (note selector, modal, settings)
```

Dependency direction (inner → outer): `types → constants → shared → domain → infrastructure → presentation → bootstrap`

### Documentation

- [Architecture Decision Record](docs/arch/architecture.md)
- [Development Plan](docs/plans/2026-05-18-obsidian-garden-dev-plan.md)
- [Product Requirements](docs/plans/2026-05-18-obsidian-garden-prd.md)
- [Changelog](CHANGELOG.md)

### License

MIT — see [LICENSE](LICENSE)

---

## 中文

### 功能特点

- **一键发布** — 在 Obsidian 中选择笔记，一键发布到 GitHub Pages
- **完整 Markdown 支持** — WikiLinks（`[[笔记]]`）、图片、YAML 元数据、标签
- **主题系统** — 内置浅色和深色主题，支持自定义 CSS
- **增量发布** — 基于 SHA256 的差异引擎，仅上传变更的文件
- **内置搜索** — 自动生成搜索索引和标签聚合页面
- **导航目录** — 基于文件夹结构自动生成导航
- **免费层** — 免费发布最多 10 篇笔记
- **专业版升级** — 一次性付费 $19，解锁无限笔记、自定义域名和自定义 CSS
- **零后端** — 使用 GitHub PAT 认证，RSA-2048 本地许可证验证
- **隐私优先** — 无外部服务器，无用户追踪，无数据收集
- **六边形架构** — 99.9% 测试覆盖率，TypeScript 严格模式

### 快速开始

1. 在 Obsidian 社区插件市场中安装 **OGarden**
2. 打开设置 → OGarden
3. 输入您的 GitHub Personal Access Token（需要 `repo` 权限）
4. 配置仓库名称和发布分支（默认为 `gh-pages`）
5. 点击侧边栏的地球图标或使用命令面板打开笔记选择器
6. 选择要发布的笔记，点击 **发布**

您的网站将在 `https://<用户名>.github.io/<仓库>/` 上线。

### 配置指南

#### GitHub Token

生成一个 [Personal Access Token（经典版）](https://github.com/settings/tokens)，需要 `repo` 权限。细粒度 Token 同样有效，需赋予 `Contents` 和 `Pages` 权限。

#### 仓库

插件可以创建新仓库或使用已有仓库。发布分支（默认为 `gh-pages`）必须启用 GitHub Pages — 插件会自动完成此操作。

#### 主题

在设置面板中选择**默认浅色**或**深色模式**。自定义主题可以通过主题注册 API 以编程方式添加。

#### 许可证

在设置面板中输入您的专业版许可证密钥，即可解锁无限笔记。许可证验证完全在本地通过 RSA-2048 完成 — 无需网络请求，无需后端服务，无数据发送。

### 开发指南

```bash
# 克隆并安装依赖
git clone https://github.com/obsidian-garden/obsidian-garden.git
cd obsidian-garden
npm install

# 生产构建
npm run build

# 开发模式（监听文件变化）
npm run dev

# 运行测试
npm test

# 代码检查与类型检查
npm run lint
npm run typecheck
```

### 架构概览

```
src/
├── types/          # TypeScript 类型定义
├── constants/      # 全局常量（限制、GitHub 配置）
├── shared/         # 纯工具函数（加密、Markdown、验证器）
├── domain/         # 业务逻辑（端口接口 + 服务实现）
│   ├── ports/      # 接口定义（依赖反转）
│   ├── github/     # GitHub 认证、仓库、Pages 服务
│   ├── publisher/  # 站点生成器、差异引擎、发布编排
│   ├── theme/      # 主题注册、渲染器、服务
│   └── license/    # RSA-2048 许可证验证
├── infrastructure/ # 适配器实现（HTTP、缓存、Obsidian API）
├── config/         # 插件设置与模式验证
├── di/             # tsyringe 依赖注入容器
├── bootstrap/      # 插件初始化器、错误边界、功能开关
└── presentation/   # Obsidian 原生 UI（笔记选择器、模态框、设置）
```

依赖方向（内 → 外）：`types → constants → shared → domain → infrastructure → presentation → bootstrap`

### 文档

- [架构决策记录](docs/arch/architecture.md)
- [开发计划](docs/plans/2026-05-18-obsidian-garden-dev-plan.md)
- [产品需求文档](docs/plans/2026-05-18-obsidian-garden-prd.md)
- [更新日志](CHANGELOG.md)

### 许可证

MIT 协议 — 详见 [LICENSE](LICENSE)
