/* global Data */
// eslint-disable-next-line no-unused-vars
/* global $containerFolderPath, $containerSnippets, $panelSnippets */

import {
    SETTINGS_DEFAULTS,
    DBget,
    saveOtherData,
    migrateData,
    LS_STORAGE_TYPE_PROP,
    OLD_DATA_STORAGE_KEY,
} from "./commonDataHandlers";
import {
    SHOW_CLASS,
    q,
    Q,
    qClsSingle,
    qId,
    chromeAPICallWrapper,
    isBlockedSite,
    escapeRegExp,
    protoWWWReplaceRegex,
    debounce,
    PRIMITIVES_EXT_KEY,
    appendBlobToLink,
    gTranlateImmune,
} from "./pre";
import { DualTextbox, Folder } from "./snippetClasses";
import { ensureRobustCompat, initiateRestore } from "./restoreFns";
import { initBackup } from "./backupWork";
import { initSnippetWork } from "./snippetWork";
import { getHTML } from "./textmethods";
import { updateAllValuesPerWin } from "./protoExtend";
import { primitiveExtender } from "./primitiveExtend";
import { MAX_SYNC_DATA_SIZE, MAX_LOCAL_DATA_SIZE } from "./service-worker-constants.js";

window.IN_OPTIONS_PAGE = true;
primitiveExtender();

// Initialize data when options page loads
async function initializeOptionsData() {
    console.log("[OPTIONS] Initializing data");
    try {
        // Request data from service worker
        const response = await chrome.runtime.sendMessage({ type: "getData" });
        console.log("[OPTIONS] Service worker response:", response);

        if (response) {
            console.log("[OPTIONS] Got data from service worker");
            window.Data = response;

            // Initialize dark mode state
            console.log("[OPTIONS] Setting initial dark mode state:", window.Data.darkMode);
            // Remove any existing dark-theme class first
            document.documentElement.classList.remove("dark-theme");
            // Only add if darkMode is explicitly true
            if (window.Data.darkMode === true) {
                document.documentElement.classList.add("dark-theme");
            }

            // Set checkbox state to match
            const $darkModeInput = document.querySelector("#darkMode");
            if ($darkModeInput) {
                $darkModeInput.checked = window.Data.darkMode === true;
            }

            return true;
        }
        console.error("[OPTIONS] Failed to get data from service worker");
        return false;
    } catch (error) {
        console.error("[OPTIONS] Error initializing data:", error);
        return false;
    }
}

