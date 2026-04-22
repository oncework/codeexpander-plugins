#!/usr/bin/env python3
"""
CodeExpander 插件后端 - http 模式 (Python)

协议：从环境变量 CODEEXPANDER_BACKEND_PORT 获取端口
     在 127.0.0.1:PORT 启动 HTTP 服务
     接收 POST / 请求，body 为 { method, payload }
     返回 JSON 响应

进程常驻，空闲约 5 分钟后退出
"""
import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler


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
        return {"ok": True, "pong": True, "mode": "http"}
    return {"ok": False, "error": f"Unknown method: {method}"}


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/":
            self.send_response(404)
            self.end_headers()
            return
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8")
        try:
            data = json.loads(body)
            method = data.get("method", "run")
            payload = data.get("payload", {})
            response = handle_request(method, payload)
            out = json.dumps(response).encode("utf-8")
        except Exception as e:
            out = json.dumps({"ok": False, "error": str(e)}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(out))
        self.end_headers()
        self.wfile.write(out)

    def log_message(self, *args):
        pass


def main():
    port = os.environ.get("CODEEXPANDER_BACKEND_PORT")
    if not port:
        print("CODEEXPANDER_BACKEND_PORT not set", file=__import__("sys").stderr)
        exit(1)
    server = HTTPServer(("127.0.0.1", int(port)), Handler)
    server.serve_forever()


if __name__ == "__main__":
    main()
