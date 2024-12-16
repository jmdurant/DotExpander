/* global Data */

import { chromeAPICallWrapper, isTabSafe } from "./pre";
import { Folder, Snip, Generic } from "./snippetClasses";
import { getFormattedDate } from "./dateFns";

// Convert legacy types to standard types
const convertLegacyType = (type) => {
    // If it's already a standard type, return it
    if (type === Generic.FOLDER_TYPE || type === Generic.SNIP_TYPE) {
        return type;
    }

    // Handle legacy types
    const legacyMap = {
        'r': Generic.FOLDER_TYPE,
        'o': Generic.SNIP_TYPE,
        'a': Generic.FOLDER_TYPE,
        'i': Generic.SNIP_TYPE,
        'folder': Generic.FOLDER_TYPE,
        'snip': Generic.SNIP_TYPE
    };

    // Get the mapped type or return the original type
    return legacyMap[type] || type;
};

// Inline the serialization functions to use the correct class definitions
function serializeSnippetData(data) {
    console.log('[SERIALIZE_SNIPPET_DATA] Input:', {
        type: data?.type,
        name: data?.name,
        listLength: data?.list?.length,
        isInstance: data instanceof Folder
    });

    if (!data) return null;

    // Convert type to consistent format
    const type = convertLegacyType(data.type);

    // Create base object with common properties
    const serialized = {
        type: type,
        name: data.name,
        timestamp: data.timestamp
    };

    // Add folder-specific or snippet-specific properties
    if (type === Generic.FOLDER_TYPE) {
        serialized.list = data.list?.map(item => serializeSnippetData(item)).filter(Boolean);
    } else if (type === Generic.SNIP_TYPE) {
        serialized.body = data.body;
    }

    return serialized;
}

function deserializeSnippetData(data) {
    console.log('[DESERIALIZE_SNIPPET_DATA] Input:', {
        type: data?.type,
        name: data?.name,
        listLength: data?.list?.length,
        isPlainObject: data?.constructor === Object
    });

    if (!data) return null;

    // Convert legacy type identifiers
    const type = convertLegacyType(data.type);

    if (type === Generic.FOLDER_TYPE) {
        const folder = new Folder(data.name, [], data.timestamp);
        if (data.list && Array.isArray(data.list)) {
            folder.list = data.list.map(item => deserializeSnippetData(item)).filter(Boolean);
        }
        return folder;
    } else if (type === Generic.SNIP_TYPE) {
        return new Snip(data.name, data.body || '', data.timestamp);
    }

    return null;
}

const SETTINGS_DEFAULTS = {
        snippets: Folder.getDefaultSnippetData(),
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
        darkMode: false,
    },
    OLD_DATA_STORAGE_KEY = "UserSnippets",
    LS_REVISIONS_PROP = "prokeys_revisions",
    LS_STORAGE_TYPE_PROP = "pkStorageType";

function notifySnippetDataChanges(snippetList) {
    const msg = {
        snippetList,
    };

    chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
            if (isTabSafe(tab)) {
                chrome.tabs.sendMessage(tab.id, msg, chromeAPICallWrapper());
            }
        }
    });

    chrome.runtime.sendMessage({ updateCtx: true }, chromeAPICallWrapper());
}

/**
 *
 * @param {String} dataString stringified latest data
 */
function saveRevision(dataString) {
    const MAX_REVISIONS_STORED = 20;
    let parsed = JSON.parse(localStorage[LS_REVISIONS_PROP]);
    const latestRevision = {
        label: `${getFormattedDate()} - ${window.latestRevisionLabel}`,
        data: dataString || Data.snippets,
    };

    parsed.unshift(latestRevision);
    parsed = parsed.slice(0, MAX_REVISIONS_STORED);
    let thereWasError = true;
    while (thereWasError) {
        try {
            localStorage[LS_REVISIONS_PROP] = JSON.stringify(parsed);
            thereWasError = false;
        } catch (e) {
            // it exceeded quota, because user has too many snippets
            thereWasError = true;
            parsed.pop();
        }
    }
}

