# CodeExpander 插件规范（简体中文）

这是一个面向 **人类开发者** 和 **AI 工具** 的分步骤指南，帮助你为 CodeExpander 开发、导入以及通过 MCP 自动创建插件。

- **如果你是人类开发者**：重点阅读第 **1–5 章** 了解目录结构、manifest、Tauri 能力、前端/后端运行时；第 **7 章** 了解无需 MCP 的导入方式。  
- **如果你是 AI 工具（通过 MCP）**：重点阅读第 **3 章 manifest 规范** 和第 **6 章 MCP 接口**。

---

## 1. 什么是 CodeExpander 插件？

1. 插件本质上是一个 **片段目录**，可以：  
   - 渲染一个 **浏览器 UI**（HTML / JS / JS 模块）。  
   - 可选地调用一个 **后端可执行程序**（Node / Python / Shell / 任何系统中可执行的程序）。  
2. CodeExpander 同时可以作为 **MCP 服务器** 暴露给 AI 助手（如 Cursor、Claude Desktop 等），从而 **自动创建、列出和管理插件**。

---

## 2. 插件目录结构

一个插件就是一个目录，至少包含：

- **plugin.json**（或 **plugin.meta.json**）—— 插件清单，描述元信息和入口文件  
- **入口文件** —— 例如 `index.html`（或在 `main` 字段中指定的文件）

示例（扁平目录）：

```text
my-plugin/
  plugin.json
  index.html
```

**dist 式目录**（如 Vite 构建产物）：根目录放 `index.html`，资源在子目录。从目录导入时，会递归扫描并将每个文件按**相对插件根的路径**存储（如 `assets/index-abc123.js`），宿主通过 `codeexpander-plugin://<snippetKey>/<path>` 提供访问，HTML 中的相对引用（如 `<script src="./assets/index-abc123.js">`）可正确解析。

**图片（PNG、JPG、GIF、WebP、ICO）**  
从目录导入时，二进制图片会以 **base64** 存入片段（与 Gist/Gitee 约定一致），宿主通过 `codeexpander-plugin://` 按正确 MIME 类型提供，故 `<img src="./assets/logo.png">` 可用。SVG 仍以 UTF-8 文本存储。

## 3. plugin.json 与 manifest

### 3.1 通用字段

| 字段 | 类型 | 说明 |
|------|------|------|
| **main** | string | 浏览器入口文件（例如 `index.html` 或 `index.js`），默认 `index.html` |
| **backend** | object | 可选，多语言后端配置（Node / Python / Shell / 其它可执行程序），见下文 |
| **title** | string | 在搜索与插件列表中展示的名称 |
| **description** | string | 简短描述 |
| **logo** | string | Logo 地址（URL 或 data URL）|
| **icon** | string | 图标标识或 URL |
| **category** | string | 分类名称 |
| **order** | number | 排序权重 |
| **features** | array | 特性定义，用于搜索匹配（code / explain / cmds）|
| **pluginSetting** | object | 可选，详见 **3.1.1**。 |
| **url** | string | 可选。安装来源。`npm:` 或完整 CDN URL = npm 包（仅 manifest 存于片段）；`file://` 或 `devlink:` = 本地/开发路径（运行时从磁盘读文件）。省略则所有文件存于片段。 |
| **i18n** | object | 可选。title / description / category 的多语言覆盖，见 **3.1.2**。 |

### 3.1.1 pluginSetting（可选）

- **height**（number）— 在**搜索窗**右侧插件面板中展示时使用的高度；也作为「以插件窗口打开」独立窗的默认高度。
- 针对**「以插件窗口打开」**独立窗，还支持：
  - **width**、**height**（number）— 窗口宽高（px），默认 640×480，限制在 320–1200 × 240–900。
  - **minWidth**、**minHeight**、**maxWidth**、**maxHeight**（number）— 尺寸上下限（px）。
  - **alwaysOnTop**（boolean）— 是否置顶，默认 `false`。每次打开时都会应用。
  - **transparent**（boolean）— 透明背景，默认 `false`。**仅在窗口首次创建时生效**（创建后无法再改）。
  - **decorations**（boolean）— 是否显示标题栏，默认 `true`。**仅首次创建时生效。**
  - **resizable**（boolean）— 是否允许用户缩放窗口，默认 `true`。**仅首次创建时生效。**
  - **permissions**（string 数组）— 插件运行时需要的 Tauri 权限标识。宿主在展示插件窗口时通过 `add_capability` 动态授予。需声明完整标识，如 `core:window:allow-set-size`、`core:window:allow-set-position`。若省略或为空，不授予任何额外权限。**注意**：权限一旦授予，在应用生命周期内对所有插件窗口生效（全局累积）。示例：

