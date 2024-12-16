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

    // Initialize window.Placeholder if it doesn't exist
    if (!window.Placeholder) {
        window.Placeholder = {};
    }

    // Reset placeholder state
    window.resetPlaceholderState();
    
    // Set initial state
    window.Placeholder.node = node;
    window.Placeholder.isCENode = node.isContentEditable;
    window.Placeholder.fromIndex = startPosition;
    window.Placeholder.mode = false;
    window.Placeholder.array = [];
    window.Placeholder.currentIndex = -1;
    window.Placeholder.justSelected = false;

    let rootNode = node;
    // For contenteditable nodes, we need to get the full content from all text nodes
    if (node.isContentEditable) {
        // Find the root contenteditable container
        function getRootContentEditable(node) {
            while (node && (!node.isContentEditable || node.parentElement?.isContentEditable)) {
                node = node.parentElement;
            }
            return node;
        }

        rootNode = getRootContentEditable(node);
        console.log('Root contenteditable node:', rootNode);

        // First find placeholders in the new content
        const newPlaceholders = findPlaceholders(content);
        console.log('Found placeholders in new content:', newPlaceholders);

        // Then get all placeholders from the full content
        const walker = document.createTreeWalker(
            rootNode,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let fullContent = '';
        let currentNode;
        while (currentNode = walker.nextNode()) {
            fullContent += currentNode.textContent;
        }
        console.log('Full content from TreeWalker:', fullContent);

        // Find all placeholders in the document
        const allPlaceholders = findPlaceholders(fullContent);
        console.log('Found all placeholders:', allPlaceholders);

        // Combine placeholders, prioritizing the new ones
        const combinedPlaceholders = [];
        
        // First add new placeholders
        if (newPlaceholders && newPlaceholders.length > 0) {
            combinedPlaceholders.push(...newPlaceholders);
        }
        
        // Then add existing placeholders that aren't in the new content
        if (allPlaceholders) {
            allPlaceholders.forEach(placeholder => {
                if (!newPlaceholders?.includes(placeholder)) {
                    combinedPlaceholders.push(placeholder);
                }
            });
        }

        console.log('Combined placeholders with priority:', combinedPlaceholders);

        if (combinedPlaceholders.length === 0) {
            console.log('No placeholders found');
            return;
        }

        // Set up placeholder handling
        window.Placeholder.mode = true;
        window.Placeholder.array = combinedPlaceholders;
        window.Placeholder.currentIndex = 0;

        // Select the first placeholder (which will be from the new content if any exist)
        const firstPlaceholder = combinedPlaceholders[0];
        console.log('First placeholder to select:', firstPlaceholder);

        // Find the text node containing the placeholder
        console.log('Looking for text node with placeholder in root:', rootNode);
        const result = findTextNodeWithContent(rootNode, firstPlaceholder);
        console.log('Found result:', result);

        if (result) {
            console.log('Setting range:', {
                node: result.node,
                start: result.start,
                end: result.end,
                text: result.node.textContent.substring(result.start, result.end)
            });

            // Wrap the selection in a small timeout
            setTimeout(() => {
                try {
                    const selection = window.getSelection();
                    const range = document.createRange();

                    // Use the exact position info to create the range
                    range.setStart(result.node, result.start);
                    range.setEnd(result.node, result.end);

                    console.log('Range set, current selection:', {
                        range: range.toString(),
                        startOffset: range.startOffset,
                        endOffset: range.endOffset,
                        collapsed: range.collapsed
                    });

                    selection.removeAllRanges();
                    selection.addRange(range);

                    console.log('Selection updated:', {
                        selectedText: selection.toString(),
                        rangeCount: selection.rangeCount,
                        type: selection.type
                    });

                    window.Placeholder.justSelected = true;

                    // Ensure the placeholder is visible
                    result.node.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    console.log('Scrolled placeholder into view');

                    // Force focus on the contenteditable
                    rootNode.focus();
                } catch (error) {
                    console.error('Error in delayed selection:', error);
                }
            }, 0);
        } else {
            console.error('Text node for first placeholder not found');
        }
    } else {
        // For input/textarea nodes
        const placeholders = findPlaceholders(content);
        console.log('Found placeholders:', placeholders);

        if (!placeholders || placeholders.length === 0) {
            console.log('No placeholders found');
            return;
        }

        // Set up placeholder handling
        window.Placeholder.mode = true;
        window.Placeholder.array = placeholders;
        window.Placeholder.currentIndex = 0;

        const firstPlaceholder = placeholders[0];
        const placeholderStart = content.indexOf(firstPlaceholder);

        if (placeholderStart !== -1) {
            node.setSelectionRange(placeholderStart, placeholderStart + firstPlaceholder.length);
            window.Placeholder.justSelected = true;

            // Ensure the placeholder is visible
            node.focus();
            if (node.scrollHeight > node.clientHeight) {
                const lineHeight = parseInt(window.getComputedStyle(node).lineHeight);
                const lines = content.substr(0, placeholderStart).split('\n').length - 1;
                node.scrollTop = lines * lineHeight;
            }
        } else {
            console.error('First placeholder not found in content');
        }
    }
}