const IN_OPTIONS_PAGE = window.location.href && /chrome-extension:\/\//.test(window.location.href);

/**
 * requests data from background page and
 * passes the Data to the callback
 */
function DBget(callback) {
    console.log('[CDH] Requesting data from service worker');
    try {
        chrome.runtime.sendMessage({ giveData: true }, async (response) => {
            console.log('[CDH] Received raw data:', response);
            
            if (response.error) {
                console.error('[CDH] Error getting data:', response.error);
                throw new Error(response.error);
            }

            // Ensure proper instances
            if (response.snippets) {
                console.log('[CDH] Deserializing snippets');
                response.snippets = deserializeSnippetData(response.snippets);
                console.log('[CDH] Deserialized snippets:', response.snippets);
                console.log('[CDH] snippets instanceof Folder:', response.snippets instanceof Folder);
            }

            if (callback) {
                callback(response);
            }
        });
    } catch (error) {
        console.error('[CDH] Error in DBget:', error);
        throw error;
    }
}

/**
 * sends updated data to background page for storage
 */
function DBupdate(callback) {
    console.log('[CDH] Updating data:', Data);
    console.log('[CDH] Data.snippets instanceof Folder:', Data.snippets instanceof Folder);
    
    try {
        // Ensure we're sending proper instances
        if (Data.snippets) {
            console.log('[CDH] Ensuring proper instances before update');
            Data.snippets = ensureProperInstances(Data.snippets);
            console.log('[CDH] Prepared snippets:', Data.snippets);
            console.log('[CDH] snippets instanceof Folder:', Data.snippets instanceof Folder);
        }

        // Serialize data before sending
        const serializedData = {
            ...Data,
            snippets: serializeSnippetData(Data.snippets)
        };

        chrome.runtime.sendMessage({ updateData: serializedData }, (response) => {
            console.log('[CDH] Update response:', response);
            
            if (response.error) {
                console.error('[CDH] Error updating data:', response.error);
                throw new Error(response.error);
            }

            if (callback) {
                callback(response);
            }
        });
    } catch (error) {
        console.error('[CDH] Error in DBupdate:', error);
        throw error;
    }
}

async function databaseSetValue(name, value) {
    const obj = {};
    obj[name] = value;

    try {
        const storageType = await chrome.runtime.sendMessage({ getStorageType: true });
        await chrome.storage[storageType].set(obj);
    } catch (error) {
        console.error('Error setting database value:', error);
        // Fallback to local storage
        await chrome.storage.local.set(obj);
    }
}

/**
 * @param {Function} callback fn to call after save
 */
async function DBSave(callback) {
    console.log('[DB_SAVE] Starting save with data:', {
        hasData: !!Data,
        hasSnippets: !!Data?.snippets,
        isSnippetsFolder: Data?.snippets instanceof Folder
    });

    try {
        // Ensure we have proper data structure
        if (!Data || !Data.snippets) {
            throw new Error('Invalid data structure');
        }

        Folder.makeListIfFolder(Data);

        // issues#4
        Data.dataUpdateVariable = !Data.dataUpdateVariable;

        // Send message to service worker to update storage
        const response = await chrome.runtime.sendMessage({
            type: 'updateStorage',
            data: {
                key: OLD_DATA_STORAGE_KEY,
                value: Data
            }
        });

        console.log('[DB_SAVE] Storage update response:', response);
        
        if (response?.success) {
            // Convert back to folder structure
            Folder.makeFolderIfList(Data);
            
            if (callback) {
                try {
                    callback();
                } catch (callbackError) {
                    console.error('[DB_SAVE] Callback error:', callbackError);
                }
            }
        } else {
            console.error('[DB_SAVE] Failed to update storage:', response?.error);
        }
    } catch (error) {
        console.error('[DB_SAVE] Error during save:', error);
        // Still try to maintain data structure
        Folder.makeFolderIfList(Data);
    }
}

/**
 * PRECONDITION: Data.snippets is a Folder object
 */
