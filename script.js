const RESISTOR_COLORS = {
    black: { val: 0, mult: 1, color: '#000000', text: '#fff' },
    brown: { val: 1, mult: 10, tol: 1, color: '#5d4037', text: '#fff' },
    red: { val: 2, mult: 100, tol: 2, color: '#ef4444', text: '#fff' },
    orange: { val: 3, mult: 1000, color: '#f97316', text: '#000' },
    yellow: { val: 4, mult: 10000, color: '#eab308', text: '#000' },
    green: { val: 5, mult: 100000, tol: 0.5, color: '#22c55e', text: '#000' },
    blue: { val: 6, mult: 1000000, tol: 0.25, color: '#3b82f6', text: '#fff' },
    violet: { val: 7, mult: 10000000, tol: 0.1, color: '#8b5cf6', text: '#fff' },
    grey: { val: 8, mult: 100000000, tol: 0.05, color: '#64748b', text: '#fff' },
    white: { val: 9, mult: 1000000000, color: '#ffffff', text: '#000' },
    gold: { mult: 0.1, tol: 5, color: '#d4af37', text: '#000' },
    silver: { mult: 0.01, tol: 10, color: '#c0c0c0', text: '#000' },
    none: { tol: 20, color: 'transparent', text: '#000' }
};

// Available colors for each band type
const BAND_OPTIONS = {
    digit: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'],
    multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gold', 'silver'],
    tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'grey', 'gold', 'silver']
};

let currentMode = 4;
let state = {
    band1: 'brown',
    band2: 'black',
    band3: 'black', // Only used in 5-band mode as 3rd digit
    multiplier: 'red',
    tolerance: 'gold'
};

function setMode(mode) {
    currentMode = mode;

    // Update UI buttons
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`mode-${mode}`).classList.add('active');

    // Update Resistor Body Appearance (Beige vs Blue)
    const resistorBody = document.querySelector('.resistor-body');
    resistorBody.classList.remove('mode-4', 'mode-5');
    resistorBody.classList.add(`mode-${mode}`);

    // Show/Hide 3rd band visual and control
    const band3 = document.getElementById('band3');
    if (mode === 5) {
        band3.classList.remove('hidden');
    } else {
        band3.classList.add('hidden');
    }

    renderControls();
    updateResistorVisual();
    calculateValue();
}

function renderControls() {
    const container = document.getElementById('controls');
    container.innerHTML = '';

    // Helper to create select inputs
    const createSelect = (id, label, options, selectedValue) => {
        const group = document.createElement('div');
        group.className = 'control-group';

        const labelEl = document.createElement('label');
        labelEl.textContent = label;
        group.appendChild(labelEl);

        const select = document.createElement('select');
        select.id = `select-${id}`;
        select.onchange = (e) => updateState(id, e.target.value);

        options.forEach(colorKey => {
            const option = document.createElement('option');
            option.value = colorKey;
            option.textContent = colorKey.charAt(0).toUpperCase() + colorKey.slice(1);
            option.style.backgroundColor = RESISTOR_COLORS[colorKey].color;
            option.style.color = RESISTOR_COLORS[colorKey].text; // Contrast text
            if (colorKey === selectedValue) option.selected = true;
            select.appendChild(option);
        });

        group.appendChild(select);
        return group;
    };

    container.appendChild(createSelect('band1', 'Band 1', BAND_OPTIONS.digit, state.band1));
    container.appendChild(createSelect('band2', 'Band 2', BAND_OPTIONS.digit, state.band2));

    if (currentMode === 5) {
        container.appendChild(createSelect('band3', 'Band 3', BAND_OPTIONS.digit, state.band3));
    }

    container.appendChild(createSelect('multiplier', 'Multiplier', BAND_OPTIONS.multiplier, state.multiplier));
    container.appendChild(createSelect('tolerance', 'Tolerance', BAND_OPTIONS.tolerance, state.tolerance));
}

function updateState(key, value) {
    state[key] = value;
    updateResistorVisual();
    calculateValue();

    // Update select background color to match selection (UX flair)
    // const select = document.getElementById(`select-${key}`);
    // select.style.borderLeft = `5px solid ${RESISTOR_COLORS[value].color}`;
}

function updateResistorVisual() {
    const setBandColor = (elementId, colorKey) => {
        const el = document.getElementById(elementId);
        if (colorKey && RESISTOR_COLORS[colorKey]) {
            el.style.backgroundColor = RESISTOR_COLORS[colorKey].color;
            el.style.boxShadow = `0 0 10px ${RESISTOR_COLORS[colorKey].color}80`; // Glow
        }
    };

    setBandColor('band1', state.band1);
    setBandColor('band2', state.band2);
    setBandColor('band-multiplier', state.multiplier);
    setBandColor('band-tolerance', state.tolerance);

    if (currentMode === 5) {
        setBandColor('band3', state.band3);
    }
}

function formatResistance(ohms) {
    if (ohms >= 1000000000) return (ohms / 1000000000).toFixed(2).replace(/\.00$/, '') + ' GΩ';
    if (ohms >= 1000000) return (ohms / 1000000).toFixed(2).replace(/\.00$/, '') + ' MΩ';
    if (ohms >= 1000) return (ohms / 1000).toFixed(2).replace(/\.00$/, '') + ' kΩ';
    return ohms.toFixed(2).replace(/\.00$/, '') + ' Ω';
}

function calculateValue() {
    let baseValue = 0;

    const d1 = RESISTOR_COLORS[state.band1].val;
    const d2 = RESISTOR_COLORS[state.band2].val;
    const mult = RESISTOR_COLORS[state.multiplier].mult;
    const tol = RESISTOR_COLORS[state.tolerance].tol;

    if (currentMode === 4) {
        baseValue = (d1 * 10) + d2;
    } else {
        const d3 = RESISTOR_COLORS[state.band3].val;
        baseValue = (d1 * 100) + (d2 * 10) + d3;
    }

    const totalOhms = baseValue * mult;

    document.getElementById('resistance-value').textContent = formatResistance(totalOhms);
    document.getElementById('tolerance-value').textContent = `± ${tol}%`;
}

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    setMode(4); // Default to 4 band
});
