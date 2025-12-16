/**
 * ============================================
 * 色碼電阻計算器 - JavaScript 主程式
 * ============================================
 * 本程式用於計算色碼電阻的阻值與誤差
 * 支援 4 環與 5 環電阻的計算
 */

/**
 * 電阻色碼對照表
 * 每個顏色包含以下屬性：
 * - val: 數字值（用於第1、2、3環的數字計算）
 * - mult: 乘數（用於乘數環的倍率）
 * - tol: 誤差百分比（用於誤差環）
 * - color: 顏色的 CSS 色碼
 * - text: 該顏色背景上適合的文字顏色（用於對比）
 */
const RESISTOR_COLORS = {
    black: { val: 0, mult: 1, color: '#000000', text: '#fff' },           // 黑色：數字0，乘數×1
    brown: { val: 1, mult: 10, tol: 1, color: '#5d4037', text: '#fff' },  // 棕色：數字1，乘數×10，誤差±1%
    red: { val: 2, mult: 100, tol: 2, color: '#ef4444', text: '#fff' },   // 紅色：數字2，乘數×100，誤差±2%
    orange: { val: 3, mult: 1000, color: '#f97316', text: '#000' },       // 橙色：數字3，乘數×1000
    yellow: { val: 4, mult: 10000, color: '#eab308', text: '#000' },      // 黃色：數字4，乘數×10000
    green: { val: 5, mult: 100000, tol: 0.5, color: '#22c55e', text: '#000' },    // 綠色：數字5，乘數×100000，誤差±0.5%
    blue: { val: 6, mult: 1000000, tol: 0.25, color: '#3b82f6', text: '#fff' },   // 藍色：數字6，乘數×1000000，誤差±0.25%
    violet: { val: 7, mult: 10000000, tol: 0.1, color: '#8b5cf6', text: '#fff' }, // 紫色：數字7，乘數×10000000，誤差±0.1%
    grey: { val: 8, mult: 100000000, tol: 0.05, color: '#64748b', text: '#fff' }, // 灰色：數字8，乘數×100000000，誤差±0.05%
    white: { val: 9, mult: 1000000000, color: '#ffffff', text: '#000' },  // 白色：數字9，乘數×1000000000
    gold: { mult: 0.1, tol: 5, color: '#d4af37', text: '#000' },          // 金色：乘數×0.1，誤差±5%
    silver: { mult: 0.01, tol: 10, color: '#c0c0c0', text: '#000' },      // 銀色：乘數×0.01，誤差±10%
    none: { tol: 20, color: 'transparent', text: '#000' }                 // 無色：誤差±20%
};

/**
 * 各環位可選擇的顏色選項
 * - digit: 數字環可用的顏色（第1、2、3環，代表0-9）
 * - multiplier: 乘數環可用的顏色（包含金色和銀色的小數乘數）
 * - tolerance: 誤差環可用的顏色
 */
const BAND_OPTIONS = {
    digit: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'],
    multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gold', 'silver'],
    tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'grey', 'gold', 'silver']
};

// 目前選擇的模式：4 = 四環電阻，5 = 五環電阻
let currentMode = 4;

/**
 * 電阻各環的目前狀態
 * - band1: 第一環（十位數或百位數）
 * - band2: 第二環（個位數或十位數）
 * - band3: 第三環（僅五環模式使用，個位數）
 * - multiplier: 乘數環
 * - tolerance: 誤差環
 */
let state = {
    band1: 'brown',      // 預設棕色（數字1）
    band2: 'black',      // 預設黑色（數字0）
    band3: 'black',      // 預設黑色（數字0），僅五環模式使用
    multiplier: 'red',   // 預設紅色（乘數×100）
    tolerance: 'gold'    // 預設金色（誤差±5%）
};

/**
 * 設定電阻模式（四環或五環）
 * @param {number} mode - 模式值，4 或 5
 */