```json
"pluginSetting": {
  "permissions": [
    "core:window:allow-set-size",
    "core:window:allow-set-position",
    "core:window:allow-set-title"
  ]
}
```

**初始化后的运行时调整**  
当插件在**独立插件窗口**（「以插件窗口打开」）中运行时，可访问 Tauri 的 window API（例如通过 `@tauri-apps/api/window`）。窗口创建后，插件可调用 `getCurrentWindow()`，再在运行时调整：**尺寸**（`setSize`）、**最小/最大尺寸**（`setMinSize`、`setMaxSize`）、**置顶**（`setAlwaysOnTop`）、**位置**（`setPosition`）、**标题**（`setTitle`）。仅在创建时生效的属性（**transparent**、**decorations**、**resizable**）在该窗口创建后不可再改。

### 3.1.2 i18n（可选）

用于 **title**、**description**、**category** 的多语言文案，也可以扩展到你自定义的 key（例如 feature 的详细说明）。宿主按当前语言（如 `zh_CN`、`en`）解析展示。

- **结构**：`i18n` 为对象，key 为语言码（`en`、`zh_CN` 等），value 为「字段名或 key → 文案」对象。常见 key 是 `title`、`description`、`category`，也可以自定义如 `"feature.timestamp_convert.explain"` 等。
- **解析顺序**（每个核心字段：**title / description / category**）：(1) 若存在 `i18n[locale].field` 或 `i18n.en.field` 则用；(2) 若主字段形如 `{{key}}`，则在 `i18n[locale]` / `i18n.en` 中查该 key；(3) 否则用主字段值。

示例（字段覆盖）：

```json
"title": "Timestamp converter",
"description": "Convert between Unix timestamp and readable date.",
"category": "Tools",
"i18n": {
  "zh_CN": {
    "title": "时间戳转换",
    "description": "在 Unix 时间戳与可读日期之间转换。",
    "category": "工具"
  }
}
```

示例（模板 key）：

```json
"title": "{{title}}",
"description": "{{description}}",
"category": "{{category}}",
"i18n": {
  "en": { "title": "Timestamp converter", "description": "...", "category": "Tools" },
  "zh_CN": { "title": "时间戳转换", "description": "...", "category": "工具" }
}
```

你也可以为 **feature 的 explain 文案** 定义自定义 key，宿主在渲染特性列表时会自动按语言解析，例如：

```json
"features": [
  {
    "code": "timestamp_convert",
    "explain": "{{feature.timestamp_convert.explain}}",
    "cmds": ["timestamp", "ts"]
  }
],
"i18n": {
  "en": {
    "feature.timestamp_convert.explain": "Convert between Unix timestamp and readable date."
  },
  "zh_CN": {
    "feature.timestamp_convert.explain": "在 Unix 时间戳与可读日期之间转换。"
  }
}
```

如果 `explain` 是普通字符串（而不是 `{{key}}` 模板），宿主会优先尝试从 `i18n[locale][\"feature.<code>.explain\"]` / `i18n.en` 读取更具体的文案，找不到时回退到原始 `explain` 字段。

### 3.2 features（可选）

每一项可以包含：

- **code** —— 特性标识符  
- **explain** —— 简短说明，可以是：
  - 默认语言的一行文字（如 `"在 Unix 时间戳与可读日期之间转换。"`），或
  - 一个模板 key（如 `{{feature.timestamp_convert.explain}}`），具体文案从 `i18n[locale]` / `i18n.en` 中按 key 查表（见 3.1.2）。
- **cmds** —— 触发命令数组：可以是简单字符串，或带 `type` 的对象（`regex` / `over` / `files` / `img` / `window` 等），用于统一搜索匹配。

### 3.3 backend 对象（可选）

当你需要一个后端进程（Node、Python、Shell 或任意可执行程序）时，在 manifest 中声明 `backend` 对象：

```json
{
  "main": "index.html",
  "backend": {
    "runtime": "node",          // 任意可执行文件名或路径，如 "node"、"python3"、"ruby"、"sh" ...
    "entry": "backend.js",      // 相对插件根目录的脚本路径
    "args": ["--flag"],         // 可选，附加参数
    "cwd": "backend",           // 可选，工作目录，默认 "."
    "mode": "stdio"             // 可选："stdio"（默认）或 "http"，见 §4.2 后端协议
  }
}
```