function saveSnippetData(callback, folderNameToList, objectNamesToHighlight) {
    console.log('[SAVE_SNIPPET_DATA] Starting save:', {
        hasCallback: !!callback,
        folderNameToList,
        objectNamesToHighlight
    });

    try {
        // Ensure we have proper instances
        if (Data.snippets && !(Data.snippets instanceof Folder)) {
            console.log('[SAVE_SNIPPET_DATA] Converting data to proper instances');
            Data.snippets = ensureProperInstances(Data.snippets);
        }
        
        DBSave(() => {
            try {
                if (IN_OPTIONS_PAGE) {
                    console.log('[SAVE_SNIPPET_DATA] Updating UI in options page');
                    
                    // Request fresh data from service worker
                    chrome.runtime.sendMessage({ getData: true }, (response) => {
                        console.log('[SAVE_SNIPPET_DATA] Got fresh data:', {
                            hasData: !!response,
                            hasSnippets: !!response?.snippets
                        });
                        
                        if (response?.snippets) {
                            // Update Data with fresh data
                            Data = response;
                            Data.snippets = deserializeSnippetData(response.snippets);
                            
                            if (window.$containerSnippets) {
                                window.$containerSnippets.html("");
                                // Just list the root folder's contents if no specific folder is requested
                                if (Data.snippets && typeof Data.snippets.listSnippets === 'function') {
                                    Data.snippets.listSnippets(objectNamesToHighlight);
                                } else {
                                    console.error('[SAVE_SNIPPET_DATA] Data.snippets is not properly initialized');
                                }
                            } else {
                                console.warn('[SAVE_SNIPPET_DATA] Container not found');
                            }

                            // Set indices after updating data
                            if (Data.snippets instanceof Folder) {
                                Folder.setIndices(Data.snippets);
                            }
                        } else {
                            console.error('[SAVE_SNIPPET_DATA] No snippets in response:', response);
                        }
                        
                        if (callback) {
                            callback();
                        }
                    });
                } else if (callback) {
                    callback();
                }
            } catch (error) {
                console.error('[SAVE_SNIPPET_DATA] Error in save callback:', error);
                // Try to recover the UI
                if (IN_OPTIONS_PAGE && window.$containerSnippets && Data.snippets) {
                    try {
                        Data.snippets.listSnippets();
                    } catch (recoveryError) {
                        console.error('[SAVE_SNIPPET_DATA] Failed to recover UI:', recoveryError);
                    }
                }
            }
        });
    } catch (error) {
        console.error('[SAVE_SNIPPET_DATA] Error during save:', error);
    }
}

// save data not involving snippets
function saveOtherData(msg = "Saved!", callback) {
    DBupdate(() => {
        if (typeof msg === "function") {
            msg();
        } else if (typeof msg === "string") {
            window.alert(msg);
        }

        if (callback) {
            callback();
        }
    });
}

// transfer data from one storage to another
function migrateData(transferData, callback) {
    const copyOfTheOldData = Data.snippets.toArray();

    // make current storage unusable
    Data.snippets = false;

    DBupdate(() => {
        chrome.runtime.sendMessage({ changeStorageType: true, overridingSync: transferData }, (response) => {
            if (response.completed === false) {
                Data.snippets = copyOfTheOldData;
                DBupdate(() => {
                    callback(false);
                });
                return;
            }
            if (transferData) {
                Data.snippets = copyOfTheOldData;
                DBupdate(() => callback(true));
            } else if (callback) {
                // don't do Data.snippets = Folder.fromArray(Data.snippets);
                // here since Data.snippets is false and since this is
                // the sync2 option, we need to retain the data that user had
                // previously synced on another PC

                callback(true);
            }
        });
    });
}

/**
 * these are the only methods
 * which should be used by other scripts
 * under our new data storage policy (#266)
 * Be cautious while changing it.
 */
export {
    DBget,
    saveSnippetData,
    saveOtherData,
    migrateData,
    saveRevision,
    SETTINGS_DEFAULTS,
    LS_REVISIONS_PROP,
    LS_STORAGE_TYPE_PROP,
    OLD_DATA_STORAGE_KEY,
    DBSave,
};
