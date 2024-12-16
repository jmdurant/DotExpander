// Placeholder state management
let Placeholder = {
    mode: false,
    fromIndex: -1,
    toIndex: -1,
    selectionLength: 0,
    justSelected: false,
    node: null,
    isCENode: false,
    array: [],
    currentIndex: -1
};

/**
 * Reset placeholder state
 */
function resetPlaceholderState() {
    Placeholder.mode = false;
    Placeholder.fromIndex = -1;
    Placeholder.toIndex = -1;
    Placeholder.selectionLength = 0;
    Placeholder.justSelected = false;
    Placeholder.node = null;
    Placeholder.isCENode = false;
    Placeholder.array = [];
    Placeholder.currentIndex = -1;
}

/**
 * Test for placeholder presence in a node's content
 * @param {HTMLElement} node - The node to check for placeholders
 * @param {string} content - The content to check
 * @param {number} startPosition - Starting position in the text
 */
function testPlaceholderPresence(node, content, startPosition) {
    console.log('Testing for placeholders:', { 
        nodeType: node.nodeType,
        nodeName: node.nodeName,
        isContentEditable: node.isContentEditable,
        classes: node.className,
        content: content,
        startPosition
    });

    // Reset placeholder state
    window.resetPlaceholderState();
    
    // Set initial state
    window.Placeholder.node = node;
    window.Placeholder.isCENode = node.isContentEditable;
    window.Placeholder.fromIndex = startPosition;

    let placeholders = findPlaceholders(content);
    console.log('Found placeholders:', placeholders);

    if (placeholders.length === 0) {
        return;
    }

    // Set up placeholder handling
    window.Placeholder.mode = true;
    window.Placeholder.array = placeholders;
    window.Placeholder.currentIndex = 0;

    // Attempt to select the first placeholder
    console.log('Attempting to select first placeholder:', {
        placeholders,
        currentIndex: window.Placeholder.currentIndex
    });

    const firstPlaceholder = placeholders[0];
    const placeholderText = typeof firstPlaceholder === 'string' ? firstPlaceholder : firstPlaceholder.text;
    
    // For contenteditable nodes
    if (window.Placeholder.isCENode) {
        // Find text nodes recursively
        function findTextNodes(node) {
            let textNodes = [];
            if (node.nodeType === 3) {
                textNodes.push(node);
            } else {
                const children = node.childNodes;
                for (let i = 0; i < children.length; i++) {
                    textNodes = textNodes.concat(findTextNodes(children[i]));
                }
            }
            return textNodes;
        }

        const textNodes = findTextNodes(node);
        
        // Find the text node containing the first placeholder
        for (let textNode of textNodes) {
            const text = textNode.textContent;
            const placeholderIndex = text.indexOf(placeholderText);
            
            if (placeholderIndex !== -1) {
                const range = document.createRange();
                range.setStart(textNode, placeholderIndex);
                range.setEnd(textNode, placeholderIndex + placeholderText.length);
                
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
                
                window.Placeholder.justSelected = true;
                break;
            }
        }
    } else {
        // For input/textarea nodes
        const content = node.value;
        const placeholderStart = content.indexOf(placeholderText);
        
        if (placeholderStart !== -1) {
            node.setSelectionRange(placeholderStart, placeholderStart + placeholderText.length);
            window.Placeholder.justSelected = true;
        }
    }
}

/**
 * Find all placeholders in content
 * @param {string} content - Content to search for placeholders
 * @returns {Array} Array of placeholder objects with start and end positions
 */
function findPlaceholders(content) {
    const placeholders = [];
    // Updated regex to properly capture full placeholders
    const regex = /%[^%\s]+%/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
        placeholders.push({
            text: match[0],
            start: match.index,
            end: match.index + match[0].length
        });
    }

    return placeholders;
}

/**
 * Select a placeholder in the node
 * @param {Object} placeholder - Placeholder object with text and position info
 * @param {HTMLElement} node - Node containing the placeholder
 */
function selectPlaceholder(placeholder, node) {
    if (node.isContentEditable) {
        selectPlaceholderInContentEditable(placeholder, node);
    } else {
        selectPlaceholderInTextInput(placeholder, node);
    }
}

