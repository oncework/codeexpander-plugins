<?php
/**
 * CodeExpander 插件后端 - http 模式 (PHP)
 *
 * 协议：从环境变量 CODEEXPANDER_BACKEND_PORT 获取端口
 *       在 127.0.0.1:PORT 启动 HTTP 服务
 *       接收 POST / 请求，body 为 { method, payload }
 *       返回 JSON 响应
 *
 * 进程常驻，空闲约 5 分钟后退出
 *
 * 启动方式：php backend.php（由 CodeExpander 设置 CODEEXPANDER_BACKEND_PORT）
 * 本文件同时作为 router：被内置服务器调用时处理请求
 */

// 作为 router 被调用时（每次 HTTP 请求）
if (isset($_SERVER['REQUEST_METHOD'])) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST' || ($_SERVER['REQUEST_URI'] ?? '') !== '/') {
        http_response_code(404);
        exit;
    }
    try {
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $method = $data['method'] ?? 'run';
        $payload = $data['payload'] ?? [];
        $response = handleRequest($method, $payload);
    } catch (Throwable $e) {
        $response = ['ok' => false, 'error' => $e->getMessage()];
    }
    header('Content-Type: application/json');
    echo json_encode($response);
    exit;
}

function handleRequest($method, $payload) {
    if (in_array($method, ['run', 'transform'])) {
        $text = $payload['text'] ?? '';
        $action = $payload['action'] ?? 'upper';
        $result = $action === 'upper' ? strtoupper($text)
            : ($action === 'lower' ? strtolower($text)
            : ($action === 'reverse' ? strrev($text) : $text));
        return ['ok' => true, 'result' => $result, 'action' => $action];
    }
    if ($method === 'ping') {
        return ['ok' => true, 'pong' => true, 'mode' => 'http'];
    }
    return ['ok' => false, 'error' => "Unknown method: $method"];
}

$port = getenv('CODEEXPANDER_BACKEND_PORT');
if (!$port) {
    fwrite(STDERR, "CODEEXPANDER_BACKEND_PORT not set\n");
    exit(1);
}

// PHP 内置服务器：使用本文件作为 router
$server = "127.0.0.1:$port";
passthru("php -S $server " . escapeshellarg(__FILE__), $code);
exit($code);
