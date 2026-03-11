# plugin-demo-nodejs-http

CodeExpander 插件 demo：**http 模式** Node.js 后端。

## 协议说明

- CodeExpander 启动 **常驻进程**
- 后端从环境变量 `CODEEXPANDER_BACKEND_PORT` 获取端口
- 在 `127.0.0.1:PORT` 启动 HTTP 服务
- 接收 **POST /** 请求，body 为 `{ method, payload }`
- 返回 JSON 响应
- 进程在空闲约 5 分钟后退出

## 目录结构

```
plugin-demo-nodejs-http/
  plugin.json    # manifest，backend.mode: "http"
  index.html     # 前端 UI
  backend.js     # Node.js 后端
```

## 导入方式

在 CodeExpander 中：**设置 → 从目录导入**，选择 `packages/plugin-demo-nodejs-http` 目录。
