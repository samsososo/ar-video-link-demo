# Image AR ▶ Video ▶ Link（MindAR + A‑Frame）Starter

呢個 zip 係一個最簡單可跑嘅範例：用 **手機相機對準某張圖片**（image target）→ **喺圖上疊一段影片** → **影片播完彈出連結**。

> ⚠️ 必須以 **HTTPS** 或 **localhost** 打開，手機瀏覽器先會畀相機權限。

---

## 一、快速試跑（用樣本目標圖）

1. 把整個資料夾部署到任何靜態空間（Netlify / Vercel / GitHub Pages / Cloudflare Pages），或者本機：  
   ```bash
   npx serve -l 5173 .
   # or
   npx http-server -p 5173 .
   # 建 HTTPS 測試隧道（可選）
   npx ngrok http 5173
   ```
2. 用手機開 HTTPS 網址。
3. 對準 **MindAR 官方 sample 卡片**（搜尋「mindar card image」或打開：  
   https://hiukim.github.io/mind-ar-js-doc/tools/ 用示例 target）  
   > 亦可在另一台裝置上開示例圖片。
4. 成功追蹤後，會於圖上播放示例影片（MDN 的 flower.mp4）。片尾會彈出一個按鈕連去 `https://example.com`。

> 如要離線，把 `index.html` 的影片改為 `./assets/video.mp4`（自行加入）。

---

## 二、改用你自己的目標圖（例如 `assets/testing.jpg`）

### 方法 A（最易，無需安裝）
1. 進入 **MindAR Image Target Compiler**（網上版）：  
   https://hiukim.github.io/mind-ar-js-doc/tools/  
2. 上載你的圖片（建議用 **相片** 或有 **紋理對比** 嘅圖；避免純色/幾何太平滑）。  
3. 下載得到 `targets.mind`。  
4. 把檔案放到本專案 `assets/targets.mind`。  
5. 打開 `index.html`，把：  
   ```html
   mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.2.3/examples/image-tracking/assets/card/targets.mind"
   ```
   改成：
   ```html
   mindar-image="imageTargetSrc: ./assets/targets.mind"
   ```

### 方法 B（本機 CLI）
1. 安裝 Node.js 後執行：  
   ```bash
   npx mindar-image-cli compile --input assets/testing.jpg --output assets/targets.mind
   ```
2. 然後同上，修改 `index.html` 的 `imageTargetSrc` 指向 `./assets/targets.mind`。

---

## 三、改片源同片尾連結

- 片源：在 `index.html` 的 `<a-assets>` 裡把 `src` 改為 `./assets/video.mp4`，並把影片檔放到 `assets/`。建議 H.264 + AAC、720p 內。  
- 片尾連結：在 `index.html` 裡把 `OUT_LINK` 改成你想要彈去的網址。

---

## 四、常見問題

- **iOS 自動播放**：需要 `muted` + `playsinline`，首次通常要一次用戶互動（例如按「允許相機」）。  
- **相機無權限**：請確保是 HTTPS 或 localhost；如曾拒絕權限，去瀏覽器設定手動允許。  
- **追蹤不穩**：圖片要有細節紋理、反差，避免光滑/重複圖樣；現場光線要充足。  
- **想掃多張圖**：用 MindAR 工具把多張圖編成同一個 `targets.mind`，再在 `a-entity` 用不同的 `targetIndex`（0/1/2…）。  
- **要後台**：把「target key → 影片/連結」放 Firebase/Supabase，前端開場 fetch 設定即可。

---

## 五、檔案結構
```
.
├── index.html             # 主頁（已接 MindAR + A‑Frame）
├── assets/
│   ├── testing.jpg        # 你上載嘅示例圖片（可用嚟編譯 targets.mind）
│   └── (自行加入) targets.mind / video.mp4
└── README.md
```

祝順利！有需要我可以幫你把 `targets.mind` 及影片尺寸對位都微調好。