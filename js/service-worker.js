// Service worker implementation
import {
    SETTINGS_DEFAULTS,
    LS_STORAGE_TYPE_PROP,
    OLD_DATA_STORAGE_KEY,
    LS_REVISIONS_PROP
} from "./service-worker-constants.js";

import { Folder, Snip, Generic } from './service-worker-classes.js';
import { serializeSnippetData, deserializeSnippetData } from './service-worker-serialization.js';
import { createSnippet, editSnippet, deleteSnippet } from './service-worker-operations.js';

// Import tests in development mode
if (process.env.NODE_ENV === 'development') {
    import('./service-worker-tests.js').catch(console.error);
}

// Initialize state
const storage = chrome.storage.local;
let Data = null;
let contextMenuActionBlockSite = false;
let isInitialized = false;  // Add flag to track initialization
let isInitializing = false; // Add flag to track initialization in progress
let storageType = 'local';  // Default storage type

// Function to get storage type
async function getStorageType() {
    try {
        const result = await chrome.storage.local.get(LS_STORAGE_TYPE_PROP);
        return result[LS_STORAGE_TYPE_PROP] || 'local';
    } catch (error) {
        console.error('Error getting storage type:', error);
        return 'local';
    }
}

// Function to set storage type
async function setStorageType(type) {
    try {
        await chrome.storage.local.set({ [LS_STORAGE_TYPE_PROP]: type });
        storageType = type;
    } catch (error) {
        console.error('Error setting storage type:', error);
    }
}

// Modify decideCorrectStorageType to use chrome.storage
async function decideCorrectStorageType() {
    try {
        await setStorageType('local');
        const response = await chrome.storage.local.get(OLD_DATA_STORAGE_KEY);
        const Data = response[OLD_DATA_STORAGE_KEY];
        
        if (Data && Data.snippets === false) {
            await setStorageType('sync');
        }
        
        return storageType;
    } catch (error) {
        console.error('Error deciding storage type:', error);
        return 'local';
    }
}