/**
 * Find all placeholders in the given text
 * @param {string} text - Text to search for placeholders
 * @returns {Array<string>} Array of placeholder strings found
 */
function findPlaceholders(text, rootNode = null) {
    // Match either %variable% or ** patterns
    const placeholderRegex = /(%[^%\s]+%|\*\*)/g;
    
    if (!rootNode) {
        // Simple text-based search when no rootNode provided
        const placeholders = [];
        let match;
        while ((match = placeholderRegex.exec(text)) !== null) {
            placeholders.push({
                text: match[0],
                index: match.index
            });
        }
        console.log('Found placeholders:', placeholders);
        return placeholders.map(p => p.text); // For backward compatibility
    }
    
    // When rootNode is provided, find placeholders in visual order
    const placeholderPositions = [];
    const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT);
    let currentNode;
    let totalOffset = 0;
    let uniqueId = 0; // Add a unique ID for each placeholder instance
    
    while (currentNode = walker.nextNode()) {
        const nodeText = currentNode.textContent;
        let match;
        const regex = new RegExp(placeholderRegex);
        
        while ((match = regex.exec(nodeText)) !== null) {
            placeholderPositions.push({
                text: match[0],
                position: totalOffset + match.index,
                node: currentNode,
                nodeOffset: match.index,
                id: uniqueId++ // Each placeholder gets a unique ID
            });
        }
        
        totalOffset += nodeText.length;
    }
    
    // Sort by position to get visual order
    placeholderPositions.sort((a, b) => a.position - b.position);
    
    console.log('Found placeholders in visual order:', placeholderPositions);
    window.Placeholder.positions = placeholderPositions; // Store for navigation
    return placeholderPositions.map(p => p.text);
}

/**
 * Find the text node containing the specified text
 * @param {Node} node - The node to search in
 * @param {string} searchText - The text to search for
 * @returns {Node|null} The text node containing the text, or null if not found
 */
