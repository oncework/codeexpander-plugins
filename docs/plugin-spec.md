# CodeExpander Plugin Specification

Clear, numbered guide for **humans** and **AI tools** to build and manage CodeExpander plugins.

- **If you are a human developer**: read Sections **1 → 5** to create a plugin, and Section **8** for import options.  
- **If you are an AI tool (via MCP)**: use the manifest rules in Section **3** and the MCP tools in Section **7**.

---

## 1. What is a CodeExpander plugin?

1. A plugin is a **snippet folder** that can:
   - Render a **browser UI** (HTML / JS / JS module).
   - Optionally call a **backend executable** (Node / Python / Shell / anything on your system).
2. CodeExpander can also expose an **MCP server** so AI assistants (Cursor, Claude Desktop, etc.) can **create, list and manage plugins automatically**.

---

## 2. Plugin folder structure

1. A plugin is a directory containing at least:
   - **plugin.json** (or **plugin.meta.json**) — manifest with metadata and entry file.
   - **Entry file** — for example `index.html` (or another file set in `main`).
2. Example layout (flat or with subdirs, e.g. a built `dist/`):

```text
my-plugin/
  plugin.json
  index.html
```

   **Dist-style layout** (e.g. Vite build output): you may have `index.html` at the root and assets in a subfolder. When importing from directory, the importer recurses and stores each file with its **path relative to the plugin root** (e.g. `assets/index-abc123.js`). The host serves files via `codeexpander-plugin://<snippetKey>/<path>`, so relative references in your HTML (e.g. `<script src="./assets/index-abc123.js">`) resolve correctly.

```text
dist/
  plugin.json
  index.html
  assets/
    index-abc123.js
    index-def456.css
```

**Images (PNG, JPG, GIF, WebP, ICO)**  
When you import from directory, binary image files are stored as **base64** in the snippet (same convention as GitHub Gist / Gitee for binary content). The host serves them via `codeexpander-plugin://` with the correct MIME type, so `<img src="./assets/logo.png">` works. SVG remains stored as UTF-8 text.

---

## 3. Manifest file: `plugin.json`

### 3.1 Common fields

| Field | Type | Description |
|-------|------|-------------|
| **main** | string | Browser entry file (e.g. `index.html` or `index.js`). Default: `index.html`. |
| **backend** | object | Optional backend config for Node/Python/Shell/custom executable. See **3.3**. |
| **title** | string | Display name in search results and the plugin list. |
| **description** | string | Short, human‑readable description. |
| **logo** | string | Logo URL or data URL. |
| **icon** | string | Icon identifier or URL. |
| **category** | string | Category name for grouping. |
| **order** | number | Sort order within its category. |
| **features** | array | Feature definitions (code, explain, cmds) to help search match this plugin. |
| **pluginSetting** | object | Optional. See **3.1.1** for fields. |
| **url** | string | Optional. Install source. `npm:` or full CDN URL = npm package (only manifest stored in snippet); `file://` or `devlink:` = local/dev path (files read from disk at runtime). Omit = all files stored in snippet. |

### 3.1.1 `pluginSetting` (optional)

- **height** (number) — Used when the plugin is shown in the **search window** right pane; also used as the default height for the standalone “open as plugin window”.
- For **“open as plugin window”** (standalone window), the following are also supported:
  - **width**, **height** (number) — Window size in px; default 640×480, clamped to 320–1200 × 240–900.
  - **minWidth**, **minHeight**, **maxWidth**, **maxHeight** (number) — Size constraints in px.
  - **alwaysOnTop** (boolean) — Whether the window stays on top; default `false`. Applied every time the window is shown.
  - **transparent** (boolean) — Transparent background; default `false`. **Applied only when the window is first created** (cannot be changed later for that window).
  - **decorations** (boolean) — Show title bar; default `true`. **Applied only at first creation.**
  - **resizable** (boolean) — Allow user resize; default `true`. **Applied only at first creation.**
  - **permissions** (array of strings) — Tauri permission identifiers the plugin needs at runtime. The host dynamically grants these via `add_capability` when showing the plugin window. Declare full identifiers, e.g. `core:window:allow-set-size`, `core:window:allow-set-position`. If omitted or empty, no extra permissions are granted. Example:

