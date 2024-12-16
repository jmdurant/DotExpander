/**
 * Configuration constants for ProKeys extension
 */

// Debug Settings
export const DEBUG = {
    ENABLED: false,
    OBJECT_NAME_LIMIT: 50,
};

// DOM Related
export const DOM = {
    SHOW_CLASS: "show",
    PRIMITIVES_EXT_KEY: "primitivesExtended",
};

// URL and Site Settings
export const URL = {
    BLOCKED_PATTERNS: [
        /^chrome-extension:/,
        /^chrome:/,
        /^https?:\/\/chrome\.google\.com/,
        /^about:blank/,
        /^www\./i,
    ],
};

// Keyboard Settings
export const KEYBOARD = {
    // Add keyboard-related constants here
    MODIFIER_KEYS: ["Control", "Alt", "Shift", "Meta"],
    SPECIAL_KEYS: {
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        TAB: 9,
    },
};

// Snippet Settings
export const SNIPPETS = {
    MAX_SEARCH_LENGTH: 50, // Maximum length of text to search for snippets
    FOLDER_TYPE: "folder",
};

// UI Settings
export const UI = {
    ANIMATION_DURATION: 300, // Duration for UI animations in milliseconds
    DEFAULT_DEBOUNCE_DELAY: 250, // Default delay for debounced functions
};

// File Settings
export const FILE = {
    DEFAULT_EXPORT_FILENAME: "prokeys-backup.json",
    ALLOWED_EXTENSIONS: [".txt", ".json"],
};

// API Settings
export const API = {
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // Delay between retries in milliseconds
};
