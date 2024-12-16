/**
 * State manager for ProKeys
 * Handles all global state in a centralized location
 */

// Editor State
let originalNode = null;
let originalRange = null;
let dotPosition = -1;

// Auto-insert State
let autoInsertPairFirstChar = [];
let autoInsertPairSecondChar = [];
let autoInsertTyped = false;
let toIndexIncrease = 0;

// Modifier Key States
const modifierStates = {
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    keySequence: [], // Track key sequence
    lastKeyPressed: null
};

// Editor State Management
export function setOriginalNode(node) {
    originalNode = node;
}

export function getOriginalNode() {
    return originalNode;
}

export function setOriginalRange(range) {
    originalRange = range;
}

export function getOriginalRange() {
    return originalRange;
}

export function setDotPosition(position) {
    dotPosition = position;
}

export function getDotPosition() {
    return dotPosition;
}

// Auto-insert State Management
export function setAutoInsertPairs(firstChar, secondChar) {
    autoInsertPairFirstChar = firstChar;
    autoInsertPairSecondChar = secondChar;
}

export function getAutoInsertPairs() {
    return {
        firstChar: autoInsertPairFirstChar,
        secondChar: autoInsertPairSecondChar
    };
}

export function setAutoInsertTyped(typed) {
    autoInsertTyped = typed;
}

export function getAutoInsertTyped() {
    return autoInsertTyped;
}

export function setIndexIncrease(increase) {
    toIndexIncrease = increase;
}

export function getIndexIncrease() {
    return toIndexIncrease;
}

// Modifier Key State Management
export function updateModifierState(event) {
    console.log('State Manager - updateModifierState:', {
        type: event.type,
        key: event.key,
        currentStates: { ...modifierStates },
        eventModifiers: {
            shiftKey: event.shiftKey,
            ctrlKey: event.ctrlKey,
            altKey: event.altKey,
            metaKey: event.metaKey
        }
    });

    // Always update modifier states based on event properties
    modifierStates.shiftKey = event.shiftKey;
    modifierStates.ctrlKey = event.ctrlKey;
    modifierStates.altKey = event.altKey;
    modifierStates.metaKey = event.metaKey;

    // Update key sequence
    if (event.type === 'keydown') {
        if (!modifierStates.keySequence.includes(event.key)) {
            modifierStates.keySequence.push(event.key);
        }
        
        // Keep only the last 2 keys in the sequence
        if (modifierStates.keySequence.length > 2) {
            modifierStates.keySequence.shift();
        }
        
        modifierStates.lastKeyPressed = event.key;
    } else if (event.type === 'keyup') {
        modifierStates.keySequence = modifierStates.keySequence.filter(k => k !== event.key);
        
        if (event.key === modifierStates.lastKeyPressed) {
            modifierStates.lastKeyPressed = null;
        }
    }

    console.log('State Manager - After update:', {
        states: { ...modifierStates },
        sequence: [...modifierStates.keySequence]
    });
}

export function getModifierStates() {
    return { ...modifierStates };
}

export function resetModifierStates() {
    modifierStates.shiftKey = false;
    modifierStates.ctrlKey = false;
    modifierStates.altKey = false;
    modifierStates.metaKey = false;
    modifierStates.keySequence = [];
    modifierStates.lastKeyPressed = null;
}

// Event Priority Management
export function shouldHandleHotkey(event) {
    // Only handle on keydown
    if (event.type !== 'keydown') {
        console.log('Not a keydown event');
        return false;
    }

    // Get configured hotkey
    if (!window.Data || !window.Data.hotKey || !Array.isArray(window.Data.hotKey)) {
        console.log('No hotkey configured:', window.Data?.hotKey);
        return false;
    }

    const [modifierKey, key] = window.Data.hotKey;
    const pressedKey = event.key === 'Tab' ? 'Tab' : (event.key === ' ' ? 'Space' : event.key);
    const normalizedConfigKey = key === ' ' ? 'Space' : (key === 'Tab' ? 'Tab' : key);

    // Convert modifier key to proper event property name
    const modifierPropName = modifierKey.toLowerCase().endsWith('key') ? 
        modifierKey.charAt(0).toLowerCase() + modifierKey.slice(1) : 
        modifierKey.charAt(0).toLowerCase() + modifierKey.slice(1) + 'Key';

    console.log('Checking hotkey:', {
        pressedKey,
        normalizedConfigKey,
        modifierKey,
        modifierPropName,
        modifierStates,
        event: {
            key: event.key,
            shiftKey: event.shiftKey,
            ctrlKey: event.ctrlKey,
            altKey: event.altKey,
            metaKey: event.metaKey
        }
    });

    // Check if this is just a modifier key press
    const modifierKeys = ['Shift', 'Control', 'Alt', 'Meta'];
    if (modifierKeys.includes(pressedKey)) {
        console.log('Modifier key pressed, ignoring');
        return false;
    }

    // Check if the hotkey combination is pressed
    const keyMatches = pressedKey === normalizedConfigKey;
    const modifierMatches = event[modifierPropName] === true;
    
    // Return result without resetting state - let the handler reset state after processing
    return keyMatches && modifierMatches;
}

/**
 * Determines if tab key should be handled by ProKeys
 * @param {Event} e - The keyboard event
 * @param {boolean} placeholderMode - Whether placeholder mode is active
 * @param {boolean} dotMode - Whether dot mode is active
 * @returns {string|false} - Returns 'dotmode' if in dot mode, 'placeholder' if in placeholder mode, false otherwise
 */
export function shouldHandleTabKey(e, placeholderMode, dotMode) {
    // First check if this is a hotkey combination
    if (shouldHandleHotkey(e)) {
        console.log('Tab is part of hotkey combination, not handling as special tab');
        return false;
    }

    // Prevent default tab behavior if we're handling it
    if (dotMode || placeholderMode) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Dot mode takes precedence over placeholder mode
    if (dotMode) {
        console.log('In dot mode, handling tab');
        return 'dotmode';
    }

    if (placeholderMode) {
        console.log('In placeholder mode, handling tab');
        return 'placeholder';
    }

    console.log('No special tab handling needed');
    return false;
}

// Editor State Checks
export function isEmptyEditorState(node, passedRange) {
    // If no node is passed, check if we have an original node
    if (!node && !originalNode) {
        return true;
    }

    // If no range is passed, check if we have an original range
    if (!passedRange && !originalRange) {
        return true;
    }

    return false;
}

// State Reset
export function resetAllState() {
    // Reset editor state
    originalNode = null;
    originalRange = null;
    dotPosition = -1;

    // Reset auto-insert state
    autoInsertPairFirstChar = [];
    autoInsertPairSecondChar = [];
    autoInsertTyped = false;
    toIndexIncrease = 0;

    // Reset modifier states
    resetModifierStates();
    
    // Reset hotkey-specific state
    resetModifierSequence();
    clearHotkeyFlags();
}

// Reset modifier sequence
export function resetModifierSequence() {
    if (window.modifierSequence) {
        window.modifierSequence = [];
    }
}

// Clear hotkey flags
export function clearHotkeyFlags() {
    // Reset any hotkey-related flags
    window.hotkeyActive = false;
    window.lastHotkeyTime = 0;
}
