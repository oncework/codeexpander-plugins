# plugin-demo-go-http

Demo plugin for a **Go HTTP backend** with CodeExpander.

## Runtime

- Backend executables: `go`, `sh` (resolved from system `PATH`)
- Uses **http mode**: shell script runs `go run backend.go`, backend listens on `CODEEXPANDER_BACKEND_PORT`

----------

# plugin-demo-go-http（中文）

CodeExpander 插件 demo（Go）：**http 模式** 后端。

## 运行环境

- 依赖：`go`、`sh`（系统 `PATH` 中可找到）
- 使用 **http 模式**：通过 shell 脚本执行 `go run backend.go`，后端从 `CODEEXPANDER_BACKEND_PORT` 读取端口并提供 HTTP 服务