function setMode(mode) {
    currentMode = mode;

    // 更新模式切換按鈕的樣式
    // 移除所有按鈕的 active 樣式，再為當前模式的按鈕加上 active
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`mode-${mode}`).classList.add('active');

    // 更新電阻本體的外觀
    // 四環電阻（碳膜）顯示米色，五環電阻（金屬膜）顯示藍色
    const resistorBody = document.querySelector('.resistor-body');
    resistorBody.classList.remove('mode-4', 'mode-5');
    resistorBody.classList.add(`mode-${mode}`);

    // 控制第三環的顯示與隱藏
    // 五環模式時顯示第三環，四環模式時隱藏
    const band3 = document.getElementById('band3');
    if (mode === 5) {
        band3.classList.remove('hidden');  // 顯示第三環
    } else {
        band3.classList.add('hidden');     // 隱藏第三環
    }

    // 重新渲染控制面板、更新電阻視覺效果、計算阻值
    renderControls();
    updateResistorVisual();
    calculateValue();
}

/**
 * 渲染控制面板
 * 動態產生各環的下拉選單
 */
function renderControls() {
    const container = document.getElementById('controls');
    container.innerHTML = '';  // 清空現有的控制元件

    /**
     * 建立下拉選單的輔助函式
     * @param {string} id - 選單的識別碼（對應 state 的 key）
     * @param {string} label - 顯示的標籤文字
     * @param {Array} options - 可選擇的顏色陣列
     * @param {string} selectedValue - 目前選中的值
     * @returns {HTMLElement} - 包含標籤和選單的 div 元素
     */
    const createSelect = (id, label, options, selectedValue) => {
        // 建立控制組的容器
        const group = document.createElement('div');
        group.className = 'control-group';

        // 建立標籤元素
        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        group.appendChild(labelEl);

        // 建立下拉選單
        const select = document.createElement('select');
        select.id = `select-${id}`;
        // 當選擇改變時，更新狀態
        select.onchange = (e) => updateState(id, e.target.value);

        // 為每個顏色建立選項
        options.forEach(colorKey => {
            const option = document.createElement('option');
            option.value = colorKey;
            // 將顏色名稱的首字母轉為大寫
            option.textContent = colorKey.charAt(0).toUpperCase() + colorKey.slice(1);
            // 設定選項的背景色為對應的電阻顏色
            option.style.backgroundColor = RESISTOR_COLORS[colorKey].color;
            // 設定適當的文字顏色以確保可讀性
            option.style.color = RESISTOR_COLORS[colorKey].text;
            // 如果是目前選中的值，設為選中狀態
            if (colorKey === selectedValue) option.selected = true;
            select.appendChild(option);
        });

        group.appendChild(select);
        return group;
    };

    // 建立第一環選單（數字環）
    container.appendChild(createSelect('band1', 'Band 1', BAND_OPTIONS.digit, state.band1));
    // 建立第二環選單（數字環）
    container.appendChild(createSelect('band2', 'Band 2', BAND_OPTIONS.digit, state.band2));

    // 五環模式時，加入第三環選單（數字環）
    if (currentMode === 5) {
        container.appendChild(createSelect('band3', 'Band 3', BAND_OPTIONS.digit, state.band3));
    }

    // 建立乘數環選單
    container.appendChild(createSelect('multiplier', 'Multiplier', BAND_OPTIONS.multiplier, state.multiplier));
    // 建立誤差環選單
    container.appendChild(createSelect('tolerance', 'Tolerance', BAND_OPTIONS.tolerance, state.tolerance));
}

/**
 * 更新狀態並刷新顯示
 * @param {string} key - 要更新的狀態鍵（band1, band2, band3, multiplier, tolerance）
 * @param {string} value - 新的顏色值
 */
function updateState(key, value) {
    state[key] = value;          // 更新狀態物件
    updateResistorVisual();      // 更新電阻的視覺顯示
    calculateValue();            // 重新計算阻值

    // 可選功能：為選單加上左邊框顯示目前選擇的顏色（目前已註解）
    // const select = document.getElementById(`select-${key}`);
    // select.style.borderLeft = `5px solid ${RESISTOR_COLORS[value].color}`;
}