function findTextNodeWithContent(node, searchText) {
    console.log('findTextNodeWithContent called with:', {
        nodeType: node.nodeType,
        nodeName: node.nodeName,
        searchText: searchText,
        nodeContent: node.nodeType === 3 ? node.textContent : node.innerHTML
    });

    // First find the root contenteditable container
    let rootNode = node;
    while (rootNode && (!rootNode.isContentEditable || rootNode.parentElement?.isContentEditable)) {
        rootNode = rootNode.parentElement;
    }
    
    if (!rootNode) {
        console.error('Could not find root contenteditable container');
        return null;
    }

    console.log('Found root contenteditable:', rootNode);

    // Normalize the entire tree
    rootNode.normalize();

    // Use TreeWalker to find all text nodes
    const walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let currentNode;
    while (currentNode = walker.nextNode()) {
        console.log('Checking text node:', {
            content: currentNode.textContent,
            includes: currentNode.textContent.includes(searchText)
        });
        
        if (currentNode.textContent.includes(searchText)) {
            // Find the exact position of the placeholder
            const placeholderIndex = currentNode.textContent.indexOf(searchText);
            console.log('Found placeholder in text node:', {
                node: currentNode,
                text: currentNode.textContent,
                placeholderIndex,
                placeholderText: searchText
            });
            
            // Return both the node and the position
            return {
                node: currentNode,
                start: placeholderIndex,
                end: placeholderIndex + searchText.length
            };
        }
    }
    
    console.log('No text node found containing:', searchText);
    return null;
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

    // Find the root contenteditable container
    let rootNode = node;
    while (rootNode && (!rootNode.isContentEditable || rootNode.parentElement?.isContentEditable)) {
        rootNode = rootNode.parentElement;
    }
    
    if (!rootNode) {
        console.error('Could not find root contenteditable container');
        return;
    }

    // Normalize the tree to ensure clean text nodes
    rootNode.normalize();

    // Create a new range
    const range = document.createRange();
    const selection = window.getSelection();

    // Find the text node containing the placeholder
    const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT);
    let currentNode;
    let found = false;

    while (currentNode = walker.nextNode()) {
        const nodeText = currentNode.textContent;
        const placeholderIndex = nodeText.indexOf(placeholder);
        
        if (placeholderIndex !== -1) {
            try {
                // Ensure the node is still in the document
                if (currentNode.parentNode && document.contains(currentNode)) {
                    range.setStart(currentNode, placeholderIndex);
                    range.setEnd(currentNode, placeholderIndex + placeholder.length);
                    
                    // Clear existing selection and set new one
                    selection.removeAllRanges();
                    selection.addRange(range);
                    
                    // Update placeholder state
                    Placeholder.selectionLength = placeholder.length;
                    Placeholder.justSelected = true;
                    
                    // Ensure visibility
                    if (currentNode.parentElement) {
                        currentNode.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                    // Force focus on contenteditable
                    rootNode.focus();
                    
                    found = true;
                    console.log('Successfully selected placeholder');
                    break;
                }
            } catch (e) {
                console.error('Error setting selection:', e);
            }
        }
    }

    if (!found) {
        console.warn('Could not find placeholder in text nodes');
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
            // Create a temporary div to work with the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = parsed.html.trim();
            
            // Get the table element
            const table = tempDiv.querySelector('table');
            if (table) {
                // Remove Quill-specific attributes
                table.removeAttribute('data-table');
                table.removeAttribute('class');
                
                // Add basic table styling
                table.style.cssText = 'border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid #ccc;';
                
                // Process all cells
                const cells = table.querySelectorAll('td, th');
                cells.forEach(cell => {
                    // Remove Quill-specific attributes
                    cell.removeAttribute('data-row');
                    cell.removeAttribute('data-cell');
                    cell.removeAttribute('class');
                    
                    // Add basic cell styling
                    cell.style.cssText = 'border: 1px solid #ccc; padding: 8px; text-align: left;';
                    
                    // If cell has Quill editor content, extract it
                    const qlEditor = cell.querySelector('.ql-editor');
                    if (qlEditor) {
                        cell.innerHTML = qlEditor.innerHTML;
                    }
                    
                    // Clean up any remaining Quill classes
                    cell.querySelectorAll('*').forEach(el => {
                        if (el.className && el.className.includes('ql-')) {
                            el.removeAttribute('class');
                        }
                    });
                });
                
                // Return the cleaned table HTML
                return table.outerHTML;
            }
            return '<p>Error: Could not process table</p>';
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
function insertSnippetInContentEditableNode(node, snip) {
    if (!node || !snip) {
        console.error("Invalid parameters for insertSnippetInContentEditableNode:", { node, snip });
        return false;
    }

    try {
        const win = node.ownerDocument.defaultView || node.ownerDocument.parentWindow;
        const sel = win.getSelection();
        const range = sel.getRangeAt(0);
        
        // Store raw content for later placeholder detection
        const rawContent = snip.body;
        console.log('Raw content before processing:', rawContent);
        
        // Create a proper Snip object and format macros
        const snippetObj = new Snip(snip.name, snip.body, snip.timestamp);
        
        // Process macros (this handles %d, %u, %p, etc.)
        snippetObj.formatMacros((formattedContent) => {
            let content = formattedContent;
            console.log('Content after macro processing:', content);
            
            try {
                // Try to parse as JSON for table content
                const parsed = JSON.parse(content);
                if (parsed.type === 'quill-table-content' && parsed.html) {
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
                    content = html;
                }
            } catch (e) {
                // Not JSON, treat as regular content
                if (!content.includes('<')) {
                    content = content.replace(/\n/g, '<br>');
                }
            }

            // First delete any selected text
            if (!range.collapsed) {
                range.deleteContents();
            }
            
            // Delete the snippet name if it exists
            if (snip.name) {
                const textBefore = range.startContainer.textContent;
                const nameStart = textBefore.lastIndexOf(snip.name);
                if (nameStart !== -1) {
                    const nameRange = document.createRange();
                    nameRange.setStart(range.startContainer, nameStart);
                    nameRange.setEnd(range.startContainer, nameStart + snip.name.length);
                    nameRange.deleteContents();
                }
            }

            // Store the current selection point
            const insertionPoint = range.startContainer;
            const insertionOffset = range.startOffset;

            // Create a temporary div to hold the content
            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = content;
            
            // Create a document fragment
            const fragment = document.createDocumentFragment();
            while (contentDiv.firstChild) {
                fragment.appendChild(contentDiv.firstChild);
            }
            
            // Insert the content
            range.insertNode(fragment);
            
            // Now look for placeholders only in the newly inserted content
            const walker = document.createTreeWalker(
                node,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        // Check if this node comes after our insertion point
                        const position = node.compareDocumentPosition(insertionPoint);
                        if (position & Node.DOCUMENT_POSITION_PRECEDING) {
                            // This node comes after our insertion point
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        return NodeFilter.FILTER_SKIP;
                    }
                }
            );

            // Find all placeholders in the new content
            let newContent = '';
            let currentNode;
            while (currentNode = walker.nextNode()) {
                newContent += currentNode.textContent;
            }

            console.log('New content for placeholder detection:', newContent);
            
            // Test for placeholders only in the new content
            testPlaceholderPresence(node, newContent, insertionOffset);
            
            // Trigger input event to ensure changes are registered
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
            });
            node.dispatchEvent(inputEvent);
        });
        
        return true;
    } catch (error) {
        console.error("Error in insertSnippetInContentEditableNode:", error);
        return false;
    }
}

