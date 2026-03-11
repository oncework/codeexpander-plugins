# CodeExpander Plugins

[English](./README.md) | [简体中文](./README.zh-CN.md)

本仓库是 **CodeExpander 插件** 的 pnpm 单体仓库。

## 结构

- **packages/ui** — 插件共用的 Tailwind + shadcn 风格 UI 组件。
- **packages/i18n** — 插件多语言用的轻量 i18n 工具（`getLocale`、`t`）。
- **packages/plugin-text** … **packages/plugin-ai** — 各品类 CodeExpander 插件包，构建输出到 `dist/`（含 `plugin.json`、`index.html` 及静态资源）。

## 常用命令

| 命令 | 说明 |
|--------|-------------|
| `pnpm install` | 安装工作区依赖。 |
| `pnpm run dev` | 启动默认插件开发服务。**`make dev`** 可交互选择要开发的插件；`make dev PLUGIN=plugin-html` 直接指定插件。 |
| `pnpm run build` | 构建所有包。 |
| `pnpm --filter @codeexpander/plugin-text run build` | 仅构建单个插件。 |
| `pnpm run build:plugins` | 仅构建所有插件（等价于 `pnpm --filter './packages/plugin-*' run build`）。 |
| `pnpm run publish:plugins` | 先构建再按序发布所有插件到 npm（包名为 `@codeexpander/plugin-*`）。 |

## 一键发布插件

插件包名统一为 **`@codeexpander/plugin-*`**（如 `@codeexpander/plugin-text`），发布到 npm 后可在 CodeExpander 中通过 npm 安装使用。

**发布前准备**

1. 登录 npm：`npm login`（需具备 `@codeexpander` 组织权限或使用个人 scope）。
2. 可选：统一提升版本号（如 `0.1.0` → `0.2.0`）：
   ```bash
   pnpm --filter './packages/plugin-*' exec -- npm version patch --no-git-tag-version
   ```

**执行发布**

```bash
pnpm run publish:plugins
```

该命令会依次：构建所有插件（`build:plugins`）→ 对每个插件执行 `pnpm publish`（`--no-git-checks` 跳过 git 检查）。发布内容为各包的 `dist/` 目录（含 `plugin.json`、`index.html` 及资源）。

若只发布单个插件，可先构建再进入该包目录执行 `pnpm publish`：

```bash
pnpm --filter @codeexpander/plugin-text run build
cd packages/plugin-text && pnpm publish --no-git-checks
```

## 如何验证插件开发

### 方式一：本地开发（不依赖 CodeExpander）

在浏览器中直接运行插件 UI，支持热更新；无宿主时复制/Toast 会走 fallback（如 `navigator.clipboard`）。

```bash
cd packages/plugin-text && pnpm run dev
# 或从仓库根目录指定插件
pnpm --filter @codeexpander/plugin-text run dev
```

在终端提示的地址（如 `http://localhost:5173`）打开，即可看到该插件的多 Tab 工具界面（无「返回工具」等外壳，仅插件内容）。

### 方式二：构建后在 CodeExpander 中验证（推荐）

在真实宿主中确认插件行为（含 `writeClipboard`、`showToast`、多语言等）。

1. **构建插件**
   ```bash
   pnpm --filter @codeexpander/plugin-text run build
   # 或构建所有插件
   pnpm run build:plugins
   ```

2. **在 CodeExpander 中导入**
   - 打开 CodeExpander → **设置** 或 **插件中心**
   - 选择 **从目录导入**
   - 选中该插件的 **dist** 目录，例如：
     - `packages/plugin-text/dist`
     - `packages/plugin-html/dist`

3. **验证**
   - 在 CodeExpander 中搜索或打开对应插件（如「文本工具」）
   - 应只看到插件内容：Tab 切换各工具（如字数统计、文本对比等），无「返回工具」
   - 测试复制、Toast、中英文切换（若传入 `initialPayload.locale`）

## 在 CodeExpander 中使用插件

1. 构建插件：`pnpm --filter @codeexpander/plugin-text run build`。
2. 在 CodeExpander：**设置** 或 **插件中心** → **从目录导入**。
3. 选择插件的 `dist` 目录（如 `packages/plugin-text/dist`），其中需包含 `plugin.json` 和入口文件 `index.html`。

插件通过 `initialPayload.locale` 或浏览器语言支持多语言（en、zh）。