// Debug logging function
function logDebug(context, data, error = false) {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] [DotExpander Debug] ${context}: ${JSON.stringify(data, (key, value) => {
        if (value instanceof Folder) return `[Folder: ${value.name}]`;
        if (value instanceof Snip) return `[Snip: ${value.name}]`;
        return value;
    }, 2)}`;
    if (error) {
        console.error(message);
    } else {
        console.log(message);
    }
}

// Constants
const BLOCK_SITE_ID = "blockSite";
const SNIPPET_MAIN_ID = "snippet_main";
const URL_REGEX = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/;

// Constants for chunking
const CHUNK_KEY_PREFIX = 'chunk_';
const CHUNK_SIZE = 7000; // Leave some buffer below 8KB limit

// Split data into chunks for storage
async function saveDataInChunks(data) {
    try {
        const storage = chrome.storage[await decideCorrectStorageType()];
        const serializedData = JSON.stringify(data);
        const chunks = [];
        
        // Split data into chunks
        for (let i = 0; i < serializedData.length; i += CHUNK_SIZE) {
            chunks.push(serializedData.slice(i, i + CHUNK_SIZE));
        }
        
        // Save chunk metadata
        const metadata = {
            totalChunks: chunks.length,
            totalSize: serializedData.length,
            timestamp: Date.now()
        };
        
        // Clear old chunks first
        const oldKeys = await new Promise(resolve => {
            storage.get(null, items => {
                resolve(Object.keys(items).filter(key => key.startsWith(CHUNK_KEY_PREFIX)));
            });
        });
        if (oldKeys.length > 0) {
            await storage.remove(oldKeys);
        }
        
        // Save new chunks
        const savePromises = chunks.map((chunk, index) => {
            return storage.set({ [`${CHUNK_KEY_PREFIX}${index}`]: chunk });
        });
        
        // Save metadata and wait for all chunks to be saved
        await Promise.all([
            storage.set({ [`${CHUNK_KEY_PREFIX}metadata`]: metadata }),
            ...savePromises
        ]);
        
        return true;
    } catch (error) {
        console.error('[SAVE_CHUNKS] Error:', error);
        return false;
    }
}

// Load and combine chunks from storage
async function loadDataFromChunks() {
    try {
        const storage = chrome.storage[await decideCorrectStorageType()];
        
        // Get metadata first
        const metadataResult = await storage.get(`${CHUNK_KEY_PREFIX}metadata`);
        const metadata = metadataResult[`${CHUNK_KEY_PREFIX}metadata`];
        
        if (!metadata) {
            console.log('[LOAD_CHUNKS] No chunked data found');
            return null;
        }
        
        // Get all chunks
        const chunkKeys = Array.from({ length: metadata.totalChunks }, (_, i) => `${CHUNK_KEY_PREFIX}${i}`);
        const chunks = await storage.get(chunkKeys);
        
        // Combine chunks in order
        let combinedData = '';
        for (let i = 0; i < metadata.totalChunks; i++) {
            const chunk = chunks[`${CHUNK_KEY_PREFIX}${i}`];
            if (!chunk) {
                throw new Error(`Missing chunk ${i}`);
            }
            combinedData += chunk;
        }
        
        // Verify total size
        if (combinedData.length !== metadata.totalSize) {
            throw new Error('Data size mismatch after combining chunks');
        }
        
        return JSON.parse(combinedData);
    } catch (error) {
        console.error('[LOAD_CHUNKS] Error:', error);
        return null;
    }
}

// Initialize Data when service worker starts
const initializeData = async () => {
    try {
        logDebug('initializeData - Starting', null);
        
        // Determine correct storage type
        const storageType = await decideCorrectStorageType();
        logDebug('initializeData - Storage type', { storageType });
        
        // Initialize Data with defaults first
        Data = JSON.parse(JSON.stringify(SETTINGS_DEFAULTS)); // Deep clone defaults
        Data.snippets = Folder.getDefaultSnippetData(); // Initialize default snippets
        logDebug('initializeData - Default data initialized', {
            hasData: !!Data,
            hasSnippets: !!Data?.snippets
        });
        
        // Try to load chunked data
        const storedData = await loadDataFromChunks();
        if (storedData) {
            logDebug('initializeData - Loaded chunked data', {
                hasStoredSnippets: !!storedData?.snippets,
                storedDataKeys: Object.keys(storedData)
            });
            
            // Handle snippets separately with proper deserialization
            if (storedData.snippets) {
                Data.snippets = deserializeSnippetData(storedData.snippets);
                logDebug('initializeData - Deserialized snippets', {
                    isFolder: Data.snippets instanceof Folder,
                    rootName: Data.snippets?.name
                });
            }
            
            // Copy other properties
            for (const key in storedData) {
                if (key !== 'snippets') {
                    Data[key] = storedData[key];
                }
            }
        }
        
        // Now that we have a proper Folder instance, set indices
        if (Data.snippets) {
            logDebug('initializeData - Setting indices', {
                isFolder: Data.snippets instanceof Folder,
                rootName: Data.snippets?.name
            });
            Folder.setIndices(Data.snippets);
        }
        
        logDebug('initializeData - Complete', {
            storageType,
            dataLoaded: !!Data,
            hasSnippets: !!Data?.snippets,
            isSnippetsFolder: Data?.snippets instanceof Folder
        });
    } catch (error) {
        logDebug('initializeData - Error', error, true);
        Data = JSON.parse(JSON.stringify(SETTINGS_DEFAULTS)); // Deep clone defaults
        Data.snippets = Folder.getDefaultSnippetData();
        if (Data.snippets) {
            Folder.setIndices(Data.snippets);
        }
    }
};

// Data Management Functions
function makeDataReady() {
    logDebug('makeDataReady - Input Data', { hasData: !!Data, hasSnippets: !!Data?.snippets });
    
    if (Data && Data.snippets) {
        // If snippets is already a Folder instance, we're good
        if (!(Data.snippets instanceof Folder)) {
            try {
                logDebug('makeDataReady - Deserializing snippets', { 
                    snippetsType: typeof Data.snippets,
                    isArray: Array.isArray(Data.snippets)
                });
                // Try to deserialize the data
                Data.snippets = deserializeSnippetData(Data.snippets);
            } catch (error) {
                logDebug('makeDataReady - Error deserializing', error, true);
                // If deserialization fails, get default data
                Data.snippets = Folder.getDefaultSnippetData();
            }
        }
    } else {
        logDebug('makeDataReady - Using default data', null);
        Data.snippets = Folder.getDefaultSnippetData();
    }
    
    // Ensure indices are set
    if (Data.snippets) {
        logDebug('makeDataReady - Setting indices', { 
            rootFolder: Data.snippets.name,
            listLength: Data.snippets.list?.length
        });
        Folder.setIndices(Data.snippets);
    }
    
    logDebug('makeDataReady - Final Data state', {
        hasData: !!Data,
        hasSnippets: !!Data?.snippets,
        isSnippetsFolder: Data?.snippets instanceof Folder,
        rootFolderName: Data?.snippets?.name
    });
}

async function saveRevision(label) {
    try {
        const storage = chrome.storage[await getStorageType()];
        const result = await storage.get(LS_REVISIONS_PROP);
        const revisions = result[LS_REVISIONS_PROP] || {};
        
        // Serialize the data before saving
        const serializedData = {
            ...Data,
            snippets: serializeSnippetData(Data.snippets)
        };
        
        revisions[label || Date.now()] = serializedData;
        await storage.set({ [LS_REVISIONS_PROP]: revisions });
        return true;
    } catch (error) {
        console.error('Error saving revision:', error);
        return false;
    }
}

async function loadRevision(timestamp) {
    try {
        const storage = chrome.storage[await getStorageType()];
        const result = await storage.get(LS_REVISIONS_PROP);
        const revisions = result[LS_REVISIONS_PROP] || {};
        const revision = revisions[timestamp];
        
        if (revision) {
            // Deserialize the snippets data
            if (revision.snippets) {
                revision.snippets = deserializeSnippetData(revision.snippets);
            }
            Data = revision;
            makeDataReady();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error loading revision:', error);
        return false;
    }
}

// Modify the existing notifyDataChange function to use chunking
async function notifyDataChange() {
    try {
        // Ensure snippets is a proper Folder instance before serializing
        if (!(Data.snippets instanceof Folder)) {
            console.log('[SW] Converting snippets to Folder instance before save');
            Data.snippets = deserializeSnippetData(Data.snippets);
        }
        
        // Serialize the data before saving
        const serializedSnippets = serializeSnippetData(Data.snippets);
        console.log('[SW] Serialized snippets:', {
            type: serializedSnippets?.type,
            name: serializedSnippets?.name,
            listLength: serializedSnippets?.list?.length,
            isPlainObject: serializedSnippets?.constructor === Object
        });
        
        const dataToStore = {
            ...Data,
            snippets: serializedSnippets
        };
        
        console.log('[SW] Saving data to storage:', {
            hasData: !!dataToStore,
            hasSnippets: !!dataToStore?.snippets,
            storageType: await decideCorrectStorageType()
        });
        
        // Use chunking for storage
        const success = await saveDataInChunks(dataToStore);
        
        if (success) {
            // Save revision after successful storage
            try {
                await saveRevision('Updated data');
            } catch (error) {
                console.warn('[SW] Failed to save revision:', error);
                // Don't fail the whole operation if revision fails
            }
        }
        
        return success;
    } catch (error) {
        console.error('[SW] Error in notifyDataChange:', error);
        return false;
    }
}

// Debug function to display storage contents
async function debugDisplayStorage() {
    try {
        const storageType = await decideCorrectStorageType();
        const storage = chrome.storage[storageType];
        const data = await storage.get(OLD_DATA_STORAGE_KEY);
        
        console.log('[STORAGE DEBUG] Current storage contents:', {
            storageType,
            hasData: !!data[OLD_DATA_STORAGE_KEY],
            rawData: data[OLD_DATA_STORAGE_KEY],
            snippets: data[OLD_DATA_STORAGE_KEY]?.snippets,
        });
    } catch (error) {
        console.error('[STORAGE DEBUG] Error reading storage:', error);
    }
}

// Save data to storage
async function saveData() {
    try {
        console.log('[SAVE_DATA] Starting save');
        const success = await notifyDataChange();
        if (success) {
            console.log('[SAVE_DATA] Successfully saved data');
            return true;
        } else {
            console.error('[SAVE_DATA] Failed to save data');
            return false;
        }
    } catch (error) {
        console.error('[SAVE_DATA] Error saving:', error);
        return false;
    }
}

// Debug function to inspect storage contents
async function inspectStorage() {
    try {
        const storageType = await decideCorrectStorageType();
        const storage = chrome.storage[storageType];
        
        // Get all storage data
        const data = await new Promise(resolve => {
            storage.get(null, items => resolve(items));
        });
        
        console.log('[STORAGE_INSPECT] Storage type:', storageType);
        console.log('[STORAGE_INSPECT] All storage keys:', Object.keys(data));
        
        // Check UserSnippets
        if (data[OLD_DATA_STORAGE_KEY]) {
            console.log('[STORAGE_INSPECT] UserSnippets content:', data[OLD_DATA_STORAGE_KEY]);
        } else {
            console.log('[STORAGE_INSPECT] UserSnippets not found');
        }
        
        // Check for chunked data
        const chunkKeys = Object.keys(data).filter(key => key.startsWith(CHUNK_KEY_PREFIX));
        if (chunkKeys.length > 0) {
            console.log('[STORAGE_INSPECT] Found chunked data:');
            console.log('- Metadata:', data[`${CHUNK_KEY_PREFIX}metadata`]);
            console.log('- Number of chunks:', chunkKeys.length - 1); // -1 for metadata
        } else {
            console.log('[STORAGE_INSPECT] No chunked data found');
        }
        
        // Check storage usage
        const bytesInUse = await new Promise(resolve => {
            storage.getBytesInUse(null, bytes => resolve(bytes));
        });
        console.log('[STORAGE_INSPECT] Total bytes in use:', bytesInUse);
        
        return data;
    } catch (error) {
        console.error('[STORAGE_INSPECT] Error:', error);
        return null;
    }
}

// Message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[SW] Message received:', request);
    console.log('[SW] Current Data state:', Data);
    
    const handleMessage = async () => {
        try {
            // Ensure initialization is complete
            if (!isInitialized && !isInitializing) {
                console.log('[SW] Starting initialization');
                isInitializing = true;
                await initializeData();
                isInitialized = true;
                isInitializing = false;
            } else if (isInitializing) {
                console.log('[SW] Waiting for initialization to complete');
                while (isInitializing) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            
            // Handle Google Docs snippet request
            if (request.type === 'getSnippetContent') {
                console.log('[SW] Handling Google Docs snippet request:', request.snippetName);
                try {
                    // Find the snippet
                    const findSnippet = (folder, name) => {
                        if (!folder || !folder.list) return null;
                        for (const item of folder.list) {
                            if (item instanceof Snip && item.name === name) {
                                return item;
                            } else if (item instanceof Folder) {
                                const found = findSnippet(item, name);
                                if (found) return found;
                            }
                        }
                        return null;
                    };

                    const snippet = findSnippet(Data.snippets, request.snippetName);
                    if (snippet) {
                        // Write to clipboard
                        await writeToClipboard(snippet.body);
                        sendResponse({ success: true });
                    } else {
                        sendResponse({ success: false, error: 'Snippet not found' });
                    }
                } catch (error) {
                    console.error('[SW] Error handling Google Docs snippet:', error);
                    sendResponse({ success: false, error: error.message });
                }
                return;
            }

            // Handle getData request (both getData and giveData for backward compatibility)
            if (request.getData || request.giveData || request.type === 'getData') {
                console.log('[SW] Handling getData request');
                const serializedData = {
                    ...Data,
                    snippets: serializeSnippetData(Data.snippets)
                };
                console.log('[SW] Sending data response:', {
                    hasData: !!serializedData,
                    hasSnippets: !!serializedData?.snippets
                });
                sendResponse(serializedData);
                return;
            }

            // Handle getBytesInUse request
            if (request.getBytesInUse) {
                console.log('[SW] Handling getBytesInUse request');
                try {
                    const storage = chrome.storage[await decideCorrectStorageType()];
                    const bytes = await storage.getBytesInUse();
                    console.log('[SW] Storage bytes in use:', bytes);
                    sendResponse({ bytes });
                } catch (error) {
                    console.error('[SW] Error getting bytes in use:', error);
                    sendResponse({ bytes: 0 });
                }
                return;
            }

            // Handle updateStorage message
            if (request.type === 'updateStorage') {
                console.log('[SW] Handling storage update:', {
                    key: request.data?.key,
                    hasValue: !!request.data?.value
                });

                try {
                    const storage = chrome.storage[await decideCorrectStorageType()];
                    await storage.set({ [request.data.key]: request.data.value });
                    console.log('[SW] Storage updated successfully');
                    sendResponse({ success: true });
                } catch (error) {
                    console.error('[SW] Storage update error:', error);
                    sendResponse({ success: false, error: error.message });
                }
                return;
            }

            // Handle create snippet request
            if (request.type === 'createSnippet') {
                console.log('[SW] Handling create snippet request:', request.data);
                const result = await createSnippet(request.data, Data);
                
                if (result.success) {
                    const saved = await saveData();
                    if (!saved) {
                        result.success = false;
                        result.error = 'Failed to save data';
                    }
                }
                
                sendResponse(result);
                return;
            }

            // Handle edit snippet request
            if (request.type === 'editSnippet') {
                console.log('[SW] Handling edit snippet request:', request.data);
                const result = await editSnippet(request.data, Data);
                
                if (result.success) {
                    const saved = await saveData();
                    if (!saved) {
                        result.success = false;
                        result.error = 'Failed to save data';
                    }
                }
                
                sendResponse(result);
                return;
            }

            // Handle delete snippet request
            if (request.type === 'deleteSnippet') {
                console.log('[SW] Handling delete snippet request:', request.data);
                const result = await deleteSnippet(request.data, Data);
                
                if (result.success) {
                    const saved = await saveData();
                    if (!saved) {
                        result.success = false;
                        result.error = 'Failed to save data';
                    }
                }
                
                sendResponse(result);
                return;
            }

            // Handle unknown request type
            console.warn('[SW] Unknown request type:', request.type);
            sendResponse({ success: false, error: 'Unknown request type' });
            
        } catch (error) {
            console.error('[SW] Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    };

    // Ensure we keep the message channel open for async response
    handleMessage().catch(error => {
        console.error('[SW] Fatal error in message handler:', error);
        sendResponse({ success: false, error: error.message });
    });
    
    return true; // Keep the message channel open
});

// Clipboard Operations
async function writeToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to write to clipboard:', error);
        return false;
    }
}

async function readFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        return text;
    } catch (error) {
        console.error('Failed to read from clipboard:', error);
        return null;
    }
}

// Script Injection
async function injectContentScript(tabId) {
    try {
        // Check if scripts are already injected
        const injectionResults = await chrome.scripting.executeScript({
            target: { tabId },
            func: () => window.prokeysContentScriptInjected === true
        });
        
        if (injectionResults[0]?.result) {
            return; // Scripts already injected
        }

        // Inject content scripts
        await chrome.scripting.executeScript({
            target: { tabId },
            files: ['detector.js']
        });

        // Inject CSS
        await chrome.scripting.insertCSS({
            target: { tabId },
            files: ['css/content.css']
        });

        // Mark as injected
        await chrome.scripting.executeScript({
            target: { tabId },
            func: () => { window.prokeysContentScriptInjected = true; }
        });

        console.log('Scripts injected successfully into tab:', tabId);
    } catch (error) {
        console.error('Failed to inject scripts:', error);
    }
}

// Helper functions
function isURL(text) {
    return URL_REGEX.test(text?.trim());
}

function getDomain(url) {
    url = url.replace(/^(ht|f)tps?(:\/\/)?(www\.)?/, "").split("/");
    let domain = url[0],
        path1 = url[1],
        idx;

    if (path1) {
        idx = path1.indexOf("?");
        if (idx !== -1) {
            path1 = path1.substring(0, idx);
        }
        domain += `/${path1}`;
    }

    return domain;
}

// Context Menu Functions
async function updateContextMenu(isRecalled = false) {
    if (!Data) {
        if (!isRecalled) {
            // Try again in a moment
            setTimeout(() => updateContextMenu(true), 100);
            return;
        }
        // If still no data after recall, use defaults
        Data = SETTINGS_DEFAULTS;
    }

    if (!Data.ctxEnabled) {
        await chrome.contextMenus.removeAll();
        return;
    }

    const contexts = ["editable", "selection"];
    await chrome.contextMenus.removeAll();

    await chrome.contextMenus.create({
        id: BLOCK_SITE_ID,
        title: "Block this site",
        contexts: ["page"],
    });

    await chrome.contextMenus.create({
        id: SNIPPET_MAIN_ID,
        title: "Create snippet from selection",
        contexts: ["selection"],
    });
}

function initContextMenu() {
    // Only initialize once
    chrome.contextMenus.removeAll(() => {
        updateContextMenu();
    });

    chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === BLOCK_SITE_ID) {
            handleBlockSite(tab);
        } else if (info.menuItemId === SNIPPET_MAIN_ID && info.selectionText) {
            handleCreateSnippet(info.selectionText, tab);
        }
    });
}

// Consolidated initialization function
async function initialize() {
    if (isInitialized || isInitializing) {
        console.log('[SW] Already initialized or initializing, skipping');
        return;
    }

    try {
        isInitializing = true;
        await initializeData();
        initContextMenu();
        isInitialized = true;
        isInitializing = false;
        console.log('[SW] Service worker initialized successfully');
    } catch (error) {
        console.error('Error during service worker initialization:', error);
        isInitialized = false;
        isInitializing = false;  // Allow retry on failure
    }
}

// Handle extension installation/update
chrome.runtime.onInstalled.addListener((details) => {
    // Set extensionUpdated flag for changelog display using chrome.storage
    chrome.storage.local.set({ 'extensionUpdated': true });
    
    // Set badge text to indicate update
    chrome.action.setBadgeText({ text: 'NEW' });
    
    initialize().catch(console.error);
});

// Handle extension button click
chrome.action.onClicked.addListener(() => {
    chrome.runtime.openOptionsPage();
});

// Tab Events for Context Menu
chrome.tabs.onActivated.addListener((activeInfo) => {
    updateContextMenu();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        updateContextMenu();
    }
});

// Initialize when service worker starts
initialize().catch(console.error);

async function handleBlockSite(tab) {
    const url = tab.url;
    if (isURL(url)) {
        const domain = getDomain(url);
        chrome.tabs.sendMessage(tab.id, {
            blockSite: true,
            domain,
            isBlocked: contextMenuActionBlockSite,
        });
    }
}

function handleCreateSnippet(selectionText, tab) {
    // Implement snippet creation logic here
    console.log('Create snippet from selection:', selectionText);
}

// Initialize when service worker starts
chrome.runtime.onStartup.addListener(() => {
    console.log('[SW-DEBUG] onStartup triggered');
    initializeData().then(() => {
        console.log('[SW-DEBUG] Data after startup:', {
            isInitialized,
            hasData: !!Data,
            hasSnippets: !!Data?.snippets,
            snippetsType: Data?.snippets?.constructor?.name
        });
    });
});

// Also initialize on install
chrome.runtime.onInstalled.addListener(() => {
    console.log('[SW-DEBUG] onInstalled triggered');
    initializeData().then(() => {
        console.log('[SW-DEBUG] Data after install:', {
            isInitialized,
            hasData: !!Data,
            hasSnippets: !!Data?.snippets,
            snippetsType: Data?.snippets?.constructor?.name
        });
    });
});

// Add reload listener
chrome.runtime.onSuspend.addListener(() => {
    console.log('[SW-DEBUG] Service worker suspending, current data:', {
        isInitialized,
        hasData: !!Data,
        hasSnippets: !!Data?.snippets,
        snippetsType: Data?.snippets?.constructor?.name
    });
});

// Add message handler for inspection
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'inspectStorage') {
        inspectStorage().then(data => {
            sendResponse({ success: true, data });
        });
        return true; // Keep message channel open for async response
    }
    // ... existing message handlers ...
});

async function handleStorageUpdate(data) {
    try {
        const storage = chrome.storage[await getStorageType()];
        await storage.set({ [data.key]: data.value });
        return { success: true };
    } catch (error) {
        console.error('Error updating storage:', error);
        return { success: false, error: error.message };
    }
}

