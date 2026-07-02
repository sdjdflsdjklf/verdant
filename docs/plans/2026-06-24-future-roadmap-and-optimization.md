# Obsidian Garden 未来更新与优化计划

> **制定日期**: 2026-06-24
> **适用范围**: garden-publish（普通版/Free）、obsidian-garden（Pro 完整版）、license-server（许可证后端）
> **核心目标**: 让用户越来越离不开这个插件，并持续提高付费转化意愿
> **文档性质**: 战略规划 + 执行路线图，是后续所有迭代的需求来源

---

## 一、现状诊断（基于代码深度审计）

### 1.1 三个项目的真实状态

> **更新（Phase 0 后）**：以下为 Phase 0 修复后的现状。原始问题已标注 ✅ 已修复 / ⚠️ 部分修复。

| 项目 | 版本 | 实际能力 | 关键问题 |
|---|---|---|---|
| **garden-publish**（Free） | 1.0.4 | 发布管线完整（PAT→Git Data API→Pages）、SSG、18 CSS 模块、链接图谱、RSS、分页 | ✅ 增量发布已激活；✅ Giscus 评论已激活；Free 10 篇上限保留作为转化触发点 |
| **obsidian-garden**（Pro） | 1.0.0 | 在 Free 基础上增加：Supabase License 验证、FlexSearch 全文搜索、AI CSS 助手（4 工具+流式）、Device Flow 登录、自定义 CSS、Giscus 评论、增量发布 | ✅ 文档已对齐 Supabase 验证；✅ AI 助手与自定义 CSS 已加 FeatureGate；自定义域名仍为 Phase 2 目标 |
| **license-server** | - | Supabase Edge Functions（activate/verify/deactivate）、Payhip 集成、设备绑定、速率限制、输入校验 | ✅ wrangler.toml 明文 secret 已移除；✅ 自助解绑端点已上线；✅ 速率限制+格式校验已实现；Supabase RLS 需控制台手动配置 |

### 1.2 最严重的五个问题（Phase 0 修复状态）

1. ✅ **安全漏洞已修复**：`license-server/wrangler.toml` 明文 secret 已移除，改用 `wrangler secret put`；新增速率限制和输入校验
2. ✅ **信任危机已化解**：所有文档（AGENTS.md/README/architecture.md）已更新为"Supabase 在线验证 + 设备绑定"，并强调"仅验证 license，不收集笔记内容"
3. ✅ **付费墙漏洞已堵住**：AI CSS 助手和自定义 CSS 均已加 `FeatureGate` 检查，Free 用户看到升级引导
4. ⚠️ **虚假宣传待处理**：Payhip 销售页面宣称"自定义域名"但代码未实现 — 需更新销售页面文案或列入 Phase 2 实现（非代码层面，需手动处理）
5. ✅ **用户流失陷阱已修复**：`device_id` 由 `PluginConfigService` 自动持久化；新增自助解绑端点和设置面板按钮；License 验证结果 24h 本地缓存

### 1.3 闲置的已实现能力（Phase 0 后状态）

| 能力 | 状态 | 激活情况 |
|---|---|---|
| 增量发布（`publishIncremental`） | ✅ 已激活 | `doPublish` 默认调用 `publishIncremental`，仅推送变更文件 |
| Giscus 评论 | ✅ 已激活 | 设置面板 4 字段配置 → `doPublish` 组装 `giscusConfig` → 透传到 `renderNote` |
| 自定义 CSS | ✅ 已激活 | 设置面板编辑器（Pro gate）+ AI 助手双入口；`doPublish` 优先 AI 定制，回退持久化 CSS |

---

## 二、战略框架

### 2.1 用户粘性飞轮（让用户离不开）

```
   ┌──────────────────────────────────────────────────────────┐
   │                                                            │
   │   ① 内容沉淀        ② 工作流依赖       ③ 站点成长          │
   │   笔记越多越不愿换  → 发布成习惯        → 流量增长正反馈    │
   │         ↑                ↑                    ↑            │
   │         │                │                    │            │
   │   ⑥ AI 赋能创作     ⑤ 社区互动         ④ 数据驱动优化      │
   │   越用越顺手        ←  评论/订阅/分享  ←  访客统计/SEO 反馈 │
   │                                                            │
   └──────────────────────────────────────────────────────────┘
```