/**
 * 更新電阻的視覺顯示
 * 根據目前狀態設定各環的顏色
 */
function updateResistorVisual() {
    /**
     * 設定單一環的顏色
     * @param {string} elementId - 環的 HTML 元素 ID
     * @param {string} colorKey - 顏色的鍵值
     */
    const setBandColor = (elementId, colorKey) => {
        const el = document.getElementById(elementId);
        if (colorKey && RESISTOR_COLORS[colorKey]) {
            // 設定背景顏色
            el.style.backgroundColor = RESISTOR_COLORS[colorKey].color;
            // 加上發光效果（使用顏色的半透明版本）
            el.style.boxShadow = `0 0 10px ${RESISTOR_COLORS[colorKey].color}80`;
        }
    };

    // 設定各環的顏色
    setBandColor('band1', state.band1);              // 第一環
    setBandColor('band2', state.band2);              // 第二環
    setBandColor('band-multiplier', state.multiplier); // 乘數環
    setBandColor('band-tolerance', state.tolerance);   // 誤差環

    // 五環模式時，額外設定第三環的顏色
    if (currentMode === 5) {
        setBandColor('band3', state.band3);
    }
}

/**
 * 格式化電阻值為易讀的字串
 * 自動轉換為適當的單位（Ω、kΩ、MΩ、GΩ）
 * @param {number} ohms - 電阻值（歐姆）
 * @returns {string} - 格式化後的電阻值字串
 */
function formatResistance(ohms) {
    // 大於等於 10 億歐姆，轉換為 GΩ（吉歐姆）
    if (ohms >= 1000000000) return (ohms / 1000000000).toFixed(2).replace(/\.00$/, '') + ' GΩ';
    // 大於等於 100 萬歐姆，轉換為 MΩ（百萬歐姆）
    if (ohms >= 1000000) return (ohms / 1000000).toFixed(2).replace(/\\.00$/, '') + ' MΩ';
    // 大於等於 1000 歐姆，轉換為 kΩ（千歐姆）
    if (ohms >= 1000) return (ohms / 1000).toFixed(2).replace(/\.00$/, '') + ' kΩ';
    // 小於 1000 歐姆，直接顯示 Ω
    return ohms.toFixed(2).replace(/\.00$/, '') + ' Ω';
}

/**
 * 計算電阻值並更新顯示
 * 
 * 四環電阻計算公式：
 * 阻值 = (第一環數字 × 10 + 第二環數字) × 乘數
 * 
 * 五環電阻計算公式：
 * 阻值 = (第一環數字 × 100 + 第二環數字 × 10 + 第三環數字) × 乘數
 */
function calculateValue() {
    let baseValue = 0;

    // 從狀態中取得各環對應的數值
    const d1 = RESISTOR_COLORS[state.band1].val;        // 第一環的數字值
    const d2 = RESISTOR_COLORS[state.band2].val;        // 第二環的數字值
    const mult = RESISTOR_COLORS[state.multiplier].mult; // 乘數環的乘數
    const tol = RESISTOR_COLORS[state.tolerance].tol;    // 誤差環的誤差百分比

    // 根據模式計算基礎值
    if (currentMode === 4) {
        // 四環模式：兩位數字
        // 例如：棕黑 = 1×10 + 0 = 10
        baseValue = (d1 * 10) + d2;
    } else {
        // 五環模式：三位數字
        // 例如：棕黑黑 = 1×100 + 0×10 + 0 = 100
        const d3 = RESISTOR_COLORS[state.band3].val;    // 第三環的數字值
        baseValue = (d1 * 100) + (d2 * 10) + d3;
    }

    // 計算總電阻值（基礎值 × 乘數）
    const totalOhms = baseValue * mult;

    // 更新顯示
    document.getElementById('resistance-value').textContent = formatResistance(totalOhms);
    document.getElementById('tolerance-value').textContent = `± ${tol}%`;
}

/**
 * 初始化設定
 * 當 DOM 載入完成後執行
 */
document.addEventListener('DOMContentLoaded', () => {
    setMode(4);  // 預設使用四環模式
});
