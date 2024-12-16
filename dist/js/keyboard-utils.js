// Keyboard utility functions for ProKeys
// These functions are designed to be Manifest V3 compatible

import { getModifierStates, shouldHandleHotkey } from './state-manager';

/**
 * Checks if a keyboard event is not a meta key (Ctrl, Alt, etc.)
 * @param {KeyboardEvent} event - The keyboard event to check
 * @returns {boolean} - Whether the key is not a meta key
 */
export function isNotMetaKey(event) {
    return !(event.ctrlKey || event.altKey || event.metaKey);
}

/**
 * Checks if a key event matches the configured hotkey
 * @param {KeyboardEvent} event - The keyboard event
 * @returns {boolean} - Whether the key matches the hotkey
 */
export function isHotkeyPressed(event) {
    return shouldHandleHotkey(event);
}

/**
 * Checks if a key event is a snippet substitution key
 * @param {KeyboardEvent} event - The keyboard event
 * @param {number} keyCode - The key code
 * @param {string} key - The key value
 * @returns {boolean} - Whether the key is a snippet substitution key
 */
export function isSnippetSubstitutionKey(event, keyCode, key) {
    // Don't treat Enter as a substitution key for plain text inputs
    if (keyCode === 13 && (event.target.nodeName === 'TEXTAREA' || event.target.nodeName === 'INPUT')) {
        return false;
    }
    
    // Only treat Enter as a substitution key in rich text when in dot mode
    if (keyCode === 13 && event.target.isContentEditable && (!window.isDotMode || !window.Data.dotPhrasesEnabled)) {
        return false;
    }
    
    // Only treat space as a substitution key in dot mode
    if (keyCode === 32 && (!window.isDotMode || !window.Data.dotPhrasesEnabled)) {
        return false;
    }

    const modifierStates = getModifierStates();
    
    return (
        (keyCode === 32 || // Space (only in dot mode)
        keyCode === 13 || // Enter (only for contentEditable in dot mode)
        keyCode === 9) && // Tab
        isNotMetaKey(event) &&
        !modifierStates.shiftKey && 
        !shouldHandleHotkey(event) // Don't treat hotkey as snippet substitution
    );
}

/**
 * Checks if a node is usable for ProKeys functionality
 * @param {Element} node - The node to check
 * @returns {boolean} - Whether the node is usable
 */
export function isUsableNode(node) {
    if (!node || !node.tagName) return false;

    const tagName = node.tagName.toLowerCase();
    const type = (node.type || '').toLowerCase();
    const allowedInputTypes = ['text', 'search', 'tel', 'url', 'email'];

    // Check if node is cached as unusable
    if (node.dataset && node.dataset.prokeysUsable === 'false') {
        return false;
    }

    // Handle input elements
    if (tagName === 'input') {
        const isUsable = allowedInputTypes.includes(type);
        if (node.dataset) {
            node.dataset.prokeysUsable = isUsable.toString();
        }
        return isUsable;
    }

    // Handle textarea and contenteditable
    if (tagName === 'textarea' || node.isContentEditable) {
        if (node.dataset) {
            node.dataset.prokeysUsable = 'true';
        }
        return true;
    }

    // Cache result for other elements
    if (node.dataset) {
        node.dataset.prokeysUsable = 'false';
    }
    return false;
}

/**
 * Attaches a keyboard event handler to the document
 * @param {Function} handler - The event handler function
 * @returns {Function} - The event handler function bound to the document
 */
export function keyEventAttacher(handler) {
    return function(event) {
        if (!event || !event.target) return;
        handler.call(this, event);
    };
}

/**
 * Inserts a tab character at the current caret position
 * @param {Element} node - The node to insert the tab in
 */
export function insertTabChar(node) {
    if (!node) return;
    
    if (node.isContentEditable) {
        document.execCommand('insertText', false, '\t');
    } else {
        const start = node.selectionStart;
        const end = node.selectionEnd;
        node.value = node.value.substring(0, start) + '\t' + node.value.substring(end);
        node.selectionStart = node.selectionEnd = start + 1;
    }
}

/**
 * Shifts the caret position by a specified count
 * @param {Element} node - The node to shift caret in
 * @param {number} shiftCount - The number of positions to shift
 */
export function shiftCaretByCount(node, shiftCount) {
    if (!node || typeof shiftCount !== 'number') return;

    if (node.isContentEditable) {
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        const textNode = range.startContainer;
        
        if (textNode.nodeType === Node.TEXT_NODE) {
            const newOffset = Math.min(
                Math.max(0, range.startOffset + shiftCount),
                textNode.length
            );
            range.setStart(textNode, newOffset);
            range.setEnd(textNode, newOffset);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else {
        const newPos = Math.min(
            Math.max(0, node.selectionStart + shiftCount),
            node.value.length
        );
        node.selectionStart = node.selectionEnd = newPos;
    }
}
