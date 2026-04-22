#!/usr/bin/env python3
"""
CodeExpander 插件后端 - stdio 模式 (Python)

协议：从 stdin 读取一行 JSON { method, payload }
     向 stdout 输出一行 JSON 作为响应

每次 callBackend 调用会 spawn 新进程，10 秒超时
"""
import json
import sys


def handle_request(method: str, payload: dict) -> dict:
    if method in ("run", "transform"):
        text = payload.get("text", "")
        action = payload.get("action", "upper")
        if action == "upper":
            result = text.upper()
        elif action == "lower":
            result = text.lower()
        elif action == "reverse":
            result = text[::-1]
        else:
            result = text
        return {"ok": True, "result": result, "action": action}
    if method == "ping":
        return {"ok": True, "pong": True, "mode": "stdio"}
    return {"ok": False, "error": f"Unknown method: {method}"}


def main():
    try:
        line = sys.stdin.read().strip()
        data = json.loads(line)
        method = data.get("method", "run")
        payload = data.get("payload", {})
        response = handle_request(method, payload)
        print(json.dumps(response))
    except Exception as e:
        print(json.dumps({"ok": False, "error": str(e)}))


if __name__ == "__main__":
    main()
