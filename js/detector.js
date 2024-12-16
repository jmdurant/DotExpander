/* global Data */

import {
    q,
    chromeAPICallWrapper,
    debugLog,
    isTextNode,
    isBlockedSite,
    PRIMITIVES_EXT_KEY,
    getNodeWindow,
    triggerFakeInput,
    isParent
} from "./pre";
import { Folder, Snip } from "./snippetClasses";
import { DBget } from "./commonDataHandlers";
import { primitiveExtender } from "./primitiveExtend";
import { updateAllValuesPerWin } from "./protoExtend";
import { getHTML } from "./textmethods";
import { showBlockSiteModal } from "./modalHandlers";
import { getCurrentTimestamp, getFormattedDate } from "./dateFns";
import { insertCharacter, searchAutoInsertChars } from "./autoInsertFunctionality";
import {
    getCaretCoordinates,
    selectTextInNode
} from "./dom-utils";
import {
    isNotMetaKey,
    isSnippetSubstitutionKey,
    isUsableNode,
    keyEventAttacher,
    insertTabChar,
    shiftCaretByCount,
} from "./keyboard-utils";
import {
    updateSuggestions,
    hideSuggestions,
    selectSuggestion,
    updateDotBuffer,
    setDotMode,
    getDotMode,
    getDotBuffer
} from "./suggestion-utils";
import { 
    testPlaceholderPresence, 
    updatePlaceholderState, 
    prepareSnippetBody, 
    getEditorType, 
    handleTableInsertion, 
    insertRegularContent, 
    getInsertedContent,
    navigateToNextPlaceholder
} from "./placeholder-utils";
import { 
    evaluateMathExpression,
    evaluateDoubleBrackets,
    provideDoubleBracketFunctionality 
} from "./math-evaluator";
import {
    setOriginalNode,
    getOriginalNode,
    setOriginalRange,
    getOriginalRange,
    setDotPosition,
    getDotPosition,
    setAutoInsertPairs,
    getAutoInsertPairs,
    setAutoInsertTyped,
    getAutoInsertTyped,
    setIndexIncrease,
    getIndexIncrease,
    updateModifierState,
    getModifierStates,
    shouldHandleHotkey,
    shouldHandleTabKey,
    resetModifierStates,
    isEmptyEditorState,
    resetAllState
} from "./state-manager";
import {
    processSnippetInsertion,
    getTextBeforeCursor
} from "./snippet-processor";
import { KEYBOARD, SNIPPETS } from "./config";

primitiveExtender();
console.log("ProKeys detector.js starting");