**飞轮逻辑**：用户用 Obsidian 写笔记（①）→ 一键发布成网站（②）→ 看到访客数据（④）→ 根据反馈优化内容与 SEO（④）→ 读者评论订阅形成社区（⑤）→ AI 辅助让创作更轻松（⑥）→ 更多笔记沉淀（①）。每多转一圈，迁移成本指数级上升。

### 2.2 付费转化漏斗（提高付费愿望）

```
Free 用户（10 篇上限）
   │
   ├─ 触发点 1：达到 10 篇上限 → "解锁无限笔记" 引导
   ├─ 触发点 2：想搜索旧笔记 → "Pro 全文搜索" 引导
   ├─ 触发点 3：想自定义样式 → "Pro 自定义 CSS + AI 助手" 引导
   ├─ 触发点 4：想看访客数据 → "Pro 访客统计" 引导
   ├─ 触发点 5：想用自定义域名 → "Pro 自定义域名" 引导
   │
   ▼
试用体验（7 天 Pro 全功能试用，无需信用卡）
   │
   ▼
付费转化（$19 一次性，价值可视化）
   │
   ▼
留存与推荐（成功案例展示 + 推荐奖励）
```

**核心原则**：Free 版要足够好（让用户真正用起来并产生依赖），Pro 版要解决真实痛点（不是人为设限，而是自然进阶需求）。

### 2.3 定价策略调整建议

| 层级 | 价格 | 包含 | 目标 |
|---|---|---|---|
| **Free** | $0 | 10 篇笔记、基础发布、2 套主题、RSS、标签云 | 获客，建立依赖 |
| **Pro**（现有） | $19 一次性 | 无限笔记、全文搜索、自定义 CSS、AI 助手、访客统计、自定义域名 | 核心变现 |
| **Pro+**（新增，V2） | $39 一次性 | Pro 全部 + 多站点管理、团队协作、白标、优先支持 | 高阶用户变现 |

> **关键决策**：保持 $19 一次性付费（不引入订阅制），这是与 Obsidian 社区价值观契合的关键。订阅制会大幅降低转化率。

---

## 三、分阶段执行计划

### Phase 0：紧急修复（第 1-2 周）— 止血与信任重建 ✅ 已完成

> 目标：消除安全漏洞、对齐文档与实现、堵住付费墙漏洞。这是所有后续工作的前提。

#### 0.1 安全紧急修复 ✅
- [x] **轮换 Payhip product secret key**，从 `wrangler.toml` 移除明文，改用 `wrangler secret put` / Supabase secrets
- [x] license-server 增加 `/health` 端点 + 速率限制（每 IP 每分钟 10 次 activate/verify/deactivate）
- [ ] Supabase RLS 策略收紧：仅允许 service role 在特定 IP 段访问（需在 Supabase 控制台手动配置，非代码任务）
- [x] license key / device_id 格式预校验（正则），减少无效请求（`lib/license-key.ts`）

#### 0.2 文档与实现对齐（方案 A 已执行）✅
- **方案 A（已执行）**：更新所有文档（AGENTS.md/README/CHANGELOG/architecture.md/roadmap）如实描述"Supabase 在线验证 + 设备绑定"方案，并解释为何从 RSA 离线方案迁移（Payhip 集成需要服务端校验 secret，无法放客户端）

> **选 A 理由**：在线验证能即时反映退款状态、支持设备绑定、支持未来订阅制，是更可持续的方案。文档已诚实说明"仅验证 license，不收集任何笔记内容"。

#### 0.3 付费墙堵漏 ✅
- [x] `FeatureGate` 增加 `canUseAiAssistant()` 和 `canUseCustomCss()` 两个 gate
- [x] `AiChatPanelView` 打开前检查 `FeatureGate.canUseAiAssistant()`，Free 用户引导升级
- [x] `SiteConfig.customCss` 使用前检查 `FeatureGate.canUseCustomCss()`（doPublish 两处 customCss 传入均加 gate）
- [x] 设置面板的"自定义 CSS"编辑器对 Free 用户禁用并显示升级引导

