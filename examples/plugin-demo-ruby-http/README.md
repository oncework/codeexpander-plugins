# plugin-demo-ruby-http

Demo plugin for a **Ruby HTTP backend** with CodeExpander.

## Runtime

- Backend executable: `ruby` (resolved from system `PATH`, using WEBrick or similar HTTP server)
- Uses **http mode**: long-lived process, listens on `CODEEXPANDER_BACKEND_PORT` and serves HTTP

----------

# plugin-demo-ruby-http（中文）

CodeExpander 插件 demo（Ruby）：**http 模式** 后端。

## 运行环境

- 后端可执行程序：`ruby`（系统 `PATH` 中可找到，使用 WEBrick 等 HTTP 服务器）
- 使用 **http 模式**：常驻进程，从 `CODEEXPANDER_BACKEND_PORT` 读取端口并提供 HTTP 服务
