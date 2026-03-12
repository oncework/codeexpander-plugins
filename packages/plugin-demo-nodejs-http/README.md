# plugin-demo-nodejs-http

Demo plugin for a **Node.js HTTP backend** with CodeExpander.

## Protocol

- CodeExpander starts a **long-lived process**
- Backend reads the port from env `CODEEXPANDER_BACKEND_PORT`
- Starts an HTTP server on `127.0.0.1:PORT`
- Receives **POST /** requests with JSON body `{ "method", "payload" }`
- Returns JSON responses
- Process exits after being idle for about **5 minutes**

## Structure

```text
plugin-demo-nodejs-http/
  plugin.json    # manifest, backend.mode: "http"
  index.html     # frontend UI
  backend.js     # Node.js backend
```

## Import

In CodeExpander: **Settings → Import from directory**, then choose `packages/plugin-demo-nodejs-http`.

----------

# plugin-demo-nodejs-http（中文）

面向 **Node.js http 模式后端** 的 CodeExpander 演示插件。

## 协议说明

- CodeExpander 会启动一个 **常驻进程**
- 后端通过环境变量 `CODEEXPANDER_BACKEND_PORT` 获取端口
- 在 `127.0.0.1:PORT` 启动 HTTP 服务
- 接收 **POST /** 请求，body 为 `{ "method", "payload" }`
- 返回 JSON 响应
- 进程在空闲约 **5 分钟** 后退出

## 目录结构

```text
plugin-demo-nodejs-http/
  plugin.json    # manifest，backend.mode: "http"
  index.html     # 前端 UI
  backend.js     # Node.js 后端
```

## 导入方式

在 CodeExpander 中：进入 **设置 → 从目录导入**，选择 `packages/plugin-demo-nodejs-http` 目录。
