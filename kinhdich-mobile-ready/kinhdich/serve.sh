#!/usr/bin/env bash
# App nạp module bằng fetch() -> bắt buộc chạy qua HTTP, không mở bằng file://
# Bind 0.0.0.0 để điện thoại cùng WiFi mở được.
cd "$(dirname "$0")"
PORT="${1:-8000}"
IP=$(hostname -I 2>/dev/null | awk '{print $1}')
[ -z "$IP" ] && IP=$(ipconfig getifaddr en0 2>/dev/null)   # macOS
echo "Máy này : http://localhost:$PORT/"
[ -n "$IP" ] && echo "Điện thoại (cùng WiFi): http://$IP:$PORT/"
echo
python3 -m http.server "$PORT" --bind 0.0.0.0
