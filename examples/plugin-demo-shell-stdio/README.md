# plugin-demo-shell-stdio

Demo plugin for a **Shell stdio backend** with CodeExpander.

## Runtime

- Backend executables: `sh`, `jq` (for JSON parsing; macOS: `brew install jq`, Linux: `apt install jq`)
- Uses **stdio mode** only: there is no built-in HTTP server, backend reads/writes JSON via stdin/stdout

----------

# plugin-demo-shell-stdio（中文）

CodeExpander 插件 demo（Shell）：**stdio 模式** 后端。

## 运行环境

- 依赖：`sh`、`jq`（用于 JSON 解析；macOS 可通过 `brew install jq` 安装，Linux 可通过 `apt install jq` 安装）
- 仅提供 **stdio 模式**：Shell 无内置 HTTP 服务器，通过 stdin/stdout 读写 JSON
