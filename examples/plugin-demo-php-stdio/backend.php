<?php
/**
 * CodeExpander 插件后端 - stdio 模式 (PHP)
 *
 * 协议：从 stdin 读取一行 JSON { method, payload }
 *       向 stdout 输出一行 JSON 作为响应
 *
 * 每次 callBackend 调用会 spawn 新进程，10 秒超时
 */

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
        return ['ok' => true, 'pong' => true, 'mode' => 'stdio'];
    }
    return ['ok' => false, 'error' => "Unknown method: $method"];
}

try {
    $line = trim(file_get_contents('php://stdin'));
    $data = json_decode($line, true) ?? [];
    $method = $data['method'] ?? 'run';
    $payload = $data['payload'] ?? [];
    $response = handleRequest($method, $payload);
    echo json_encode($response);
} catch (Throwable $e) {
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
