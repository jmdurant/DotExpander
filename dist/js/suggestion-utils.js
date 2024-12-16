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

/**
 * Creates the suggestion box if it doesn't exist
 * @private
 */
function createSuggestionBox() {
    if (!suggestionBox) {
        suggestionBox = document.createElement('div');
        suggestionBox.className = 'prokeys-suggestions';
        suggestionBox.style.maxWidth = '600px'; // Ensure enough width for two columns
        suggestionBox.style.minWidth = '400px';
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
    const initialPosition = getCaretCoordinates(node);

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
            <div class="prokeys-suggestion-item${index === selectedSuggestionIndex ? ' selected' : ''}" data-index="${index}">
                <span class="prokeys-suggestion-name">${escapeHtml(item.name)}</span>
                <span class="prokeys-suggestion-description">${getSnippetPreview(item.body)}</span>
            </div>
        `).join('');
        suggestionBox.innerHTML = html;

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

        suggestionBox.style.left = left + 'px';
        suggestionBox.style.top = top + 'px';
        suggestionBox.classList.add('show');

        // Add click handlers
        suggestionBox.querySelectorAll('.prokeys-suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(item.dataset.index);
                console.log('Suggestion clicked, index:', index);
                if (!isNaN(index) && index >= 0 && index < currentSuggestions.length) {
                    selectedSuggestionIndex = index;
                    selectSuggestion(0, node);
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
        suggestionBox.parentNode.removeChild(suggestionBox);
        suggestionBox = null;
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
        
        // Update UI
        const items = suggestionBox.getElementsByClassName('prokeys-suggestion-item');
        for (let i = 0; i < items.length; i++) {
            items[i].classList.toggle('selected', i === selectedSuggestionIndex);
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
        if (node.isContentEditable) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const dotLength = getDotBuffer().length + 1; // +1 for the dot
            range.setStart(range.startContainer, range.startOffset - dotLength);
            range.deleteContents();
            if (window.insertSnippetInContentEditableNode) {
                const container = range.startContainer.parentNode;
                window.insertSnippetInContentEditableNode(container, suggestion);
            } else {
                console.error('insertSnippetInContentEditableNode not found');
                throw new Error('insertSnippetInContentEditableNode not found');
            }
        } else {
            const start = node.selectionStart - getDotBuffer().length - 1; // -1 for the dot
            const end = node.selectionStart;
            const textBefore = node.value.substring(0, start);
            const textAfter = node.value.substring(end);
            
            if (window.insertSnippet) {
                // Replace the text including the dot
                node.value = textBefore + textAfter;
                node.selectionStart = node.selectionEnd = start;
                window.insertSnippet(node, suggestion);
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

// Export only once at the end of the file
export {
    updateSuggestions,
    hideSuggestions,
    selectSuggestion,
    updateDotBuffer,
    setDotMode,
    getDotMode,
    getDotBuffer
};