(function (window) {
    if (typeof window === 'undefined') {
        console.error('Window is not defined');
        return;
    }

    const IN_OPTIONS_PAGE = window.location.pathname.includes('options.html');
    console.log("ProKeys IIFE starting");
    
    // Constants and global variables
    const CACHE_DATASET_STRING = 'prokeysUsable';
    const allowedInputElms = ['text', 'search', 'tel', 'url', 'email'];
    const UNIQ_CS_KEY = 'prokeys_content_script';
    const DOC_IS_IFRAME_KEY = 'prokeys_is_iframe';
    const IFRAME_CHECK_TIMER = 1000;
    let justEnteredDotMode = false;  // Moved to proper scope

    // Declare function variables at the top
    let handleKeyDown;
    let handleKeyPress;
    let handleKeyUp;

    // Function declarations at the top
    function isHotkeyPressed(event) {
        return KEYBOARD.MODIFIER_KEYS.some(key => event[`${key.toLowerCase()}Key`]);
    }

    function afterDBget(DataResponse) {
        console.log('afterDBget called with response:', DataResponse);
        if (!DataResponse || !DataResponse.snippets) {
            console.error('Invalid DataResponse:', DataResponse);
            return;
        }
        window.Data = DataResponse;
        Data = DataResponse;
        console.log('Data object initialized:', window.Data);
        console.log('dotPhrasesEnabled:', window.Data.dotPhrasesEnabled);
        console.log('snippets:', window.Data.snippets);
        setPageDOM();
    }

    function setPageDOM() {
        console.log("setPageDOM called");
        if (window.top !== window) {
            return;
        }

        if (window.IN_OPTIONS_PAGE) {
            return;
        }

        const win = window;
        let isBlocked = false;

        if (window.Data && window.Data.blockedSites) {
            isBlocked = isBlockedSite(window.location.href);
            if (isBlocked) {
                showBlockSiteModal();
            }
        }

        attachNecessaryHandlers(win, isBlocked);
        initiateIframeCheck(document);

        debugLog("done initializing");
        window.isGmail = /mail\.google/.test(window.location.href);
    }

    function onPageLoad() {
        console.log("onPageLoad called");
        if (!window.IN_OPTIONS_PAGE) {
            console.log("Not in options page, getting DB");
            DBget(afterDBget);
        } else {
            console.log("In options page, setting timeout");
            setTimeout(setPageDOM, 1000);
        }
    }

    // Initialize window load checker
    let windowLoadChecker = setInterval(() => {
        if (!window || !window.document) {
            console.log("Window or document not ready yet");
            return;
        }
        console.log("Checking window load state:", window.document.readyState);
        if (window.document.readyState === "complete") {
            console.log("Window load complete, calling onPageLoad");
            clearInterval(windowLoadChecker);
            onPageLoad();
        }
    }, 100);

    function onIFrameLoad(iframe) {
        let doc, win;

        try {
            doc = iframe.contentDocument;
            win = iframe.contentWindow;

            // Skip iframes we can't access
            if (!doc || !win) {
                return;
            }

            // make sure handler's not already attached
            if (!doc[UNIQ_CS_KEY]) {
                doc[UNIQ_CS_KEY] = true;
                doc[DOC_IS_IFRAME_KEY] = true;
                updateAllValuesPerWin(win);
                attachNecessaryHandlers(win);
                
                // For Gmail, we need to check for dynamically added iframes more frequently
                const checkInterval = window.isGmail ? 500 : IFRAME_CHECK_TIMER;
                setInterval(initiateIframeCheck, checkInterval, doc);
            }
        } catch (e) {
            // Ignore cross-origin errors
            if (!e.message.includes('cross-origin')) {
                debugLog(e, iframe, doc, win);
            }
        }
    }

    function initiateIframeCheck(parentDoc) {
        if (!parentDoc) return;

        // Handle shadow DOM
        function checkShadowDOM(element) {
            if (element.shadowRoot) {
                // Check for iframes in shadow root
                const shadowIframes = element.shadowRoot.querySelectorAll('iframe');
                shadowIframes.forEach(iframe => {
                    try {
                        if (iframe.contentDocument) {
                            onIFrameLoad(iframe);
                        }
                    } catch (e) {
                        // Ignore cross-origin errors
                    }
                });

                // Recursively check shadow DOM children
                element.shadowRoot.querySelectorAll('*').forEach(checkShadowDOM);
            }
        }

        // Check regular iframes
        const iframes = parentDoc.getElementsByTagName("iframe");
        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            try {
                if (iframe.contentDocument) {
                    onIFrameLoad(iframe);
                }
            } catch (e) {
                // Ignore cross-origin errors
            }
        }

        // Check for shadow DOM
        parentDoc.querySelectorAll('*').forEach(checkShadowDOM);
    }

    function resetPlaceholderVariables() {
        updatePlaceholderState().mode = false;
        updatePlaceholderState().fromIndex = updatePlaceholderState().toIndex = 0;
        updatePlaceholderState().isCENode = false;
        updatePlaceholderState().node = null;
        updatePlaceholderState().array = null;
        updatePlaceholderState().lastCaretPosition = -1;
        updatePlaceholderState().justSelected = false;
        updatePlaceholderState().selectionLength = 0;
        updatePlaceholderState().currentPlaceholder = null;
        updatePlaceholderState().textMap = null;
    }

    function isProKeysNode(node) {
        return node.tagName === TAGNAME_SNIPPET_HOLDER_ELM && (node && node.classList.contains(SPAN_CLASS));
    }

    function setCaretAtEndOf(node, pos) {
        const win = getNodeWindow(node),
            sel = win.getSelection(),
            range = sel.getRangeAt(0);

        if (isProKeysNode(node)) {
            range.selectNodeContents(node);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        } else {
            // textarea
            node.selectionEnd = node.selectionStart = pos || updatePlaceholderState().toIndex;
        }
    }

    function isSnippetPresentCENode(node) {
        const win = node.ownerDocument.defaultView || node.ownerDocument.parentWindow;
        const sel = win.getSelection();
        const range = sel.getRangeAt(0);
        const container = range.startContainer;
        // pos relative to container (not node)
        const caretPos = range.startOffset;
        let snip = null;

        function onSnipFound() {
            if (!snip || !snip.name) {
                console.log('No valid snippet found');
                return false;
            }
            // remove snippet name from container
            range.setStart(container, caretPos - snip.name.length);
            range.setEnd(container, caretPos);
            range.deleteContents();

            insertSnippetInContentEditableNode(node, snip);
            return true;
        }

        if (!range.collapsed) {
            return false;
        }

        // Only proceed if we're in dot mode and dot phrases are enabled
        if (!getDotMode() && Data.dotPhrasesEnabled) {
            console.log('Not in dot mode or dot phrases disabled');
            return false;
        }

        // Handle both array and Folder object formats
        const snippetsList = Array.isArray(Data.snippets) ? Data.snippets.slice(2) : Data.snippets.list;
        
        if (!snippetsList) {
            console.log('No snippets list found');
            return false;
        }

        // Find the longest matching snippet name before the cursor
        let maxLength = Math.min(caretPos, 50); // Look back at most 50 chars
        let text = container.textContent || '';
        text = text.substring(Math.max(0, caretPos - maxLength), caretPos);
        let matchingSnip = null;
        
        // Try each possible length of text before cursor
        for (let i = 1; i <= text.length; i++) {
            let testText = text.substring(text.length - i);
            let found = false;
            
            // Search through snippets
            const processSnippets = (items) => {
                items.forEach(item => {
                    if (Array.isArray(item)) {
                        if (item.length <= 2 && item[0] === testText) {
                            matchingSnip = new Snip(item[0], item[1] || "", item[1]);
                            found = true;
                        } else if (item.length > 2) {
                            processSnippets(item.slice(2));
                        }
                    } else if (item && typeof item === 'object') {
                        if (item.type === 'folder' && item.list) {
                            processSnippets(item.list);
                        } else if (item.name === testText) {
                            matchingSnip = new Snip(item.name, item.body, item.timestamp);
                            found = true;
                        }
                    }
                });
            };
            
            processSnippets(snippetsList);
            if (found) {
                snip = matchingSnip;
                break;
            }
        }

        // snippet found
        if (snip !== null) {
            setTimeout(onSnipFound, 10);
            return true;
        }

        return false;
    }

    function isSnippetPresent(node, dotPhrase = null, passedRange = null, isHotkey = false) {
        console.log("Checking for snippet, dotPhrase:", dotPhrase, "isHotkey:", isHotkey, "node:", node);
        
        // Only proceed if we're in dot mode or have an explicit dotPhrase or triggered by hotkey
        if (!getDotMode() && dotPhrase === null && !isHotkey) {
            console.log("Not in dot mode, no dotPhrase provided, and not hotkey triggered, skipping snippet check");
            return null;
        }

        let start, end, str;
        let snip = null;  // Declare snip in outer scope
        let found = false;  // Declare found in outer scope
        let currentRange;
        
        // Initialize variables at the top of function
        if (node.isContentEditable) {
            const win = node.ownerDocument.defaultView || node.ownerDocument.parentWindow;
            const sel = win.getSelection();
            
            // Use passed range if available, otherwise get current range
            currentRange = passedRange || (sel.rangeCount ? sel.getRangeAt(0) : null);
            if (!currentRange) {
                console.log("No valid range found");
                return null;
            }

            // Get the actual contentEditable node from the range
            let container = currentRange.startContainer;
            while (container && !container.isContentEditable) {
                container = container.parentNode;
            }
            if (!container) {
                console.log("No contenteditable container found");
                return null;
            }

            // Update node to be the actual contentEditable container
            node = container;

            start = currentRange.startOffset;
            end = currentRange.endOffset;
            str = currentRange.startContainer.textContent;

            if (dotPhrase) {
                try {
                    console.log('Searching for dotPhrase:', dotPhrase);
                    
                    // Handle both array and Folder object formats
                    const snippetsList = Array.isArray(Data.snippets) ? Data.snippets.slice(2) : Data.snippets.list;
                    
                    if (!snippetsList) {
                        console.log('No snippets list found');
                        return false;
                    }

                    const processSnippets = (items) => {
                        items.forEach(item => {
                            if (Array.isArray(item)) {
                                if (item.length <= 2 && item[0] === dotPhrase) {
                                    found = true;
                                    snip = new Snip(item[0], item[1] || "", item[1]);
                                } else if (item.length > 2) {
                                    processSnippets(item.slice(2));
                                }
                            } else if (item && typeof item === 'object') {
                                if (item.type === 'folder' && item.list) {
                                    processSnippets(item.list);
                                } else if (item.name === dotPhrase) {
                                    found = true;
                                    snip = new Snip(item.name, item.body || "", item.timestamp || getCurrentTimestamp());
                                }
                            }
                        });
                    };

                    processSnippets(snippetsList);
                    
                    if (found && snip) {
                        console.log("Found snippet for dot phrase:", snip.name);
                        
                        // First remove the dot phrase text (including the dot)
                        const sel = window.getSelection();
                        const range = sel.getRangeAt(0);
                        range.setStart(range.startContainer, range.startOffset - dotPhrase.length - 1);
                        range.deleteContents();
                        
                        // Reset dot mode variables
                        updateDotBuffer('');
                        hideSuggestions();
                        setOriginalNode(null);
                        setOriginalRange(null);
                        setDotPosition(-1);
                        
                        // Insert the snippet using the same method as hotkey
                        insertSnippetInContentEditableNode(node, snip);
                        return true;
                    }
                    return false;
                } catch (e) {
                    console.error("Error searching for snippet:", e);
                    return false;
                }
            }

            // For hotkey expansion in contenteditable, we need to look back for snippet names
            if (isHotkey) {
                // Look back up to 50 characters for a snippet name
                const maxLength = Math.min(start, 50);
                const textBeforeCursor = str.substring(start - maxLength, start);
                console.log("Looking for snippet in text:", textBeforeCursor);

                // Try each possible length of text before cursor
                for (let i = 1; i <= textBeforeCursor.length; i++) {
                    let testText = textBeforeCursor.substring(textBeforeCursor.length - i);
                    let found = false;
                    let matchingSnip = null;  // Define matchingSnip here
                    
                    // Search through snippets
                    const processSnippets = (items) => {
                        items.forEach(item => {
                            if (Array.isArray(item)) {
                                if (item.length <= 2 && item[0] === testText) {
                                    matchingSnip = new Snip(item[0], item[1] || "", getCurrentTimestamp());
                                    found = true;
                                } else if (item.length > 2) {
                                    processSnippets(item.slice(2));
                                }
                            } else if (item && typeof item === 'object') {
                                if (item.type === 'folder' && item.list) {
                                    processSnippets(item.list);
                                } else if (item.name === testText) {
                                    matchingSnip = new Snip(item.name, item.body || "", item.timestamp || getCurrentTimestamp());
                                    found = true;
                                }
                            }
                        });
                        return matchingSnip;  // Return the found snippet
                    };
                    
                    const snippetsList = Array.isArray(Data.snippets) ? Data.snippets.slice(2) : Data.snippets.list;
                    const foundSnip = processSnippets(snippetsList);

                    if (found && foundSnip) {
                        snip = foundSnip;
                        console.log("Found snippet:", snip);
                        break;
                    }
                }

                if (snip) {
                    console.log("Found snippet to insert:", snip);
                    // Delete the snippet name
                    const sel = window.getSelection();
                    const range = sel.getRangeAt(0);
                    range.setStart(range.startContainer, range.startOffset - snip.name.length);
                    range.deleteContents();
                    
                    // Insert the snippet
                    insertSnippetInContentEditableNode(node, snip);
                    return true;
                } else {
                    console.log("No matching snippet found");
                    return false;
                }
            }
            return false;
        } else {
            // Initialize variables at the top of function
            start = node.selectionStart;
            end = node.selectionEnd;
            str = node.value;

            if (dotPhrase) {
                try {
                    console.log('Searching for dotPhrase:', dotPhrase);
                    console.log('Data.snippets:', Data.snippets);

                    // Handle both array and Folder object formats
                    const snippetsList = Array.isArray(Data.snippets) ? Data.snippets.slice(2) : Data.snippets.list;
                    
                    if (!snippetsList) {
                        console.log('No snippets list found');
                        return false;
                    }

                    const processSnippets = (items) => {
                        items.forEach(item => {
                            // Handle both array format and object format
                            let snippetObj;
                            if (Array.isArray(item)) {
                                // For array format, check if it's a snippet (not a folder)
                                // Array items with length > 2 are folders ([name, timestamp, ...contents])
                                if (item.length <= 2) {
                                    // Create a proper Snip object with the body from Data.snippets
                                    snippetObj = {
                                        name: item[0],
                                        body: item[1] || "",  // Use empty string as fallback
                                        timestamp: item[1]
                                    };
                                } else {
                                    // It's a folder, recursively process its contents
                                    processSnippets(item.slice(2));
                                }
                            } else if (item && typeof item === 'object') {
                                if (item.type === 'folder' && item.list) {
                                    // It's a folder object, recursively process its contents
                                    processSnippets(item.list);
                                } else if (item.type !== 'folder') {
                                    // It's a snippet object, use it directly
                                    snippetObj = item;
                                }
                            }
                            
                            if (snippetObj && (
                                (snippetObj.name && snippetObj.name.toLowerCase() === dotPhrase.toLowerCase()) ||
                                (snippetObj.shortcut && snippetObj.shortcut.toLowerCase() === dotPhrase.toLowerCase())
                            )) {
                                console.log('Found matching snippet:', snippetObj);
                                found = true;
                                snip = snippetObj;  // We'll convert to Snip instance later when needed
                            }
                        });
                    };

                    // Start processing from the root
                    processSnippets(snippetsList);
                    
                    if (found && snip) {
                        console.log("Found snippet for dot phrase:", snip.name);
                        // Convert raw object to Snip instance with all properties
                        snip = new Snip(snip.name, snip.body || "", snip.timestamp);
                        
                        // First remove the dot phrase text (including the dot)
                        if (node.nodeName === 'TEXTAREA' || node.nodeName === 'INPUT') {
                            const start = node.selectionStart - dotPhrase.length - 1; // -1 for the dot
                            const end = node.selectionStart;
                            node.setSelectionRange(start, end);
                            document.execCommand('delete', false);
                        } else {
                            // For contentEditable
                            const sel = window.getSelection();
                            const range = sel.getRangeAt(0);
                            range.setStart(range.startContainer, range.startOffset - dotPhrase.length - 1);
                            range.deleteContents();
                        }
                        
                        // Reset dot mode variables
                        updateDotBuffer('');
                        hideSuggestions();
                        setOriginalNode(null);
                        setOriginalRange(null);
                        setDotPosition(-1);
                        
                        // Then insert the snippet at the current position
                        if (node.isContentEditable) {
                            insertSnippetInContentEditableNode(node, snip);
                        } else {
                            insertSnippet(node, snip);
                        }
                        return true;
                    }
                    console.log("No snippet found for dot phrase:", dotPhrase);
                    return false;
                } catch (e) {
                    console.error("Error searching for snippet:", e);
                    return false;
                }
            }

            // Original hotkey-based snippet logic
            if (start !== end) {
                return false;
            }

            // Handle both array and object formats
            const snippetsList = Array.isArray(Data.snippets) ? Data.snippets.slice(2) : Data.snippets.list;
            
            if (!snippetsList) {
                console.log('No snippets list found');
                return false;
            }

            // Find the longest matching snippet name before the cursor
            let maxLength = Math.min(start, 50); // Look back at most 50 chars
            let text = str.substring(start - maxLength, start);
            let matchingSnip = null;
            
            // Try each possible length of text before cursor
            for (let i = 1; i <= text.length; i++) {
                let testText = text.substring(text.length - i);
                let found = false;
                
                // Search through snippets
                const processSnippets = (items) => {
                    items.forEach(item => {
                        if (Array.isArray(item)) {
                            if (item.length <= 2 && item[0] === testText) {
                                matchingSnip = new Snip(item[0], item[1] || "", item[1]);
                                found = true;
                            } else if (item.length > 2) {
                                processSnippets(item.slice(2));
                            }
                        } else if (item && typeof item === 'object') {
                            if (item.type === 'folder' && item.list) {
                                processSnippets(item.list);
                            } else if (item.name === testText) {
                                matchingSnip = new Snip(item.name, item.body, item.timestamp);
                                found = true;
                            }
                        }
                    });
                };
                
                processSnippets(snippetsList);
                if (found) {
                    snip = matchingSnip;
                    break;
                }
            }

            // snippet found
            if (snip !== null) {
                setTimeout(() => {
                    const textBeforeSnipName = str.substring(0, start - snip.name.length),
                        textAfterSnipName = str.substring(start);

                    snip.formatMacros((snipBody) => {
                        // snipBody can be both textarea-saved or rte-saved
                        // if it is textarea-saved => nothing needs to be done
                        // else callt his method
                        // it is textarea-saved IF it does not have any quill classes
                        snipBody = Snip.makeHTMLSuitableForTextareaThroughString(snipBody);
                        if (node.isContentEditable) {
                            node.innerHTML = textBeforeSnipName + snipBody + textAfterSnipName;
                        } else {
                            node.value = textBeforeSnipName + snipBody + textAfterSnipName;
                        }

                        // Wait for DOM to be updated and normalized
                        setTimeout(() => {
                            // Normalize the node to merge adjacent text nodes
                            node.normalize();
                            
                            // Now look for placeholders in the actual DOM content
                            const walker = document.createTreeWalker(
                                node,
                                NodeFilter.SHOW_TEXT,
                                null,
                                false
                            );

                            // Collect all text content first
                            let textContent = '';
                            let currentNode;
                            while (currentNode = walker.nextNode()) {
                                textContent += currentNode.textContent;
                            }

                            console.log('Actual text content after macro processing:', textContent);
                            
                            // Now test for placeholders in the normalized content
                            testPlaceholderPresence(node, textContent, start - snip.name.length);
                        }, 0);
                    });
                }, 10);

                // first prevent space from being inserted
                return true;
            }
            return false;
        }
    }

    // Define the event handlers
    handleKeyDown = function(e) {
        const node = e.target;
        
        debugLog("Key down event:", {
            key: e.key,
            keyCode: e.keyCode,
            shiftKey: e.shiftKey,
            target: e.target.nodeName,
            isContentEditable: e.target.isContentEditable,
            hotKey: window.Data?.hotKey
        });

        // Update modifier state tracking in central state manager
        updateModifierState(e);

        if (!isUsableNode(node)) {
            return;
        }

        const keyCode = e.keyCode || e.which;
        const key = e.key;

        // First priority: Check if any modifier key is pressed
        if (getModifierStates().shiftKey || getModifierStates().ctrlKey || 
            getModifierStates().altKey || getModifierStates().metaKey) {
            // If it's a hotkey combination, handle it
            if (shouldHandleHotkey(e)) {
                console.log('Hotkey detected:', {
                    event: e,
                    modifierStates: getModifierStates(),
                    hotKey: window.Data?.hotKey
                });
                e.preventDefault();
                e.stopPropagation();
                
                // For contenteditable elements, we need to handle the snippet insertion differently
                if (node.isContentEditable) {
                    const sel = window.getSelection();
                    const range = sel.getRangeAt(0);
                    return isSnippetPresent(node, null, range.cloneRange(), true);
                }
                
                return processSnippetInsertion(node, e);
            }
            // Otherwise, let the browser handle modified keystrokes
            return;
        }

        // Second priority: Handle Tab key based on mode
        if (key === 'Tab') {
            console.log('Tab key pressed, checking modes:', {
                placeholderMode: window.Placeholder?.mode,
                dotMode: getDotMode()
            });

            const tabAction = shouldHandleTabKey(e, window.Placeholder?.mode, getDotMode());
            if (!tabAction) {
                console.log('No special tab handling needed');
                return; // Let browser handle tab if no special handling needed
            }

            e.preventDefault(); // Prevent default tab behavior
            e.stopPropagation();

            if (tabAction === 'placeholder') {
                console.log('Handling placeholder tab navigation');
                // Use the modularized navigateToNextPlaceholder function
                if (!navigateToNextPlaceholder(node)) {
                    console.log('No placeholders available');
                }
            } else if (tabAction === 'dotmode') {
                console.log('Handling dot mode tab completion');
                // Handle dot mode tab completion - select the current suggestion
                if (selectSuggestion(0, node)) {
                    console.log('Successfully selected suggestion');
                    // Clean up dot mode state
                    setDotMode(false);
                    updateDotBuffer('');
                    hideSuggestions();
                } else {
                    console.log('Failed to select suggestion');
                }
            }
            return;
        }

        // Handle F2 key for dedicated placeholder cycling
        if (key === 'F2') {
            console.log('F2 key pressed, checking for placeholders');
            e.preventDefault();
            e.stopPropagation();

            // If not in placeholder mode, check for placeholders first
            if (!window.Placeholder?.mode) {
                console.log('Not in placeholder mode, checking for placeholders');
                const content = node.isContentEditable ? node.innerHTML : node.value;
                testPlaceholderPresence(node, content, 0);
            }

            // Now try to navigate to next placeholder
            if (window.Placeholder?.mode) {
                console.log('Navigating to next placeholder with F2');
                if (!navigateToNextPlaceholder(node)) {
                    console.log('No more placeholders available');
                }
            }
            return;
        }

        // Prevent space from deleting selected placeholder
        if (keyCode === KEYBOARD.SPECIAL_KEYS.SPACE && window.Placeholder && window.Placeholder.mode === true) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            if (!range.collapsed) {
                // Only prevent if the selection contains a placeholder
                const selectedNode = range.commonAncestorContainer;
                if (selectedNode.nodeType === Node.ELEMENT_NODE && 
                    (selectedNode.classList.contains(PLACE_CLASS) || 
                     selectedNode.querySelector('.' + PLACE_CLASS))) {
                    e.preventDefault();
                    return;
                }
            }
        }

        // Handle ESC key in dot mode
        if (getDotMode() && Data.dotPhrasesEnabled && e.keyCode === KEYBOARD.SPECIAL_KEYS.ESC) { // ESC key
            e.preventDefault();
            setDotMode(false);
            
            // Delete the typed text including the dot
            if (node.nodeName === 'TEXTAREA' || node.nodeName === 'INPUT') {
                const start = Math.max(0, node.selectionStart - getDotBuffer().length - 1); // -1 for the dot
                const end = node.selectionStart;
                node.setSelectionRange(start, end);
                document.execCommand('delete', false);
            } else {
                // For contentEditable
                const sel = window.getSelection();
                const range = sel.getRangeAt(0);
                const container = range.startContainer;
                const offset = range.startOffset;
                
                // Calculate the new start offset, ensuring it doesn't go below 0
                const bufferLength = getDotBuffer().length + 1; // +1 for the dot
                const newStartOffset = Math.max(0, offset - bufferLength);
                
                try {
                    // If we're in a text node, we can directly set the range
                    if (container.nodeType === Node.TEXT_NODE) {
                        range.setStart(container, newStartOffset);
                    } else {
                        // If we're in an element node, find the appropriate text node
                        const textNodes = [];
                        const walker = document.createTreeWalker(
                            container,
                            NodeFilter.SHOW_TEXT,
                            null,
                            false
                        );
                        
                        let node;
                        while (node = walker.nextNode()) {
                            textNodes.push(node);
                        }
                        
                        if (textNodes.length > 0) {
                            const lastTextNode = textNodes[textNodes.length - 1];
                            range.setStart(lastTextNode, Math.max(0, lastTextNode.length - bufferLength));
                        }
                    }
                    range.deleteContents();
                } catch (error) {
                    console.warn('Error setting range:', error);
                    // Fallback: just clear the selection
                    range.collapse(true);
                }
            }
            
            // Reset dot mode variables
            updateDotBuffer('');
            hideSuggestions();
            setOriginalNode(null);
            setOriginalRange(null);
            setDotPosition(-1);
            return;
        }

        // Add backspace handling in handleKeyDown
        if (getDotMode() && Data.dotPhrasesEnabled && e.keyCode === 8) { // Backspace
            console.log('Backspace in dot mode, current buffer:', getDotBuffer());
            if (getDotBuffer().length > 1) {
                // Update buffer
                updateDotBuffer(getDotBuffer().slice(0, -1));
                console.log('Buffer after backspace:', getDotBuffer());

                // Let default backspace happen for the actual text
                updateSuggestions(node);
                return true;
            } else {
                // If buffer will become empty after this backspace, exit dot mode
                setDotMode(false);
                updateDotBuffer('');
                hideSuggestions();
                setOriginalNode(null);
                setOriginalRange(null);
                setDotPosition(-1);
                return true;
            }
        }

        // Handle up/down arrows in dot mode
        if (getDotMode() && Data.dotPhrasesEnabled) {
            if (keyCode === 38) { // Up arrow
                e.preventDefault();
                e.stopPropagation(); // Add this to prevent double handling
                selectSuggestion(-1, node); // -1 means move up
                return false; // Add this to ensure event doesn't propagate
            } else if (keyCode === 40) { // Down arrow
                e.preventDefault();
                e.stopPropagation(); // Add this to prevent double handling
                selectSuggestion(1, node); // 1 means move down
                return false; // Add this to ensure event doesn't propagate
            } else if (keyCode === 13) { // Enter key
                e.preventDefault(); // Prevent default behavior immediately
                e.stopPropagation(); // Stop event propagation immediately
                e.stopImmediatePropagation(); // Stop other handlers from executing
                selectSuggestion(0, node); // Select current suggestion
                return false;
            }
        }

        // Handle space key in dot mode
        if (getDotMode() && Data.dotPhrasesEnabled && keyCode === 32) { // Space key
            e.preventDefault();
            
            // If only a dot has been typed (empty buffer), exit dot mode without selecting
            if (getDotBuffer() === '') {
                console.log('Space after dot, cancelling dot mode');
                setDotMode(false);
                updateDotBuffer('');
                setDotPosition(-1);
                setOriginalNode(null);
                setOriginalRange(null);
                
                // Only insert a space if we just entered dot mode
                if (node.isContentEditable) {
                    document.execCommand('insertText', false, ' ');
                } else {
                    const pos = node.selectionStart;
                    const value = node.value;
                    node.value = value.slice(0, pos) + ' ';
                    node.selectionStart = node.selectionEnd = pos + 1;
                }
                justEnteredDotMode = false;  // Reset the flag
                return;
            }
            
            // Otherwise proceed with suggestion selection
            const suggestionResult = selectSuggestion(0, node); // 0 means select current
            
            if (suggestionResult) {
                // Only clean up if no placeholder was selected
                if (!window.Placeholder.justSelected) {
                    setDotMode(false);
                    updateDotBuffer('');
                    setDotPosition(-1);
                    setOriginalNode(null);
                    setOriginalRange(null);
                }
            }
            return;
        }

        // Tab key handling for placeholders
        if (keyCode === 9 && window.Placeholder.mode) { // Tab key
            e.preventDefault();
            console.log('Tab pressed in placeholder mode');
            
            // Calculate next index
            const nextIndex = (window.Placeholder.currentIndex + 1) % window.Placeholder.array.length;
            console.log('Moving to next placeholder:', {
                currentIndex: window.Placeholder.currentIndex,
                nextIndex,
                totalPlaceholders: window.Placeholder.array.length,
                placeholders: window.Placeholder.array
            });

            // Update current index
            window.Placeholder.currentIndex = nextIndex;
            const nextPlaceholder = window.Placeholder.array[nextIndex];
            const placeholderText = typeof nextPlaceholder === 'string' ? nextPlaceholder : nextPlaceholder.text;

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
                
                // Find the text node containing the next placeholder
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
                const firstPlaceholder = placeholders[0];
                const placeholderStart = content.indexOf(placeholderText);
                
                node.setSelectionRange(placeholderStart, placeholderStart + placeholderText.length);
                window.Placeholder.justSelected = true;
            }
            return false;
        }

        // Handle other key events...
        if (isSnippetSubstitutionKey(e, keyCode, key)) {
            e.preventDefault();
            isSnippetPresent(node);
            return;
        }
    };

    handleKeyPress = function (e) {
        console.log('handleKeyPress called', e);
        const node = e.target;
        console.log('Target node:', node);
        
        if (!isUsableNode(node)) {
            console.log('Node not usable:', node);
            return;
        }
        console.log('Node is usable');

        const charTyped = String.fromCharCode(e.charCode);
        console.log('Char typed:', charTyped);

        // Handle dot mode and suggestions
        if (getDotMode() && Data.dotPhrasesEnabled) {
            console.log('In dot mode, buffer:', getDotBuffer());
            if (charTyped === ' ' || e.charCode === 13) { // Space or Enter
                console.log("Space/Enter pressed in dot mode");
                if (e.charCode === 13) {
                    // For Enter key, we already handled it in keyDown
                    return false;
                }
                e.preventDefault(); // Prevent default behavior immediately
                e.stopPropagation(); // Stop event propagation immediately
                e.stopImmediatePropagation(); // Stop other handlers from executing
                
                const suggestionResult = selectSuggestion(0, node);
                if (suggestionResult) {
                    // Only clean up if no placeholder was selected
                    if (!window.Placeholder.justSelected) {
                        console.log('No placeholder selected, cleaning up state in keypress');
                        setDotMode(false);
                        updateDotBuffer('');
                        setDotPosition(-1);
                        setOriginalNode(null);
                        setOriginalRange(null);
                    } else {
                        console.log('Placeholder selected, keeping state in keypress');
                    }
                    return false; // Prevent further handling
                }
            } else if (charTyped === '.') {
                console.log('Dot pressed, entering dot mode. dotPhrasesEnabled:', Data.dotPhrasesEnabled);
                if (Data.dotPhrasesEnabled) {
                    // Exit placeholder mode if active
                    if (window.Placeholder && window.Placeholder.mode) {
                        console.log('Exiting placeholder mode to enter dot mode');
                        window.Placeholder.mode = false;
                        window.Placeholder.currentIndex = -1;
                    }
                    setDotMode(true);
                    justEnteredDotMode = true;  // Set the flag
                    updateDotBuffer('');
                    
                    // Store the range and position for all editors
                    if (node.isContentEditable) {
                        const sel = window.getSelection();
                        if (sel.rangeCount > 0) {
                            const range = sel.getRangeAt(0);
                            setOriginalRange(range.cloneRange());
                            setOriginalNode(node);
                            setDotPosition(range.startOffset);
                        }
                    } else {
                        // For input/textarea elements
                        setOriginalNode(node);
                        setDotPosition(node.selectionStart);
                    }
                    
                    // For Gmail, ensure the dot is inserted and dot mode is activated
                    if (window.isGmail) {
                        // Insert the dot
                        document.execCommand('insertText', false, '.');
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                    
                    // Update suggestions for all editors
                    updateSuggestions(node);
                }
                return;
            } else {
                // For Gmail, preserve the dot and handle character insertion
                if (window.isGmail) {
                    e.preventDefault(); // Prevent default character insertion
                    e.stopPropagation(); // Also stop propagation
                    
                    // Update the buffer first
                    const currentBuffer = getDotBuffer();
                    const newBuffer = currentBuffer + charTyped;
                    updateDotBuffer(newBuffer);
                    
                    // Insert the character
                    document.execCommand('insertText', false, charTyped);
                    
                    // Update suggestions immediately
                    updateSuggestions(node);
                    
                    // Store new range
                    const sel = window.getSelection();
                    if (sel.rangeCount > 0) {
                        const newRange = sel.getRangeAt(0);
                        setOriginalRange(newRange.cloneRange());
                    }
                    return false;
                } else {
                    // Original behavior for other editors
                    updateDotBuffer(getDotBuffer() + charTyped);
                    updateSuggestions(node);
                }
            }
        } else if (charTyped === '.') {
            console.log('Dot pressed, entering dot mode. dotPhrasesEnabled:', Data.dotPhrasesEnabled);
            if (Data.dotPhrasesEnabled) {
                // Exit placeholder mode if active
                if (window.Placeholder && window.Placeholder.mode) {
                    console.log('Exiting placeholder mode to enter dot mode');
                    window.Placeholder.mode = false;
                    window.Placeholder.currentIndex = -1;
                }
                setDotMode(true);
                justEnteredDotMode = true;  // Set the flag
                updateDotBuffer('');
                
                // Store the range and position for all editors
                if (node.isContentEditable) {
                    const sel = window.getSelection();
                    if (sel.rangeCount > 0) {
                        const range = sel.getRangeAt(0);
                        setOriginalRange(range.cloneRange());
                        setOriginalNode(node);
                        setDotPosition(range.startOffset);
                    }
                } else {
                    // For input/textarea elements
                    setOriginalNode(node);
                    setDotPosition(node.selectionStart);
                }
                
                // For Gmail, ensure the dot is inserted and dot mode is activated
                if (window.isGmail) {
                    // Insert the dot
                    document.execCommand('insertText', false, '.');
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                
                // Update suggestions for all editors
                updateSuggestions(node);
            }
            return;
        }
        
        // Rest of the handleKeyPress function...
        const autoInsertPairs = getAutoInsertPairs();
        const autoInsertTyped = getAutoInsertTyped();
        if (
            autoInsertTyped
            && autoInsertPairs[0]
            && getCharFollowingCaret(node) === charTyped
        ) {
            e.preventDefault();

            shiftCaretByCount(node, 1);

            setAutoInsertTyped(false);
        } else if (autoInsertPairs[0]) {
            // #197: disable auto-inserts for emojis
            if (
                !(
                    "({".indexOf(autoInsertPairs[0]) > -1
                    && previousCharactersForEmoji(node)
                )
            ) {
                e.preventDefault();
                insertCharacter(node, autoInsertPairs[0], autoInsertPairs[1]);

                setAutoInsertTyped(true);
            }
        }

        // to type date, we do [[date=]] and for time we do [[time=]]
        // so check for that
        if (charTyped === "=") {
            // wait till the = sign actually appears in node value
            const win = getNodeWindow(node);
            setTimeout(provideDoubleBracketFunctionality, 10, node, win);
        }

        // this logic of Placeholder only for textarea
        // about adjusting toIndex to match typed text
        const placeholderState = updatePlaceholderState();
        if (placeholderState && !placeholderState.isCENode) {
            const caretPos = node.selectionStart;

            if (
                placeholderState.mode
                && caretPos >= placeholderState.fromIndex
                && caretPos <= placeholderState.toIndex
            ) {
                // when you select text of length 10, and press one key
                // I have to subtract 9 chars in toIndex
                if (placeholderState.justSelected) {
                    placeholderState.justSelected = false;
                    setIndexIncrease(getIndexIncrease() - placeholderState.selectionLength);
                }

                placeholderState.toIndex += getIndexIncrease();
            }
        }
    };

    handleKeyUp = function(e) {
        // Update modifier state tracking
        updateModifierState(e);
    };

    // Helper functions for different tab navigation types
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
        window.Placeholder.justSelected = true;
        
        // Ensure the placeholder is visible
        node.focus();
        // Scroll the textarea if needed
        if (node.scrollHeight > node.clientHeight) {
            const lineHeight = parseInt(window.getComputedStyle(node).lineHeight);
            const lines = content.substr(0, finalStart).split('\n').length - 1;
            node.scrollTop = lines * lineHeight;
        }
    }

    function handleRichTextTabNavigation(placeholder) {
        console.log('Handling rich text tab navigation:', { placeholder });
        
        if (!window.Placeholder || !window.Placeholder.node) {
            console.error('No placeholder node available');
            return;
        }

        try {
            const selection = window.getSelection();
            const range = document.createRange();
            
            // Find the text node containing the placeholder
            function findTextNodeWithContent(node, searchText) {
                console.log('findTextNodeWithContent called with:', {
                    nodeType: node.nodeType,
                    nodeName: node.nodeName,
                    searchText: searchText,
                    nodeContent: node.nodeType === 3 ? node.textContent : node.innerHTML
                });

                // First normalize the node to merge adjacent text nodes
                node.normalize();
                console.log('After normalization:', {
                    childNodes: node.childNodes.length,
                    innerHTML: node.innerHTML
                });
                
                // Helper function to get text content ignoring <br> tags
                function getTextWithoutBRs(node) {
                    const content = node.innerHTML ? 
                        node.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '') : 
                        node.textContent;
                    console.log('getTextWithoutBRs:', {
                        original: node.innerHTML || node.textContent,
                        processed: content
                    });
                    return content;
                }
                
                // For text nodes, check directly
                if (node.nodeType === 3) {
                    console.log('Checking text node:', {
                        content: node.textContent,
                        includes: node.textContent.includes(searchText)
                    });
                    if (node.textContent.includes(searchText)) {
                        console.log('Found in text node!');
                        return node;
                    }
                } 
                // For element nodes, check innerHTML and recursively check children
                else if (node.nodeType === 1) {
                    console.log('Checking element node:', {
                        tag: node.tagName,
                        innerHTML: node.innerHTML
                    });
                    
                    // First check if this element's direct text contains the placeholder
                    const elementText = getTextWithoutBRs(node);
                    console.log('Element text content:', {
                        text: elementText,
                        includes: elementText.includes(searchText)
                    });
                    
                    if (elementText.includes(searchText)) {
                        console.log('Found in element text, checking immediate children');
                        // If found, look through immediate child text nodes
                        for (let child of node.childNodes) {
                            if (child.nodeType === 3 && child.textContent.includes(searchText)) {
                                console.log('Found in immediate child text node!');
                                return child;
                            }
                        }
                        
                        console.log('Not found in immediate children, creating new text node');
                        // If not found in immediate children, create a new text node
                        const textNode = document.createTextNode(elementText);
                        node.innerHTML = ''; // Clear existing content
                        node.appendChild(textNode);
                        return textNode;
                    }
                    
                    // Recursively check children
                    console.log('Checking children recursively');
                    for (let child of node.childNodes) {
                        const result = findTextNodeWithContent(child, searchText);
                        if (result) {
                            console.log('Found in child node!');
                            return result;
                        }
                    }
                }
                
                console.log('No matching text node found');
                return null;
            }

            const textNode = findTextNodeWithContent(window.Placeholder.node, placeholder);
            
            if (!textNode) {
                console.error('Text node with placeholder not found');
                return;
            }
            
            const placeholderStart = textNode.textContent.indexOf(placeholder);
            range.setStart(textNode, placeholderStart);
            range.setEnd(textNode, placeholderStart + placeholder.length);
            
            selection.removeAllRanges();
            selection.addRange(range);
            window.Placeholder.justSelected = true;
            
            // Ensure the placeholder is visible
            textNode.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (error) {
            console.error('Error in rich text tab navigation:', error);
        }
    }

    // Function to insert a snippet into a plain text editor (textarea or input)
    function insertSnippet(node, snip) {
        console.log('Inserting snippet into plain text editor:', snip);
        const start = node.selectionStart;
        
        // Create a proper Snip object from the raw snippet data
        const snippetObj = new Snip(snip.name, snip.body, snip.timestamp);
        
        snippetObj.formatMacros((snipBody) => {
            // Make the snippet body suitable for plain text
            snipBody = Snip.makeHTMLSuitableForTextareaThroughString(snipBody);
            
            // Insert the snippet at cursor position
            const textBeforeCursor = node.value.substring(0, start);
            const textAfterCursor = node.value.substring(start);
            node.value = textBeforeCursor + snipBody + textAfterCursor;
            
            // Test for placeholders in the inserted content
            testPlaceholderPresence(node, node.value, 0);
        });
    }

    // Function to insert a snippet into a contenteditable node
    function insertSnippetInContentEditableNode(node, snip) {
        if (!node || !snip) {
            console.error("Invalid parameters for insertSnippetInContentEditableNode:", { node, snip });
            return false;
        }

        try {
            const win = node.ownerDocument.defaultView || node.ownerDocument.parentWindow;
            const sel = win.getSelection();
            const range = sel.getRangeAt(0);
            
            // Create a proper Snip object and format macros
            const snippetObj = new Snip(snip.name, snip.body, snip.timestamp);
            snippetObj.formatMacros((formattedContent) => {
                let content = formattedContent;
                try {
                    // Try to parse as JSON for table content
                    const parsed = JSON.parse(content);
                    if (parsed.type === 'quill-table-content' && parsed.html) {
                        let html = parsed.html.trim();
                        console.log('Raw table HTML:', JSON.stringify(html));
                        // Remove temporary tags and their contents
                        html = html.replace(/<temporary[^>]*>.*?<\/temporary>/g, '');
                        if (!html.includes('style=')) {
                            html = html.replace('<table', '<table style="border-collapse: collapse; width: 100%;"');
                        }
                        if (!html.includes('td style=')) {
                            html = html.replace(/<td/g, '<td style="border: 1px solid #ccc; padding: 8px;"');
                        }
                        if (!html.includes('th style=')) {
                            html = html.replace(/<th/g, '<th style="border: 1px solid #ccc; padding: 8px; background-color: #f2f2f2;"');
                        }
                        // Remove any remaining <br> tags before the table
                        html = html.replace(/^(?:\s*<br\s*\/?>\s*)+(<table)/i, '$1');
                        // Remove extra paragraphs at the end
                        html = html.replace(/(<\/table>)(?:\s*<p>\s*<br\s*\/?>\s*<\/p>\s*)+$/i, '$1');
                        content = html;
                        console.log('Processed table HTML:', JSON.stringify(content));
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

                // Create a temporary div to hold the content
                const contentDiv = document.createElement('div');
                contentDiv.innerHTML = content.trim();
                
                // Create a document fragment
                const fragment = document.createDocumentFragment();
                
                // Handle whitespace properly
                let firstNode = contentDiv.firstChild;
                while (firstNode) {
                    // Skip empty text nodes
                    if (firstNode.nodeType === Node.TEXT_NODE && !firstNode.textContent.trim()) {
                        const nextNode = firstNode.nextSibling;
                        contentDiv.removeChild(firstNode);
                        firstNode = nextNode;
                        continue;
                    }
                    fragment.appendChild(firstNode);
                    firstNode = contentDiv.firstChild;
                }
                
                // Insert the content
                range.insertNode(fragment);
                
                // Wait for DOM to be updated before testing for placeholders
                setTimeout(() => {
                    // Normalize the node to merge adjacent text nodes
                    node.normalize();
                    
                    // Get the full content after normalization
                    const fullContent = node.innerHTML;
                    console.log('Content after insertion:', fullContent);
                    
                    // Test for placeholders in the normalized content
                    testPlaceholderPresence(node, fullContent, 0);
                    
                    // Move cursor to end of inserted content
                    const newRange = document.createRange();
                    const lastNode = node.lastChild;
                    newRange.setStartAfter(lastNode);
                    newRange.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(newRange);
                }, 100); // Give the DOM time to update
                
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

    // Attach functions to window object for external use
    window.insertSnippet = insertSnippet;

    // Helper function to check if we're in an empty editor state
    function isEmptyEditorState(node, passedRange) {
        // Get current selection range if not provided
        let range;
        if (passedRange) {
            range = passedRange;
        } else {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) {
                // No selection, consider editor empty
                console.log('No selection range found');
                return true;
            }
            range = selection.getRangeAt(0);
        }

        if (!range) {
            console.log('No valid range found');
            return true;
        }

        console.log('Checking editor state:', { 
            startOffset: range.startOffset,
            nodeType: node.nodeType,
            innerHTML: node.innerHTML
        });

        // Check if we're at the start of the editor
        if (range.startOffset > 1) {
            console.log('Not at start of editor');
            return false;
        }

        // Get the first block element
        const firstBlock = node.querySelector('p') || node.firstElementChild;
        if (!firstBlock) {
            console.log('No block elements found');
            return true;
        }

        // Check content
        const content = firstBlock.innerHTML.trim();
        const hasOnlyBr = content === '<br>' || content === '<br/>';
        const hasOnlyZeroWidth = content === '&#8203;';
        const isEmpty = content === '' || hasOnlyBr || hasOnlyZeroWidth;

        console.log('First block analysis:', {
            content,
            hasOnlyBr,
            hasOnlyZeroWidth,
            isEmpty
        });

        return isEmpty;
    }

    // attaches event to document receives
    // `this` as the function to call on event
    function keyEventAttacher(handler) {
        return function (event) {
            const node = event.target;
            if (isUsableNode(node)) {
                handler.call(node, event);
            }
        };
    }

    const onKeyDownFunc = keyEventAttacher(handleKeyDown),
        onKeyPressFunc = keyEventAttacher(handleKeyPress),
        onKeyUpFunc = keyEventAttacher(handleKeyUp);

    // Attach handlers only once per window
    const handlerAttached = new WeakMap();
    
    function attachNecessaryHandlers(win, isBlocked) {
        // Check if handlers are already attached to this window
        if (handlerAttached.get(win)) {
            console.log("Handlers already attached to window, skipping");
            return;
        }
        
        console.log("Attaching handlers, isBlocked:", isBlocked);

        if (isBlocked) {
            console.log("Page is blocked, not attaching key handlers");
            return;
        }

        // For Gmail, try to find the compose editor directly
        if (window.isGmail) {
            console.log("Attaching handlers for Gmail");
            const findAndAttachToEditor = () => {
                // Common Gmail editor selectors
                const editorSelectors = [
                    'div[contenteditable="true"][role="textbox"]',
                    'div[contenteditable="true"][aria-label*="Message"]',
                    'div[contenteditable="true"][aria-label*="Compose"]',
                    'div[g_editable="true"]'
                ];

                // Try each selector
                for (const selector of editorSelectors) {
                    const editors = document.querySelectorAll(selector);
                    editors.forEach(editor => {
                        if (!editor.dataset.prokeysHandled) {
                            console.log("Found Gmail editor:", editor);
                            editor.dataset.prokeysHandled = 'true';
                            editor.addEventListener('keydown', (e) => {
                                updateModifierState(e);
                                handleKeyDown(e);
                            });
                            editor.addEventListener('keypress', (e) => {
                                updateModifierState(e);
                                handleKeyPress(e);
                            });
                            editor.addEventListener('keyup', (e) => {
                                updateModifierState(e);
                                handleKeyUp(e);
                            });
                        }
                    });
                }
            };

            // Initial check
            findAndAttachToEditor();

            // Watch for dynamically added editors
            const observer = new MutationObserver(() => {
                findAndAttachToEditor();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Attach regular handlers
        const keyDownHandler = function(e) {
            updateModifierState(e);
            handleKeyDown(e);
        };
        
        const keyUpHandler = function(e) {
            updateModifierState(e);
            handleKeyUp(e);
        };
        
        const keyPressHandler = function(e) {
            updateModifierState(e);
            handleKeyPress(e);
        };

        win.document.addEventListener('keydown', keyDownHandler, true);
        win.document.addEventListener('keypress', keyPressHandler, true);
        win.document.addEventListener('keyup', keyUpHandler, true);

        // Add beforeinput handler for contentEditable elements
        win.document.addEventListener('beforeinput', (e) => {
            const node = e.target;
            if (node.isContentEditable) {
                // Check if this is a hotkey event using the configured hotkey
                const fakeEvent = {
                    type: 'keydown',
                    key: e.data,
                    shiftKey: getModifierStates().shiftKey,
                    ctrlKey: getModifierStates().ctrlKey,
                    altKey: getModifierStates().altKey,
                    metaKey: getModifierStates().metaKey,
                    preventDefault: () => e.preventDefault(),
                    stopPropagation: () => e.stopPropagation()
                };
                
                if (shouldHandleHotkey(fakeEvent)) {
                    e.preventDefault();
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0).cloneRange();
                        isSnippetPresent(node, null, range, true);
                    }
                }
            }
        }, true);
        
        // Mark handlers as attached
        handlerAttached.set(win, true);
        
        console.log("Key handlers attached to document");
    }

    if (!window.IN_OPTIONS_PAGE) {
        console.log("Not in options page, getting DB");
        DBget(afterDBget);
    } else {
        console.log("In options page, not getting DB");
    }
    
    // Make insertSnippetInContentEditableNode available globally
    window.insertSnippetInContentEditableNode = insertSnippetInContentEditableNode;

    // Expose state management functions to window object
    window.resetModifierStates = resetModifierStates;
    window.resetAllState = resetAllState;
    window.getOriginalNode = getOriginalNode;
    window.getOriginalRange = getOriginalRange;

    // Google Docs integration
    (function() {
        // Check if we're in Google Docs
        if (!window.location.href.includes('docs.google.com')) {
            return;
        }

        // Listen for keydown events
        document.addEventListener('keydown', async function(event) {
            // Check for Tab key with any modifiers
            if (event.key === 'Tab' && (event.shiftKey || event.ctrlKey || event.altKey)) {
                event.preventDefault(); // Prevent default Tab behavior
                
                try {
                    // Get the active element (should be the Google Docs editor)
                    const editor = document.querySelector('.kix-appview-editor');
                    if (!editor) {
                        console.log('Editor not found');
                        return;
                    }

                    // Get text before cursor
                    const textBeforeCursor = getTextFromGoogleDocs();
                    if (!textBeforeCursor) {
                        console.log('No text before cursor');
                        return;
                    }

                    // Find the last word before cursor
                    const match = textBeforeCursor.match(/\S+$/);
                    if (!match) {
                        console.log('No word found before cursor');
                        return;
                    }

                    const snippetName = match[0];
                    console.log('Looking for snippet:', snippetName);

                    // Request snippet content from service worker
                    const response = await chrome.runtime.sendMessage({
                        type: 'getSnippetContent',
                        snippetName: snippetName
                    });
                    
                    if (response.success) {
                        // Delete the snippet name using backspace
                        for (let i = 0; i < snippetName.length; i++) {
                            simulateKeyPress('Backspace');
                        }
                        
                        // Wait a bit for the backspaces to complete
                        await new Promise(resolve => setTimeout(resolve, 50));
                        
                        // Trigger paste
                        document.execCommand('paste');
                    }
                } catch (error) {
                    console.error('Error handling snippet in Google Docs:', error);
                }
            }
        });

        // Helper function to get text from Google Docs
        function getTextFromGoogleDocs() {
            try {
                // Get the cursor line
                const cursorLine = document.querySelector('.kix-cursor.docs-cursor-selectable');
                if (!cursorLine) return '';

                // Get the text element before the cursor
                const textElements = document.querySelectorAll('.kix-lineview .kix-wordhtmlgenerator-word-node');
                let text = '';
                let foundCursor = false;

                for (const element of textElements) {
                    const rect = element.getBoundingClientRect();
                    const cursorRect = cursorLine.getBoundingClientRect();

                    // If we're on the same line as the cursor
                    if (Math.abs(rect.top - cursorRect.top) < 5) {
                        // If we haven't found the cursor yet, add the text
                        if (!foundCursor) {
                            text += element.textContent;
                        }
                        // If this element contains or is after the cursor, stop
                        if (rect.left >= cursorRect.left) {
                            foundCursor = true;
                        }
                    }
                }

                return text;
            } catch (error) {
                console.error('Error getting text from Google Docs:', error);
                return '';
            }
        }

        // Helper function to simulate key press
        function simulateKeyPress(key) {
            const keyEvent = new KeyboardEvent('keydown', {
                key: key,
                code: 'Key' + key,
                keyCode: key === 'Backspace' ? 8 : key.charCodeAt(0),
                which: key === 'Backspace' ? 8 : key.charCodeAt(0),
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(keyEvent);
        }
    })();
})(window);
