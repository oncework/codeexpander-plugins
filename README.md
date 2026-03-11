# CodeExpander Plugins

[English](./README.md) | [简体中文](./README.zh-CN.md)

Monorepo of **CodeExpander plugins**, managed with pnpm workspaces.

## Structure

- **packages/ui** — Shared Tailwind + shadcn-style UI components used by plugins.
- **packages/i18n** — Minimal i18n helpers (`getLocale`, `t`) for plugin locales.
- **packages/plugin-text** … **packages/plugin-ai** — CodeExpander plugin packages (one per category). Each builds to a `dist/` folder with `plugin.json`, `index.html`, and assets.

## Commands

| Command | Description |
|--------|-------------|
| `pnpm install` | Install all workspace dependencies. |
| `pnpm run dev` | Start the default plugin dev server. Use **`make dev`** to pick a plugin interactively, or `make dev PLUGIN=plugin-html` to specify one. |
| `pnpm run build` | Build all packages. |
| `pnpm --filter @codeexpander/plugin-text run build` | Build a single plugin. |
| `pnpm run build:plugins` | Build all plugin packages only (`pnpm --filter './packages/plugin-*' run build`). |
| `pnpm run publish:plugins` | Build and publish all plugins to npm in sequence (package names: `@codeexpander/plugin-*`). |

## One-Click Plugin Publish

Plugin packages use the **`@codeexpander/plugin-*`** scope (e.g. `@codeexpander/plugin-text`). After publishing to npm, they can be installed via CodeExpander’s npm install flow.

**Before publishing**

1. Log in to npm: `npm login` (requires `@codeexpander` org access or your own scope).
2. Optional — bump versions (e.g. `0.1.0` → `0.2.0`):
   ```bash
   pnpm --filter './packages/plugin-*' exec -- npm version patch --no-git-tag-version
   ```

**Publish**

```bash
pnpm run publish:plugins
```

This will: build all plugins (`build:plugins`), then run `pnpm publish` for each plugin (with `--no-git-checks`). Published content is each package’s `dist/` (including `plugin.json`, `index.html`, and assets).

To publish a single plugin:

```bash
pnpm --filter @codeexpander/plugin-text run build
cd packages/plugin-text && pnpm publish --no-git-checks
```

## Verifying Plugin Development

### Option 1: Local dev (no CodeExpander)

Run the plugin UI in the browser with hot reload. Copy/Toast use fallbacks (e.g. `navigator.clipboard`) when not running inside CodeExpander.

```bash
cd packages/plugin-text && pnpm run dev
# or from repo root:
pnpm --filter @codeexpander/plugin-text run dev
```

Open the URL shown in the terminal (e.g. `http://localhost:5173`) to see the plugin’s multi-tab tools UI (no “Back to Tools” shell, just the plugin).

### Option 2: Build and test in CodeExpander (recommended)

Verify behavior in the real host (e.g. `writeClipboard`, `showToast`, i18n).

1. **Build**
   ```bash
   pnpm --filter @codeexpander/plugin-text run build
   # or all plugins:
   pnpm run build:plugins
   ```

2. **Import in CodeExpander**
   - Open CodeExpander → **Settings** or **Plugin Hub**
   - Choose **Import from directory**
   - Select the plugin’s **dist** folder, e.g.:
     - `packages/plugin-text/dist`
     - `packages/plugin-html/dist`

3. **Verify**
   - Search or open the plugin (e.g. “Text Tools”) in CodeExpander.
   - You should see only the plugin content: tabs for each tool (Word Counter, Text Diff, etc.), no “Back to Tools”.
   - Test copy, Toast, and locale (if `initialPayload.locale` is passed).

## Using Plugins in CodeExpander

1. Build the plugin: `pnpm --filter @codeexpander/plugin-text run build`.
2. In CodeExpander: **Settings** or **Plugin Hub** → **Import from directory**.
3. Select the plugin’s `dist` folder (e.g. `packages/plugin-text/dist`). It must contain `plugin.json` and the entry file (`index.html`).

Plugins support multiple languages (en, zh) via `initialPayload.locale` or browser locale.