/**
 * Select placeholder in a contenteditable node
 * @param {Object} placeholder - Placeholder object
 * @param {HTMLElement} node - ContentEditable node
 */
function selectPlaceholderInContentEditable(placeholder, node) {
    console.log('Attempting to select placeholder:', {
        placeholder,
        nodeContent: node.innerHTML
    });

    // Find the text node containing the placeholder
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let currentNode;
    let found = false;
    let firstPlaceholderNode = null;
    let firstPlaceholderIndex = -1;
    let firstPlaceholderText = null;
    
    // First pass - find the earliest occurrence of any placeholder
    while (currentNode = walker.nextNode()) {
        const nodeText = currentNode.textContent;
        console.log('Checking text node:', {
            nodeText,
            parentNode: currentNode.parentNode.nodeName,
            nodeType: currentNode.nodeType
        });
        
        // Look for any placeholder pattern
        const match = nodeText.match(/%[^%\s]+%/);
        if (match && (!firstPlaceholderNode || firstPlaceholderIndex === -1)) {
            firstPlaceholderNode = currentNode;
            firstPlaceholderIndex = match.index;
            firstPlaceholderText = match[0];
            console.log('Found first placeholder:', {
                text: firstPlaceholderText,
                node: firstPlaceholderNode,
                index: firstPlaceholderIndex
            });
            break; // Stop at first match
        }
    }
    
    if (firstPlaceholderNode && firstPlaceholderIndex !== -1) {
        try {
            // Create a new range specifically for the placeholder
            const placeholderRange = document.createRange();
            placeholderRange.setStart(firstPlaceholderNode, firstPlaceholderIndex);
            placeholderRange.setEnd(firstPlaceholderNode, firstPlaceholderIndex + firstPlaceholderText.length);
            
            // Update selection without modifying content
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(placeholderRange);
            
            // Update placeholder state
            Placeholder.selectionLength = firstPlaceholderText.length;
            Placeholder.justSelected = true;
            
            found = true;
            console.log('Successfully set selection to first placeholder');
        } catch (e) {
            console.error('Error setting selection:', e);
        }
    }

    if (!found) {
        console.warn('Could not find any placeholders in text nodes:', {
            placeholder,
            htmlContent: node.innerHTML
        });
    }
}

/**
 * Select placeholder in a text input or textarea
 * @param {Object} placeholder - Placeholder object
 * @param {HTMLElement} node - Input node
 */
function selectPlaceholderInTextInput(placeholder, node) {
    // Check if node is an input/textarea element
    if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) {
        node.selectionStart = placeholder.start;
        node.selectionEnd = placeholder.end;
        node.focus();
    } else if (node.isContentEditable) {
        // If it's a contenteditable node, use the contenteditable selection method
        selectPlaceholderInContentEditable(placeholder, node);
    } else {
        console.warn('Node is neither input/textarea nor contenteditable:', node);
    }
}

/**
 * Update placeholder state after text changes
 * @param {number} toIndexIncrease - Amount to adjust the toIndex by
 */
function updatePlaceholderState(toIndexIncrease) {
    if (!Placeholder.isCENode && Placeholder.mode) {
        const caretPos = Placeholder.node.selectionStart;

        if (caretPos >= Placeholder.fromIndex && caretPos <= Placeholder.toIndex) {
            if (Placeholder.justSelected) {
                Placeholder.justSelected = false;
                toIndexIncrease -= Placeholder.selectionLength;
            }
            Placeholder.toIndex += toIndexIncrease;
        }
    }
}

/**
 * Prepare snippet body for insertion
 * @param {string|object} body - The raw snippet body
 * @returns {string} - Prepared snippet body
 */
