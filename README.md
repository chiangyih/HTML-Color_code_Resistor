# 國立新化高工資訊科 色碼電阻計算器
**Resistor Master - Color Code Calculator**

🔗 **線上體驗 (Live Demo)**: [https://chiangyih.github.io/HTML-Color_code_Resistor/](https://chiangyih.github.io/HTML-Color_code_Resistor/)

Author: Tseng  
Last modify: 2025.12.16 22:54

<img width="683" height="812" alt="image" src="https://github.com/user-attachments/assets/2ffd7bd2-02c8-4b47-83ee-3a32dff1eca1" />

---

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

## 🎓 教學說明 (Educational Notes)

### 色碼電阻讀取方法

#### 四環電阻
| 環位 | 說明 |
|------|------|
| 第一環 | 十位數字 (0-9) |
| 第二環 | 個位數字 (0-9) |
| 第三環 | 乘數 (10 的次方) |
| 第四環 | 誤差值 |

**計算公式**: `阻值 = (第一環 × 10 + 第二環) × 乘數`

#### 五環電阻
| 環位 | 說明 |
|------|------|
| 第一環 | 百位數字 (0-9) |
| 第二環 | 十位數字 (0-9) |
| 第三環 | 個位數字 (0-9) |
| 第四環 | 乘數 (10 的次方) |
| 第五環 | 誤差值 |

**計算公式**: `阻值 = (第一環 × 100 + 第二環 × 10 + 第三環) × 乘數`

### 色碼對照表

| 顏色 | 數字值 | 乘數 | 誤差 |
|------|--------|------|------|
| 黑色 (Black) | 0 | ×1 | - |
| 棕色 (Brown) | 1 | ×10 | ±1% |
| 紅色 (Red) | 2 | ×100 | ±2% |
| 橙色 (Orange) | 3 | ×1,000 | - |
| 黃色 (Yellow) | 4 | ×10,000 | - |
| 綠色 (Green) | 5 | ×100,000 | ±0.5% |
| 藍色 (Blue) | 6 | ×1,000,000 | ±0.25% |
| 紫色 (Violet) | 7 | ×10,000,000 | ±0.1% |
| 灰色 (Grey) | 8 | ×100,000,000 | ±0.05% |
| 白色 (White) | 9 | ×1,000,000,000 | - |
| 金色 (Gold) | - | ×0.1 | ±5% |
| 銀色 (Silver) | - | ×0.01 | ±10% |

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
  - 完整正體中文程式註解。

## 📂 專案結構 (Project Structure)

```
HTML-Color_code_Resistor/
├── index.html      # 主程式入口
├── style.css       # 樣式表 (含 Design System)
├── script.js       # 核心計算邏輯與互動控制（含詳細中文註解）
└── README.md       # 專案說明文件
```

## 🧪 測試與驗證 (Testing)

本專案已通過完整的測試計畫驗證：
- **核心邏輯**: 涵蓋一般值、精密值、極大/極小值測試。
- **UI 互動**: 模式切換正確性、視覺回饋連動。
- **瀏覽器相容性**: 支援主流現代瀏覽器。

---

© 2025 國立新化高工資訊科 | National Hsin-Hua Industrial Vocational High School - Information Technology