```json
"pluginSetting": {
  "permissions": [
    "core:window:allow-set-size",
    "core:window:allow-set-position",
    "core:window:allow-set-title"
  ]
}
```

**Runtime changes after init**  
When the plugin runs in the **standalone plugin window** (“open as plugin window”), the plugin has access to the Tauri window API (e.g. via `@tauri-apps/api/window`). After the window is created, the plugin can call `getCurrentWindow()` and then adjust at runtime: **size** (`setSize`), **min/max size** (`setMinSize`, `setMaxSize`), **alwaysOnTop** (`setAlwaysOnTop`), **position** (`setPosition`), **title** (`setTitle`). Properties that are fixed at creation (**transparent**, **decorations**, **resizable**) cannot be changed later for that window.

### 3.2 `features` (optional)

Each feature item can have:

1. **code** — short identifier (e.g. `"timestamp_convert"`).  
2. **explain** — one‑line explanation in natural language.  
3. **cmds** — array of **command triggers**:
   - Simple string trigger, or
   - Object with `type` (one of `regex`, `over`, `files`, `img`, `window`, etc.) and type‑specific fields.

Use `features` to describe when this plugin is relevant so **search** and **AI tools** can route queries to it.

### 3.3 `backend` object

Use `backend` when you need a separate process (Node, Python, Shell, or any executable) to do work:

```json
{
  "backend": {
    "runtime": "node",          // any executable name or path, e.g. "node", "python3", "ruby", "sh" ...
    "entry": "backend.js",      // script path relative to the plugin root
    "args": ["--flag"],         // optional extra args
    "cwd": ".",                 // optional working directory, default "."
    "mode": "stdio"             // optional: "stdio" (default) or "http"; see §5 for http mode
  }
}
```

1. `runtime` can be any executable that the system `PATH` can resolve, such as `node`, `python3`, `ruby`, `php`, `sh`, etc.  
2. Both `entry` and `cwd` are resolved inside a **plugin‑specific temp directory** at runtime and must **not contain `..`**.  
3. **Multiple methods**: Each `callBackend(method, payload)` is one invocation; with default `mode: "stdio"`, each call spawns a **new process**. For state across calls, pass state in the payload or use the temp directory (same snippet reuses the same temp dir between calls).  
4. **Timeout**: A single stdio call has a 10s timeout; the process is then terminated.

### 3.4 Minimal browser‑only example

**plugin.json**

```json
{
  "main": "index.html",
  "title": "Timestamp converter",
  "description": "Convert between Unix timestamp and readable date."
}
```

**index.html**

- Your plugin UI (HTML / JS).  
- The host injects an `initialPayload` (e.g. search keyword, file list) and exposes a bridge object:
  - `window.__codeexpander_initial_payload` — same as the `initialPayload` JSON.  
  - `window.__codeexpander.writeClipboard(text)` — write text to the system clipboard.  
  - `window.__codeexpander.showToast(message)` — show a desktop notification.  
  - `window.__codeexpander.callBackend(method, payload)` — call the configured backend (see **3.3**) and receive a Promise that resolves to the JSON result.

---

## 4. Tauri plugins & capabilities (CodeExpander host)

CodeExpander initializes the following Tauri plugins. Snippet plugins run inside webviews that match specific capabilities; not all plugin APIs are available to every plugin window.

### 4.1 Tauri plugins initialized

| Plugin | Purpose |
|--------|---------|
| `tauri_plugin_log` | Logging to app log dir |
| `tauri_plugin_opener` | Open URLs / reveal in Finder |
| `tauri_plugin_shell` | Execute shell commands |
| `tauri_plugin_clipboard_x` | Clipboard read/write |
| `tauri_plugin_global_shortcut` | Register global shortcuts |
| `tauri_plugin_fs` | File system access |
| `tauri_plugin_http` | HTTP requests |
| `tauri_plugin_notification` | Desktop notifications |
| Custom `codeexpander-plugin://` | Plugin file protocol |

