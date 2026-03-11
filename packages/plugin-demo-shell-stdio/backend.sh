#!/bin/sh
#
# CodeExpander 插件后端 - stdio 模式 (Shell)
#
# 协议：从 stdin 读取一行 JSON { method, payload }
#       向 stdout 输出一行 JSON 作为响应
#
# 每次 callBackend 调用会 spawn 新进程，10 秒超时
# 依赖：jq（用于 JSON 解析，macOS/多数 Linux 可 brew install jq 或 apt install jq）
#

read -r line
method=$(echo "$line" | jq -r '.method // "run"')
payload=$(echo "$line" | jq -c '.payload // {}')

text=$(echo "$payload" | jq -r '.text // ""')
action=$(echo "$payload" | jq -r '.action // "upper"')

case "$method" in
  run|transform)
    case "$action" in
      upper) result=$(echo "$text" | tr '[:lower:]' '[:upper:]') ;;
      lower) result=$(echo "$text" | tr '[:upper:]' '[:lower:]') ;;
      reverse) result=$(echo "$text" | rev) ;;
      *) result="$text" ;;
    esac
    jq -n -c --arg r "$result" --arg a "$action" '{ok: true, result: $r, action: $a}'
    ;;
  ping)
    jq -n -c '{ok: true, pong: true, mode: "stdio"}'
    ;;
  *)
    jq -n -c --arg m "$method" '{ok: false, error: ("Unknown method: " + $m)}'
    ;;
esac