/**
 * Handle tab navigation in plain text inputs
 * @param {HTMLElement} node - The input/textarea node
 * @param {string} nextPlaceholder - The placeholder to navigate to
 */
function handlePlainTextTabNavigation(node, nextPlaceholder) {
    console.log('Handling plain text tab navigation:', { 
        nextPlaceholder,
        nodeType: node.nodeName,
        value: node.value,
        selectionStart: node.selectionStart,
        selectionEnd: node.selectionEnd
    });
    
    if (!node || !nextPlaceholder) {
        console.error('Invalid node or placeholder');
        return;
    }
    
    const content = node.value;
    // Start searching from the current cursor position
    const searchStart = node.selectionStart;
    const start = content.indexOf(nextPlaceholder, searchStart);
    
    // If not found after cursor, search from beginning
    const finalStart = start === -1 ? content.indexOf(nextPlaceholder) : start;
    
    if (finalStart === -1) {
        console.error('Placeholder not found in text');
        return;
    }
    
    console.log('Found placeholder at position:', finalStart);
    node.setSelectionRange(finalStart, finalStart + nextPlaceholder.length);
    Placeholder.justSelected = true;
    
    // Ensure the placeholder is visible
    node.focus();
    // Scroll the textarea if needed
    if (node.scrollHeight > node.clientHeight) {
        const lineHeight = parseInt(window.getComputedStyle(node).lineHeight);
        const lines = content.substr(0, finalStart).split('\n').length - 1;
        node.scrollTop = lines * lineHeight;
    }
}

/**
 * Handle tab navigation in rich text (contenteditable) elements
 * @param {string} placeholder - The placeholder to navigate to
 */
