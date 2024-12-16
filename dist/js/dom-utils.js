// DOM utility functions for ProKeys
// These functions are designed to be Manifest V3 compatible

import { getHTML } from './textmethods';
import { getNodeWindow } from './pre';

/**
 * Gets the coordinates of the caret in any editable element
 * @param {Element} node - The node to get caret coordinates from
 * @returns {Object} - {left, top} coordinates
 */
export function getCaretCoordinates(node) {
    if (!node) return { left: 0, top: 0 };

    if (node.tagName === 'TEXTAREA' || node.tagName === 'INPUT') {
        const rect = node.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(node);
        const lineHeight = parseInt(computedStyle.lineHeight);
        const paddingTop = parseInt(computedStyle.paddingTop);
        const paddingLeft = parseInt(computedStyle.paddingLeft);

        let coords = {
            left: rect.left + paddingLeft,
            top: rect.top + paddingTop
        };

        if (node.tagName === 'TEXTAREA') {
            const text = node.value;
            const lines = text.substr(0, node.selectionStart).split('\n');
            coords.top += (lines.length - 1) * lineHeight;
        }

        return coords;
    } 
    
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top
        };
    }

    return { left: 0, top: 0 };
}

/**
 * Checks if an element is visible in the viewport
 * @param {Element} element - The element to check
 * @returns {boolean} - Whether the element is visible
 */
export function isElementVisible(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           rect.width > 0 && 
           rect.height > 0;
}

/**
 * Sets the caret position at the end of a node
 * @param {Element} node - The node to set caret in
 * @param {number} pos - The position to set caret at
 */
export function setCaretAtEndOf(node, pos) {
    if (!node) return;

    if (node.isContentEditable) {
        const win = getNodeWindow(node);
        const sel = win.getSelection();
        const range = document.createRange();
        
        range.selectNodeContents(node);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (node.tagName === 'TEXTAREA' || node.tagName === 'INPUT') {
        node.selectionEnd = node.selectionStart = pos || node.value.length;
    }
}

/**
 * Gets the character following the caret
 * @param {Element} node - The node to check
 * @returns {string} - The character following the caret
 */
export function getCharFollowingCaret(node) {
    if (!node) return '';

    if (node.isContentEditable) {
        const win = getNodeWindow(node);
        const sel = win.getSelection();
        const range = sel.getRangeAt(0);
        const caretPos = range.startOffset;
        let container = range.startContainer;
        let text = getHTML(container);

        if (caretPos < text.length) {
            return text[caretPos];
        }

        container = range.startContainer.nextSibling;
        if (container) {
            text = getHTML(container);
            if (text.length !== 0) {
                return text[0];
            }
        }

        return '';
    }
    
    return node.value[node.selectionStart] || '';
}

/**
 * Finds a text node containing specific content
 * @param {Node} node - The root node to search in
 * @param {string} searchText - The text to search for
 * @returns {Node|null} - The text node containing the content
 */
export function findTextNodeWithContent(node, searchText) {
    if (!node || !searchText) return null;

    const walker = document.createTreeWalker(
        node,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                return node.textContent.includes(searchText) ? 
                    NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
        }
    );
    
    return walker.nextNode();
}

/**
 * Gets the text node at a specific offset
 * @param {Node} root - The root node to search in
 * @param {number} targetOffset - The target offset
 * @returns {Object|null} - {node, offset} or null
 */
export function getTextNodeAtOffset(root, targetOffset) {
    if (!root || targetOffset < 0) return null;

    let currentOffset = 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;

    while ((node = walker.nextNode())) {
        const length = node.textContent.length;
        if (currentOffset + length >= targetOffset) {
            return {
                node: node,
                offset: targetOffset - currentOffset
            };
        }
        currentOffset += length;
    }

    return null;
}

