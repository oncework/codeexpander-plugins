# create-codeexpander-plugin

一键初始化 CodeExpander 插件，支持多种技术栈。Scaffold CodeExpander plugins with React, Node.js, Python, or Go.

## 安装与使用

```bash
# pnpm（推荐）
pnpm create codeexpander-plugin

# npm
npm create codeexpander-plugin@latest

# yarn
yarn create codeexpander-plugin

# 指定项目名和模板
pnpm create codeexpander-plugin my-plugin -t html
pnpm create codeexpander-plugin my-plugin -t nodejs-stdio
pnpm create codeexpander-plugin my-plugin -t react-standalone --yes
```

## 模板说明

| 模板 | 说明 | 依赖 |
|------|------|------|
| `html` | 纯 HTML，零依赖，开箱即用 | 无 |
| `vue` | Vue 3 + Vite + TypeScript，纯 Vue 无额外依赖 | 无 |
| `nodejs-stdio` | Node.js 后端，每次 spawn 新进程 | Node.js |
| `nodejs-http` | Node.js 后端，HTTP 长连接 | Node.js |
| `python-stdio` | Python 后端 | Python 3 |
| `python-http` | Python 后端，HTTP 长连接 | Python 3 |
| `go-stdio` | Go 后端 | Go |
| `go-http` | Go 后端，HTTP 长连接 | Go |
| `react` | React + Vite，需在 monorepo 内开发 | pnpm workspace |
| `react-standalone` | React + Vite，独立项目 | @codeexpander/* 已发布到 npm |

### 第三方用户推荐

- **零依赖**：`html` — 纯 HTML/JS，无需构建，导入即用
- **Vue 技术栈**：`vue` — Vue 3 + Vite + TypeScript，无 @codeexpander 依赖
- **有 Node.js**：`nodejs-stdio` 或 `nodejs-http`
- **有 Python**：`python-stdio` 或 `python-http`
- **有 Go**：`go-stdio` 或 `go-http`

### React 模板说明

- **react**：使用 `workspace:*`，需在 [codeexpander-plugins](https://github.com/oncework/codeexpander-plugins) 仓库的 `packages/` 下创建
- **react-standalone**：使用 npm 版本，需 `@codeexpander/dev-tools-ui`、`@codeexpander/dev-tools-i18n`、`@codeexpander/plugin-types` 已发布到 npm。若尚未发布，请使用 `html` 或 `nodejs-stdio`

## 使用生成的插件

1. 在 CodeExpander 中打开 **设置 → 插件** 或 **插件中心**
2. 选择 **从目录导入**
3. 选择生成的插件目录
4. 对于 `html`、`nodejs-*`、`python-*`、`go-*`：导入后即可使用
5. 对于 `vue`、`react`、`react-standalone`：先执行 `pnpm install && pnpm build`，再导入 `dist/` 所在目录（或导入项目根目录，CodeExpander 会读取 `dist/`）

## 环境要求

- Node.js >= 18
- 后端模板需对应运行时：Node.js / Python 3 / Go

## 发布到 npm

```bash
cd packages/cli
pnpm build
npm publish
```

发布前请确保：

- 已执行 `npm login`
- `package.json` 中 `version` 已更新
- `pnpm run build` 成功

## 相关链接

- [CodeExpander](https://codeexpander.com/)
- [插件规范](../docs/plugin-spec.md)
- [GitHub](https://github.com/oncework/codeexpander-plugins)