- `runtime` 可以是任何在 `PATH`（或系统）中可解析的可执行名称，如 `node`、`python3`、`ruby`、`php`、`sh` 等。  
- `entry` / `cwd` 最终会在一个插件专用的临时目录下解析，路径中不得包含 `..`。  
- **多方法**：每次 `callBackend(method, payload)` 为一次调用；默认 `mode: "stdio"` 时每次调用都会**新起一个进程**。若需跨调用状态，请通过 payload 传递或在临时目录中读写文件（同一片段多次调用共享同一临时目录）。  
- **超时**：单次 stdio 调用超时时间为 10 秒，超时后进程会被终止。

### 3.4 最小示例（仅浏览器）

**plugin.json：**

```json
{
  "main": "index.html",
  "title": "Timestamp converter",
  "description": "Convert between Unix timestamp and readable date."
}
```

**index.html：** 你的插件 UI（HTML/JS）。宿主会注入 `initialPayload`（如搜索关键字、文件列表），并暴露一组桥接 API：

- `window.__codeexpander_initial_payload` —— 与 `initialPayload` 相同的 JSON 对象  
- `window.__codeexpander.writeClipboard(text)` —— 写入系统剪贴板  
- `window.__codeexpander.showToast(message)` —— 显示桌面通知  
- `window.__codeexpander.callBackend(method, payload)` —— 调用你在 `backend.runtime` 配置的后端可执行程序，并返回一个 Promise，解析为 JSON 结果

## 4. Tauri 插件与能力（CodeExpander 宿主）

CodeExpander 初始化了以下 Tauri 插件。片段插件运行在匹配特定 capability 的 webview 中，并非所有插件 API 都对每个插件窗口开放。

### 4.1 已初始化的 Tauri 插件

| 插件 | 用途 |
|------|------|
| `tauri_plugin_log` | 日志写入应用日志目录 |
| `tauri_plugin_opener` | 打开 URL / 在 Finder 中显示 |
| `tauri_plugin_shell` | 执行 shell 命令 |
| `tauri_plugin_clipboard_x` | 剪贴板读写 |
| `tauri_plugin_global_shortcut` | 注册全局快捷键 |
| `tauri_plugin_fs` | 文件系统访问 |
| `tauri_plugin_http` | HTTP 请求 |
| `tauri_plugin_notification` | 桌面通知 |
| 自定义 `codeexpander-plugin://` | 插件文件协议 |

### 4.2 插件窗口上下文与 capability

片段插件运行在以下上下文之一：

| 上下文 | 窗口/Webview | Capability 文件 | 使用场景 |
|--------|--------------|-----------------|----------|
| **独立窗** | `plugin_content_only` | `default` | 右键「以插件窗口打开」 |
| **搜索窗** | `search` + webview `search_plugin_content` | `default` | 搜索窗插件模式 |
| **旧版** | `plugin_content` | `plugin_content` | 旧插件中心子窗（权限较少） |

`default` capability 授予：`core`（window show/hide/close/focus/center/position/theme/title/always-on-top/dragging）、`opener`、`shell`、`clipboard-x`、`global-shortcut`、`notification`、`fs`（限定路径）、`http`、`log`。**注意**：`core:window:allow-set-size` **不在**默认 capability 中；需要调用 `window.setSize()` 的插件必须在 `pluginSetting.permissions` 中声明。

### 4.3 宿主注入 API 与 Tauri API

| API | 来源 | 说明 |
|-----|------|------|
| `writeClipboard` / `showToast` / `callBackend` | `window.__codeexpander`（注入） | 始终可用，无需 capability |
| `@tauri-apps/api`（window、fs、http 等） | Tauri API | 需匹配 capability；`pluginSetting.permissions` 可在运行时追加 |

## 5. 运行时 Host API

- **initialPayload** —— 插件打开时传入的对象，例如搜索关键字、文件列表等。  
- **postMessage** —— 通过 `postMessage` 调用宿主的简化通道，仅支持：  
  - `{ type: "codeexpander", action: "writeClipboard", value: "..." }`  
  - `{ type: "codeexpander", action: "showToast", value: "..." }`

### 5.1 浏览器 JS 模块插件

除了 HTML 入口外，`main` 也可以指向一个 JS 模块文件，例如 `"main": "index.js"`。此时：