function findTextNodeAtPosition(root, targetOffset) {
    console.log('Finding text node at position:', { targetOffset });
    
    // Get all text nodes and their positions
    const textNodes = [];
    let totalLength = 0;
    
    // Only apply rich text offset once at the beginning
    const isRichText = root.isContentEditable;
    const richTextOffset = isRichText ? 2 : 0;
    const adjustedTargetOffset = Math.max(0, targetOffset - richTextOffset);
    
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    // First pass: collect all text nodes and their absolute positions
    let node;
    while ((node = walker.nextNode())) {
        const nodeText = node.textContent;
        textNodes.push({
            node,
            start: totalLength,
            length: nodeText.length,
            text: nodeText,
            isPlaceholder: /%[^%]+%/.test(nodeText)
        });
        totalLength += nodeText.length;
    }
    
    console.log('Text nodes found:', textNodes.map(n => ({
        text: n.text,
        start: n.start,
        length: n.length,
        isPlaceholder: n.isPlaceholder
    })));
    
    console.log('Using offset:', { adjustedTargetOffset, richTextOffset });
    
    // Find the node containing our target position
    for (let i = 0; i < textNodes.length; i++) {
        const nodeInfo = textNodes[i];
        const nodeStart = nodeInfo.start;
        const nodeEnd = nodeStart + nodeInfo.length;
        
        if (nodeStart <= adjustedTargetOffset && nodeEnd > adjustedTargetOffset) {
            // Calculate offset within this specific node
            let nodeOffset = adjustedTargetOffset - nodeStart;
            
            // If this is a placeholder node, ensure we select the whole placeholder
            if (nodeInfo.isPlaceholder) {
                const placeholderMatch = nodeInfo.text.match(/%[^%]+%/);
                if (placeholderMatch) {
                    const placeholderStart = nodeInfo.text.indexOf(placeholderMatch[0]);
                    const placeholderEnd = placeholderStart + placeholderMatch[0].length;
                    
                    // If we're inside a placeholder, adjust to select the whole thing
                    if (nodeOffset >= placeholderStart && nodeOffset <= placeholderEnd) {
                        nodeOffset = placeholderStart;
                    }
                }
            }
            
            const result = {
                node: nodeInfo.node,
                offset: nodeOffset
            };
            
            console.log('Found target node:', {
                nodeText: nodeInfo.text,
                adjustedTargetOffset,
                nodeStart,
                resultOffset: result.offset,
                richTextOffset,
                isPlaceholder: nodeInfo.isPlaceholder
            });
            
            return result;
        }
    }
    
    // If we couldn't find the exact position, return the last text node
    if (textNodes.length > 0) {
        const lastNode = textNodes[textNodes.length - 1];
        return {
            node: lastNode.node,
            offset: lastNode.length
        };
    }
    
    return null;
}

export function selectTextInNode(node, start, length) {
    try {
        console.log('Selecting text in node:', { node, start, length });
        if (!node) {
            console.error('No node provided for text selection');
            return;
        }

        // Handle plain text inputs (textarea/input)
        if (node.tagName === 'TEXTAREA' || (node.tagName === 'INPUT' && node.type === 'text')) {
            console.log('Handling plain text input selection');
            const textLength = node.value.length;
            const safeStart = Math.min(Math.max(0, start), textLength);
            const safeEnd = Math.min(safeStart + length, textLength);
            
            node.focus();
            node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            setTimeout(() => {
                try {
                    node.setSelectionRange(safeStart, safeEnd);
                    node.blur();
                    node.focus();
                    console.log('Set selection range:', { start: safeStart, end: safeEnd });
                } catch (err) {
                    console.error('Error setting selection range:', err);
                }
            }, 0);
            
            return;
        }

        // Handle contentEditable nodes
        const win = getNodeWindow(node);
        const sel = win.getSelection();
        const range = document.createRange();

        // Find start position
        const startPos = findTextNodeAtPosition(node, start);
        if (!startPos) {
            console.error('Could not find start text node for selection');
            return;
        }

        // For the end position, we'll use the start node if it contains the whole placeholder
        const startNodeLength = startPos.node.textContent.length;
        if (startNodeLength >= length && startPos.node.textContent.includes('%')) {
            // If the start node contains the whole placeholder, use it for both start and end
            range.setStart(startPos.node, startPos.offset);
            range.setEnd(startPos.node, startPos.offset + length);
        } else {
            // Otherwise find the end node
            const endPos = findTextNodeAtPosition(node, start + length);
            if (!endPos) {
                console.error('Could not find end text node for selection');
                return;
            }
            range.setStart(startPos.node, startPos.offset);
            range.setEnd(endPos.node, endPos.offset);
        }

        console.log('Setting range:', {
            startNode: startPos.node.textContent,
            startOffset: startPos.offset,
            endNode: range.endContainer.textContent,
            endOffset: range.endOffset
        });

        // Update selection
        sel.removeAllRanges();
        sel.addRange(range);

        // Ensure the selection is visible
        const endElement = range.endContainer.parentElement;
        if (endElement) {
            endElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

    } catch (error) {
        console.error('Error in selectTextInNode:', error);
    }
}
