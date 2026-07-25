// Ambil elemen HTML
const resultDisplay = document.getElementById('result');
const historyDisplay = document.getElementById('history');
const buttons = document.querySelectorAll('.btn');
const themeToggle = document.getElementById('themeToggle');

// State
let currentNumber = '0';
let previousNumber = '';
let currentOperator = null;
let historyText = '';
let isNewNumber = true;
let isResultShown = false;

// Update layar
function updateDisplay() {
    if (!resultDisplay || !historyDisplay) return;
    
    let display = currentNumber;
    if (display.length > 15) {
        display = parseFloat(display).toExponential(6);
    }
    resultDisplay.textContent = display;
    historyDisplay.textContent = historyText;
}

// Masukkan angka
function inputNumber(value) {
    // Kalo baru selesai hitung, reset semua
    if (isResultShown) {
        currentNumber = '0';
        previousNumber = '';
        currentOperator = null;
        historyText = '';
        isResultShown = false;
        isNewNumber = true;
    }
    
    // Kalo ini angka pertama setelah operator, mulai dari 0
    if (isNewNumber) {
        currentNumber = '0';
        isNewNumber = false;
    }
    
    // Cegah titik dobel
    if (value === '.' && currentNumber.includes('.')) return;
    
    // Ganti 0 dengan angka baru, kalo titik tambahin aja
    if (currentNumber === '0' && value !== '.') {
        currentNumber = value;
    } else {
        currentNumber += value;
    }
    
    updateDisplay();
}

// Clear semua
function clearAll() {
    currentNumber = '0';
    previousNumber = '';
    currentOperator = null;
    historyText = '';
    isNewNumber = true;
    isResultShown = false;
    updateDisplay();
}

// Ubah tanda +/-
function toggleSign() {
    if (currentNumber === '0') return;
    if (currentNumber.startsWith('-')) {
        currentNumber = currentNumber.substring(1);
    } else {
        currentNumber = '-' + currentNumber;
    }
    updateDisplay();
}

// Persentase
function percentage() {
    const num = parseFloat(currentNumber);
    if (!isNaN(num)) {
        currentNumber = String(num / 100);
        updateDisplay();
    }
}

// Pilih operator
function chooseOperator(op) {
    // Kalo sebelumnya udah ada operator dan bukan angka baru, hitung dulu
    if (currentOperator !== null && !isNewNumber) {
        calculate();
    }
    
    // Kalo hasil ditampilkan, reset flag
    if (isResultShown) {
        isResultShown = false;
    }
    
    previousNumber = currentNumber;
    currentOperator = op;
    historyText = `${previousNumber} ${op}`;
    isNewNumber = true;
    updateDisplay();
}

// Hitung
function calculate() {
    // Kalo ga ada operator atau lagi di angka baru, skip
    if (currentOperator === null || isNewNumber) return;
    
    const a = parseFloat(previousNumber);
    const b = parseFloat(currentNumber);
    let result;
    
    if (isNaN(a) || isNaN(b)) return;
    
    // Operasi
    switch (currentOperator) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '×': result = a * b; break;
        case '÷': 
            if (b === 0) {
                currentNumber = 'Error';
                updateDisplay();
                return;
            }
            result = a / b; 
            break;
        default: return;
    }
    
    // Tampilkan hasil
    historyText = `${previousNumber} ${currentOperator} ${currentNumber} =`;
    currentNumber = String(result);
    currentOperator = null;
    previousNumber = '';
    isNewNumber = true;
    isResultShown = true;
    updateDisplay();
}

// Event listener tombol
buttons.forEach(btn => {
    btn.addEventListener('click', function() {
        const value = this.dataset.value;
        if (value === undefined) return;
        
        if (value === 'C') {
            clearAll();
        } else if (value === '±') {
            toggleSign();
        } else if (value === '%') {
            percentage();
        } else if (value === '=') {
            calculate();
        } else if (['+', '-', '×', '÷'].includes(value)) {
            chooseOperator(value);
        } else {
            inputNumber(value);
        }
    });
});

// Keyboard support
document.addEventListener('keydown', function(e) {
    const key = e.key;
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        e.preventDefault();
    }
    
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(key)) {
        e.preventDefault();
        inputNumber(key);
    } else if (key === '+') {
        e.preventDefault();
        chooseOperator('+');
    } else if (key === '-') {
        e.preventDefault();
        chooseOperator('-');
    } else if (key === '*') {
        e.preventDefault();
        chooseOperator('×');
    } else if (key === '/') {
        e.preventDefault();
        chooseOperator('÷');
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        e.preventDefault();
        if (currentNumber.length > 1) {
            currentNumber = currentNumber.slice(0, -1);
        } else {
            currentNumber = '0';
        }
        updateDisplay();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        e.preventDefault();
        clearAll();
    } else if (key === '%') {
        e.preventDefault();
        percentage();
    }
});

// Toggle tema
let isDark = true;
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        isDark = !isDark;
        document.body.classList.toggle('light', !isDark);
        this.textContent = isDark ? 'dark' : 'light';
    });
}

// Inisialisasi
updateDisplay();