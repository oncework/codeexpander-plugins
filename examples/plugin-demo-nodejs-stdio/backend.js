#!/usr/bin/env node
/**
 * CodeExpander 插件后端 - stdio 模式
 *
 * 协议：从 stdin 读取一行 JSON { method, payload }
 *       向 stdout 输出一行 JSON 作为响应
 *
 * 每次 callBackend 调用会 spawn 新进程，10 秒超时
 */

function readStdin() {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => { data += chunk; });
    process.stdin.on("end", () => resolve(data.trim()));
  });
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
      return { ok: true, pong: true, mode: "stdio" };
    default:
      return { ok: false, error: `Unknown method: ${method}` };
  }
}

async function main() {
  try {
    const input = await readStdin();
    const { method = "run", payload = {} } = JSON.parse(input);
    const response = handleRequest(method, payload);
    console.log(JSON.stringify(response));
  } catch (err) {
    console.log(JSON.stringify({ ok: false, error: String(err.message) }));
  }
}

main();