(function () {
    // Initialize data before setting up UI
    initializeOptionsData().then(() => {
        console.log("[OPTIONS] Data initialized, setting up UI");
        // Rest of initialization code
    });

    let $autoInsertTable,
        $tabKeyInput,
        $ctxEnabledInput,
        $dotPhrasesEnabledInput,
        $snipMatchDelimitedWordInput,
        $snipNameDelimiterListDIV,
        autoInsertWrapSelectionInput,
        omniboxSearchURLInput,
        $blockSitesTextarea,
        quillEditor;

    const RESERVED_DELIMITER_LIST = "`~|\\^",
        VERSION = chrome.runtime.getManifest().version;

    window.$containerSnippets = null;
    window.$panelSnippets = null;
    window.$containerFolderPath = null;

    // State tracking
    const state = {
        windowLoaded: false,
        quillReady: false,
        dbLoaded: false,
    };

    function checkAllReady() {
        return state.windowLoaded && state.quillReady && state.dbLoaded;
    }

    function initQuill(retryCount = 0) {
        if (typeof Quill === "undefined") {
            if (retryCount < 50) { // Max 5 seconds of retries
                console.log("[DEBUG] Waiting for Quill to load...");
                setTimeout(() => initQuill(retryCount + 1), 100);
                return;
            }
            console.error("[DEBUG] Quill not available after maximum retries");
            return;
        }

        try {
            console.log("[DEBUG] Starting Quill initialization");
            const tryitElement = document.querySelector("#tryit");
            if (!tryitElement) {
                console.error("[DEBUG] Could not find #tryit element");
                return;
            }

            // Register the table module only if not already registered
            if (typeof QuillBetterTable !== "undefined") {
                console.log("[DEBUG] Checking table module registration");
                if (!Quill.imports["modules/better-table"]) {
                    console.log("[DEBUG] Registering table module");
                    Quill.register({
                        "modules/better-table": QuillBetterTable,
                    });
                }
            } else {
                console.error("[DEBUG] QuillBetterTable module not found");
            }

            const toolbarOptions = [
                    ["bold", "italic", "underline", "strike"],
                    ["blockquote", "code-block", "link"],
                    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
                    [{ script: "sub" }, { script: "super" }],
                    [{ size: ["small", false, "large", "huge"] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ align: [] }],
                    ["table-better", "image"],
                    ["clean"],
                ],

                // Configure Quill with table module
                quillConfig = {
                    modules: {
                        toolbar: {
                            container: toolbarOptions,
                        },
                        "table-better": {
                            operationMenu: {
                                items: {
                                    unmergeCells: {
                                        text: "Unmerge cells",
                                    },
                                },
                            },
                            menus: ["column", "row", "merge", "table", "cell", "wrap", "delete"],
                            toolbarTable: true,
                            tableStyles: {
                                width: "100%",
                                height: "auto",
                                table: {
                                    width: "100%",
                                    "border-collapse": "collapse",
                                },
                                cell: {
                                    border: "1px solid #000",
                                    padding: "8px",
                                    "min-width": "50px",
                                },
                            },
                        },
                    },
                    theme: "snow",
                };

            quillEditor = new Quill("#tryit", quillConfig);

            state.quillReady = true;
            console.log("[DEBUG] Quill initialized successfully");

            // If everything else is ready, set initial content
            if (checkAllReady()) {
                setInitialContent();
            }
        } catch (err) {
            console.error("[DEBUG] Error initializing Quill:", err);
            console.error(err);
        }
    }

    function setInitialContent() {
        if (!checkAllReady()) {
            console.log("[DEBUG] Not setting content - waiting for initialization");
            return;
        }

        try {
            if (quillEditor && quillEditor.root) {
                console.log("[DEBUG] Setting initial content");
                quillEditor.root.innerHTML = "This is a contenteditable or editable div.\nThese editors are generally found in your email client like Gmail, Outlook, etc.<br><br><i>This editor\n<u>supports</u></i><b> HTML formatting</b>. You can use the \"my_sign\" sample snippet here, and see the effect.";
            }
        } catch (err) {
            console.error("[DEBUG] Error setting initial content:", err);
        }
    }

    const getCurrentStorageType = function getCurrentStorageType() {
            return localStorage[LS_STORAGE_TYPE_PROP];
        },

        getBytesInUse = function getBytesInUse(callback) {
            chrome.runtime.sendMessage({ getBytesInUse: true }, chromeAPICallWrapper(callback));
        },

        notifyCtxEnableToggle = function notifyCtxEnableToggle() {
            const msg = { ctxEnabled: Data.ctxEnabled };
            chrome.runtime.sendMessage(msg, chromeAPICallWrapper());
        },

        listBlockedSites = function listBlockedSites() {
            $blockSitesTextarea.value = Data.blockedSites.join("\n");
        },

        createTableRow = function createTableRow(textArr) {
            const tr = q.new("tr");

            for (const text of textArr) {
                tr.appendChild(q.new("td").html(text));
            }

            return tr;
        },

        getAutoInsertCharIndex = function getAutoInsertCharIndex(firstCharToGet) {
            const arr = Data.charsToAutoInsertUserList;

            for (const [index, charPair] of arr.entries()) {
                if (firstCharToGet === charPair[0]) {
                    return index;
                }
            }

            return -1;
        },

        appendInputBoxesInTable = function appendInputBoxesInTable() {
            const mainClass = "char_input",
                tr = q.new("tr"),
                // eslint-disable-next-line no-use-before-define
                inp1 = configureTextInputElm("new character"),
                // eslint-disable-next-line no-use-before-define
                inp2 = configureTextInputElm("its complement");

            function append(elm) {
                const td = q.new("td");
                td.appendChild(elm);
                tr.appendChild(td);
            }

            function configureTextInputElm(attribute) {
                const inp = q
                    .new("input")
                    .addClass(mainClass)
                    .attr("placeholder", `Type ${attribute}`);
                inp.type = "text";

                append(inp);

                inp.addEventListener("keydown", (e) => {
                    if (e.keyCode === 13) {
                    // eslint-disable-next-line no-use-before-define
                        saveAutoInsert([inp1.value, inp2.value]);
                    }
                });

                return inp;
            }

            append(q.new("button").html("Save"));

            $autoInsertTable.appendChild(tr);
        },

        // inserts in the table the chars to be auto-inserted
        listAutoInsertChars = function listAutoInsertChars() {
            if (Data.charsToAutoInsertUserList.length === 0) {
                $autoInsertTable.html("No Auto-Insert pair currently. Add new:");
            } else {
                const thead = q.new("thead"),
                    tr = q.new("tr");

                // clear the table initially
                $autoInsertTable.html("");

                tr.appendChild(q.new("th").html("Character"));
                tr.appendChild(q.new("th").html("Complement"));

                thead.appendChild(tr);

                $autoInsertTable.appendChild(thead);

                for (const charPair of Data.charsToAutoInsertUserList) {
                // create <tr> with <td>s having text as in current array and Remove
                    $autoInsertTable.appendChild(createTableRow(charPair.concat("Remove")));
                }
            }

            appendInputBoxesInTable();
        },

        saveAutoInsert = function saveAutoInsert(autoInsertPair) {
            const [firstChar, lastChar] = autoInsertPair,
                str = "Please type exactly one character in ";

            if (firstChar.length !== 1) {
                window.alert(`${str}first field.`);
                return;
            }

            if (lastChar.length !== 1) {
                window.alert(`${str}second field.`);
                return;
            }

            if (getAutoInsertCharIndex(firstChar) !== -1) {
                window.alert(`The character "${firstChar}" is already present.`);
                return;
            }

            // first insert in user list
            Data.charsToAutoInsertUserList.push(autoInsertPair);

            saveOtherData(`Saved auto-insert pair - ${firstChar}${lastChar}`, listAutoInsertChars);
        },

        removeAutoInsertChar = function removeAutoInsertChar(autoInsertPair) {
            const index = getAutoInsertCharIndex(autoInsertPair[0]);

            Data.charsToAutoInsertUserList.splice(index, 1);

            saveOtherData(`Removed auto-insert pair '${autoInsertPair.join("")}'`, listAutoInsertChars);
        },

        /**
     * returns the current hotkey in string format
     * example: `["shiftKey", 32]` returns `Shift+Space`
     */
        getCurrentHotkey = function getCurrentHotkey() {
            function isNumPadKey(keyCode) {
                return keyCode >= 96 && keyCode <= 105;
            }
            const combo = Data.hotKey,
                specials = {
                    9: "Tab",
                    13: "Enter",
                    32: "Space",
                    188: ", (Comma)",
                    192: "` (Backtick)",
                },
                metaKeyNames = {
                    shiftKey: "Shift",
                    ctrlKey: "Ctrl",
                    altKey: "Alt",
                    metaKey: "Meta",
                };
            let kC, // key (keyCode in older version)
                result = "";

            // dual-key combo
            if (combo[1]) {
                result += `${metaKeyNames[combo[0]]} + `;

                kC = combo[1];
            } else {
                kC = combo[0];
            }

            if (Number.isInteger(kC)) {
                if (isNumPadKey(kC)) {
                    result += "NumPad";
                    kC -= 48;
                }

                result += specials[kC] || String.fromCharCode(kC);
            } else {
                result += kC === " " ? "Space" : kC;
            }

            return result;
        },

        sanitizeSiteURLForBlock = function sanitizeSiteURLForBlock(URL) {
            const validSiteRegex = /(\w+\.)+\w+/;

            // invalid domain entered; exit
            if (!validSiteRegex.test(URL)) {
                window.alert("Invalid form of site address entered.");
                return false;
            }

            URL = URL.replace(protoWWWReplaceRegex, "");

            // already a blocked site
            if (isBlockedSite(URL)) {
                window.alert(`Site ${URL} is already blocked.`);
                return false;
            }

            return URL;
        },

        // (sample) input 1836 => "2KB"
        // input 5,123,456 => "5MB"
        roundByteSize = function roundByteSize(bytes) {
            const suffixPowerMap = {
                MB: 6,
                KB: 3,
                B: 0,
            };

            for (const [suffix, power] of Object.entries(suffixPowerMap)) {
                const divisor = Math.pow(10, power);
                if (bytes >= divisor) {
                    return Math.round(bytes / divisor) + suffix;
                }
            }

            return `${bytes}B`;
        },

        roundByteSizeWithPercent = function roundByteSizeWithPercent(bytes, bytesLim) {
            const roundedByteSize = roundByteSize(bytes),
                percent = Math.round((bytes / bytesLim) * 100);
            return `${roundedByteSize} (${percent}%)`;
        },

        // updates the storage header in #headArea
        // "You have x bytes left out of y bytes"
        updateStorageAmount = function updateStorageAmount() {
            getBytesInUse((response) => {
                if (!response || typeof response.bytes !== "number") {
                    console.error("[DEBUG] Invalid bytes response:", response);
                    return;
                }

                const bytesInUse = response.bytes,
                    bytesAvailable = getCurrentStorageType() === "sync" ? MAX_SYNC_DATA_SIZE : MAX_LOCAL_DATA_SIZE;

                console.log("[DEBUG] Storage usage:", {
                    bytesInUse,
                    bytesAvailable,
                    storageType: getCurrentStorageType(),
                });

                // set current bytes
                const currentBytesElement = qClsSingle("currentBytes");
                if (currentBytesElement) {
                    currentBytesElement.html(roundByteSizeWithPercent(bytesInUse, bytesAvailable));
                }

                // set total bytes available
                const bytesAvailableElement = qClsSingle("bytesAvailable");
                if (bytesAvailableElement) {
                    bytesAvailableElement.html(roundByteSize(bytesAvailable));
                }
            });
        },

        // used when buttons in navbar are clicked
        // or when the url contains an id of a div
        showHideMainPanels = function showHideMainPanels(DIVName) {
            const containerSel = "#content > ",
                DIVSelector = `#${DIVName}`,
                btnSelector = `.sidebar .buttons button[data-divid =${DIVName}]`,
                selectedBtnClass = "selected",
                selectedDIV = q(`${containerSel}.show`),
                selectedBtn = q(`.sidebar .buttons .${selectedBtnClass}`);

            if (DIVName === "snippets") {
                Data.snippets.listSnippets();
            }

            if (selectedDIV) {
                selectedDIV.removeClass("show");
            }
            q(containerSel + DIVSelector).addClass("show");

            if (selectedBtn) {
                selectedBtn.removeClass(selectedBtnClass);
            }
            q(btnSelector).addClass(selectedBtnClass);

            let { href } = window.location,
                selIndex = href.indexOf("#");

            if (selIndex !== -1) {
                href = href.substring(0, selIndex);
            }

            window.location.href = href + DIVSelector;

            // the page shifts down a little
            // for the exact location of the div;
            // so move it back to the top
            document.body.scrollTop = 0;
        },

        /**
     * Setup those parts of the DOM first which can function decently even
     * if Data isn't loaded
     */
        domBeforeDBLoad = function domBeforeDBLoad() {
            if (!window[PRIMITIVES_EXT_KEY]) {
                updateAllValuesPerWin(window);
            }

            chrome.storage.onChanged.addListener(updateStorageAmount);
            Q("span.version").forEach((span) => {
                span.innerHTML = VERSION;
            });

            const sidebarButtons = Q(".sidebar .buttons button");

            // the left hand side nav buttons
            // Help, Settings, Backup&Restore, About
            sidebarButtons.forEach((button) => {
                button.addEventListener("click", function () {
                    showHideMainPanels(this.dataset.divid);
                });
            });

            (function helpPageHandlers() {
            /* set up accordion in help page */
            // heading
                Q("#help section dt").forEach((dt) => {
                    dt.addEventListener("click", function () {
                        this.classList.toggle("show");
                    });
                });

                function fixMacroTable(table) {
                    const tableRows = table.children[1].children;
                    Array.prototype.forEach.call(tableRows, (tablerow) => {
                        tablerow.firstElementChild.innerHTML = gTranlateImmune(tablerow.firstElementChild.innerHTML);
                    });
                }

                fixMacroTable(qClsSingle("date-macro-list"));
                fixMacroTable(qClsSingle("browser-macro-list"));
            }());

            // snippetWork.js handles the change-log box
            (function setupPopupBoxHandlers() {
                const noDBErrorBox = qClsSingle("no-db-error"),
                    $closeButton = noDBErrorBox.q("button");

                $closeButton.addEventListener("click", () => {
                    noDBErrorBox.removeClass(SHOW_CLASS);
                });
            }());

            // Add click handler for Help section dropdowns
            const helpSection = document.getElementById("help");
            if (helpSection) {
                helpSection.addEventListener("click", (e) => {
                    if (e.target.tagName.toLowerCase() === "dt") {
                        e.target.classList.toggle("show");
                    }
                });
            }
        },

        /**
     * Called when Data is defined and has correctly loaded
     */
        DOMafterDBLoad = function DOMafterDBLoad() {
        // Initialize DOM elements
            $tabKeyInput = qId("tabKey");
            $ctxEnabledInput = qId("ctxEnable");
            $dotPhrasesEnabledInput = qId("dotPhrasesEnabled");
            $snipMatchDelimitedWordInput = q(".snippet_match_whole_word input[type='checkbox']");
            $snipNameDelimiterListDIV = qClsSingle("delimiter_list");
            $autoInsertTable = q(".auto_insert");
            autoInsertWrapSelectionInput = q("[name='wrapSelectionAutoInsert']");
            omniboxSearchURLInput = q(".search-provider input[type='text']");
            $blockSitesTextarea = q(".blocked-sites textarea");

            // Verify elements are found
            if (!$tabKeyInput || !$ctxEnabledInput || !$blockSitesTextarea) {
                console.error("[ERROR] Critical DOM elements not found:", {
                    $tabKeyInput,
                    $ctxEnabledInput,
                    $blockSitesTextarea,
                });
                return;
            }

            const url = window.location.href;
            if (/#\w+$/.test(url) && !/tryit|symbolsList/.test(url)) {
            // get the id and show divs based on that
                showHideMainPanels(url.match(/#(\w+)$/)[1]);
            } else {
                showHideMainPanels("snippets");
            }

            (function settingsPageHandlers() {
                const $delimiterCharsInput = q(".delimiter_list input"),
                    $delimiterCharsResetBtn = q(".delimiter_list button");

                // on user input in tab key setting
                $tabKeyInput.addEventListener("change", function () {
                    Data.tabKey = this.checked;
                    saveOtherData();
                });

                // on user input in context menu setting
                $ctxEnabledInput.addEventListener("change", function () {
                    Data.ctxEnabled = this.checked;
                    notifyCtxEnableToggle();
                    saveOtherData();
                });

                $blockSitesTextarea.addEventListener("keydown", (event) => {
                    if (event.keyCode === 13 && (event.ctrlKey || event.metaKey)) {
                        const URLs = $blockSitesTextarea.value.split("\n"),
                            len = URLs.length;
                        let i = 0,
                            URL,
                            sanitizedURL;

                        Data.blockedSites = []; // reset

                        for (; i < len; i++) {
                            URL = URLs[i].trim();
                            sanitizedURL = sanitizeSiteURLForBlock(URL);

                            if (sanitizedURL === false) {
                                return;
                            }
                            Data.blockedSites.push(sanitizedURL);
                        }

                        saveOtherData(listBlockedSites);
                    }
                });

                function getAutoInsertPairFromSaveInput(node) {
                    const $clickedTR = node.parentNode.parentNode;
                    return $clickedTR.qCls("char_input").map(e => e.value);
                }

                function getAutoInsertPairFromRemoveInput(node) {
                    const $clickedTR = node.parentNode;
                    return (
                        $clickedTR
                            .Q("td")
                        // slice to exclude Remove button
                            .map(e => e.innerText)
                            .slice(0, 2)
                    );
                }

                $autoInsertTable.addEventListener("click", (e) => {
                    const node = e.target;

                    if (node.tagName === "BUTTON") {
                        saveAutoInsert(getAutoInsertPairFromSaveInput(node));
                    } else if (getHTML(node) === "Remove") {
                        removeAutoInsertChar(getAutoInsertPairFromRemoveInput(node));
                    }
                });

                $snipMatchDelimitedWordInput.addEventListener("change", function () {
                    const isChecked = this.checked;
                    Data.matchDelimitedWord = isChecked;
                    $snipNameDelimiterListDIV.classList.toggle(SHOW_CLASS);
                    saveOtherData();
                });

                function validateDelimiterList(stringList) {
                    const len = RESERVED_DELIMITER_LIST.length;
                    let i = 0,
                        reservedDelimiter;
                    for (; i < len; i++) {
                        reservedDelimiter = RESERVED_DELIMITER_LIST.charAt(i);
                        if (stringList.match(escapeRegExp(reservedDelimiter))) {
                            return reservedDelimiter;
                        }
                    }

                    return true;
                }

                $delimiterCharsInput.addEventListener("keyup", function (e) {
                    if (e.keyCode === 13) {
                        const vld = validateDelimiterList(this.value);
                        if (vld !== true) {
                            window.alert(
                                `Input list contains reserved delimiter "${vld}". Please remove it from the list. Thank you!`,
                            );
                            return true;
                        }
                        Data.snipNameDelimiterList = this.value;
                        saveOtherData();
                    }

                    return false;
                });

                function delimiterInit() {
                    $delimiterCharsInput.value = Data.snipNameDelimiterList;
                }

                $delimiterCharsResetBtn.addEventListener("click", () => {
                    if (
                        window.confirm(
                            "Are you sure you want to replace the current list with the default delimiter list?",
                        )
                    ) {
                        Data.snipNameDelimiterList = SETTINGS_DEFAULTS.snipNameDelimiterList;
                        delimiterInit();
                        saveOtherData();
                    }
                });

                delimiterInit();
            }());

            // dot phrases toggle
            $dotPhrasesEnabledInput = q("#dotPhrasesEnabled");
            $dotPhrasesEnabledInput.checked = Data.dotPhrasesEnabled;
            $dotPhrasesEnabledInput.addEventListener("change", () => {
                Data.dotPhrasesEnabled = $dotPhrasesEnabledInput.checked;
                saveOtherData();
            });

            // dark mode toggle
            const $darkModeInput = q("#darkMode");
            console.log("[OPTIONS] Setting up dark mode toggle. Initial state:", Data.darkMode);
            // Remove any existing dark-theme class first
            document.documentElement.classList.remove("dark-theme");
            // Only add if darkMode is explicitly true
            if (Data.darkMode === true) {
                document.documentElement.classList.add("dark-theme");
            }
            $darkModeInput.checked = Data.darkMode === true;

            $darkModeInput.addEventListener("change", () => {
                console.log("[OPTIONS] Dark mode toggled to:", $darkModeInput.checked);
                Data.darkMode = $darkModeInput.checked;
                // Use add/remove instead of toggle for explicit control
                if (Data.darkMode) {
                    document.documentElement.classList.add("dark-theme");
                } else {
                    document.documentElement.classList.remove("dark-theme");
                }
                saveOtherData();
            });

            initSnippetWork();

            (function storageModeWork() {
            // Initialize storage mode radio buttons
                const storageModeContainer = qClsSingle("storageMode");
                if (storageModeContainer) {
                    const currentMode = getCurrentStorageType() || "sync",
                        modes = [
                            { id: "sync1", label: "Sync With Other Computers Under This Account", value: "sync" },
                            { id: "sync2", label: "This Device Only", value: "sync" },
                        ];

                    // Create radio buttons
                    modes.forEach((mode) => {
                        const label = document.createElement("label"),
                            input = document.createElement("input");
                        input.type = "radio";
                        input.name = "storageMode";
                        input.id = mode.id;
                        input.dataset.storagetoset = mode.value;
                        input.checked = currentMode === mode.value;

                        label.appendChild(input);
                        label.appendChild(document.createTextNode(` ${mode.label}`));
                        label.appendChild(document.createElement("br"));

                        storageModeContainer.appendChild(label);
                    });
                }

                // boolean parameter transferData: dictates if one should transfer data or not
                function storageRadioBtnClick(str, transferData) {
                    if (
                        !window.confirm(
                            `Migrate data to ${str} storage? It is VERY NECESSARY to take a BACKUP before proceeding.`,
                        )
                    ) {
                        this.checked = false;
                        return;
                    }

                    migrateData(transferData, (wasSuccessful) => {
                        if (wasSuccessful) {
                            window.alert(`Done! Data migrated to ${str} storage successfully!`);
                            window.location.reload();
                        } else {
                            window.alert(`It seems the target storage ${str} hasn't loaded yet.
In case of sync data, it may be because of Google sync not having finished yet.
Please wait at least five minutes and try again.`);
                            window.location.reload();
                        }
                    });
                }

                // event delegation since radio buttons are
                // dynamically added
                qClsSingle("storageMode").addEventListener("click", (e) => {
                    const input = e.target;

                    // make sure radio btn is clicked and is checked
                    if (input.tagName === "INPUT" && input.checked) {
                        storageRadioBtnClick.call(
                            input,
                            input.dataset.storagetoset,
                            input.id !== "sync2",
                        );
                    }
                });
            }());

            initBackup();

            // Hotkey change handler
            const $hotkeyListener = q(".hotkey_listener"),
                $hotkeyDisplay = q(".hotkey_display"),
                $changeHotkeyBtn = q(".change_hotkey");

            let isCapturingHotkey = false,
                capturedModifier = null;

            function updateHotkeyDisplay() {
                $hotkeyDisplay.innerHTML = getCurrentHotkey();
            }

            $changeHotkeyBtn.addEventListener("click", function () {
                if (!isCapturingHotkey) {
                    isCapturingHotkey = true;
                    capturedModifier = null;
                    this.innerHTML = "Press your hotkey combination";
                    $hotkeyListener.value = "";
                    $hotkeyListener.focus();
                } else {
                    isCapturingHotkey = false;
                    this.innerHTML = "Change hotkey";
                }
            });

            $hotkeyListener.addEventListener("keydown", function (event) {
                if (!isCapturingHotkey) { return; }

                event.preventDefault();

                const modifierKeys = {
                    Shift: "shiftKey",
                    Control: "ctrlKey",
                    Alt: "altKey",
                    Meta: "metaKey",
                };

                // If it's a modifier key, capture it
                if (modifierKeys[event.key]) {
                    capturedModifier = modifierKeys[event.key];
                    this.value = `${event.key} + ...`;
                    return;
                }

                // If we have a modifier and now a regular key
                if (capturedModifier && event[capturedModifier]) {
                    const key = event.key === " " ? "Space" : event.key;
                    Data.hotKey = [capturedModifier, key];
                    saveOtherData(updateHotkeyDisplay);
                    isCapturingHotkey = false;
                    $changeHotkeyBtn.innerHTML = "Change hotkey";
                    this.value = "";
                    this.blur();
                }
            });

            $hotkeyListener.addEventListener("keyup", function (event) {
                if (!isCapturingHotkey) { return; }

                const modifierKeys = {
                    Shift: "shiftKey",
                    Control: "ctrlKey",
                    Alt: "altKey",
                    Meta: "metaKey",
                };

                // If the modifier key was released without pressing another key
                if (modifierKeys[event.key] && modifierKeys[event.key] === capturedModifier) {
                    capturedModifier = null;
                    this.value = "";
                }
            });

            updateHotkeyDisplay();

            const bindEvents = () => {
                if (omniboxSearchURLInput) {
                    omniboxSearchURLInput.addEventListener("keydown", function (e) {
                        if (e.keyCode === 13) {
                            Data.omniboxSearchURL = this.value;
                            saveOtherData();
                        }
                    });
                }

                if (autoInsertWrapSelectionInput) {
                    autoInsertWrapSelectionInput.addEventListener("click", () => {
                        Data.wrapSelectionAutoInsert = autoInsertWrapSelectionInput.checked;
                        saveOtherData();
                    });
                }
            };

            bindEvents();
        },

        local = "<b>Local</b> - storage only on one's own PC. More storage space than sync",
        localT = "<label for=\"local\"><input type=\"radio\" id=\"local\" data-storagetoset=\"local\"/><b>Local</b></label> - storage only on one's own PC locally. Safer than sync, and has more storage space. Note that on migration from sync to local, data stored on sync across all PCs would be deleted, and transfered into Local storage on this PC only.",
        sync1 = "<label for=\"sync\"><input type=\"radio\" id=\"sync\" data-storagetoset=\"sync\"/><b>Sync</b></label> - select if this is the first PC on which you are setting sync storage",
        sync2 = "<label for=\"sync2\"><input type=\"radio\" id=\"sync2\" data-storagetoset=\"sync\"/><b>Sync</b></label> - select if you have already set up sync storage on another PC and want that PCs data to be transferred here.",
        sync = "<b>Sync</b> - storage synced across all PCs. Offers less storage space compared to Local storage.",

        onDBLoad = function onDBLoad(DataResponse) {
            console.log("[DEBUG] DB load complete");
            console.log("[DEBUG] DataResponse:", DataResponse);
            console.log("[DEBUG] IN_OPTIONS_PAGE:", window.IN_OPTIONS_PAGE);
            state.dbLoaded = true;

            if (typeof DataResponse === "undefined") {
                console.log("[DEBUG] No data found, initializing defaults");
                DataResponse = {
                    snippets: Folder.getDefaultSnippetData(),
                    tabKey: true,
                    ctxEnabled: true,
                    matchDelimitedWord: false,
                };
                console.log("[DEBUG] Created default DataResponse:", DataResponse);
            }

            window.Data = DataResponse;
            Data = DataResponse;
            console.log("[DEBUG] Data object after assignment:", Data);

            // Ensure snippets is properly initialized as a Folder
            if (!(Data.snippets instanceof Folder)) {
                console.log("[DEBUG] Converting snippets to Folder instance");
                console.log("[DEBUG] Current Data.snippets:", Data.snippets);
                Data.snippets = Folder.getDefaultSnippetData();
                console.log("[DEBUG] Created new Folder instance:", Data.snippets);
            }

            // Set folder indices after Data is initialized
            console.log("[DEBUG] Setting folder indices");
            Folder.setIndices();

            // Initialize UI elements with proper error handling
            try {
                console.log("[DEBUG] Initializing UI elements");
                $panelSnippets = qClsSingle("panel_snippets");
                console.log("[DEBUG] $panelSnippets:", $panelSnippets);
                if ($panelSnippets) {
                    $containerSnippets = $panelSnippets.qClsSingle("panel_content");
                    $containerFolderPath = $panelSnippets.qClsSingle("folder_path");
                    console.log("[DEBUG] $containerSnippets:", $containerSnippets);
                    console.log("[DEBUG] $containerFolderPath:", $containerFolderPath);
                }

                $snipMatchDelimitedWordInput = q(".snippet_match_whole_word input[type='checkbox']");
                $tabKeyInput = qId("tabKey");
                $ctxEnabledInput = qId("ctxEnable");
                $snipNameDelimiterListDIV = qClsSingle("delimiter_list");

                // Initialize checkbox states with null checks
                if ($tabKeyInput) { $tabKeyInput.checked = Data.tabKey; }
                if ($ctxEnabledInput) { $ctxEnabledInput.checked = Data.ctxEnabled; }
                if ($snipMatchDelimitedWordInput) {
                    $snipMatchDelimitedWordInput.checked = Data.matchDelimitedWord;
                    if (Data.matchDelimitedWord && $snipNameDelimiterListDIV) {
                        $snipNameDelimiterListDIV.classList.add(SHOW_CLASS);
                    }
                }

                // Set up event listeners for UI elements
                if ($tabKeyInput) {
                    $tabKeyInput.addEventListener("change", function () {
                        Data.tabKey = this.checked;
                        saveOtherData();
                    });
                }

                if ($ctxEnabledInput) {
                    $ctxEnabledInput.addEventListener("change", function () {
                        Data.ctxEnabled = this.checked;
                        saveOtherData();
                    });
                }

                if ($snipMatchDelimitedWordInput) {
                    $snipMatchDelimitedWordInput.addEventListener("change", function () {
                        Data.matchDelimitedWord = this.checked;
                        if ($snipNameDelimiterListDIV) {
                            if (this.checked) {
                                $snipNameDelimiterListDIV.classList.add(SHOW_CLASS);
                            } else {
                                $snipNameDelimiterListDIV.classList.remove(SHOW_CLASS);
                            }
                        }
                        saveOtherData();
                    });
                }
            } catch (err) {
                console.error("[DEBUG] Error initializing UI:", err);
            }

            DOMafterDBLoad();

            if (checkAllReady()) {
                setInitialContent();
            }
        };

    // Initialize button click handlers
    document.addEventListener("DOMContentLoaded", () => {
        const buttons = document.querySelectorAll(".button");
        buttons.forEach((button) => {
            button.addEventListener("click", function (e) {
                e.preventDefault();
                const action = this.getAttribute("data-action");

                if (action === "snippets") {
                    if (window.Data && window.Data.snippets) {
                        try {
                            showSnippets();
                        } catch (err) {
                            console.error("[DEBUG] Error showing snippets:", err);
                        }
                    }
                } else if (action === "about") {
                    const aboutPanel = qClsSingle("about");
                    if (aboutPanel) {
                        aboutPanel.classList.add("show");
                    }
                }
            });
        });
    });

    const onWindowLoad = function onWindowLoad() {
        console.log("[DEBUG] Window load event fired");
        state.windowLoaded = true;
        domBeforeDBLoad();
        DBget(onDBLoad);
    };

    window.addEventListener("load", onWindowLoad);

    // Listen for storage changes
    chrome.storage.onChanged.addListener(updateStorageAmount);

    // Initial update of storage amount
    document.addEventListener("DOMContentLoaded", () => {
        updateStorageAmount();
    });
}());