### 4.2 Plugin window contexts & capabilities

Snippet plugins run in one of these contexts:

| Context | Window/Webview | Capability file | Use case |
|---------|----------------|-----------------|----------|
| **Standalone** | `plugin_content_only` | `default` | "Open as plugin window" (right‑click) |
| **Search pane** | `search` + webview `search_plugin_content` | `default` | Plugin mode in search window |
| **Legacy** | `plugin_content` | `plugin_content` | Old plugin hub child (fewer permissions) |

The `default` capability grants: `core` (window show/hide/close/focus/center/position/theme/title/always-on-top/dragging), `opener`, `shell`, `clipboard-x`, `global-shortcut`, `notification`, `fs` (scoped paths), `http`, `log`. **Note:** `core:window:allow-set-size` is **not** in the default capability; plugins that need `window.setSize()` must declare it in `pluginSetting.permissions`.

### 4.3 Host-injected APIs vs Tauri API

| API | Source | Notes |
|-----|--------|------|
| `writeClipboard` / `showToast` / `callBackend` | `window.__codeexpander` (injected) | Always available; no capability needed |
| `@tauri-apps/api` (window, fs, http, etc.) | Tauri API | Requires matching capability; `pluginSetting.permissions` can add more at runtime |

---

## 5. Host APIs (plugin runtime)

### 5.1 Data passed into the plugin

1. **initialPayload** — an object passed when the plugin opens (for example, `{ keyword, files }`).  
2. Your UI can read it via `window.__codeexpander_initial_payload`.

### 5.2 Sending actions back to CodeExpander

Use `postMessage` from the plugin webview to call a **limited, safe set of actions**:

1. Write to clipboard:

```js
window.parent.postMessage(
  { type: "codeexpander", action: "writeClipboard", value: "text to copy" },
  "*"
);
```

2. Show a toast notification:

```js
window.parent.postMessage(
  { type: "codeexpander", action: "showToast", value: "Saved!" },
  "*"
);
```

Only these `action` values are supported: **`writeClipboard`** and **`showToast`**.

### 5.3 Browser JS module plugins

Instead of an HTML entry file, `main` can point to a JS module, for example:

```json
{
  "main": "index.js"
}
```

When `main` is a JS module:

1. CodeExpander serves `codeexpander-plugin://<snippetKey>/index.js` inside an HTML wrapper using `<script type="module">`.  
2. Relative imports such as `import "./util.js"` still work and resolve to `codeexpander-plugin://<snippetKey>/util.js`.  
3. The wrapper exposes the same bridge (`window.__codeexpander_*`), so your JS module can always access host APIs.

You are responsible for bundling any npm dependencies into browser‑compatible ESM files (using Vite, webpack, Rollup, etc.) and placing them in the plugin directory. CodeExpander does **not** run `npm install` or resolve packages for you.

---

## 6. Backend protocol & lifecycle

Any backend runtime (the executable configured in `backend.runtime`) receives **one JSON object** on `stdin`, for example:

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

The contract is:

1. The backend must write a single **line of JSON** to `stdout` as the response.  
   - CodeExpander parses that line and returns it to the caller (browser or search).  
   - If parsing fails, the raw output is returned as a plain string.  
2. **Per‑call process model (default `mode: "stdio"`)**  
   - Every backend call (from Search or `callBackend`) spawns a **fresh child process**, waits for one response line with a **10s timeout**, then exits.  
   - There is **no long‑lived daemon** by default.  
   - **Multiple methods**: Call `callBackend("run", ...)`, `callBackend("init", ...)` etc. as needed; each call is a new process. For **state**, either pass it in the payload each time or read/write files in the temp directory (same snippet shares `$TMP/codeexpander-plugin-backend/<snippetKey>/` across calls).  
3. **Temporary directory**  
   - Before each call, all snippet files are exported to a folder like `$TMP/codeexpander-plugin-backend/<snippetKey>/`.  
   - `backend.entry` and `backend.cwd` are resolved relative to this directory and must not contain `..`.  
