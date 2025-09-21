#!/bin/bash

echo "🚀 啟動 AR 應用的 HTTPS 伺服器..."
echo ""

# 檢查 Node.js 是否安裝
if ! command -v node &> /dev/null; then
    echo "❌ 需要安裝 Node.js"
    echo "請訪問: https://nodejs.org/"
    exit 1
fi

# 檢查是否已經在運行
if pgrep -f "node server.js" > /dev/null; then
    echo "⚠️  HTTPS 伺服器已經在運行中"
    echo "端口: 8443"
    echo ""
    echo "📱 在手機上訪問:"
    echo "   https://192.168.40.93:8443"
    echo ""
    echo "💻 在本機訪問:"
    echo "   https://localhost:8443"
    echo ""
    echo "🛑 要停止伺服器，按 Ctrl+C 或運行: pkill -f 'node server.js'"
    exit 0
fi

# 啟動伺服器
echo "✅ 啟動 HTTPS 伺服器..."
node server.js
