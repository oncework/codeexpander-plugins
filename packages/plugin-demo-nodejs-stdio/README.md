# plugin-demo-nodejs-stdio

CodeExpander 插件 demo：**stdio 模式** Node.js 后端。

## 协议说明

- 每次 `callBackend` 调用会 **spawn 新的子进程**
- 后端从 **stdin** 读取一行 JSON：`{ method, payload }`
- 向 **stdout** 输出一行 JSON 作为响应
- 单次调用超时 10 秒

## 目录结构

```
plugin-demo-nodejs-stdio/
  plugin.json    # manifest，backend.mode: "stdio"
  index.html     # 前端 UI
  backend.js     # Node.js 后端
```

## 导入方式

在 CodeExpander 中：**设置 → 从目录导入**，选择 `packages/plugin-demo-nodejs-stdio` 目录。
