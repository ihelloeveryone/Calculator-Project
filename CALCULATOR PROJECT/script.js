let currentInput = '0';
let previousInput = '';
let operation = null;
let resetScreen = false;
let memoryValue = 0;
let angleMode = 'DEG';
let calculationHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    loadHistory();
    updateDisplay();
    setupUnitConverter();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('hamburger').addEventListener('click', toggleNavMenu);
    document.addEventListener('keydown', handleKeyPress);
}

function toggleNavMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

function handleKeyPress(e) {
    if (/[0-9.]/.test(e.key)) appendNumber(e.key);
    if (/[+\-*/%]/.test(e.key)) appendOperator(e.key);
    if (e.key === 'Enter') calculateResult();
    if (e.key === 'Escape') clearDisplay();
    if (e.key === 'Backspace') backspace();
}

function updateDisplay() {
    const display = document.getElementById('display');
    const calcDisplay = document.getElementById('calculationDisplay');
    display.value = currentInput;
    
    if (operation && previousInput) {
        calcDisplay.textContent = `${previousInput} ${operation} ${currentInput}`;
    } else {
        calcDisplay.textContent = '';
    }
}

function appendNumber(number) {
    if (currentInput === '0' || resetScreen) {
        currentInput = number;
        resetScreen = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operation !== null) calculateResult();
    previousInput = currentInput;
    operation = op;
    resetScreen = true;
    updateDisplay();
}

function appendFunction(func) {
    if (resetScreen) currentInput = '0';
    if (func.includes('Math.')) {
        currentInput = func;
        resetScreen = false;
    } else {
        currentInput = func + currentInput;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    updateDisplay();
}

function backspace() {
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function calculateResult() {
    if (operation === null && !currentInput.includes('(')) return;
    
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    try {
        if (operation !== null) {
            switch (operation) {
                case '+': computation = prev + current; break;
                case '-': computation = prev - current; break;
                case '*': computation = prev * current; break;
                case '/': computation = prev / current; break;
                case '%': computation = prev % current; break;
            }
        } else {
            if (currentInput.includes('Math.')) {
                computation = eval(currentInput + ')');
            } else if (currentInput.includes('factorial(')) {
                computation = factorial(parseInt(currentInput.replace('factorial(', '')));
            } else {
                computation = eval(currentInput);
            }
        }
        
        const calculationString = `${previousInput} ${operation || ''} ${currentInput} = ${computation}`;
        addToHistory(calculationString);
        
        document.getElementById('calculationDisplay').textContent = calculationString;
        currentInput = computation.toString();
        operation = null;
        resetScreen = true;
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        updateDisplay();
    }
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

function toggleSign() {
    currentInput = currentInput.startsWith('-') ? currentInput.slice(1) : '-' + currentInput;
    updateDisplay();
}

function memoryAdd() {
    memoryValue += parseFloat(currentInput);
}

function memorySubtract() {
    memoryValue -= parseFloat(currentInput);
}

function memoryRecall() {
    currentInput = memoryValue.toString();
    updateDisplay();
}

function memoryClear() {
    memoryValue = 0;
}

function showModal(modalId) {
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById('modalOverlay').classList.remove('active');
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

function showSettings() {
    showModal('settingsModal');
    toggleNavMenu();
}

function showHistory() {
    showModal('historyModal');
    toggleNavMenu();
}

function showUnitConverter() {
    showModal('unitConverterModal');
    toggleNavMenu();
}

function saveSettings() {
    const displaySize = document.getElementById('displaySize').value;
    const displayBrightness = document.getElementById('displayBrightness').value;
    const buttonSize = document.getElementById('buttonSize').value;
    const buttonRoundness = document.getElementById('buttonRoundness').value;
    const theme = document.getElementById('themeSelect').value;
    
    localStorage.setItem('displaySize', displaySize);
    localStorage.setItem('displayBrightness', displayBrightness);
    localStorage.setItem('buttonSize', buttonSize);
    localStorage.setItem('buttonRoundness', buttonRoundness);
    localStorage.setItem('theme', theme);
    
    applySettings();
    closeModal('settingsModal');
}

function resetSettings() {
    localStorage.removeItem('displaySize');
    localStorage.removeItem('displayBrightness');
    localStorage.removeItem('buttonSize');
    localStorage.removeItem('buttonRoundness');
    localStorage.removeItem('theme');
    
    document.getElementById('displaySize').value = 1;
    document.getElementById('displayBrightness').value = 1;
    document.getElementById('buttonSize').value = 1;
    document.getElementById('buttonRoundness').value = 50;
    document.getElementById('themeSelect').value = 'dark';
    
    applySettings();
}

function loadSettings() {
    const displaySize = localStorage.getItem('displaySize') || 1;
    const displayBrightness = localStorage.getItem('displayBrightness') || 1;
    const buttonSize = localStorage.getItem('buttonSize') || 1;
    const buttonRoundness = localStorage.getItem('buttonRoundness') || 50;
    const theme = localStorage.getItem('theme') || 'dark';
    
    document.getElementById('displaySize').value = displaySize;
    document.getElementById('displayBrightness').value = displayBrightness;
    document.getElementById('buttonSize').value = buttonSize;
    document.getElementById('buttonRoundness').value = buttonRoundness;
    document.getElementById('themeSelect').value = theme;
    
    applySettings();
}

function applySettings() {
    const displaySize = parseFloat(document.getElementById('displaySize').value);
    const displayBrightness = parseFloat(document.getElementById('displayBrightness').value);
    const buttonSize = parseFloat(document.getElementById('buttonSize').value);
    const buttonRoundness = parseInt(document.getElementById('buttonRoundness').value);
    const theme = document.getElementById('themeSelect').value;
    
    document.getElementById('display').style.fontSize = `${2.5 * displaySize}rem`;
    document.getElementById('display').style.filter = `brightness(${displayBrightness})`;
    
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.style.height = `${60 * buttonSize}px`;
        btn.style.fontSize = `${1.5 * buttonSize}rem`;
        btn.style.borderRadius = `${buttonRoundness}%`;
    });
    
    document.body.className = '';
    if (theme === 'light') document.body.classList.add('light-theme');
    if (theme === 'highContrast') document.body.classList.add('high-contrast');
}

function addToHistory(entry) {
    calculationHistory.unshift(entry);
    if (calculationHistory.length > 20) calculationHistory.pop();
    saveHistory();
    updateHistoryDisplay();
}

function clearHistory() {
    calculationHistory = [];
    saveHistory();
    updateHistoryDisplay();
}

function saveHistory() {
    localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
}

function loadHistory() {
    const history = localStorage.getItem('calculationHistory');
    if (history) calculationHistory = JSON.parse(history);
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    calculationHistory.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        item.textContent = entry;
        item.onclick = () => useHistoryEntry(entry);
        historyList.appendChild(item);
    });
}

