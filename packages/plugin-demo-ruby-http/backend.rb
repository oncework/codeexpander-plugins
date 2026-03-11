#!/usr/bin/env ruby
# frozen_string_literal: true
#
# CodeExpander 插件后端 - http 模式 (Ruby)
#
# 协议：从环境变量 CODEEXPANDER_BACKEND_PORT 获取端口
#       在 127.0.0.1:PORT 启动 HTTP 服务
#       接收 POST / 请求，body 为 { method, payload }
#       返回 JSON 响应
#
# 进程常驻，空闲约 5 分钟后退出

require 'json'
require 'webrick'

def handle_request(method, payload)
  case method
  when 'run', 'transform'
    text = payload['text'] || ''
    action = payload['action'] || 'upper'
    result = case action
             when 'upper' then text.upcase
             when 'lower' then text.downcase
             when 'reverse' then text.reverse
             else text
             end
    { ok: true, result: result, action: action }
  when 'ping'
    { ok: true, pong: true, mode: 'http' }
  else
    { ok: false, error: "Unknown method: #{method}" }
  end
end

port = ENV['CODEEXPANDER_BACKEND_PORT']
if port.nil? || port.empty?
  $stderr.puts 'CODEEXPANDER_BACKEND_PORT not set'
  exit 1
end

server = WEBrick::HTTPServer.new(Port: port.to_i, BindAddress: '127.0.0.1')
server.mount_proc '/' do |req, res|
  if req.request_method != 'POST' || req.path != '/'
    res.status = 404
    next
  end
  begin
    data = JSON.parse(req.body)
    method = data['method'] || 'run'
    payload = data['payload'] || {}
    response = handle_request(method, payload)
    res['Content-Type'] = 'application/json'
    res.body = JSON.generate(response)
  rescue => e
    res.status = 500
    res['Content-Type'] = 'application/json'
    res.body = JSON.generate(ok: false, error: e.message)
  end
end

trap('INT') { server.shutdown }
trap('TERM') { server.shutdown }
server.start
