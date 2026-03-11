# plugin-demo-tauri-window

CodeExpander 插件 demo：展示 **@tauri-apps/api** 窗口 API 完整功能。

## 使用条件

**必须「以插件窗口打开」** 才能使用。在搜索窗右侧面板中运行时，Tauri 窗口 API 不可用。

## ACL 权限（宿主配置）

若出现 `Command plugin:window|set_size not allowed by ACL` 错误，说明 **CodeExpander 宿主** 未为插件窗口授予 Tauri 窗口权限。

需在宿主项目的 capability 中，为**插件独立窗口**对应的 capability 添加 window 权限。根据宿主使用的 Tauri 版本：

- **core 窗口 API**：添加 `core:window:default` 或具体权限如 `core:window:allow-set-size`
- **plugin:window**：添加 `plugin:window:allow-set-size` 等，或该插件的 default 权限

具体配置位置取决于 CodeExpander 宿主对插件窗口的 capability 定义（通常在 `capabilities/*.json` 或 `tauri.conf.json` 中）。

## 功能列表

| 功能 | API | 说明 |
|------|-----|------|
| 设置尺寸 | `setSize(LogicalSize)` | 窗口宽高 |
| 设置位置 | `setPosition(LogicalPosition)` | 窗口坐标 |
| 居中 | `center()` | 窗口居中到屏幕 |
| 设置标题 | `setTitle(string)` | 窗口标题 |
| 置顶 | `setAlwaysOnTop(boolean)` | 是否始终置顶 |
| 最小尺寸 | `setMinSize(LogicalSize \| null)` | 最小宽高约束 |
| 最大尺寸 | `setMaxSize(LogicalSize \| null)` | 最大宽高约束 |
| 最小化 | `minimize()` | 最小化窗口 |
| 最大化 | `toggleMaximize()` | 切换最大化 |
| 全屏 | `setFullscreen(boolean)` | 切换全屏 |
| 聚焦 | `setFocus()` | 窗口置前并聚焦 |
| 关闭 | `close()` | 关闭窗口 |

## pluginSetting 预设

插件在 `plugin.json` 中预设了窗口创建参数：

- `width`, `height`: 520×560
- `minWidth`, `minHeight`: 400×400
- `maxWidth`, `maxHeight`: 800×900
- `resizable`, `decorations`: true

这些仅在**首次创建**独立窗口时生效，创建后可通过 API 动态调整。
