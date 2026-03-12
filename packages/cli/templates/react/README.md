# {{title}}

CodeExpander 插件 - {{title}}（React，monorepo 内开发）

> 使用 `workspace:*` 依赖，需在 **codeexpander-plugins** 仓库的 `packages/` 目录下创建，并纳入 pnpm workspace。

## 开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

构建产物在 `dist/` 目录，可在 CodeExpander 中通过「导入目录」使用。
