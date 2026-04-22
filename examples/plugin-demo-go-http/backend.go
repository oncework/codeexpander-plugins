// CodeExpander 插件后端 - http 模式 (Go)
//
// 协议：从环境变量 CODEEXPANDER_BACKEND_PORT 获取端口
//       在 127.0.0.1:PORT 启动 HTTP 服务
//       接收 POST / 请求，body 为 { method, payload }
//       返回 JSON 响应
//
// 进程常驻，空闲约 5 分钟后退出
package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
)

type request struct {
	Method  string                 `json:"method"`
	Payload map[string]interface{} `json:"payload"`
}

type response struct {
	OK     bool   `json:"ok"`
	Error  string `json:"error,omitempty"`
	Result string `json:"result,omitempty"`
	Action string `json:"action,omitempty"`
	Pong   bool   `json:"pong,omitempty"`
	Mode   string `json:"mode,omitempty"`
}

func handleRequest(method string, payload map[string]interface{}) response {
	switch method {
	case "run", "transform":
		text, _ := payload["text"].(string)
		action, _ := payload["action"].(string)
		if action == "" {
			action = "upper"
		}
		var result string
		switch action {
		case "upper":
			result = strings.ToUpper(text)
		case "lower":
			result = strings.ToLower(text)
		case "reverse":
			runes := []rune(text)
			for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
				runes[i], runes[j] = runes[j], runes[i]
			}
			result = string(runes)
		default:
			result = text
		}
		return response{OK: true, Result: result, Action: action}
	case "ping":
		return response{OK: true, Pong: true, Mode: "http"}
	default:
		return response{OK: false, Error: "Unknown method: " + method}
	}
}

func main() {
	port := os.Getenv("CODEEXPANDER_BACKEND_PORT")
	if port == "" {
		fmt.Fprintln(os.Stderr, "CODEEXPANDER_BACKEND_PORT not set")
		os.Exit(1)
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost || r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}
		var req request
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(response{OK: false, Error: err.Error()})
			return
		}
		if req.Method == "" {
			req.Method = "run"
		}
		if req.Payload == nil {
			req.Payload = make(map[string]interface{})
		}
		res := handleRequest(req.Method, req.Payload)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(res)
	})

	http.ListenAndServe("127.0.0.1:"+port, nil)
}
