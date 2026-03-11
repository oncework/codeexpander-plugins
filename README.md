# Online Dev Tools (pnpm monorepo)

Monorepo of **CodeExpander plugins**, managed with pnpm workspaces.

## Structure

- **packages/ui** — Shared Tailwind + shadcn-style UI components used by plugins.
- **packages/i18n** — Minimal i18n helpers (`getLocale`, `t`) for plugin locales.
- **packages/plugin-text** … **packages/plugin-ai** — CodeExpander plugin packages (one per category). Each builds to a `dist/` folder with `plugin.json` + `index.html` + assets.

## Commands

- `pnpm install` — Install all workspace dependencies.
- `pnpm run dev` — Start the plugin-text dev server. **`make dev`** — CLI 选择要开发的插件后启动对应 dev server；或 `make dev PLUGIN=plugin-html` 直接指定。
- `pnpm run build` — Build all plugin packages.
- Build a single plugin: `pnpm --filter @codeexpander/plugin-text run build`.
- Build all plugins only: `pnpm run build:plugins`（或 `pnpm --filter './packages/plugin-*' run build`）。
- **一键发布所有插件到 npm**：`pnpm run publish:plugins`（先构建再按序发布 11 个包，包名为 `@codeexpander/plugin-xxx`）。

---

## 一键发布插件 / One-click plugin publish

插件包名已统一为 **`@codeexpander/plugin-*`**（如 `@codeexpander/plugin-text`），发布到 npm 后可通过 CodeExpander 的 npm 安装方式使用。

**发布前准备**

1. 登录 npm：`npm login`（需有 `@codeexpander` 组织权限或使用个人 scope）。
2. 可选：统一改版本号（如 `0.1.0` → `0.2.0`）：
   ```bash
   pnpm --filter './packages/plugin-*' exec -- npm version patch --no-git-tag-version
   ```

**执行发布**

```bash
pnpm run publish:plugins
```

该命令会依次：构建所有插件（`build:plugins`）→ 对每个插件执行 `pnpm publish -r`（`--no-git-checks` 跳过 git 检查）。发布内容为各包的 `dist/` 目录（含 `plugin.json`、`index.html`、assets）。

若只发布单个插件，可先构建再进入该包目录执行 `pnpm publish`：

```bash
pnpm --filter @codeexpander/plugin-text run build
cd packages/plugin-text && pnpm publish --no-git-checks
```

---

## 如何验证开发插件 / How to verify plugin development

### 方式一：本地开发（不依赖 CodeExpander）

在浏览器里直接跑插件的 UI，改代码会热更新，适合改界面、加功能。复制/Toast 在无 host 时会走 fallback（如 `navigator.clipboard`）。

```bash
# 进入某个插件目录并启动 Vite 开发服务器
cd packages/plugin-text && pnpm run dev
# 或从仓库根目录指定插件
pnpm --filter @codeexpander/plugin-text run dev
```

浏览器打开终端里提示的地址（如 `http://localhost:5173`），即可看到该插件的**多 Tab 工具界面**（无「Back to Tools」等外壳，仅插件内容）。

### 方式二：构建后在 CodeExpander 里验证（推荐）

在真实宿主里确认插件是否按规范工作（含 `writeClipboard`、`showToast`、多语言等）。

1. **构建插件**
   ```bash
   # 构建单个插件
   pnpm --filter @codeexpander/plugin-text run build

   # 或构建所有插件
   pnpm run build:plugins
   ```

2. **导入 CodeExpander**
   - 打开 CodeExpander → **设置** 或 **插件中心**
   - 选择 **从目录导入**（Import from directory）
   - 选中该插件的 **dist** 目录，例如：
     - `packages/plugin-text/dist`
     - `packages/plugin-html/dist`
     - 等等

3. **验证**
   - 在 CodeExpander 里搜索或打开对应插件（如 "Text Tools"）
   - 应只看到插件内容：Tab 切换各工具（如 Word Counter、Text Diff…），无「Back to Tools」
   - 测试复制、Toast、中英文切换（若传了 `initialPayload.locale`）

---

## Using plugins in CodeExpander

1. Build the plugin: `pnpm --filter @codeexpander/plugin-text run build`.
2. In CodeExpander: **Settings** or **Plugin Hub** → **Import from directory**.
3. Select the plugin’s `dist` folder (e.g. `packages/plugin-text/dist`). The folder must contain `plugin.json` and the entry file (`index.html`).

Each plugin supports multiple languages (en, zh) via `initialPayload.locale` or browser locale.
