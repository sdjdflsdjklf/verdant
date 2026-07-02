# [Plugin] Verdant — One-Click Publish Your Notes as a Website (Free + $19 Pro)

Hi everyone 👋

I built a plugin called **Verdant** — it publishes your Obsidian notes as a clean, responsive static website on GitHub Pages with one click.

**Why?** Obsidian Publish costs $8-10/month, and Quartz/Hugo require terminal setup. I wanted something zero-config, one-time payment, fully local.

---

## How it works

1. Generate a GitHub Personal Access Token with `repo` scope
2. Open the Note Selector from the sidebar
3. Pick the notes you want
4. Click **Publish**

Your site goes live at `https://<you>.github.io/<repo>/` within minutes.

---

## Features

- **One-click publish** — Note selector, theme picker, done
- **Smart diff engine** — Only changed files are re-uploaded
- **Multiple themes** — Default Light, Dark Mode, and more
- **WikiLink support** — `[[Note]]` becomes clickable cross-links
- **Tag pages** — Auto-generated per-tag aggregation pages
- **Privacy-first** — Notes go to YOUR GitHub repo. We never see your content
- **Zero backend** — No servers, no databases, no monthly bills

---

## Free vs Pro

| | Free | Pro ($19 one-time) |
|---|---|---|
| Publish to GitHub Pages | ✅ | ✅ |
| Built-in themes | ✅ | ✅ |
| WikiLinks, tags, nav | ✅ | ✅ |
| Max notes | **10** | **Unlimited** |
| Full-text search | ❌ | ✅ |
| **AI Style Agent** | ❌ | ✅ |

**AI Style Agent** — the flagship Pro feature. Describe what you want in natural language:

- *"Make the header dark blue with white text"*
- *"Add more spacing between blog posts"*
- *"Change the font to something more elegant"*

The AI reads your current styles, generates CSS overrides, and you see changes in real-time. No CSS knowledge needed.

**Free is not a trial.** 10 notes is enough for a small digital garden or blog. Pro is one-time, no subscription.

---

## Install

**Option A — Community Plugins (recommended)**

1. Obsidian → Settings → Community Plugins → Browse → search "Verdant"
2. Install → Enable

**Option B — Manual**

1. Download `main.js`, `manifest.json`, `styles.css` from [Releases](https://github.com/sdjdflsdjklf/verdant/releases)
2. Put them in `.obsidian/plugins/verdant/`
3. Restart Obsidian → enable in Community Plugins

---

## Quick comparison

| | Verdant | Obsidian Publish | Quartz |
|---|---|---|---|
| Cost (year 1) | **$19** | $96-120 | Free |
| Tech barrier | None | None | Medium-High |
| AI site customization | ✅ | ❌ | ❌ |
| Data stays local | ✅ | ✅ | ✅ |

---

## Links

- Plugin page: [community.obsidian.md/plugins/verdant](https://community.obsidian.md/plugins/verdant)
- GitHub: [github.com/sdjdflsdjklf/verdant](https://github.com/sdjdflsdjklf/verdant)

Happy to answer questions, hear feature ideas, or take bug reports. 🙌
