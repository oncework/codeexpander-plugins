import { useState, useEffect, useCallback } from "react";
import {
  getCurrentWindow,
  LogicalSize,
  LogicalPosition,
  UserAttentionType,
} from "@tauri-apps/api/window";

function useTauriWindow() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [win, setWin] = useState<Awaited<ReturnType<typeof getCurrentWindow>> | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [title, setTitle] = useState("");
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const fetchWindowState = useCallback(
    async (w: Awaited<ReturnType<typeof getCurrentWindow>>) => {
      try {
        const [s, p, t, aot, full, max, min] = await Promise.all([
          w.innerSize(),
          w.innerPosition(),
          w.title(),
          w.isAlwaysOnTop(),
          w.isFullscreen(),
          w.isMaximized(),
          w.isMinimized(),
        ]);
        setSize({ width: s.width, height: s.height });
        setPosition({ x: p.x, y: p.y });
        setTitle(t);
        setAlwaysOnTop(aot);
        setIsFullscreen(full);
        setIsMaximized(max);
        setIsMinimized(min);
      } catch {
        // ignore
      }
    },
    []
  );

  const refresh = useCallback(async () => {
    if (win) await fetchWindowState(win);
  }, [win, fetchWindowState]);

  useEffect(() => {
    let mounted = true;
    const INIT_TIMEOUT_MS = 6000;

    const init = async () => {
      try {
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), INIT_TIMEOUT_MS)
        );
        const task = (async () => {
          const w = getCurrentWindow();
          if (!mounted) return;
          setWin(w);
          setAvailable(true);
          await fetchWindowState(w);
        })();
        await Promise.race([task, timeout]);
      } catch {
        if (mounted) setAvailable(false);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, [fetchWindowState]);

  return {
    available,
    win,
    size,
    position,
    title,
    alwaysOnTop,
    isFullscreen,
    isMaximized,
    isMinimized,
    refresh,
  };
}

