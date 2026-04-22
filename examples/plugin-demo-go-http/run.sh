#!/bin/sh
# 通过 go run 运行 backend.go，http 模式
cd "$(dirname "$0")"
exec go run backend.go