#### 0.4 License 体验修复 ✅
- [x] `device_id` 持久化到 Obsidian plugin data（`PluginConfigService.load()` 自动生成并持久化，`SettingsPanelView` 同步到 `LicenseService`）
- [x] license-server 新增 `POST /api/deactivate` 端点（调用已有的 `deleteLicenseBinding`），支持自助解绑
- [x] 插件设置面板增加"Deactivate License"按钮
- [x] License 验证增加本地缓存（24 小时 TTL），离线启动时使用缓存状态，避免每次启动都打 Supabase

#### 0.5 闲置能力激活 ✅
- [x] publish-wizard 增加"增量发布"调用分支（`doPublish` 调用 `publishIncremental` 而非 `publish`）
- [x] 设置面板增加 Giscus 配置区（repo/repoId/category/categoryId），透传到 `generateSite()`
- [x] 设置面板增加"自定义 CSS"编辑器（Pro gate 后），写入 `PluginSettings.customCss`，`doPublish` 回退使用

**Phase 0 完成标志**：✅ 无已知安全漏洞、文档与实现一致、Free/Pro 边界清晰、License 体验顺畅、闲置功能激活。

---

### Phase 1：用户粘性基础（第 3-6 周）— 让飞轮转起来

> 目标：激活飞轮的 ④ 数据驱动 和 ⑤ 社区互动 两个缺失环节，让用户感受到"站点在成长"。

#### 1.1 访客统计面板（Pro 核心卖点）
**方案**：零后端，基于 GitHub Issues + 客户端 beacon

- [ ] 发布时自动在仓库创建 `visitors` label 的 issue 模板
- [ ] 站点前端植入轻量 beacon（`<img src="...">` 或 fetch），访问时在仓库创建/更新 issue 评论计数
- [ ] 插件内"访客统计"面板：近 7/30 天 PV/UV、热门笔记 Top 10、来源国家/地区、设备分布
- [ ] 数据存储在 GitHub Issues（零成本），插件拉取并可视化

**替代方案**（更简单）：基于 localStorage 的"站点内搜索热词"统计 + GitHub API 拉取仓库 clone/visit 数据（GitHub 提供 traffic API）

#### 1.2 SEO 增强套件（Pro）
- [ ] 自动生成 `sitemap.xml`（发布时随站点一起推送）
- [ ] 自动生成 `robots.txt`
- [ ] 笔记 frontmatter 支持 `seo_title`/`seo_description`/`og_image`，注入 `<meta>` 标签
- [ ] 自动生成 Open Graph 卡片（首页 + 每篇笔记）
- [ ] 自动生成 JSON-LD 结构化数据（Article schema），提升 Google 富摘要
- [ ] 自动生成 canonical URL，避免重复内容

#### 1.3 评论区增强
- [ ] Giscus 配置 UI（Phase 0 已激活基础功能）
- [ ] 支持 Giscus 主题跟随站点主题（light/dark）
- [ ] 支持 Utterances（基于 GitHub Issues）作为 Giscus 替代
- [ ] 评论数显示在笔记卡片上

#### 1.4 订阅功能
- [ ] RSS feed 已有，增加"邮件订阅"入口（通过 Buttondown/Substack embed，零后端）
- [ ] 站点首页增加订阅表单组件
- [ ] 发布新笔记时自动触发 RSS 更新（已有）

**Phase 1 完成标志**：用户能看到访客数据、SEO 表现、读者评论、订阅增长，飞轮 ④⑤ 转起来。

---

### Phase 2：创作体验深化（第 7-12 周）— 让 AI 成为习惯

> 目标：AI 从"CSS 助手"扩展为"全流程创作伙伴"，让用户离不开 AI 辅助。

#### 2.1 AI 能力扩展（Pro 核心）
当前 AI 仅限 CSS 编辑，扩展为：

- [ ] **AI 内容助手**：
  - 笔记摘要生成（一键生成 excerpt）
  - 标签推荐（分析笔记内容推荐 tags）
  - 标题优化建议
  - SEO 描述生成
  - 相关笔记推荐（基于语义而非链接）
