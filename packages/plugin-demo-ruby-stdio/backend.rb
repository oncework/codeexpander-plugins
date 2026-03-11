#!/usr/bin/env ruby
# frozen_string_literal: true
#
# CodeExpander 插件后端 - stdio 模式 (Ruby)
#
# 协议：从 stdin 读取一行 JSON { method, payload }
#       向 stdout 输出一行 JSON 作为响应
#
# 每次 callBackend 调用会 spawn 新进程，10 秒超时

require 'json'

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
    { ok: true, pong: true, mode: 'stdio' }
  else
    { ok: false, error: "Unknown method: #{method}" }
  end
end

begin
  line = $stdin.read.strip
  data = JSON.parse(line)
  method = data['method'] || 'run'
  payload = data['payload'] || {}
  response = handle_request(method, payload)
  puts JSON.generate(response)
rescue => e
  puts JSON.generate(ok: false, error: e.message)
end
