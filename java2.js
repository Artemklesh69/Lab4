function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

function isDigit(str) {
    return /^\d{1}$/.test(str);
}

function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}


function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if(lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}


function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length-1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}


function evaluate(str) {
    const tokens = str.split(' ');
    const stack = [];

    for (const token of tokens) {
        if (isNumeric(token)) {
            stack.push(parseFloat(token));
        } else if (isOperation(token)) {
            const operand2 = stack.pop();
            const operand1 = stack.pop();

            switch (token) {
                case '+':
                    stack.push(operand1 + operand2);
                    break;
                case '-':
                    stack.push(operand1 - operand2);
                    break;
                case '*':
                    stack.push(operand1 * operand2);
                    break;
                case '/':
                    stack.push(operand1 / operand2);
                    break;
            }
        }
    }

    return stack.pop().toFixed(2);
}


let isResultCalculated = false;

function clickHandler(event) {
    const screen = document.querySelector('.screen span');
    const classList = event.target.classList;

    if (classList.contains('digit')) {
        if (isResultCalculated) {
            screen.textContent = event.target.textContent;
            isResultCalculated = false;
        } else {
            screen.textContent += event.target.textContent;
        }
    } else if (classList.contains('operation') || classList.contains('bracket')) {
        screen.textContent += event.target.textContent;
        isResultCalculated = false;
    } else if (classList.contains('clear')) {
        screen.textContent = '';
        isResultCalculated = false;
    } else if (classList.contains('result')) {
        const expression = screen.textContent;
        const postfixExpression = compile(expression);
        const result = evaluate(postfixExpression);
        screen.textContent = result;
        isResultCalculated = true;
    }
}

window.onload = function () {
    document.getElementById('calculator').addEventListener('click', clickHandler);
}