# 发布到 npm 检查清单

## 发布前

- [ ] 已执行 `npm login` 并确认账号
- [ ] 更新 `package.json` 中的 `version`（遵循 semver）
- [ ] 运行 `pnpm build` 确保构建成功
- [ ] 运行 `pnpm pack` 检查打包内容（应包含 `dist/`、`templates/`）

## 发布

```bash
cd packages/cli
pnpm build
npm publish
```

## 发布后

- [ ] 在 [npm](https://www.npmjs.com/package/create-codeexpander-plugin) 确认版本
- [ ] 测试：`pnpm create codeexpander-plugin test-demo -t html --yes`
- [ ] 更新 README / CHANGELOG（如有）

## React 模板依赖说明

`react-standalone` 模板依赖以下包已发布到 npm：

- `@codeexpander/dev-tools-ui`
- `@codeexpander/dev-tools-i18n`
- `@codeexpander/plugin-types`

若尚未发布，第三方用户使用 `react-standalone` 时 `pnpm install` 会失败。建议：

1. 先发布上述三个包到 npm，或
2. 在 README 中明确推荐使用 `html`、`nodejs-stdio` 等无需额外依赖的模板