- CodeExpander 会将 `codeexpander-plugin://<snippetKey>/index.js` 包装成一个 HTML 页面，并使用 `<script type="module">` 运行你的 JS 模块。  
- 相对导入（如 `import './util.js'`）依然有效，会解析为 `codeexpander-plugin://<snippetKey>/util.js`。  
- 该 HTML wrapper 中同样注入了 `window.__codeexpander_*` 桥接对象，因此 JS 模块可以直接访问宿主 API。

你需要自行使用 Vite / webpack / rollup 等工具，将 npm 依赖打包为浏览器可用的 ES 模块文件，并放入插件目录。CodeExpander 不会执行 `npm install` 或解析 npm 包。

### 5.2 后端协议与生命周期

任意后端 runtime（即你在 `backend.runtime` 中配置的可执行程序）都会在 stdin 上收到一个 JSON 对象，例如：

```json
{
  "method": "run",
  "payload": {
    "type": "text",
    "value": "keyword",
    "files": ["/path/to/file.txt"]
  }
}
```

约定：

- 后端程序应当在 stdout 上输出一行 **JSON 字符串** 作为响应。  
  - CodeExpander 会解析这一行并返回给调用方（浏览器或搜索）。  
  - 若解析失败，则按普通字符串返回。  
- **按调用生成进程（默认 `mode: "stdio"`）** —— 每一次 backend 调用（无论是搜索触发，还是 `callBackend`）都会新建一个子进程，等待一行输出，**超时 10 秒**后结束，不存在默认常驻守护进程。  
  - **多方法**：可多次调用 `callBackend("run", ...)`、`callBackend("init", ...)` 等；每次调用对应一个新进程。**有状态**时请在每次 payload 中传递，或在临时目录中读写文件（同一片段多次调用共享 `$TMP/codeexpander-plugin-backend/<snippetKey>/`）。  
- **临时目录** —— 每次调用前，宿主会将该片段的所有文件导出到形如 `$TMP/codeexpander-plugin-backend/<snippetKey>/` 的临时目录：  
  - `backend.entry` 与 `backend.cwd` 都会在该目录下解析，路径中禁止出现 `..`，以避免越界访问。  
- **Hybrid 与纯后端插件**：  
  - manifest 同时包含 `main` 与 `backend` 时：打开插件会先加载浏览器 UI（`main`），前端 JS 可以在需要时调用 `window.__codeexpander.callBackend(...)` 与后端交互。  
  - manifest 仅包含 `backend`（无 `main`）时：搜索将其视为“纯后端插件”，选中后会直接运行后端一次并使用返回结果，不会打开 Webview UI。  
- **可选：`mode: "http"`（常驻后端）** —— 若 `backend.mode` 为 `"http"`，CodeExpander 会启动一个**常驻进程**，该进程须通过环境变量 `CODEEXPANDER_BACKEND_PORT`（如 Node 中 `process.env.CODEEXPANDER_BACKEND_PORT`）获取端口并监听。CodeExpander 向 `http://127.0.0.1:PORT/` 发送 POST，body 为 `{ "method", "payload" }`，使用 JSON 响应。进程在空闲超时（默认 5 分钟）或应用退出前会被复用。详见开发文档中的「Backend mode: stdio vs http」。

## 6. MCP 服务器（CodeExpander 作为 MCP 服务端）

CodeExpander 可以作为 MCP（Model Context Protocol）服务器运行，让任何 MCP 客户端（如 Cursor、Claude Desktop 等）无需手动导入即可创建 / 管理插件。

### 6.1 启用 MCP 服务器

1. 在 CodeExpander 中打开 **设置 → MCP**。  
2. 在 **CodeExpander 作为 MCP 服务器** 部分，开启 **启用 MCP 服务器**，并设置端口（例如：0 = 关闭，1–65535 为有效端口）。  
3. 保存后，会显示一个连接 URL（如 `http://127.0.0.1:PORT/mcp`）。

### 6.2 在 AI 助手中添加 CodeExpander（泛用说明）

- **Cursor**：将生成的 `mcp.json` 片段粘贴到 Cursor 的 MCP 设置中（或合并到 `.cursor/mcp.json` / 全局 MCP 配置）；生成的配置会使用 Streamable HTTP 端点（例如 `http://127.0.0.1:PORT/mcp`）。  
- **Claude Desktop**：在 MCP 配置文件中添加一个使用相同 URL 的服务器条目。  
- **其他客户端**：使用 MCP 的 Streamable HTTP 传输协议，对 `/mcp` 端点发送 `Content-Type: application/json` 的 JSON-RPC POST 请求。

