/* global Data */

import { chromeAPICallWrapper, isTabSafe } from "./pre";
import { Folder } from "./snippetClasses";
import { getFormattedDate } from "./dateFns";
import { deserializeSnippetData, serializeSnippetData, ensureProperInstances } from './service-worker-serialization.js';

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

function databaseSetValue(name, value, callback) {
    const obj = {};
    obj[name] = value;

    // the localStorage[LS_STORAGE_TYPE_PROP] works on the assumption
    // that this function will always be called from the bg.js frame
    // hence sending a runtime msg to get the storage type won't work
    chrome.storage[localStorage[LS_STORAGE_TYPE_PROP]].set(obj, () => {
        if (callback) {
            callback();
        }
    });
}

/**
 * @param {Function} callback fn to call after save
 */
function DBSave(callback) {
    Folder.makeListIfFolder(Data);

    // issues#4
    Data.dataUpdateVariable = !Data.dataUpdateVariable;

    databaseSetValue(OLD_DATA_STORAGE_KEY, Data, () => {
        if (callback) {
            callback();
        }
    });

    // once databaseSetValue has been called, doesn't matter
    // if this prop is object/array since storage.clear/set
    // methods are using a separate storageObj
    Folder.makeFolderIfList(Data);
}

/**
 * PRECONDITION: Data.snippets is a Folder object
 */
function saveSnippetData(callback, folderNameToList, objectNamesToHighlight) {
    // Ensure we have proper instances
    if (Data.snippets && !(Data.snippets instanceof Folder)) {
        Data.snippets = ensureProperInstances(Data.snippets);
    }
    
    DBSave(() => {
        if (IN_OPTIONS_PAGE) {
            window.$containerSnippets.html("");
            const listedFolder = Data.snippets.getListedFolder(folderNameToList);
            listedFolder.listSnippets(objectNamesToHighlight);
        }

        if (callback) {
            callback();
        }
    });
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
