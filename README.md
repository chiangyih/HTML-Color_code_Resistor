# Resistor Master (色碼電阻計算機)
Author: Tseng
Last modify:2025.12.16 15:21 
![Uploading image.png…]()


這是一個設計精美、功能強大的網頁版色碼電阻計算機。專為電子工程師、學生及愛好者設計，提供直觀的視覺回饋與即時計算功能。

## ✨ 特色功能 (Features)

- **雙模式支援**: 
  - **4環電阻 (4-Band)**: 標準碳膜電阻計算。
  - **5環電阻 (5-Band)**: 精密金屬膜電阻計算。
  
- **即時視覺回饋 (Real-time Visualization)**:
  - 電阻色環顏色會隨選擇即時更新。
  - **動態本體變色**: 
    - 4環模式顯示為**米色 (Beige)**。
    - 5環模式顯示為**藍色 (Blue)**，符合真實電阻外觀標準。
    
- **智慧計算 (Smart Calculation)**:
  - 自動換算單位 (Ω, kΩ, MΩ, GΩ)。
  - 即時顯示誤差值 (Tolerance)。

- **頂級 UI 設計 (Premium Design)**:
  - 現代化 Dark Mode 介面，搭配霓虹色調點綴。
  - 玻璃擬態 (Glassmorphism) 風格控制面板。
  - 響應式設計 (Responsive)，完美支援桌機與手機操作。

## 🚀 使用方式 (Usage)

本專案為純靜態網頁，無需安裝任何依賴或伺服器環境。

1. 下載專案資料夾。
2. 雙擊開啟 `index.html` (建議使用 Chrome, Edge 或 Firefox 瀏覽器)。
3. 使用介面上的按鈕切換 "4 Bands" 或 "5 Bands" 模式。
4. 透過下拉選單選擇對應的色環顏色。
5. 畫面上方將即時顯示計算結果與電阻示意圖。

## 🛠️ 技術棧 (Tech Stack)

- **HTML5**: 語意化標籤結構。
- **CSS3**: 
  - Vanilla CSS (無框架)。
  - CSS Variables 用於主題管理。
  - Flexbox & Grid 佈局。
  - CSS Transitions 實現流暢動畫。
- **JavaScript (ES6+)**: 
  - 模組化邏輯設計。
  - DOM 操作與事件監聽。

## 📂 專案結構 (Project Structure)

```
resistor/
├── index.html      # 主程式入口
├── style.css       # 樣式表 (含 Design System)
├── script.js       # 核心計算邏輯與互動控制
└── README.md       # 專案說明文件
```

## 🧪 測試與驗證 (Testing)

本專案已通過完整的測試計畫驗證：
- **核心邏輯**: 涵蓋一般值、精密值、極大/極小值測試。
- **UI 互動**: 模式切換正確性、視覺回饋連動。
- **瀏覽器相容性**: 支援主流現代瀏覽器。

詳細測試報告請參閱 Artifacts 中的 `test_plan.md` 與 `walkthrough.md`。