- [ ] **AI 发布助手**：
  - 发布前检查清单（链接有效性、图片完整性、frontmatter 规范）
  - 自动生成站点描述
  - 自动生成首页推荐笔记排序
- [ ] **AI 翻译**：一键翻译笔记为多语言版本（发布多语言站点）

#### 2.2 预览体验升级
- [ ] 实时预览：编辑笔记时侧边栏实时显示发布效果（无需打开发布向导）
- [ ] 移动端预览：模拟手机屏幕尺寸预览
- [ ] 暗色模式预览切换
- [ ] 预览中点击链接可跳转（SPA 预览）

#### 2.3 主题系统增强
- [ ] 主题市场（社区贡献主题，GitHub 仓库托管，插件内一键安装）
- [ ] 主题自定义面板（可视化调整 CSS 变量：颜色/字体/间距/圆角，无需写代码）
- [ ] 主题导入导出（JSON 配置文件分享）

#### 2.4 发布流程优化
- [ ] 自动发布：笔记保存时自动增量发布（可配置触发条件：特定 tag/特定文件夹）
- [ ] 定时发布：frontmatter 支持 `publish_date`，到时间自动发布
- [ ] 草稿模式：`draft: true` 的笔记不发布
- [ ] 排除规则：`.gardenignore` 文件支持
- [ ] 发布历史：记录每次发布的变更（基于 Git commit）

**Phase 2 完成标志**：AI 深入创作全流程、主题丰富可定制、发布自动化，用户迁移成本极高。

---

### Phase 3：站点成长赋能（第 13-20 周）— 让站点越成功越离不开

> 目标：让用户的站点真正"活起来"，成为个人品牌资产。

#### 3.1 自定义域名（Pro，补齐虚假宣传）
- [ ] 设置面板增加域名配置（`CNAME` 内容 + DNS 配置指引）
- [ ] 发布时自动写入 `CNAME` 文件到仓库根目录
- [ ] 调用 GitHub Pages API 配置自定义域名（`PUT /repos/{owner}/{repo}/pages`）
- [ ] HTTPS 自动启用（GitHub Pages 自动签发 Let's Encrypt 证书）
- [ ] 域名状态检测与错误提示

#### 3.2 多站点管理（Pro+，新增变现点）
- [ ] 一个插件管理多个发布目标（多个 GitHub 仓库）
- [ ] 每个站点独立配置（主题/域名/笔记集合）
- [ ] 站点间笔记共享与差异发布
- [ ] 站点仪表盘（一览所有站点的访客/笔记数/最后发布时间）

#### 3.3 图片智能处理（Pro）
- [ ] 图片自动压缩（发布时压缩为 WebP，保留原图）
- [ ] 图片懒加载（`loading="lazy"`）
- [ ] 响应式图片（`srcset` 多尺寸）
- [ ] 图片 CDN（可选，通过 jsDelivr 或自定义 CDN）
- [ ] 图片 EXIF 信息剥离（隐私保护）

#### 3.4 性能优化
- [ ] HTML/CSS/JS 压缩（发布时 minify）
- [ ] 字体子集化（仅打包使用的字符）
- [ ] 关键 CSS 内联（首屏渲染优化）
- [ ] 资源预加载（`<link rel="preload">`）
- [ ] Lighthouse 评分集成（发布后自动检测并展示评分）

#### 3.5 社交分享
- [ ] 笔记页增加社交分享按钮（Twitter/LinkedIn/微信/复制链接）
- [ ] Open Graph 卡片优化（确保分享链接有美观预览）
- [ ] 分享计数显示（可选）

**Phase 3 完成标志**：站点具备独立域名、高性能、多站点管理能力，成为用户的正式个人品牌站点。

---

### Phase 4：生态与社区（第 21-30 周）— 构建护城河

> 目标：从单点工具升级为生态，让用户因社区而留下。

#### 4.1 主题市场
- [ ] 社区主题仓库（GitHub repo 托管，JSON 索引）
- [ ] 插件内主题浏览器（预览截图 + 一键安装）
- [ ] 主题作者署名与捐赠入口
- [ ] 主题版本管理与更新通知

