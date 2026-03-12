# plugin-demo-nodejs-stdio

Demo plugin for a **Node.js stdio backend** with CodeExpander.

## Protocol

- Each `callBackend` spawns a **new child process**
- Backend reads **one line of JSON** from stdin: `{ "method", "payload" }`
- Writes **one line of JSON** to stdout as the response
- Single-call timeout: **10 seconds**

## Structure

```text
plugin-demo-nodejs-stdio/
  plugin.json    # manifest, backend.mode: "stdio"
  index.html     # frontend UI
  backend.js     # Node.js backend
```

## Import

In CodeExpander: **Settings → Import from directory**, then choose `packages/plugin-demo-nodejs-stdio`.

----------

# plugin-demo-nodejs-stdio（中文）

面向 **Node.js stdio 模式后端** 的 CodeExpander 演示插件。

## 协议说明

- 每次 `callBackend` 调用都会 **spawn 一个新的子进程**
- 后端从 **stdin** 读取一行 JSON：`{ "method", "payload" }`
- 向 **stdout** 输出一行 JSON 作为响应
- 单次调用超时 **10 秒**

## 目录结构

```text
plugin-demo-nodejs-stdio/
  plugin.json    # manifest，backend.mode: "stdio"
  index.html     # 前端 UI
  backend.js     # Node.js 后端
```

## 导入方式

在 CodeExpander 中：进入 **设置 → 从目录导入**，选择 `packages/plugin-demo-nodejs-stdio` 目录。
