/* global Data */

import { Snip } from "./snippetClasses";
import { triggerFakeInput } from "./pre";

/**
 * Process a list of snippets to find a match
 * @param {Array} snippetsList - List of snippets to search through
 * @param {string} searchText - Text to match against snippets
 * @returns {Object} Object containing found status and matching snippet
 */
export function findMatchingSnippet(snippetsList, searchText) {
    let found = false;
    let matchingSnip = null;

    const processSnippets = (items) => {
        items.forEach(item => {
            if (Array.isArray(item)) {
                if (item.length <= 2 && item[0] === searchText) {
                    matchingSnip = new Snip(item[0], item[1] || "", item[1]);
                    found = true;
                } else if (item.length > 2) {
                    processSnippets(item.slice(2));
                }
            } else if (item && typeof item === 'object') {
                if (item.type === 'folder' && item.list) {
                    processSnippets(item.list);
                } else if (item.name === searchText) {
                    matchingSnip = new Snip(item.name, item.body, item.timestamp);
                    found = true;
                }
            }
        });
    };

    processSnippets(snippetsList);
    return { found, matchingSnip };
}

/**
 * Find a snippet match from text before the cursor
 * @param {string} textBeforeCursor - Text content before cursor position
 * @returns {Object} Object containing match information
 */
export function findSnippetMatch(textBeforeCursor) {
    const match = textBeforeCursor.match(/\S+$/);
    if (!match) return { found: false };

    const testText = match[0];
    const snippetsList = Array.isArray(Data.snippets) ? Data.snippets.slice(2) : Data.snippets.list;
    
    return findMatchingSnippet(snippetsList, testText);
}

/**
 * Insert a snippet into a contenteditable node
 * @param {HTMLElement} node - The contenteditable node
 * @param {string} textBeforeCursor - Text before cursor position
 * @returns {boolean} Whether insertion was successful
 */
export function insertSnippetInContentEditable(node, textBeforeCursor) {
    const win = node.ownerDocument.defaultView || node.ownerDocument.parentWindow;
    const sel = win.getSelection();
    if (!sel.rangeCount) return false;
    
    const range = sel.getRangeAt(0);
    const container = range.startContainer;
    
    // Get the actual contentEditable container
    let editableNode = container;
    while (editableNode && !editableNode.isContentEditable) {
        editableNode = editableNode.parentNode;
    }
    
    if (!editableNode) return false;

    const { found, matchingSnip } = findSnippetMatch(textBeforeCursor);
    if (!found || !matchingSnip) return false;

    // Delete the snippet text
    range.setStart(range.startContainer, range.startOffset - matchingSnip.name.length);
    range.deleteContents();
    
    // Insert the snippet
    window.insertSnippetInContentEditableNode(editableNode, matchingSnip);
    return true;
}

/**
 * Insert a snippet into a regular input field
 * @param {HTMLInputElement|HTMLTextAreaElement} node - The input node
 * @param {string} textBeforeCursor - Text before cursor position
 * @returns {boolean} Whether insertion was successful
 */
export function insertSnippetInInput(node, textBeforeCursor) {
    const { found, matchingSnip } = findSnippetMatch(textBeforeCursor);
    if (!found || !matchingSnip) return false;

    // Delete the snippet text
    const cursorPosition = node.selectionStart;
    const start = cursorPosition - matchingSnip.name.length;
    const textBefore = node.value.substring(0, start);
    const textAfter = node.value.substring(cursorPosition);
    node.value = textBefore + textAfter;
    node.selectionStart = node.selectionEnd = start;
    
    // Insert the snippet
    window.insertSnippet(node, matchingSnip);
    return true;
}

/**
 * Get text before cursor in any type of node
 * @param {HTMLElement} node - The input node
 * @param {Range} [range] - Optional range for contenteditable nodes
 * @returns {string} Text before cursor
 */
export function getTextBeforeCursor(node, range = null) {
    if (node.isContentEditable) {
        if (!range) {
            const sel = window.getSelection();
            if (!sel.rangeCount) return '';
            range = sel.getRangeAt(0);
        }
        const text = node.textContent;
        const cursorPosition = range.startOffset;
        return text.substring(Math.max(0, cursorPosition - 50), cursorPosition);
    } else {
        const cursorPosition = node.selectionStart;
        return node.value.substring(Math.max(0, cursorPosition - 50), cursorPosition);
    }
}

/**
 * Process a snippet insertion request
 * @param {HTMLElement} node - The target node
 * @param {Event} event - The triggering event
 * @returns {boolean} Whether the snippet was inserted
 */
export function processSnippetInsertion(node, event) {
    const textBeforeCursor = getTextBeforeCursor(node);
    
    if (node.isContentEditable) {
        return insertSnippetInContentEditable(node, textBeforeCursor);
    } else {
        return insertSnippetInInput(node, textBeforeCursor);
    }
}
