// CodeExpander 插件后端 - stdio 模式 (Go)
// 协议：从 stdin 读取一行 JSON { method, payload }，向 stdout 输出一行 JSON
// 每次 callBackend 调用会 spawn 新进程，10 秒超时
package main

import (
	"bufio"
	"encoding/json"
	"fmt"
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
		return response{OK: true, Pong: true, Mode: "stdio"}
	default:
		return response{OK: false, Error: "Unknown method: " + method}
	}
}

func main() {
	scanner := bufio.NewScanner(os.Stdin)
	if !scanner.Scan() {
		return
	}
	line := scanner.Text()

	var req request
	if err := json.Unmarshal([]byte(line), &req); err != nil {
		out, _ := json.Marshal(response{OK: false, Error: err.Error()})
		fmt.Println(string(out))
		return
	}

	if req.Method == "" {
		req.Method = "run"
	}
	if req.Payload == nil {
		req.Payload = make(map[string]interface{})
	}

	res := handleRequest(req.Method, req.Payload)
	out, _ := json.Marshal(res)
	fmt.Println(string(out))
}
