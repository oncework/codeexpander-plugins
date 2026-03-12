# plugin-demo-ruby-stdio

Demo plugin for a **Ruby stdio backend** with CodeExpander.

## Runtime

- Backend executable: `ruby` (resolved from system `PATH`)
- Uses **stdio mode**: each `callBackend` spawns a new Ruby process and communicates via stdin/stdout

----------

# plugin-demo-ruby-stdio（中文）

CodeExpander 插件 demo（Ruby）：**stdio 模式** 后端。

## 运行环境

- 后端可执行程序：`ruby`（系统 `PATH` 中可找到）
- 使用 **stdio 模式**：每次 `callBackend` 都会新起 Ruby 进程，通过 stdin/stdout 通信