#### 4.2 插件市场（组件级）
- [ ] 可分享的"站点组件"（如：代码高亮增强、数学公式、Mermaid 图表、时间线、图集）
- [ ] 组件市场浏览与安装
- [ ] 组件配置 UI

#### 4.3 模板市场
- [ ] 站点模板（笔记 + 主题 + 配置的完整方案包）
- [ ] 用例模板：个人博客/学术主页/项目文档/读书笔记/数字花园
- [ ] 一键导入模板并发布

#### 4.4 社区案例展示
- [ ] 官网展示"用 Obsidian Garden 搭建的站点"画廊
- [ ] 案例分类（数字花园/学术/作品集/文档）
- [ ] 用户提交案例入口
- [ ] 案例带动新用户转化（社会证明）

#### 4.5 文档与教育
- [ ] 官方文档站（用 Obsidian Garden 自身搭建，dogfooding）
- [ ] 视频教程系列（从入门到高级）
- [ ] 最佳实践指南（如何组织数字花园、如何做 SEO、如何用 AI 辅助）
- [ ] 社区 Discord/微信群

**Phase 4 完成标志**：形成主题/组件/模板生态，社区案例反哺获客，护城河建立。

---

### Phase 5：长期愿景（30 周以后）

#### 5.1 多平台发布
- [ ] Netlify/Vercel/Cloudflare Pages 发布支持（不限于 GitHub Pages）
- [ ] 自托管静态文件导出（下载 ZIP）
- [ ] WordPress 导出（XML）
- [ ] Notion 发布（API）

#### 5.2 协作能力（Pro+）
- [ ] 多人共同维护一个站点（基于 GitHub 协作）
- [ ] 评论审核协作
- [ ] 内容审批流

#### 5.3 商业化进阶
- [ ] 付费墙组件（站点所有者可对部分笔记收费，集成 Stripe/Lemon Squeezy）
- [ ] 邮件订阅付费（集成 ConvertKit/Buttondown 付费计划）
- [ ] 赞助按钮（Buy Me a Coffee / GitHub Sponsors embed）

#### 5.4 AI 深度集成
- [ ] AI 生成整篇笔记大纲
- [ ] AI 知识图谱可视化（基于笔记间的语义关系）
- [ ] AI 问答机器人（基于站点所有笔记的 RAG）
- [ ] AI 自动内链建议（写作时推荐链接到哪篇已有笔记）

#### 5.5 移动端增强
- [ ] 移动端发布流程优化（触摸友好）
- [ ] 移动端预览
- [ ] PWA 支持（站点可安装为 App）

---

## 四、技术优化计划

### 4.1 架构债务清理

| 债务 | 优先级 | 方案 |
|---|---|---|
| 内存缓存跨会话丢失 | 高 | 持久化到 Obsidian plugin data，支持增量发布 |
| `@octokit/rest` 依赖冗余 | 中 | 核实未使用则移除 |
| slugify 重复定义 3 处 | 中 | 提取到 `shared/helpers/slug.helper.ts` |
| publish-wizard 直接 `container.resolve()` | 低 | 改为构造注入（保持架构纯度） |
| Supabase functions 代码重复 | 高 | 抽取共享逻辑到 `_shared/`，修复 tsconfig include |
| license-server 零测试 | 高 | 补充 activate/verify/kv/payhip 的单元测试 |
| `__FLEXSEARCH_BUNDLE__` 未 define | 高（Free 版） | esbuild.config.mjs 增加 define + 声明 flexsearch 依赖 |

### 4.2 性能优化

- [ ] **发布速度**：blob 上传并发度从 5 提升到 10（可配置），大仓库分批 commit
- [ ] **站点加载**：CSS/JS 压缩，字体子集化，图片懒加载（Phase 3）
- [ ] **插件启动**：懒加载 domain 服务（首次使用时 resolve，而非启动时全注册）
- [ ] **预览速度**：预览 HTML 缓存，仅变更部分重渲染
- [ ] **搜索速度**：FlexSearch 索引持久化到 IndexedDB（避免每次加载重建）

