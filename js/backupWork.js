/* global Data */

import {
    Q, q, copyTextToClipboard, SHOW_CLASS, qClsSingle, appendBlobToLink,
} from "./pre";
import { Folder } from "./snippetClasses";
import { initiateRestore, convertSnippetsToCSV, generateDataFromCSV } from "./restoreFns";
import { LS_REVISIONS_PROP, saveSnippetData } from "./commonDataHandlers";

// Constants for storage limits
const SYNC_QUOTA_BYTES_PER_ITEM = 8192, // 8KB per item limit for sync storage
    LOCAL_QUOTA_BYTES = 5242880, // 5MB local storage limit
    REVISION_MAX_SIZE = 4096; // 4KB max size for revisions to keep in sync

// Helper function to check data size
function getDataSize(data) {
    return new Blob([JSON.stringify(data)]).size;
}

// Helper function to chunk large data
function chunkData(data, chunkSize = SYNC_QUOTA_BYTES_PER_ITEM) {
    const serialized = JSON.stringify(data),
        chunks = [];
    for (let i = 0; i < serialized.length; i += chunkSize) {
        chunks.push(serialized.slice(i, i + chunkSize));
    }
    return chunks;
}

// Helper function to store large data
async function storeLargeData(key, data) {
    const size = getDataSize(data);

    // If data is small enough for sync storage
    if (size <= SYNC_QUOTA_BYTES_PER_ITEM) {
        try {
            await chrome.storage.sync.set({ [key]: data });
            return { success: true, storage: "sync" };
        } catch (error) {
            console.warn(`Failed to save to sync storage: ${error.message}`);
        }
    }

    // Try chunked sync storage
    try {
        const chunks = chunkData(data),
            chunkKeys = chunks.map((_, index) => `${key}_chunk_${index}`);

        // Store chunk metadata
        await chrome.storage.sync.set({
            [`${key}_chunks`]: {
                count: chunks.length,
                keys: chunkKeys,
                totalSize: size,
            },
        });

        // Store chunks
        for (let i = 0; i < chunks.length; i++) {
            await chrome.storage.sync.set({ [chunkKeys[i]]: chunks[i] });
        }

        return { success: true, storage: "chunked" };
    } catch (error) {
        console.warn(`Failed to save chunked data: ${error.message}`);
    }

    // Fallback to local storage
    try {
        await chrome.storage.local.set({ [key]: data });
        return { success: true, storage: "local" };
    } catch (error) {
        console.error(`Failed to save to local storage: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Helper function to retrieve large data
async function retrieveLargeData(key) {
    // Try sync storage first
    try {
        const syncData = await chrome.storage.sync.get(key);
        if (syncData[key]) {
            return { data: syncData[key], storage: "sync" };
        }
    } catch (error) {
        console.warn(`Failed to retrieve from sync storage: ${error.message}`);
    }

    // Check for chunked data
    try {
        const chunkMeta = await chrome.storage.sync.get(`${key}_chunks`);
        if (chunkMeta[`${key}_chunks`]) {
            const { keys } = chunkMeta[`${key}_chunks`],
                chunks = await chrome.storage.sync.get(keys),
                orderedChunks = keys.map(k => chunks[k]),
                data = JSON.parse(orderedChunks.join(""));
            return { data, storage: "chunked" };
        }
    } catch (error) {
        console.warn(`Failed to retrieve chunked data: ${error.message}`);
    }

    // Try local storage
    try {
        const localData = await chrome.storage.local.get(key);
        if (localData[key]) {
            return { data: localData[key], storage: "local" };
        }
    } catch (error) {
        console.error(`Failed to retrieve from local storage: ${error.message}`);
    }

    return { data: null, error: "Data not found in any storage" };
}

// Modified revision handling
async function saveRevision(revision) {
    try {
        const revisions = JSON.parse(localStorage[LS_REVISIONS_PROP] || "[]"),
            revisionSize = getDataSize(revision);

        // If revision is too large, store body separately
        if (revisionSize > REVISION_MAX_SIZE) {
            const revisionId = `revision_${Date.now()}`,
                revisionMeta = {
                    ...revision,
                    body: null,
                    bodyKey: revisionId,
                };

            // Store large body separately
            await storeLargeData(revisionId, revision.body);

            // Add metadata to revisions list
            revisions.unshift(revisionMeta);
        } else {
            revisions.unshift(revision);
        }

        // Keep only last 10 revisions
        if (revisions.length > 10) {
            const removed = revisions.pop();
            if (removed.bodyKey) {
                // Clean up stored body
                await chrome.storage.sync.remove(removed.bodyKey);
                await chrome.storage.local.remove(removed.bodyKey);
            }
        }

        localStorage[LS_REVISIONS_PROP] = JSON.stringify(revisions);
        return true;
    } catch (error) {
        console.error("Error saving revision:", error);
        return false;
    }
}

// Modified revision retrieval
async function getRevision(index) {
    try {
        const revisions = JSON.parse(localStorage[LS_REVISIONS_PROP] || "[]"),
            revision = revisions[index];

        if (!revision) {
            return null;
        }

        // If body is stored separately, retrieve it
        if (revision.bodyKey) {
            const { data } = await retrieveLargeData(revision.bodyKey);
            if (data) {
                revision.body = data;
            }
        }

        return revision;
    } catch (error) {
        console.error("Error retrieving revision:", error);
        return null;
    }
}

export function initBackup() {
    let dataToExport;

    // flattens all folders
    /**
     * prints the snippets inside the folder
     * flattens the folder (to level 1) in case it is nested
     * @param {Folder} folder folder whose snippets will be printed
     */
    function getSnippetPrintData(folder) {
        let res = "";

        folder.forEachSnippet((sn) => {
            res += sn.name;
            res += "\n\n";
            res += sn.body;
            res += "\n\n--\n\n";
        }, false);

        return res;
    }

    Q(".export-buttons button").on("click", function () {
        const buttonClass = this.className,
            functionMap = {
                export: showDataForExport,
                import: setupImportPopup,
                revisions: setUpPastRevisions,
            };

        q(`#snippets .panel_popup.${buttonClass}`).addClass(SHOW_CLASS);
        functionMap[buttonClass]();
    });

    async function showDataForExport() {
        const dataUse = q(".export .steps :first-child input:checked").value,
            downloadLinkTxt = q(".export a.text-download"),
            downloadLinkCsv = q(".export a.csv-download");

        if (dataUse === "print") {
            dataToExport = getSnippetPrintData(Data.snippets);
        } else {
            const orgSnippets = Data.snippets;
            Data.snippets = Data.snippets.toArray();
            dataToExport = JSON.stringify(dataUse === "data" ? Data : Data.snippets, undefined, 2);
            Data.snippets = orgSnippets;
        }

        const filename = dataUse === "print" ? "ProKeys print snippets" : `ProKeys ${dataUse}`,

            // Handle large exports
            size = getDataSize(dataToExport);
        if (size > SYNC_QUOTA_BYTES_PER_ITEM) {
            console.warn(`Large export detected (${size} bytes). Using blob storage.`);
        }

        appendBlobToLink(downloadLinkCsv, convertSnippetsToCSV(Data.snippets), filename);
        appendBlobToLink(downloadLinkTxt, dataToExport, filename);
    }

    const copyToClipboardLink = q(".export .copy-data-to-clipboard-btn");
    copyToClipboardLink.on("click", () => {
        copyTextToClipboard(dataToExport);
    });

    Q(".export input").on("change", showDataForExport);

    const fileInputLink = q(".import .file_input"),
        $inputFile = fileInputLink.nextElementSibling,
        initialLinkText = fileInputLink.html(),
        importPopup = q(".panel.import"),
        importThroughClipboardSpan = q(".import-data-clipboard-btn");
    let importFileData = null;

    function setupImportPopup() {
        const $selectList = q(".import .selectList");
        Folder.refreshSelectList($selectList);
        fileInputLink.html("Choose file containing data");
        // reset so that if same file is selected again,
        // onchange can still fire
        $inputFile.value = "";
    }

    q(".import .restore").on("click", () => {
        if (importFileData) {
            const isCsv = qClsSingle("csv-check-import").checked;
            if (isCsv) {
                importFileData = generateDataFromCSV(importFileData);
            }
            initiateRestore(importFileData);
        } else {
            window.alert("Please choose a file.");
        }
    });

    importPopup.on("paste", (event) => {
        importFileData = event.clipboardData.getData("text");
        importThroughClipboardSpan.html("Pasted data is ready. Click Restore button to begin.");
    });

    $inputFile.on("change", () => {
        const file = $inputFile.files[0];

        if (!file) {
            return false;
        }

        const reader = new FileReader();

        // don't use .on here as it is NOT
        // an HTML element
        reader.addEventListener("load", (event) => {
            importFileData = event.target.result;

            fileInputLink.html(
                `File '${file.name}' is READY.`
                + " Click Restore button to begin. Click here again to choose another file.",
            );
        });

        reader.addEventListener("error", (event) => {
            console.error(
                `File '${
                    importFileData.name
                }' could not be read! Please send following error to prokeys.feedback@gmail.com `
                + ` so that I can fix it. Thanks! ERROR: ${event.target.error.code}`,
            );
            fileInputLink.html(initialLinkText);
        });

        reader.readAsText(file);

        fileInputLink.html(`READING FILE: ${file.name}`);
        return true;
    });

    const $revisionsRestoreBtn = q(".revisions .restore"),
        $textarea = q(".revisions textarea"),
        $select = q(".revisions select"),
        $closeRevisionsPopupBtn = q(".revisions .close_btn"),
        $preserveCheckboxesLI = q(".import .preserve_checkboxes"),
        $mergeDuplicateFolderContentsInput = $preserveCheckboxesLI.q("[name=merge]"),
        $preserveExistingContentInput = $preserveCheckboxesLI.q("[value=existing]"),
        $preserveImportedContentInput = $preserveCheckboxesLI.q("[value=imported]"),
        $caveatParagraph = $preserveCheckboxesLI.q("p");
    let selectedRevision;

    async function setUpPastRevisions() {
        const revisions = JSON.parse(localStorage[LS_REVISIONS_PROP] || "[]");
        $select.html("");

        revisions.forEach((rev) => {
            $select.appendChild(q.new("option").html(rev.label));
        });

        async function showRevision() {
            const revision = await getRevision($select.selectedIndex);
            if (revision) {
                selectedRevision = revision;
                $textarea.value = JSON.stringify(revision.data, undefined, 2);
            }
        }

        $select.on("input", showRevision);
        await showRevision();
    }

    // when we restore one revision, we have to remove it from its
    // previous position; saveSnippetData will automatically insert it
    // back at the top of the list again
    function deleteRevision(index) {
        const parsed = JSON.parse(localStorage[LS_REVISIONS_PROP]);

        parsed.splice(index, 1);
        localStorage[LS_REVISIONS_PROP] = JSON.stringify(parsed);
    }

    $revisionsRestoreBtn.on("click", () => {
        try {
            if (window.confirm("Are you sure you want to use the selected revision?")) {
                Data.snippets = Folder.fromArray(JSON.parse($textarea.value));
                deleteRevision($select.selectedIndex);
                window.latestRevisionLabel = `restored revision (labelled: ${
                    selectedRevision.label
                })`;
                saveSnippetData(() => {
                    $closeRevisionsPopupBtn.click();
                });
            }
        } catch (e) {
            window.alert(
                "Data in textarea was invalid. Close this box and check console log (Ctrl+Shift+J/Cmd+Shift+J) for error report. Or please try again!",
            );
        }
    });

    $preserveCheckboxesLI.on("click", () => {
        if (!$mergeDuplicateFolderContentsInput.checked) {
            if ($preserveExistingContentInput.checked) {
                $caveatParagraph.html(
                    "<b>Caveat</b>: Unique content of "
                    + "folders with the same name will not be imported.",
                );
            } else if ($preserveImportedContentInput.checked) {
                $caveatParagraph.html(
                    "<b>Caveat</b>: Unique content of existing folders "
                    + "with the same name will be lost.",
                );
            } else {
                $caveatParagraph.html("");
            }
        } else {
            $caveatParagraph.html("");
        }
    });
}
