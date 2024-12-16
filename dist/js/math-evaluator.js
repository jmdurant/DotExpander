/* global Data */

/**
 * Evaluates a mathematical expression string
 * @param {string} expression - The mathematical expression to evaluate
 * @returns {string|null} The result of the evaluation or null if invalid
 */
export function evaluateMathExpression(expression) {
    try {
        // Remove any whitespace and validate characters
        expression = expression.replace(/\s/g, '');
        if (!/^[0-9+\-*/.()]+$/.test(expression)) {
            return null;
        }

        // Validate parentheses
        let parenCount = 0;
        for (let char of expression) {
            if (char === '(') parenCount++;
            if (char === ')') parenCount--;
            if (parenCount < 0) return null;
        }
        if (parenCount !== 0) return null;

        // Check for invalid mathematical operations
        if (/[+\-*/.]{2,}/.test(expression) || 
            /^[*/.)]/.test(expression) || 
            /[+\-*/.(]$/.test(expression)) {
            return null;
        }

        // Evaluate the expression
        const result = Function('"use strict";return (' + expression + ')')();
        
        // Format the result
        if (isNaN(result) || !isFinite(result)) return null;
        return result.toString();
    } catch (e) {
        console.error('Error evaluating expression:', e);
        return null;
    }
}

/**
 * Evaluates expressions within double brackets
 * @param {string} wholeValue - The entire text content
 * @param {number} startOfText - Starting position of the text
 * @param {number} endOfText - Ending position of the text
 * @returns {Object} Object containing the evaluated text and new caret position
 */
export function evaluateDoubleBrackets(wholeValue, startOfText, endOfText) {
    // Get the text between double brackets
    const text = wholeValue.substring(startOfText, endOfText);
    const equalPos = text.indexOf('=');
    
    if (equalPos === -1) {
        return {
            text: wholeValue,
            caretPosition: endOfText
        };
    }

    const expression = text.substring(equalPos + 1);
    const result = evaluateMathExpression(expression);

    if (result === null) {
        return {
            text: wholeValue,
            caretPosition: endOfText
        };
    }

    // Replace the expression with its result
    const newText = wholeValue.substring(0, startOfText + equalPos + 1) + 
                   result + 
                   wholeValue.substring(endOfText);
    
    return {
        text: newText,
        caretPosition: startOfText + equalPos + 1 + result.length
    };
}

/**
 * Handles the evaluation of expressions in double brackets when triggered
 * @param {HTMLElement} node - The DOM node containing the text
 * @param {Window} win - The window object
 * @returns {boolean} Whether the evaluation was performed
 */
export function provideDoubleBracketFunctionality(node, win) {
    const selection = win.getSelection();
    if (!selection.rangeCount) return false;

    const range = selection.getRangeAt(0);
    const textNode = range.startContainer;
    
    if (!textNode || textNode.nodeType !== 3) return false;

    const text = textNode.textContent;
    const cursorPosition = range.startOffset;
    
    // Look for double brackets before the cursor
    let startPos = cursorPosition - 1;
    let bracketCount = 0;
    
    while (startPos >= 0 && bracketCount < 2) {
        if (text[startPos] === '[') bracketCount++;
        startPos--;
    }
    
    if (bracketCount !== 2) return false;
    startPos += 2;

    // Look for closing brackets
    let endPos = cursorPosition;
    bracketCount = 0;
    
    while (endPos < text.length && bracketCount < 2) {
        if (text[endPos] === ']') bracketCount++;
        endPos++;
    }
    
    if (bracketCount !== 2) return false;
    endPos -= 2;

    // Evaluate the expression
    const result = evaluateDoubleBrackets(text, startPos, endPos);
    
    if (result.text === text) return false;

    // Update the text node
    textNode.textContent = result.text;
    
    // Update cursor position
    range.setStart(textNode, result.caretPosition);
    range.setEnd(textNode, result.caretPosition);
    selection.removeAllRanges();
    selection.addRange(range);
    
    return true;
}