4. **Hybrid vs pure backend plugins**
   - **Hybrid plugin** (`main` + `backend`): CodeExpander opens the browser UI (`main`), and your JS can call `window.__codeexpander.callBackend(...)` whenever it needs backend work.  
   - **Pure backend plugin** (`backend` only, no `main`): Search treats it as a **one‑shot backend tool**. Selecting it runs the backend once with a JSON payload and uses the result directly (no webview UI).

5. **Optional: `mode: "http"` (long‑lived backend)**  
   - If `backend.mode` is `"http"`, CodeExpander starts a **long‑lived** process that must listen on a port provided via the `CODEEXPANDER_BACKEND_PORT` environment variable (e.g. `process.env.CODEEXPANDER_BACKEND_PORT` in Node).  
   - CodeExpander sends POST requests to `http://127.0.0.1:PORT/` with JSON body `{ "method", "payload" }` and uses the JSON response.  
   - The process is kept alive and reused for subsequent calls until idle timeout (default 5 min) or app exit. See **Backend mode: stdio vs http** in the dev docs for lifecycle and limits.

---

## 7. CodeExpander as an MCP server (for AI tools)

CodeExpander can expose an MCP (Model Context Protocol) server so any MCP client (Cursor, Claude Desktop, etc.) can **create and list plugins without manual import**.

### 6.1 Enabling the MCP server

1. Open **Settings → MCP** in CodeExpander.  
2. In the **CodeExpander as MCP server** section, enable **MCP server** and set a **Port** (`0` = off, `1–65535` = valid port).  
3. Save. When enabled, CodeExpander shows a **Connection URL**, for example: `http://127.0.0.1:PORT/mcp`.

### 7.2 Adding CodeExpander to your AI assistant

1. **Cursor**
   - Copy the generated `mcp.json` snippet from CodeExpander.  
   - Paste it into Cursor’s MCP settings (or merge into `.cursor/mcp.json` / a global MCP config).  
   - The snippet uses the Streamable HTTP endpoint (e.g. `http://127.0.0.1:PORT/mcp`).
2. **Claude Desktop**
   - Add a server entry in the MCP config file using the same URL.  
3. **Other MCP clients**
   - Use the MCP Streamable HTTP transport.  
   - Send JSON‑RPC POST requests with `Content-Type: application/json` to the `/mcp` endpoint.

### 7.3 Available MCP tools

| Tool | Description |
|------|-------------|
| **create_plugin** | Create a plugin from `manifest` (object) and `files` (array of `{ filename, content }`). Optional `groupKey` (default: root). Returns a `snippetKey`. |
| **list_plugins** | List existing plugins. Optional `groupKey` filter. Returns a `plugins` array. |
| **get_plugin_schema** | Return the `plugin.json` schema and documentation URL to guide AI‑generated plugins. |

After a successful **create_plugin** call, the new plugin appears **immediately** in CodeExpander’s search and plugin list.

### 7.4 Free plan limits (also applied to MCP)

To stay consistent with in‑app limits, MCP‑created plugins follow the same free tier quotas:

1. Up to **50 snippets** in total (including normal snippets and plugins).  
   - When the limit is reached, `create_plugin` returns an error asking the user to delete some snippets or upgrade to Pro.  
2. Up to **5 groups** (excluding the root group).  
   - When MCP needs to auto‑create its own “MCP Plugins” group but the group limit is already reached, `create_plugin` returns an error asking you to pass an existing `groupKey` or upgrade to Pro.

---

## 8. Using plugins without MCP (manual import)

If you do not use MCP, you can still add plugins to CodeExpander in two ways:

1. **Import from directory**  
   - In **Settings** or the **Plugin Hub**, choose **Import from directory**.  
   - Select a folder that contains `plugin.json` and the entry file.  
2. **Paste files into a snippet**  
   - Create a new multi‑file snippet.  
   - Add `plugin.json` and the entry file (and any other plugin files).  
   - Enable **plugin mode** in the snippet options.

Once imported, the plugin appears in search and in the plugin list immediately.