function useHistoryEntry(entry) {
    const result = entry.split('=')[1].trim();
    currentInput = result;
    updateDisplay();
    closeModal('historyModal');
}

function setupUnitConverter() {
    const converterType = document.getElementById('converterType');
    const converterFrom = document.getElementById('converterFrom');
    const converterTo = document.getElementById('converterTo');
    
    converterType.addEventListener('change', updateUnitOptions);
    updateUnitOptions();
    
    function updateUnitOptions() {
        const type = converterType.value;
        let units = [];
        
        switch (type) {
            case 'length': units = ['meters', 'kilometers', 'centimeters', 'millimeters', 'miles', 'yards', 'feet', 'inches']; break;
            case 'weight': units = ['grams', 'kilograms', 'milligrams', 'pounds', 'ounces']; break;
            case 'temperature': units = ['celsius', 'fahrenheit', 'kelvin']; break;
            case 'area': units = ['square meters', 'square kilometers', 'square miles', 'square feet', 'square inches', 'hectares', 'acres']; break;
            case 'volume': units = ['liters', 'milliliters', 'cubic meters', 'cubic centimeters', 'gallons', 'quarts', 'pints', 'cups']; break;
        }
        
        converterFrom.innerHTML = '';
        converterTo.innerHTML = '';
        
        units.forEach(unit => {
            const option1 = document.createElement('option');
            option1.value = unit;
            option1.textContent = unit;
            converterFrom.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = unit;
            option2.textContent = unit;
            converterTo.appendChild(option2);
        });
        
        if (units.length > 1) converterTo.selectedIndex = 1;
    }
}

function performConversion() {
    const value = parseFloat(document.getElementById('converterValue').value);
    if (isNaN(value)) return;
    
    const type = document.getElementById('converterType').value;
    const fromUnit = document.getElementById('converterFrom').value;
    const toUnit = document.getElementById('converterTo').value;
    
    let result;
    
    switch (type) {
        case 'length': result = convertLength(value, fromUnit, toUnit); break;
        case 'weight': result = convertWeight(value, fromUnit, toUnit); break;
        case 'temperature': result = convertTemperature(value, fromUnit, toUnit); break;
        case 'area': result = convertArea(value, fromUnit, toUnit); break;
        case 'volume': result = convertVolume(value, fromUnit, toUnit); break;
    }
    
    document.getElementById('converterResult').value = result.toFixed(6);
}

function useConverterResult() {
    const result = document.getElementById('converterResult').value;
    if (result) {
        currentInput = result;
        updateDisplay();
        closeModal('unitConverterModal');
    }
}

function convertLength(value, fromUnit, toUnit) {
    const conversions = {
        meters: 1,
        kilometers: 1000,
        centimeters: 0.01,
        millimeters: 0.001,
        miles: 1609.34,
        yards: 0.9144,
        feet: 0.3048,
        inches: 0.0254
    };
    return (value * conversions[fromUnit]) / conversions[toUnit];
}

function convertWeight(value, fromUnit, toUnit) {
    const conversions = {
        grams: 1,
        kilograms: 1000,
        milligrams: 0.001,
        pounds: 453.592,
        ounces: 28.3495
    };
    return (value * conversions[fromUnit]) / conversions[toUnit];
}

function convertTemperature(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;
    
    let celsius;
    switch (fromUnit) {
        case 'celsius': celsius = value; break;
        case 'fahrenheit': celsius = (value - 32) * 5/9; break;
        case 'kelvin': celsius = value - 273.15; break;
    }
    
    switch (toUnit) {
        case 'celsius': return celsius;
        case 'fahrenheit': return celsius * 9/5 + 32;
        case 'kelvin': return celsius + 273.15;
    }
}

function convertArea(value, fromUnit, toUnit) {
    const conversions = {
        'square meters': 1,
        'square kilometers': 1000000,
        'square miles': 2589988.11,
        'square feet': 0.092903,
        'square inches': 0.00064516,
        'hectares': 10000,
        'acres': 4046.86
    };
    return (value * conversions[fromUnit]) / conversions[toUnit];
}

function convertVolume(value, fromUnit, toUnit) {
    const conversions = {
        'liters': 1,
        'milliliters': 0.001,
        'cubic meters': 1000,
        'cubic centimeters': 0.001,
        'gallons': 3.78541,
        'quarts': 0.946353,
        'pints': 0.473176,
        'cups': 0.236588
    };
    return (value * conversions[fromUnit]) / conversions[toUnit];
}
