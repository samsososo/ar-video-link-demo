const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 檢查是否有 openssl
try {
  execSync('which openssl', { stdio: 'ignore' });
} catch (error) {
  console.log('❌ 需要安裝 OpenSSL 來生成證書');
  console.log('請運行: brew install openssl');
  process.exit(1);
}

// 生成自簽名證書
const certDir = './certs';
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir);
}

const certPath = path.join(certDir, 'cert.pem');
const keyPath = path.join(certDir, 'key.pem');

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.log('🔐 生成自簽名 HTTPS 證書...');
  try {
    execSync(`openssl req -x509 -newkey rsa:2048 -keyout ${keyPath} -out ${certPath} -days 365 -nodes -subj "/C=HK/ST=HK/L=HK/O=AR Demo/CN=localhost"`, { stdio: 'inherit' });
    console.log('✅ 證書生成成功！');
  } catch (error) {
    console.log('❌ 證書生成失敗:', error.message);
    process.exit(1);
  }
}

// 創建 HTTPS 伺服器
const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
};

const server = https.createServer(options, (req, res) => {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  
  // 檢查文件是否存在
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('File not found');
    return;
  }
  
  // 設置 MIME 類型
  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
    '.mind': 'application/octet-stream'
  };
  
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  
  // 讀取並發送文件
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

const PORT = 8443;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 HTTPS 伺服器運行在 https://localhost:${PORT}`);
  console.log(`📱 在手機上訪問: https://192.168.40.152:${PORT}`);
  console.log(`⚠️  首次訪問會顯示安全警告，點擊「進階」→「繼續前往」即可`);
  console.log(`📷 現在應該可以使用相機了！`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`❌ 端口 ${PORT} 已被佔用，請關閉其他服務或修改端口`);
  } else {
    console.log('❌ 伺服器錯誤:', error.message);
  }
});
