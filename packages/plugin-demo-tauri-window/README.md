# plugin-demo-tauri-window

CodeExpander demo plugin that showcases the full **@tauri-apps/api** window API.

## Usage

- Must be opened via **“Open as plugin window”**; Tauri window APIs are not available in the search-pane view.

## ACL / Capabilities

If you see `Command plugin:window|set_size not allowed by ACL`, it means the **CodeExpander host** has not granted window permissions to the plugin window.

- For **core window APIs**, add `core:window:default` or specific permissions like `core:window:allow-set-size`.
- For **plugin:window** APIs, add `plugin:window:allow-set-size` etc., or the plugin’s default capability set.

Exact capability files depend on how the host defines plugin windows (usually in `capabilities/*.json` or `tauri.conf.json`).

## Features

| Feature            | API                              | Description                              |
|--------------------|----------------------------------|------------------------------------------|
| Set size           | `setSize(LogicalSize)`          | Change window width/height               |
| Set position       | `setPosition(LogicalPosition)`  | Move window to a specific position       |
| Center             | `center()`                      | Center window on screen                  |
| Set title          | `setTitle(string)`              | Update window title                      |
| Always on top      | `setAlwaysOnTop(boolean)`       | Toggle always-on-top                     |
| Min size           | `setMinSize(LogicalSize \| null)` | Set minimum width/height              |
| Max size           | `setMaxSize(LogicalSize \| null)` | Set maximum width/height              |
| Minimize           | `minimize()`                    | Minimize window                          |
| Maximize           | `toggleMaximize()`              | Toggle maximize                          |
| Fullscreen         | `setFullscreen(boolean)`        | Toggle fullscreen                        |
| Focus              | `setFocus()`                    | Bring window to front and focus          |
| Close              | `close()`                       | Close window                             |

## pluginSetting defaults

The plugin preconfigures window creation in `plugin.json`:

- `width`, `height`: 520×560
- `minWidth`, `minHeight`: 400×400
- `maxWidth`, `maxHeight`: 800×900
- `resizable`, `decorations`: `true`

These values only apply when the window is **first created**; afterwards you can adjust them dynamically via the APIs.

----------

# plugin-demo-tauri-window（中文）

CodeExpander 插件 demo：展示 **@tauri-apps/api** 窗口 API 的完整用法。

## 使用条件

- **必须通过「以插件窗口打开」** 才能使用。在搜索窗右侧面板中运行时，Tauri 窗口 API 不可用。

## ACL 权限（宿主配置）

若出现 `Command plugin:window|set_size not allowed by ACL` 错误，说明 **CodeExpander 宿主** 未为插件窗口授予 Tauri 窗口权限。

- 对于 **core 窗口 API**：需要在 capability 中添加 `core:window:default` 或具体权限（如 `core:window:allow-set-size`）。
- 对于 **plugin:window** API：需要添加 `plugin:window:allow-set-size` 等，或该插件的默认权限集合。

具体配置位置取决于宿主对插件窗口 capability 的定义（通常在 `capabilities/*.json` 或 `tauri.conf.json` 中）。

## 功能列表

| 功能       | API                               | 说明                 |
|------------|-----------------------------------|----------------------|
| 设置尺寸   | `setSize(LogicalSize)`           | 调整窗口宽高         |
| 设置位置   | `setPosition(LogicalPosition)`   | 移动窗口到指定位置   |
| 居中       | `center()`                       | 窗口居中到屏幕       |
| 设置标题   | `setTitle(string)`               | 更新窗口标题         |
| 置顶       | `setAlwaysOnTop(boolean)`        | 切换始终置顶         |
| 最小尺寸   | `setMinSize(LogicalSize \| null)` | 设置最小宽高约束    |
| 最大尺寸   | `setMaxSize(LogicalSize \| null)` | 设置最大宽高约束    |
| 最小化     | `minimize()`                     | 最小化窗口           |
| 最大化     | `toggleMaximize()`               | 切换最大化           |
| 全屏       | `setFullscreen(boolean)`         | 切换全屏模式         |
| 聚焦       | `setFocus()`                     | 将窗口置前并聚焦     |
| 关闭       | `close()`                        | 关闭窗口             |

## pluginSetting 预设

插件在 `plugin.json` 中预设了窗口创建参数：

- `width`, `height`: 520×560
- `minWidth`, `minHeight`: 400×400
- `maxWidth`, `maxHeight`: 800×900
- `resizable`, `decorations`: `true`

这些配置仅在**首次创建**独立插件窗口时生效，创建后可以通过 Tauri 窗口 API 进行动态调整。