### 4.3 质量保障

- [ ] license-server 补充测试（目标覆盖率 ≥ 80%）
- [ ] E2E 测试覆盖完整发布流程（Free + Pro 两条路径）
- [ ] 增加 Lighthouse CI（每次发布前检测站点性能评分）
- [ ] 增加 a11y 审计（axe-core 集成）
- [ ] 跨平台测试矩阵（macOS/Windows/Linux + 桌面/移动）

### 4.4 可观测性

- [ ] 插件内错误上报（可选开启，匿名，仅错误堆栈）
- [ ] license-server 结构化日志（JSON 格式，含 request id）
- [ ] license-server 指标采集（激活成功/失败次数、Payhip 延迟、错误率）
- [ ] license-server 审计日志（谁在何时激活/验证/解绑）

---

## 五、付费转化优化策略

### 5.1 价值可视化（让用户看到 Pro 的价值）

- [ ] Free 版状态栏显示"已发布 X/10 篇"，接近上限时高亮提醒
- [ ] 设置面板增加"Pro 价值估算"：展示 Pro 用户平均获得的访客增长、搜索使用次数
- [ ] 发布成功页展示"升级 Pro 解锁全文搜索/访客统计"引导（非强制，价值导向）
- [ ] 站点前端 Free 版底部显示"Powered by Obsidian Garden"（Pro 可隐藏）

### 5.2 渐进式解锁

- [ ] **7 天 Pro 试用**：新用户首次安装后自动获得 7 天 Pro 全功能体验，无需信用卡
- [ ] **推荐奖励**：老用户推荐新用户购买 Pro，双方各延长 1 个站点主题或获得 AI 额度
- [ ] **限时优惠**：达到 10 篇上限时弹出"今日升级 8 折"优惠券（Payhip 支持 coupon）

### 5.3 触发点设计（在用户最需要时出现）

| 触发场景 | 触发条件 | 引导内容 |
|---|---|---|
| 笔记数达上限 | 发布第 10 篇时 | "你已建立 10 篇笔记的花园，升级 Pro 解锁无限笔记" |
| 搜索旧笔记 | 用户在 Obsidian 内搜索 | "Pro 版站点支持全文搜索，读者可轻松找到你的内容" |
| 想自定义样式 | 用户查看主题设置 | "Pro 版支持自定义 CSS + AI 助手，打造独一无二的站点" |
| 想看访客数据 | 发布成功后 | "Pro 版访客统计让你了解读者从哪来、看什么" |
| 想用自定义域名 | 用户配置 GitHub Pages 时 | "Pro 版支持自定义域名，建立专业个人品牌" |
| 站点加载慢 | 发布大量图片后 | "Pro 版图片自动压缩，站点加载快 3 倍" |

### 5.4 信任建设

- [ ] 官网展示"已服务 X 位创作者，发布 X 篇笔记，获得 X 次访问"
- [ ] 用户案例展示（Phase 4.4）
- [ ] 透明定价页（明确 Free/Pro/Pro+ 区别，无隐藏费用）
- [ ] 退款政策明确（14 天无理由退款）
- [ ] 开源核心发布逻辑（仅 Pro 增值功能闭源），建立社区信任

---

## 六、优先级排序与执行建议

### 6.1 优先级矩阵

```
高价值 × 高紧迫 → 立即做（Phase 0）
  - 安全修复、文档对齐、付费墙堵漏、License 体验

高价值 × 低紧迫 → 规划做（Phase 1-2）
  - 访客统计、SEO、AI 扩展、主题增强

低价值 × 高紧迫 → 委托做（Phase 0.5）
  - 闲置能力激活、债务清理

低价值 × 低紧迫 → 暂缓做（Phase 3-5）
  - 多站点、协作、商业化进阶
```

### 6.2 推荐执行顺序

