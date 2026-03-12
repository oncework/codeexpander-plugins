# plugin-demo-php-stdio

Demo plugin for a **PHP stdio backend** with CodeExpander.

## Runtime

- Backend executable: `php` (resolved from system `PATH`)
- Uses **stdio mode**: each `callBackend` spawns a new process and communicates via stdin/stdout

----------

# plugin-demo-php-stdio（中文）

CodeExpander 插件 demo（PHP）：**stdio 模式** 后端。

## 运行环境

- 后端可执行程序：`php`（系统 `PATH` 中可找到）
- 使用 **stdio 模式**：每次 `callBackend` 都会新起进程，通过 stdin/stdout 通信
