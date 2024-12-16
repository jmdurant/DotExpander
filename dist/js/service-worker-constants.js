// Constants for service worker
import { Folder } from "./service-worker-classes.js";

export const SETTINGS_DEFAULTS = {
    snippets: null,  // Will be initialized in service worker
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
