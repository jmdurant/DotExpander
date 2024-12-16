// Constants for service worker
import { Folder } from "./service-worker-classes.js";

// Storage size limits (in bytes)
export const MAX_SYNC_DATA_SIZE = 102400; // 100KB for sync storage
export const MAX_LOCAL_DATA_SIZE = 5242880; // 5MB for local storage

export const SETTINGS_DEFAULTS = {
    snippets: null, // Will be initialized in service worker
    blockedSites: [],
    charsToAutoInsertUserList: [["(", ")"], ["{", "}"], ["\"", "\""], ["[", "]"]],
    dataVersion: 1,
    language: "English",
    hotKey: ["shiftKey", "Tab"],
    dataUpdateVariable: true,
    matchDelimitedWord: true,
    tabKey: false,
    snipNameDelimiterList: " @#$%&*+-=(){}[]:\"'/_<>?!.,",
    omniboxSearchURL: "https://www.google.com/search?q=SEARCH",
    wrapSelectionAutoInsert: true,
    ctxEnabled: true,
    dotPhrasesEnabled: true,
};

export const OLD_DATA_STORAGE_KEY = "UserSnippets";
export const LS_STORAGE_TYPE_PROP = "storageType";
export const LS_REVISIONS_PROP = "revisions";
