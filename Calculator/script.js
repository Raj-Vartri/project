let display = document.getElementById('display');

function appendNumber(num) {
  if (display.innerText === '0') display.innerText = '';
  display.innerText += num;
}

function appendOperator(op) {
  const lastChar = display.innerText.slice(-1);
  if ("+-*/".includes(lastChar)) return;
  display.innerText += op;
}

function clearDisplay() {
  display.innerText = '0';
}

function deleteLast() {
  if (display.innerText.length === 1) {
    display.innerText = '0';
  } else {
    display.innerText = display.innerText.slice(0, -1);
  }
}

function calculate() {
  try {
    const result = eval(display.innerText);
    display.innerText = result;
  } catch (e) {
    display.innerText = 'Error';
  }
}

// ===== Keyboard Support =====
document.addEventListener('keydown', function (event) {
  const key = event.key;

  if (!isNaN(key)) {
    appendNumber(key);
  } else if (['+', '-', '*', '/'].includes(key)) {
    appendOperator(key);
  } else if (key === 'Enter' || key === '=') {
    calculate();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key.toLowerCase() === 'c') {
    clearDisplay();
  } else if (key === '.') {
    appendNumber('.');
  }
});