### 6.3 MCP 工具

| 工具 | 说明 |
|------|------|
| **create_plugin** | 根据 `manifest`（对象）和 `files`（`{ filename, content }` 数组）创建插件，可选 `groupKey`（默认放在 MCP 专用分组）。返回 `snippetKey`。 |
| **list_plugins** | 列出插件，可选 `groupKey` 过滤。返回插件数组。 |
| **get_plugin_schema** | 返回 plugin.json 的 schema 与文档 URL，方便 AI 按规范生成插件。 |

调用 **create_plugin** 成功后，插件会立即出现在 CodeExpander 的搜索结果和插件列表中。

### 6.4 Free 版限制（MCP 同样适用）

为保持与应用内行为一致，通过 MCP 创建插件时也会遵守 Free 版配额限制：

- 最多 **50 个片段**（包括普通片段和插件）。达到上限时，`create_plugin` 会返回错误，提示你删除部分片段或升级到 Pro。  
- 最多 **5 个分组**（不含根分组）。当 MCP 需要自动创建自己的 “MCP Plugins” 分组且分组数量已达上限时，`create_plugin` 会返回错误，提示你传入已有的 `groupKey` 或升级到 Pro。

## 7. 无 MCP 场景下如何导入插件

如果暂时不使用 MCP，可以通过以下方式将插件导入 CodeExpander：

- **从目录导入**：在设置页或插件开发入口中选择“从目录导入”，指向一个包含 `plugin.json` 与入口文件的文件夹。  
- **直接在片段中粘贴**：创建一个多文件片段，将 `plugin.json` 与入口文件等一并加入该片段，然后在片段设置中启用插件模式。  

导入后，插件会立即出现在搜索与插件列表中。

---

## 9. NPM 包：`package.json` 的 description 格式

若将插件**以 npm 包形式发布**，registry 只暴露 **description** 一个字段（来自 `package.json`），没有单独的「展示标题」。为了让 CodeExpander 在插件列表和详情里显示**友好标题**（替代包名）和**多语言描述**，请在 `package.json` 的 **description** 中采用下列约定：

**格式：** `展示标题 - 简短描述（如 CodeExpander 插件，用于 …）. | 中文标题 - 中文描述。`

- 用 **`|`**（或 ` | `）分隔**英文**与**中文**两段。宿主根据是否含 CJK 字符自动识别哪段为中文、哪段为英文，再按用户语言选取对应一段。
- 在选中的一段内，用 **` - `**（空格、横线、空格）分隔：
  - **标题**：在插件列表中替代包名展示（如替代 `@codeexpander/plugin-xyz`）。
  - **描述**：标题下方的简短正文。
- 若该段内没有 ` - `，则整段当作描述，标题使用包名短名。

**示例**（写在 `package.json` 中）：

```json
"description": "My Tool - A CodeExpander plugin for X.|我的工具 - 用于 X 的 CodeExpander 插件。"
```

- **英文**环境下，宿主展示标题「My Tool」、描述「A CodeExpander plugin for X.」
- **中文**环境下，宿主展示标题「我的工具」、描述「用于 X 的 CodeExpander 插件。」

**说明**：若插件已安装且 **plugin.json** 中配置了 **i18n**（见 3.1.2），宿主在可用时会优先用 manifest 的本地化 title/description。 

---

## 10. NPM 包 README：多语言布局（可选但推荐）

当插件以 npm 包形式安装时，CodeExpander 会在详情中展示该包的 **README**。为了在有限的桌面窗口中保持多语言 README 的可读性，你可以在 README 顶部使用一行**分隔线**将不同语言的内容分开，例如：

```md
Your English title
Your English content...

----------

你的中文标题
你的中文内容……
```

- 使用仅包含 **6 个及以上 `-` 或 `=` 字符**的一行作为分隔线（例如 `------` 或 `========`）。
- 第一条分隔线**上方**的内容视为一个语言块，**下方**视为另一个语言块。
- 宿主会检测每个块中是否包含 CJK 字符，并结合当前界面语言（如 `zh_CN`）自动选择对应块进行渲染：中文环境优先显示中文块，英文环境优先显示英文块。
- 如果 README 中没有分隔线，或者无法可靠判断语言，宿主会按现在的方式渲染**完整 README**（保证向后兼容）。

这套约定是**可选**的，但对于同时面向中英文用户的插件非常推荐，可以让安装详情页中的 README 更聚焦、更易读。
