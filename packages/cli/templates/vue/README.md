# {{title}}

CodeExpander 插件 - {{title}}（Vue 3 + Vite + TypeScript）

纯 Vue 模板，无 @codeexpander 依赖，开箱即用。

## 开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

构建产物在 `dist/` 目录，可在 CodeExpander 中通过「导入目录」选择 `dist` 或项目根目录使用。

## 插件桥接

在组件中可通过 `window.__codeexpander` 使用宿主能力：

- `window.__codeexpander.writeClipboard(text)` — 写入剪贴板
- `window.__codeexpander.showToast(message)` — 显示 Toast
- `window.__codeexpander_initial_payload` — 打开时的初始参数（如 keyword、locale）