1. ✅ **第 1-2 周**：Phase 0 全部完成（止血）— **已完成**
2. ✅ **第 3-4 周**：激活闲置能力 + 0.5 闲置能力激活（增量发布/Giscus/自定义 CSS UI）— **已完成（并入 Phase 0）**
3. **第 5-8 周**：Phase 1.1 访客统计 + 1.2 SEO 增强（飞轮核心）← **下一阶段**
4. **第 9-12 周**：Phase 2.1 AI 扩展 + 2.3 主题增强（Pro 卖点强化）
5. **第 13-16 周**：Phase 3.1 自定义域名 + 3.3 图片处理（补齐承诺）
6. **第 17 周起**：按市场反馈调整 Phase 3-5 优先级

### 6.3 关键指标（KPI）

| 指标 | 当前 | 目标（3 个月） | 目标（6 个月） |
|---|---|---|---|
| Free 用户数 | - | 1,000 | 5,000 |
| Free→Pro 转化率 | - | 3% | 5% |
| Pro 用户数 | - | 30 | 250 |
| 平均发布笔记数（Free） | - | 5 | 7 |
| 平均发布笔记数（Pro） | - | 30 | 50 |
| 7 天试用→付费转化 | - | 8% | 12% |
| 站点平均 Lighthouse 分 | - | 85 | 95 |
| NPS（净推荐值） | - | 40 | 60 |

---

## 七、风险与应对

| 风险 | 概率 | 影响 | 应对 |
|---|---|---|---|
| Obsidian 社区审核因"在线验证"拒绝 | 中 | 高 | Phase 0 文档对齐，明确"仅验证 license 不收集内容"；准备 RSA 离线方案作为 Plan B |
| Payhip 服务变更/下线 | 低 | 高 | license-server 抽象支付层，预留 Lemon Squeezy/Stripe 适配 |
| GitHub API 限额（5,000/h） | 中 | 中 | 增量发布 + 缓存 + 请求合并；超限时友好提示 |
| AI API 成本（用户自带 key 但可能弃用） | 中 | 中 | 支持多 provider（OpenRouter/NIM/本地 Ollama），降低单一依赖 |
| 主题市场安全（恶意主题） | 低 | 高 | 主题沙箱化（仅 CSS，禁 JS），代码审查准入 |
| 竞品（Quartz/MkDocs/Obsidian Digital Garden） | 高 | 中 | 差异化：Obsidian 原生集成 + AI + 零配置 + $19 一次性 |

---

## 八、附录：关键决策记录

### A1. 为何从 RSA 离线验证迁移到 Supabase 在线验证？
- Payhip 集成需要服务端校验 `product-secret-key`，不能放客户端
- 在线验证能即时反映退款/禁用状态
- 支持设备绑定，防止 license 滥用
- **代价**：违背"零后端"承诺，需在文档中诚实说明并强调隐私边界

### A2. 为何保持 $19 一次性付费而非订阅制？
- Obsidian 社区价值观偏好一次性付费
- 订阅制会大幅降低转化率（社区调研）
- 一次性付费降低决策门槛，靠规模变现
- Pro+ 层级（$39）作为高阶变现补充

### A3. 为何选择 GitHub Issues 做访客统计而非自建后端？
- 零后端成本，符合"零后端"理念
- 数据在用户自己的仓库，用户完全掌控
- GitHub API 稳定，无需维护
- **限制**：精度有限（无 cookie，UV 靠 IP+UA 哈希），但对个人站点足够

### A4. 为何 AI 采用"用户自带 API Key"模式？
- 插件无 API 成本负担，可持续免费提供 AI 功能
- 用户掌控数据隐私（直接与 AI 供应商交互）
- 支持多 provider，用户可选最经济方案
- **限制**：需用户自行注册 API key，有使用门槛（通过文档降低）

---

## 九、下一步行动

> 本文档确认后，立即启动 Phase 0。每个 Phase 完成后更新本文档的 checklist 与 KPI。

**首批执行清单**（本周内）：
1. 轮换 Payhip secret key，修复 wrangler.toml
2. 更新所有文档对齐"Supabase 在线验证"现实
3. FeatureGate 增加 AI 助手与自定义 CSS 的 gate
4. device_id 持久化 + 自助解绑端点
5. 激活增量发布与 Giscus 评论

---

*本计划基于 2026-06-24 的代码审计制定，将根据市场反馈与技术演进持续迭代。*