function App() {
  const ctx = useTauriWindow();
  const [msg, setMsg] = useState("");
  const [inputWidth, setInputWidth] = useState("640");
  const [inputHeight, setInputHeight] = useState("480");
  const [inputX, setInputX] = useState("100");
  const [inputY, setInputY] = useState("100");
  const [inputTitle, setInputTitle] = useState("");
  const [inputMinW, setInputMinW] = useState("320");
  const [inputMinH, setInputMinH] = useState("240");
  const [inputMaxW, setInputMaxW] = useState("1200");
  const [inputMaxH, setInputMaxH] = useState("900");

  const showMsg = (m: string, duration = 2000) => {
    setMsg(m);
    setTimeout(() => setMsg(""), duration);
  };

  const handleApiError = (e: unknown, fallback: string) => {
    const s = String(e);
    if (s.includes("not allowed by ACL")) {
      showMsg("宿主未授予窗口权限，需在 CodeExpander 的 capability 中添加 plugin:window 或 core:window 权限。详见插件 README。", 5000);
    } else {
      showMsg(`失败: ${s}`);
    }
  };

  const handleSetSize = async () => {
    if (!ctx.win) return;
    const w = parseInt(inputWidth, 10);
    const h = parseInt(inputHeight, 10);
    if (isNaN(w) || isNaN(h) || w < 1 || h < 1) {
      showMsg("请输入有效的宽高");
      return;
    }
    try {
      await ctx.win.setSize(new LogicalSize(w, h));
      await ctx.refresh();
      showMsg("尺寸已设置");
    } catch (e) {
      handleApiError(e, "尺寸设置失败");
    }
  };

  const handleSetPosition = async () => {
    if (!ctx.win) return;
    const x = parseInt(inputX, 10);
    const y = parseInt(inputY, 10);
    if (isNaN(x) || isNaN(y)) {
      showMsg("请输入有效的坐标");
      return;
    }
    try {
      await ctx.win.setPosition(new LogicalPosition(x, y));
      await ctx.refresh();
      showMsg("位置已设置");
    } catch (e) {
      handleApiError(e, "位置设置失败");
    }
  };

  const handleSetTitle = async () => {
    if (!ctx.win) return;
    try {
      await ctx.win.setTitle(inputTitle || "Tauri 窗口 API Demo");
      await ctx.refresh();
      showMsg("标题已设置");
    } catch (e) {
      handleApiError(e, "标题设置失败");
    }
  };

  const handleSetAlwaysOnTop = async () => {
    if (!ctx.win) return;
    try {
      await ctx.win.setAlwaysOnTop(!ctx.alwaysOnTop);
      await ctx.refresh();
      showMsg(ctx.alwaysOnTop ? "已取消置顶" : "已置顶");
    } catch (e) {
      handleApiError(e, "");
    }
  };

  const handleSetMinSize = async () => {
    if (!ctx.win) return;
    const w = parseInt(inputMinW, 10);
    const h = parseInt(inputMinH, 10);
    try {
      await ctx.win.setMinSize(w > 0 && h > 0 ? new LogicalSize(w, h) : null);
      await ctx.refresh();
      showMsg("最小尺寸已设置");
    } catch (e) {
      handleApiError(e, "最小尺寸设置失败");
    }
  };

  const handleSetMaxSize = async () => {
    if (!ctx.win) return;
    const w = parseInt(inputMaxW, 10);
    const h = parseInt(inputMaxH, 10);
    try {
      await ctx.win.setMaxSize(w > 0 && h > 0 ? new LogicalSize(w, h) : null);
      await ctx.refresh();
      showMsg("最大尺寸已设置");
    } catch (e) {
      handleApiError(e, "最大尺寸设置失败");
    }
  };

  const handleCenter = async () => {
    if (!ctx.win) return;
    try {
      await ctx.win.center();
      await ctx.refresh();
      showMsg("已居中");
    } catch (e) {
      handleApiError(e, "");
    }
  };

  const handleMinimize = async () => {
    if (!ctx.win) return;
    try {
      await ctx.win.minimize();
      await ctx.refresh();
      showMsg("已最小化");
    } catch (e) {
      handleApiError(e, "");
    }
  };

  const handleMaximize = async () => {
    if (!ctx.win) return;
    try {
      await ctx.win.toggleMaximize();
      await ctx.refresh();
      showMsg(ctx.isMaximized ? "已还原" : "已最大化");
    } catch (e) {
      handleApiError(e, "");
    }
  };

  const handleFullscreen = async () => {
    if (!ctx.win) return;
    try {
      await ctx.win.setFullscreen(!ctx.isFullscreen);
      await ctx.refresh();
      showMsg(ctx.isFullscreen ? "已退出全屏" : "已全屏");
    } catch (e) {
      handleApiError(e, "");
    }
  };

  const handleClose = async () => {
    if (!ctx.win) return;
    try {
      await ctx.win.close();
    } catch {
      // ignore
    }
  };

  const handleFocus = async () => {
    if (!ctx.win) return;
    try {
      await ctx.win.setFocus();
      showMsg("已聚焦");
    } catch (e) {
      handleApiError(e, "");
    }
  };

  const handleRequestAttention = async () => {
    if (!ctx.win) return;
    try {
      await ctx.win.requestUserAttention(UserAttentionType.Informational);
      showMsg("已请求用户关注");
    } catch (e) {
      handleApiError(e, "");
    }
  };

  if (ctx.available === null) {
    return (
      <div className="p-4 text-gray-500">检测 Tauri 环境...</div>
    );
  }

  if (ctx.available === false) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-lg font-semibold text-amber-600 mb-2">
          需要「以插件窗口打开」
        </h2>
        <p className="text-sm text-gray-600">
          此插件仅在 CodeExpander 的<strong>独立插件窗口</strong>中可用。请在搜索或插件列表中右键点击本插件，选择「以插件窗口打开」。
        </p>
        <p className="text-sm text-gray-500 mt-2">
          在搜索窗右侧面板中运行时，Tauri 窗口 API 不可用。
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 min-h-[500px]">
      <h1 className="text-lg font-semibold text-gray-800">Tauri 窗口 API Demo</h1>

      {msg && (
        <div className="p-2 bg-green-100 text-green-800 text-sm rounded">
          {msg}
        </div>
      )}

      {/* 当前状态 */}
      <section className="border rounded-lg p-3 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-2">当前状态</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>尺寸: {Math.round(ctx.size.width)} × {Math.round(ctx.size.height)}</div>
          <div>位置: ({Math.round(ctx.position.x)}, {Math.round(ctx.position.y)})</div>
          <div>标题: {ctx.title || "(空)"}</div>
          <div>置顶: {ctx.alwaysOnTop ? "是" : "否"}</div>
          <div>全屏: {ctx.isFullscreen ? "是" : "否"}</div>
          <div>最大化: {ctx.isMaximized ? "是" : "否"}</div>
          <div>最小化: {ctx.isMinimized ? "是" : "否"}</div>
        </div>
        <button
          onClick={ctx.refresh}
          className="mt-2 text-xs text-blue-600 hover:underline"
        >
          刷新
        </button>
      </section>

      {/* 尺寸 */}
      <section className="border rounded-lg p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">设置尺寸</h3>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="number"
            value={inputWidth}
            onChange={(e) => setInputWidth(e.target.value)}
            className="w-20 px-2 py-1 border rounded text-sm"
            placeholder="宽"
          />
          <span>×</span>
          <input
            type="number"
            value={inputHeight}
            onChange={(e) => setInputHeight(e.target.value)}
            className="w-20 px-2 py-1 border rounded text-sm"
            placeholder="高"
          />
          <button
            onClick={handleSetSize}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            应用
          </button>
        </div>
      </section>

      {/* 位置 */}
      <section className="border rounded-lg p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">设置位置</h3>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="number"
            value={inputX}
            onChange={(e) => setInputX(e.target.value)}
            className="w-20 px-2 py-1 border rounded text-sm"
            placeholder="X"
          />
          <input
            type="number"
            value={inputY}
            onChange={(e) => setInputY(e.target.value)}
            className="w-20 px-2 py-1 border rounded text-sm"
            placeholder="Y"
          />
          <button
            onClick={handleSetPosition}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            应用
          </button>
          <button
            onClick={handleCenter}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            居中
          </button>
        </div>
      </section>

      {/* 标题 */}
      <section className="border rounded-lg p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">设置标题</h3>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            value={inputTitle}
            onChange={(e) => setInputTitle(e.target.value)}
            className="flex-1 min-w-[120px] px-2 py-1 border rounded text-sm"
            placeholder="窗口标题"
          />
          <button
            onClick={handleSetTitle}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            应用
          </button>
        </div>
      </section>

      {/* 最小/最大尺寸 */}
      <section className="border rounded-lg p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">尺寸约束</h3>
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <span className="text-xs w-12">最小:</span>
            <input
              type="number"
              value={inputMinW}
              onChange={(e) => setInputMinW(e.target.value)}
              className="w-16 px-2 py-1 border rounded text-sm"
            />
            <span>×</span>
            <input
              type="number"
              value={inputMinH}
              onChange={(e) => setInputMinH(e.target.value)}
              className="w-16 px-2 py-1 border rounded text-sm"
            />
            <button
              onClick={handleSetMinSize}
              className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              应用
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs w-12">最大:</span>
            <input
              type="number"
              value={inputMaxW}
              onChange={(e) => setInputMaxW(e.target.value)}
              className="w-16 px-2 py-1 border rounded text-sm"
            />
            <span>×</span>
            <input
              type="number"
              value={inputMaxH}
              onChange={(e) => setInputMaxH(e.target.value)}
              className="w-16 px-2 py-1 border rounded text-sm"
            />
            <button
              onClick={handleSetMaxSize}
              className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              应用
            </button>
          </div>
        </div>
      </section>

      {/* 置顶 */}
      <section className="border rounded-lg p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">窗口行为</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleSetAlwaysOnTop}
            className={`px-3 py-1 rounded text-sm ${
              ctx.alwaysOnTop ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            置顶 {ctx.alwaysOnTop ? "✓" : ""}
          </button>
          <button
            onClick={handleMinimize}
            className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
          >
            最小化
          </button>
          <button
            onClick={handleMaximize}
            className={`px-3 py-1 rounded text-sm ${
              ctx.isMaximized ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            最大化 {ctx.isMaximized ? "✓" : ""}
          </button>
          <button
            onClick={handleFullscreen}
            className={`px-3 py-1 rounded text-sm ${
              ctx.isFullscreen ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            全屏 {ctx.isFullscreen ? "✓" : ""}
          </button>
          <button
            onClick={handleFocus}
            className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
          >
            聚焦
          </button>
          <button
            onClick={handleRequestAttention}
            className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
            title="请求用户关注（闪烁任务栏等）"
          >
            请求关注
          </button>
          <button
            onClick={handleClose}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            关闭窗口
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;