function prepareSnippetBody(body) {
    // If body is an object with a body property, use that
    if (typeof body === 'object' && body.body) {
        body = body.body;
    }

    try {
        // Try to parse as JSON first in case it's a table or special format
        const parsed = JSON.parse(body);
        
        // Handle table snippets
        if (parsed.type === 'quill-table-content' && parsed.html) {
            // Add default table styling if not present
            let html = parsed.html.trim();
            if (!html.includes('style=')) {
                html = html.replace('<table', '<table style="border-collapse: collapse; width: 100%;"');
            }
            if (!html.includes('td style=')) {
                html = html.replace(/<td/g, '<td style="border: 1px solid #ccc; padding: 8px;"');
            }
            if (!html.includes('th style=')) {
                html = html.replace(/<th/g, '<th style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"');
            }
            
            // Remove any newlines and extra spaces from the HTML
            html = html.replace(/[\n\r\s]+/g, ' ').trim();
            
            // If there are Quill ops, completely remove any newline operations
            if (parsed.ops) {
                const filteredOps = [];
                let skipNext = false;
                
                for (let i = 0; i < parsed.ops.length; i++) {
                    const op = parsed.ops[i];
                    // Skip this op if marked by previous iteration
                    if (skipNext) {
                        skipNext = false;
                        continue;
                    }
                    
                    // Check if this is a newline op
                    if (op.insert && typeof op.insert === 'string' && op.insert.trim() === '') {
                        // If next op is also a newline, skip both
                        if (i < parsed.ops.length - 1 && 
                            parsed.ops[i + 1].insert && 
                            parsed.ops[i + 1].insert.trim() === '') {
                            skipNext = true;
                            continue;
                        }
                    }
                    
                    filteredOps.push(op);
                }
                
                parsed.ops = filteredOps;
            }
            
            return html;
        }
        
        // If it's just a Quill delta without table
        if (parsed.ops) {
            const ops = parsed.ops.filter(op => {
                // Keep all non-empty inserts
                if (op.insert && typeof op.insert === 'string') {
                    return op.insert.trim() !== '';
                }
                return true;
            });
            parsed.ops = ops;
            return JSON.stringify(parsed);
        }
        
        // If it's JSON but not a table or delta, stringify it
        return JSON.stringify(parsed);
    } catch (e) {
        // Not JSON, treat as regular text
        console.log('Not a JSON snippet, treating as regular text');
        // Preserve placeholders and newlines
        const text = String(body)
            // Escape HTML special characters except for placeholders
            .replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))
            // Split into lines and join with <br>
            .split('\n')
            .join('<br>');
        return '<div>' + text + '</div>';
    }
}

/**
 * Insert a snippet into a contenteditable node
 * @param {HTMLElement} node - The contenteditable node
 * @param {string} snippet - The snippet to insert
 * @returns {void}
 */
function insertSnippetInContentEditableNode(node, snippet) {
    console.log('Inserting snippet:', {
        snippet,
        nodeContent: node.innerHTML
    });

    if (!node || !node.isContentEditable) {
        console.warn('Node is not contenteditable:', node);
        return;
    }

    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const insertionPoint = range.startContainer;
    const insertionOffset = range.startOffset;
    
    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div');
    const preparedBody = prepareSnippetBody(snippet);
    tempDiv.innerHTML = preparedBody;
    
    console.log('Prepared snippet:', {
        preparedBody,
        tempDivContent: tempDiv.innerHTML
    });

    // Create a document fragment to maintain order
    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
    }
    
    // Insert at cursor position without deleting
    const newRange = document.createRange();
    newRange.setStart(insertionPoint, insertionOffset);
    newRange.setEnd(insertionPoint, insertionOffset);
    newRange.insertNode(fragment);
    
    // Move cursor to end of inserted content
    newRange.collapse(false);
    
    console.log('After insertion:', {
        nodeContent: node.innerHTML
    });

    // Save current selection state
    const savedRange = document.createRange();
    savedRange.setStart(newRange.startContainer, newRange.startOffset);
    savedRange.setEnd(newRange.endContainer, newRange.endOffset);

    // Test for placeholders in the inserted content
    testPlaceholderPresence(node, node.innerHTML, 0);

    // If no placeholder was found/selected, restore cursor position
    if (!Placeholder.justSelected) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
    }
}

// Export functions and state
window.Placeholder = Placeholder;
window.testPlaceholderPresence = testPlaceholderPresence;
window.updatePlaceholderState = updatePlaceholderState;
window.resetPlaceholderState = resetPlaceholderState;
window.insertSnippetInContentEditableNode = insertSnippetInContentEditableNode;
window.prepareSnippetBody = prepareSnippetBody;

export {
    Placeholder,
    testPlaceholderPresence,
    updatePlaceholderState,
    resetPlaceholderState,
    insertSnippetInContentEditableNode,
    prepareSnippetBody
};
