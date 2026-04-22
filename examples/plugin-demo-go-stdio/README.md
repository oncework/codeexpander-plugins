# plugin-demo-go-stdio

Demo plugin for a **Go stdio backend** with CodeExpander.

## Runtime

- Backend executables: `go`, `sh` (resolved from system `PATH`)
- Uses **stdio mode**: shell script runs `go run backend.go` and communicates via stdin/stdout

----------

# plugin-demo-go-stdio（中文）

CodeExpander 插件 demo（Go）：**stdio 模式** 后端。

## 运行环境

- 依赖：`go`、`sh`（系统 `PATH` 中可找到）
- 使用 **stdio 模式**：通过 shell 脚本执行 `go run backend.go`，并通过 stdin/stdout 通信