function handleRichTextTabNavigation(placeholder) {
    console.log('Handling rich text tab navigation:', { placeholder });
    
    if (!window.Placeholder || !window.Placeholder.node) {
        console.error('No placeholder node available');
        return;
    }

    try {
        const selection = window.getSelection();
        const range = document.createRange();
        
        // First find the root contenteditable container
        let rootNode = window.Placeholder.node;
        while (rootNode && (!rootNode.isContentEditable || rootNode.parentElement?.isContentEditable)) {
            rootNode = rootNode.parentElement;
        }
        
        if (!rootNode) {
            console.error('Could not find root contenteditable container');
            return;
        }
        
        console.log('Found root node for tab navigation:', rootNode);
        
        // Re-scan the entire content for placeholders in visual order
        const remainingPlaceholders = findPlaceholders('', rootNode);
        console.log('Current remaining placeholders:', remainingPlaceholders);
        
        // Get the stored positions with unique IDs
        const positions = window.Placeholder.positions || [];
        
        // If no placeholders left, we're done
        if (positions.length === 0) {
            console.log('No more placeholders to navigate to');
            window.Placeholder.mode = false;
            return;
        }
        
        // Find current position based on selection
        let currentPosition = -1;
        const currentSelection = selection.toString();
        
        if (currentSelection) {
            // Calculate total offset to current selection
            let totalOffset = 0;
            const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT);
            let node;
            
            while ((node = walker.nextNode()) && node !== selection.anchorNode) {
                totalOffset += node.textContent.length;
            }
            
            if (node === selection.anchorNode) {
                totalOffset += selection.anchorOffset;
            }
            
            // Find the position entry that matches our current selection
            for (let i = 0; i < positions.length; i++) {
                const pos = positions[i];
                if (pos.text === currentSelection && 
                    Math.abs(pos.position - totalOffset) < currentSelection.length) {
                    currentPosition = i;
                    break;
                }
            }
        }
        
        // Move to next position
        const nextPosition = (currentPosition + 1) % positions.length;
        const nextPlaceholder = positions[nextPosition];
        
        console.log('Navigation:', {
            currentSelection,
            currentPosition,
            nextPosition,
            nextPlaceholder
        });
        
        if (nextPlaceholder) {
            // Use the stored node and offset
            range.setStart(nextPlaceholder.node, nextPlaceholder.nodeOffset);
            range.setEnd(nextPlaceholder.node, nextPlaceholder.nodeOffset + nextPlaceholder.text.length);
            
            selection.removeAllRanges();
            selection.addRange(range);
            window.Placeholder.justSelected = true;
            window.Placeholder.currentIndex = nextPosition;
            
            // Ensure the placeholder is visible
            nextPlaceholder.node.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Force focus
            rootNode.focus();
        } else {
            console.error('Next placeholder position not found');
        }
    } catch (error) {
        console.error('Error in rich text tab navigation:', error);
    }
}

/**
 * Navigate to the next placeholder
 * @param {HTMLElement} node - The node containing placeholders
 * @returns {boolean} - Whether navigation was successful
 */
function navigateToNextPlaceholder(node) {
    if (!Placeholder.mode || !Placeholder.array.length) {
        return false;
    }

    const nextIndex = (Placeholder.currentIndex + 1) % Placeholder.array.length;
    Placeholder.currentIndex = nextIndex;
    const nextPlaceholder = Placeholder.array[nextIndex];

    if (Placeholder.isCENode) {
        handleRichTextTabNavigation(nextPlaceholder);
    } else {
        handlePlainTextTabNavigation(node, nextPlaceholder);
    }

    return true;
}

// Export additional functions
export {
    Placeholder,
    testPlaceholderPresence,
    updatePlaceholderState,
    resetPlaceholderState,
    insertSnippetInContentEditableNode,
    prepareSnippetBody,
    handlePlainTextTabNavigation,
    handleRichTextTabNavigation,
    navigateToNextPlaceholder
};

// Update window exports
Object.assign(window, {
    Placeholder,
    testPlaceholderPresence,
    updatePlaceholderState,
    resetPlaceholderState,
    insertSnippetInContentEditableNode,
    prepareSnippetBody,
    handlePlainTextTabNavigation,
    handleRichTextTabNavigation,
    navigateToNextPlaceholder
});

