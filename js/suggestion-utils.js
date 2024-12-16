/* global Data */

import { getCaretCoordinates } from "./dom-utils";
import { Snip } from "./snippetClasses";
// insertSnippetInContentEditableNode is available globally from detector.js

// State variables
let isDotMode = false;
let dotBuffer = '';
let currentSuggestions = [];
let suggestionBox = null;
let selectedSuggestionIndex = -1;

// State management for original node and range
let originalNode = null;
let originalRange = null;

function setOriginalNode(node) {
    originalNode = node;
}

function setOriginalRange(range) {
    originalRange = range;
}

function getOriginalNode() {
    return originalNode;
}

function getOriginalRange() {
    return originalRange;
}

/**
 * Creates the suggestion box if it doesn't exist
 * @private
 */
function createSuggestionBox() {
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.className = 'prokeys-suggestions';
        suggestionBox.style.maxWidth = '600px';
        suggestionBox.style.minWidth = '400px';
        suggestionBox.style.visibility = 'hidden';
        suggestionBox.style.opacity = '0';
        suggestionBox.style.transition = 'opacity 0.15s ease-in';
        
        // Add style element for suggestion box styles
        const style = document.createElement('style');
        style.textContent = `
            .prokeys-suggestions {
                position: fixed;
                z-index: 999999;
                background: white;
                border: 1px solid #ccc;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                max-height: 300px;
                overflow-y: auto;
                padding: 5px 0;
            }
            .prokeys-suggestion-item {
                padding: 5px 10px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 20px;
            }
            .prokeys-suggestion-item:hover {
                background-color: #f0f0f0;
            }
            .prokeys-suggestion-item.selected {
                background-color: #e0e0e0;
            }
            .prokeys-suggestion-name {
                font-weight: bold;
            }
            .prokeys-suggestion-description {
                color: #666;
                font-size: 0.9em;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(suggestionBox);
    }
}

/**
 * Updates the suggestion list based on the current dot buffer
 * @param {HTMLElement} node - The input node where suggestions are being shown
 */
function updateSuggestions(node) {
    console.log('updateSuggestions called. isDotMode:', isDotMode, 'dotPhrasesEnabled:', Data.dotPhrasesEnabled);
    if (!isDotMode || !Data.dotPhrasesEnabled) {
        hideSuggestions();
        return;
    }

    // Reset selection state at the start
    selectedSuggestionIndex = 0;

    // Find matching snippets
    currentSuggestions = [];
    console.log('Searching for matches with buffer:', dotBuffer);
    console.log('Available snippets:', Data.snippets);
    
    // Handle both array and Folder object formats
    const snippetsList = Data?.snippets?.list || [];
    
    if (!snippetsList) {
        console.log('No snippets found');
        hideSuggestions();
        return;
    }

    const processSnippets = (items) => {
        if (!Array.isArray(items)) {
            console.log('Items is not an array:', items);
            return;
        }
        
        items.forEach(item => {
            if (!item) return;
            
            // Handle both array format and object format
            let snippetObj;
            if (Array.isArray(item)) {
                // For array format, check if it's a snippet (not a folder)
                // Array items with length > 2 are folders ([name, timestamp, ...contents])
                if (item.length <= 2) {
                    // Create a proper Snip object
                    snippetObj = new Snip(item[0], item[1] || "", item[1]);
                } else {
                    // It's a folder, recursively process its contents
                    processSnippets(item.slice(2));
                }
            } else if (item && typeof item === 'object') {
                if (item.type === 'folder' && Array.isArray(item.list)) {
                    // Process folder contents
                    processSnippets(item.list);
                } else {
                    // It's a snippet object
                    snippetObj = item;
                }
            }
            
            if (snippetObj && snippetObj.name && 
                snippetObj.name.toLowerCase().includes(dotBuffer.toLowerCase())) {
                console.log('Found matching snippet:', snippetObj);
                currentSuggestions.push(snippetObj);
            }
        });
    };

    // Start processing from the root
    processSnippets(snippetsList);
    
    console.log('Found', currentSuggestions.length, 'matching suggestions');

    // Sort suggestions by relevance
    currentSuggestions.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aShortcut = a.shortcut ? a.shortcut.toLowerCase() : '';
        const bShortcut = b.shortcut ? b.shortcut.toLowerCase() : '';
        const query = dotBuffer.toLowerCase();

        const getScore = (text) => {
            if (text === query) return 0;
            if (text.startsWith(query)) return 1;
            if (text.includes(query)) return 2;
            return 3;
        };

        const aScore = Math.min(getScore(aName), getScore(aShortcut));
        const bScore = Math.min(getScore(bName), getScore(bShortcut));
        return aScore - bScore;
    });

    // Create and position suggestion box
    createSuggestionBox();
    
    // Get initial position with retry mechanism
    function getInitialPosition(retryCount = 0) {
        const position = getCaretCoordinates(node);
        console.log('Got caret coordinates:', position);
        
        // If position is at 0,0 and we haven't retried too many times, try again
        if ((position.left === 0 && position.top === 0) && retryCount < 3) {
            console.log('Invalid position, retrying...');
            setTimeout(() => {
                const newPosition = getInitialPosition(retryCount + 1);
                if (suggestionBox && newPosition.left !== 0 && newPosition.top !== 0) {
                    suggestionBox.style.left = newPosition.left + 'px';
                    suggestionBox.style.top = (newPosition.top + 20) + 'px';
                    // Show the box only when we have a valid position
                    suggestionBox.style.visibility = 'visible';
                    // Use a small delay to ensure position is set before fading in
                    setTimeout(() => {
                        suggestionBox.style.opacity = '1';
                    }, 10);
                }
            }, 50 * Math.pow(2, retryCount)); // Exponential backoff
            return position;
        }
        
        // If we still don't have a valid position, try to get it from the selection
        if (position.left === 0 && position.top === 0) {
            console.log('Falling back to selection-based positioning');
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                if (rect.left !== 0 || rect.top !== 0) {
                    return {
                        left: rect.left + window.scrollX,
                        top: rect.top + window.scrollY
                    };
                }
            }
            
            // Last resort: position near the node itself
            const nodeRect = node.getBoundingClientRect();
            return {
                left: nodeRect.left + window.scrollX,
                top: nodeRect.top + window.scrollY
            };
        }
        
        return position;
    }

    const initialPosition = getInitialPosition();

    // Update suggestion box content
    if (currentSuggestions.length > 0) {
        const escapeHtml = (unsafe) => {
            if (!unsafe) return '';
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        const getSnippetPreview = (body) => {
            if (!body) return '';
            // Use the same smart preview function as the snippet list
            const preview = Snip.getPreviewText(body);
            return escapeHtml(preview.substring(0, 50));
        };

        const html = currentSuggestions.map((item, index) => `
            <div class="prokeys-suggestion-item" data-index="${index}">
                <span class="prokeys-suggestion-name">${escapeHtml(item.name)}</span>
                <span class="prokeys-suggestion-description">${getSnippetPreview(item.body)}</span>
            </div>
        `).join('');
        suggestionBox.innerHTML = html;

        // After setting innerHTML, explicitly set the initial selection
        const items = suggestionBox.getElementsByClassName('prokeys-suggestion-item');
        if (items.length > 0) {
            items[0].classList.add('selected');
        }

        // Position the suggestion box
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        let left = initialPosition.left;
        let top = initialPosition.top + 20;

        // Get box dimensions after content is set
        const boxRect = suggestionBox.getBoundingClientRect();

        // Adjust horizontal position if it would overflow
        if (left + boxRect.width > viewportWidth) {
            left = Math.max(0, viewportWidth - boxRect.width);
        }

        // Adjust vertical position if it would overflow
        if (top + boxRect.height > viewportHeight) {
            // Position above the cursor if there's more space there
            const spaceAbove = initialPosition.top;
            const spaceBelow = viewportHeight - initialPosition.top;
            if (spaceAbove > spaceBelow && spaceAbove >= boxRect.height) {
                top = initialPosition.top - boxRect.height;
            }
        }

        // Set position while still invisible
        suggestionBox.style.left = left + 'px';
        suggestionBox.style.top = top + 'px';
        suggestionBox.classList.add('show');

        // Only show if we have a valid position
        if (left !== 0 || top !== 20) {
            suggestionBox.style.visibility = 'visible';
            // Use a small delay to ensure position is set before fading in
            setTimeout(() => {
                suggestionBox.style.opacity = '1';
            }, 10);
        }

        // Add click handlers
        suggestionBox.querySelectorAll('.prokeys-suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(item.dataset.index);
                console.log('Suggestion clicked, index:', index);
                if (!isNaN(index) && index >= 0 && index < currentSuggestions.length) {
                    // Get the original node and range before selection
                    const originalNode = window.getOriginalNode();
                    const originalRange = window.getOriginalRange();
                    
                    // Update selection index
                    selectedSuggestionIndex = index;
                    
                    // If we have original node and range, restore them before selection
                    if (originalNode && originalRange) {
                        const sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(originalRange.cloneRange());
                    }
                    
                    // Now select the suggestion
                    selectSuggestion(0, originalNode || node);
                }
            });
        });
    } else {
        hideSuggestions();
    }
}

/**
 * Hides the suggestion box
 */
function hideSuggestions() {
    if (suggestionBox && suggestionBox.parentNode) {
        // Fade out before removing
        suggestionBox.style.opacity = '0';
        suggestionBox.style.visibility = 'hidden';
        setTimeout(() => {
            if (suggestionBox && suggestionBox.parentNode) {
                suggestionBox.parentNode.removeChild(suggestionBox);
                suggestionBox = null;
            }
        }, 150); // Match the transition duration
    }
    selectedSuggestionIndex = -1;
    currentSuggestions = [];
}

/**
 * Selects a suggestion from the list
 * @param {number} direction - Direction of movement: -1 for up, 1 for down, 0 for select current
 * @param {HTMLElement} node - The input node where the suggestion will be inserted
 * @returns {boolean} - Whether the selection was successful
 */
function selectSuggestion(direction, node) {
    console.log('Selecting suggestion, direction:', direction, 'currentIndex:', selectedSuggestionIndex);
    if (!currentSuggestions.length) {
        console.log('No suggestions available');
        return false;
    }

    // Handle navigation
    if (direction !== 0) {
        // Move selection up or down
        selectedSuggestionIndex = selectedSuggestionIndex === -1 ? 0 : selectedSuggestionIndex;
        selectedSuggestionIndex = (selectedSuggestionIndex + direction + currentSuggestions.length) % currentSuggestions.length;
        
        // Update UI - first remove all selected classes
        const items = suggestionBox.getElementsByClassName('prokeys-suggestion-item');
        Array.from(items).forEach(item => {
            item.classList.remove('selected');
        });
        
        // Then add selected class only to the current item
        if (items[selectedSuggestionIndex]) {
            items[selectedSuggestionIndex].classList.add('selected');
        }
        
        // Scroll selected item into view if needed
        const selectedItem = items[selectedSuggestionIndex];
        if (selectedItem) {
            const boxRect = suggestionBox.getBoundingClientRect();
            const itemRect = selectedItem.getBoundingClientRect();
            
            if (itemRect.bottom > boxRect.bottom) {
                selectedItem.scrollIntoView(false); // Align to bottom
            } else if (itemRect.top < boxRect.top) {
                selectedItem.scrollIntoView(true); // Align to top
            }
        }
        
        return true;
    }

    // Handle selection - use currently selected suggestion if available
    const suggestion = currentSuggestions[selectedSuggestionIndex === -1 ? 0 : selectedSuggestionIndex];
    if (!suggestion) {
        console.log('No suggestion selected');
        return false;
    }

    try {
        console.log('Found suggestion:', suggestion);
        
        // Get the original node and range before selection
        const originalNode = window.getOriginalNode();
        const originalRange = window.getOriginalRange();
        
        // If we have original node and range, restore them before selection
        if (originalNode && originalRange) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(originalRange.cloneRange());
        }
        
        // Use the original node if available
        const targetNode = originalNode || node;
        if (!targetNode) {
            console.error('No target node available');
            return false;
        }

        // Find the root contenteditable container
        let rootNode = targetNode;
        while (rootNode && (!rootNode.isContentEditable || rootNode.parentElement?.isContentEditable)) {
            rootNode = rootNode.parentElement;
        }

        if (targetNode.isContentEditable) {
            try {
                console.log('ContentEditable dotphrase handling - suggestion:', suggestion);
                
                // Get current selection and range
                const selection = window.getSelection();
                const range = window.getOriginalRange() ? window.getOriginalRange().cloneRange() : selection.getRangeAt(0);
                
                // Calculate text to delete (dot + typed text)
                const textToDelete = '.' + getDotBuffer();
                console.log('Text to delete:', textToDelete);
                
                // Delete the text before inserting
                if (window.isGmail) {
                    // For Gmail, use execCommand
                    for (let i = 0; i < textToDelete.length; i++) {
                        document.execCommand('delete', false);
                    }
                } else {
                    // For other editors, use the same method as dotphrase mode
                    const sel = window.getSelection();
                    if (sel.rangeCount > 0) {
                        const range = sel.getRangeAt(0);
                        const container = range.startContainer;
                        const offset = range.startOffset;
                        
                        // Create a new range for deletion
                        const deleteRange = document.createRange();
                        if (container.nodeType === Node.TEXT_NODE) {
                            deleteRange.setStart(container, Math.max(0, offset - textToDelete.length));
                            deleteRange.setEnd(container, offset);
                        } else {
                            // If we're in a non-text node, find the last text node
                            const walker = document.createTreeWalker(
                                container,
                                NodeFilter.SHOW_TEXT,
                                null,
                                false
                            );
                            let lastTextNode;
                            while (walker.nextNode()) {
                                lastTextNode = walker.currentNode;
                            }
                            if (lastTextNode) {
                                const textLength = lastTextNode.textContent.length;
                                deleteRange.setStart(lastTextNode, Math.max(0, textLength - textToDelete.length));
                                deleteRange.setEnd(lastTextNode, textLength);
                            }
                        }
                        deleteRange.deleteContents();
                    }
                }
                
                // Create and format the snippet
                const snippet = new Snip(suggestion.name, suggestion.body, suggestion.timestamp);
                console.log('Created snippet:', snippet);
                
                // Use the same insertion method as hotkey path
                if (window.insertSnippetInContentEditableNode) {
                    // Ensure we're using the root node for insertion
                    window.insertSnippetInContentEditableNode(rootNode, snippet);
                    
                    // Force focus back to the editor after insertion
                    setTimeout(() => {
                        if (rootNode) {
                            rootNode.focus();
                        }
                    }, 0);
                } else {
                    console.error('insertSnippetInContentEditableNode not found');
                    throw new Error('insertSnippetInContentEditableNode not found');
                }
                
                // Clean up dot mode
                hideSuggestions();
                setDotMode(false);
                updateDotBuffer('');
                setOriginalNode(null);
                setOriginalRange(null);
                
                return true;
            } catch (error) {
                console.error('Error in ContentEditable suggestion handling:', error);
                return false;
            }
        } else {
            // Original non-contentEditable handling
            const start = targetNode.selectionStart - getDotBuffer().length - 1; // -1 for the dot
            const end = targetNode.selectionStart;
            const textBefore = targetNode.value.substring(0, start);
            const textAfter = targetNode.value.substring(end);
            
            if (window.insertSnippet) {
                // Replace the text including the dot
                targetNode.value = textBefore + textAfter;
                targetNode.selectionStart = targetNode.selectionEnd = start;
                window.insertSnippet(targetNode, suggestion);
            } else {
                console.error('insertSnippet not found');
                throw new Error('insertSnippet not found');
            }
        }

        // Clean up state
        setDotMode(false);
        updateDotBuffer('');
        hideSuggestions();
        return true;
    } catch (error) {
        console.error('Error inserting suggestion:', error);
        return false;
    }
}

/**
 * Updates the dot buffer with new text
 * @param {string} text - Text to add to the buffer
 */
function updateDotBuffer(text) {
    dotBuffer = text;
}

/**
 * Sets the dot mode state
 * @param {boolean} enabled - Whether dot mode should be enabled
 */
function setDotMode(enabled) {
    isDotMode = enabled;
    if (!enabled) {
        hideSuggestions();
    }
}

/**
 * Gets the current dot mode state
 * @returns {boolean} Whether dot mode is enabled
 */
function getDotMode() {
    return isDotMode;
}

/**
 * Gets the current dot buffer
 * @returns {string} The current dot buffer
 */
function getDotBuffer() {
    return dotBuffer;
}

// Gmail-specific suggestion handling
function handleGmailSuggestion(node, snippetData) {
    try {
        // Get current selection
        const sel = window.getSelection();
        if (!sel.rangeCount) return false;

        const range = sel.getRangeAt(0);
        const textNode = range.startContainer;
        const currentOffset = range.startOffset;

        // Create range for deletion
        const deleteRange = document.createRange();
        deleteRange.setStart(textNode, currentOffset - getDotBuffer().length - 1); // -1 for the dot
        deleteRange.setEnd(textNode, currentOffset);

        // Delete the text including the dot
        deleteRange.deleteContents();

        // Create and format the snippet
        const snippet = new Snip(snippetData.name, snippetData.body, snippetData.timestamp);
        console.log('Created snippet:', snippet);
        
        // Use the same insertion method as hotkey path
        if (window.insertSnippetInContentEditableNode) {
            window.insertSnippetInContentEditableNode(node, snippet);
        } else {
            console.error('insertSnippetInContentEditableNode not found');
            throw new Error('insertSnippetInContentEditableNode not found');
        }
        
        hideSuggestions();
        setDotMode(false);
        updateDotBuffer('');
        
        return true;
    } catch (error) {
        console.error('Error in Gmail suggestion handling:', error);
        return false;
    }
}

// Expose functions to window object ONCE at initialization
Object.assign(window, {
    setOriginalNode,
    setOriginalRange,
    getOriginalNode,
    getOriginalRange
});

// Export only once at the end of the file
export {
    updateSuggestions,
    hideSuggestions,
    selectSuggestion,
    updateDotBuffer,
    setDotMode,
    getDotMode,
    getDotBuffer,
    setOriginalNode,
    setOriginalRange,
    getOriginalNode,
    getOriginalRange
};
