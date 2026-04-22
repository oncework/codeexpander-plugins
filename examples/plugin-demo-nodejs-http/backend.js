#!/usr/bin/env node
/**
 * CodeExpander 插件后端 - http 模式
 *
 * 协议：从环境变量 CODEEXPANDER_BACKEND_PORT 获取端口
 *       在 127.0.0.1:PORT 启动 HTTP 服务
 *       接收 POST / 请求，body 为 { method, payload }
 *       返回 JSON 响应
 *
 * 进程常驻，多次调用复用同一进程，空闲约 5 分钟后退出
 */

const http = require("http");

const PORT = process.env.CODEEXPANDER_BACKEND_PORT;
if (!PORT) {
  console.error("CODEEXPANDER_BACKEND_PORT not set");
  process.exit(1);
}

function handleRequest(method, payload) {
  switch (method) {
    case "run":
    case "transform": {
      const { text = "", action = "upper" } = payload;
      let result = text;
      if (action === "upper") result = text.toUpperCase();
      else if (action === "lower") result = text.toLowerCase();
      else if (action === "reverse") result = text.split("").reverse().join("");
      return { ok: true, result, action };
    }
    case "ping":
      return { ok: true, pong: true, mode: "http" };
    default:
      return { ok: false, error: `Unknown method: ${method}` };
  }
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/") {
    res.writeHead(404);
    res.end();
    return;
  }
  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", () => {
    try {
      const { method = "run", payload = {} } = JSON.parse(body);
      const response = handleRequest(method, payload);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(response));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: String(err.message) }));
    }
  });
});

server.listen(Number(PORT), "127.0.0.1", () => {
  // 保持进程存活，CodeExpander 会复用此进程
});
