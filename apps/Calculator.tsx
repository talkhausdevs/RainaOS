import React, { useState } from 'react';

type Operator = '+' | '-' | '×' | '÷';

export const CalculatorApp: React.FC = () => {
    const [display, setDisplay] = useState('0');
    const [currentValue, setCurrentValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<Operator | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const inputDigit = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
            return;
        }
        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const performOperation = (nextOperator: Operator) => {
        const inputValue = parseFloat(display);
        if (currentValue === null) {
            setCurrentValue(inputValue);
        } else if (operator) {
            const result = calculate(currentValue, inputValue, operator);
            setCurrentValue(result);
            setDisplay(String(result));
        }
        setWaitingForOperand(true);
        setOperator(nextOperator);
    };

    const calculate = (firstOperand: number, secondOperand: number, op: Operator): number => {
        switch (op) {
            case '+': return firstOperand + secondOperand;
            case '-': return firstOperand - secondOperand;
            case '×': return firstOperand * secondOperand;
            case '÷': return firstOperand / secondOperand;
            default: return secondOperand;
        }
    };

    const handleEquals = () => {
        const inputValue = parseFloat(display);
        if (operator && currentValue !== null) {
            const result = calculate(currentValue, inputValue, operator);
            setCurrentValue(result);
            setDisplay(String(result));
            setOperator(null);
            setWaitingForOperand(true);
        }
    };

    const clearAll = () => {
        setDisplay('0');
        setCurrentValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };
    
    const toggleSign = () => {
        setDisplay(String(parseFloat(display) * -1));
    };
    
    const inputPercent = () => {
        setDisplay(String(parseFloat(display) / 100));
    }

    const buttons = [
        { label: 'AC', handler: clearAll, className: 'bg-gray-400' },
        { label: '+/-', handler: toggleSign, className: 'bg-gray-400' },
        { label: '%', handler: inputPercent, className: 'bg-gray-400' },
        { label: '÷', handler: () => performOperation('÷'), className: 'bg-orange-500 text-white' },
        { label: '7', handler: () => inputDigit('7'), className: 'bg-gray-700 text-white' },
        { label: '8', handler: () => inputDigit('8'), className: 'bg-gray-700 text-white' },
        { label: '9', handler: () => inputDigit('9'), className: 'bg-gray-700 text-white' },
        { label: '×', handler: () => performOperation('×'), className: 'bg-orange-500 text-white' },
        { label: '4', handler: () => inputDigit('4'), className: 'bg-gray-700 text-white' },
        { label: '5', handler: () => inputDigit('5'), className: 'bg-gray-700 text-white' },
        { label: '6', handler: () => inputDigit('6'), className: 'bg-gray-700 text-white' },
        { label: '-', handler: () => performOperation('-'), className: 'bg-orange-500 text-white' },
        { label: '1', handler: () => inputDigit('1'), className: 'bg-gray-700 text-white' },
        { label: '2', handler: () => inputDigit('2'), className: 'bg-gray-700 text-white' },
        { label: '3', handler: () => inputDigit('3'), className: 'bg-gray-700 text-white' },
        { label: '+', handler: () => performOperation('+'), className: 'bg-orange-500 text-white' },
        { label: '0', handler: () => inputDigit('0'), className: 'col-span-2 bg-gray-700 text-white' },
        { label: '.', handler: inputDecimal, className: 'bg-gray-700 text-white' },
        { label: '=', handler: handleEquals, className: 'bg-orange-500 text-white' },
    ];
    
    return (
        <div className="w-full h-full flex flex-col bg-black">
            <div className="flex-1 flex items-end justify-end p-4">
                <h1 className="text-white text-7xl font-light">{display}</h1>
            </div>
            <div className="grid grid-cols-4 gap-px">
                {buttons.map((btn) => (
                    <button key={btn.label} onClick={btn.handler} className={`text-3xl h-20 active:opacity-75 ${btn.className}`}>
                        {btn.label}
                    </button>
                ))}
            </div>
        </div>
    );
};