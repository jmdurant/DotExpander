/* global Data */
// eslint-disable-next-line no-unused-vars
/* global $containerSnippets, $panelSnippets */

import {
    q, qCls, qClsSingle, qId, Q, debounce, SHOW_CLASS,
} from "./pre";
import {
    Folder, Snip, Generic, DualTextbox,
} from "./snippetClasses";
import { saveSnippetData } from "./commonDataHandlers";

let validateSnippetData,
    validateFolderData,
    toggleSnippetEditPanel,
    toggleFolderEditPanel,
    dualSnippetEditorObj;
/**
 * @param {String} type generic snip or folder
 * @returns {Function} the handler for given type
 */
function handlerSaveObject(type) {
    const validationFunc = type === Generic.SNIP_TYPE ? validateSnippetData : validateFolderData;
    // once checked, now can mutate type as per need
    type = type[0].toUpperCase() + type.substr(1).toLowerCase();

    return async function () {
        return validationFunc(async (oldName, name, body, newParentfolder) => {
            console.log('Save handler called with:', { oldName, name, body, newParentfolder });
            
            if (oldName) {
                // Send edit request to service worker
                chrome.runtime.sendMessage({
                    type: 'editSnippet',
                    data: {
                        snippetId: oldName,
                        name: name,
                        body: body,
                        folderPath: newParentfolder ? [newParentfolder.name] : undefined
                    }
                }, response => {
                    if (response.success) {
                        window.latestRevisionLabel = `edited ${type} "${oldName}"`;
                        // Update UI after successful edit
                        saveSnippetData(undefined, newParentfolder ? newParentfolder.name : undefined);
                    } else {
                        console.error('Failed to edit snippet:', response.error);
                        alert(`Failed to edit snippet: ${response.error}`);
                    }
                });
            } else {
                // Send create request to service worker
                console.log('Creating new snippet:', { name, body, folderPath: newParentfolder ? [newParentfolder.name] : undefined });
                chrome.runtime.sendMessage({
                    type: 'createSnippet',
                    data: {
                        name: name,
                        body: body,
                        folderPath: newParentfolder ? [newParentfolder.name] : undefined
                    }
                }, response => {
                    if (response.success) {
                        console.log('Snippet created successfully');
                        window.latestRevisionLabel = `created ${type} "${name}"`;
                        // Update UI after successful creation
                        saveSnippetData(undefined, newParentfolder ? newParentfolder.name : undefined);
                    } else {
                        console.error('Failed to create snippet:', response.error);
                        alert(`Failed to create snippet: ${response.error}`);
                    }
                });
            }
        });
    };
}

/**
 * setup the folder or snippet edit panel
 * attaches handlers to div's
 * @param {String} type generic snip or folder
 * @returns {Function} triggered for display of edit panel
 */
function setupEditPanel(type) {
    console.log("[DEBUG] Setting up edit panel for type:", type);
    const $panel = qClsSingle(`panel_${type}_edit`),
        saveHandler = handlerSaveObject(type),
        nameElm = $panel.q(".name input");
    let $parentFolderDIV;

    $panel.on("keydown", (event) => {
        // ctrl/cmd-enter
        if (event.keyCode === 13 && (event.ctrlKey || event.metaKey)) {
            saveHandler();
        }

        // escape
        if (event.keyCode === 27) {
            $panel.qClsSingle("close_btn").click();
        }
    });

    nameElm.on("keydown", (event) => {
        // the ! ensures that both the $panel and the nameElm handlers don't fire simultaneously
        if (event.keyCode === 13 && !(event.ctrlKey || event.metaKey)) {
            saveHandler();
        }
    });

    function highlightInFolderList(folderElm, name) {
        const $folderNames = folderElm.Q("p");
        let folderUsable = null;

        for (const folder of $folderNames) {
            if (folder.dataset.name === name) {
                folderUsable = folder;
                folder.addClass("selected");
                break;
            }
        }

        if (folderUsable) {
            $parentFolderDIV = folderUsable.parent("div");
            while (!$parentFolderDIV.classList.contains("selectList")) {
                $parentFolderDIV.removeClass("collapsed");
                $parentFolderDIV = $parentFolderDIV.parent("div");
            }
        }
    }

    return async function (object, isSavingSnippet) {
        console.log("[DEBUG] Edit panel handler called", { object, isSavingSnippet, isEditing: !!object });
        const headerSpan = $panel.q(".header span"),
            folderElm = $panel.q(".folderSelect .selectList"),
            isEditing = !!object,
            isSnip = type === "snip",
            errorElements = qCls("error");

        // Set panel visibility and state
        $panelSnippets.toggleClass(SHOW_CLASS);
        $panel.toggleClass(SHOW_CLASS);
        if (isEditing) {
            $panel.removeClass("creating-new");
        } else {
            $panel.addClass("creating-new");
        }

        // Always clear editor content before loading new content or creating new snippet
        console.log("[DEBUG] Clearing editor content");
        await Promise.all([
            dualSnippetEditorObj.setPlainText(""),
            dualSnippetEditorObj.setRichText("")
        ]);

        // Only reset name field for new snippets or after save
        if (isSavingSnippet || !isEditing) {
            nameElm.value = "";
            nameElm.dataset.name = "";
        }

        // Return early if this is just a save operation
        if (isSavingSnippet) {
            return;
        }

        // reset folder list
        folderElm.html("");

        // cannot nest a folder under itself
        folderElm.appendChild(
            isEditing && type === "folder"
                ? Data.snippets.getFolderSelectList(object.name)
                : Data.snippets.getFolderSelectList(),
        );

        if (isEditing) {
            const parent = object.getParentFolder();
            highlightInFolderList(folderElm, parent.name);
        } else {
            highlightInFolderList(folderElm, Folder.getListedFolderName());
        }

        headerSpan.html((isEditing ? "Edit " : "Create new ") + type);

        if (errorElements) {
            errorElements.removeClass(SHOW_CLASS);
        }

        // Load content if editing an existing snippet
        if (isEditing) {
            console.log("[DEBUG] Loading existing content for editing");
            nameElm.value = object.name;
            nameElm.dataset.name = object.name;
            
            if (isSnip) {
                console.log("[DEBUG] Setting up editor with body:", object.body);
                try {
                    let content = object.body;
                    
                    // Wait for Quill initialization if needed
                    if (!dualSnippetEditorObj.isQuillInitialized && dualSnippetEditorObj.quillInitPromise) {
                        console.log("[DEBUG] Waiting for Quill initialization");
                        await dualSnippetEditorObj.quillInitPromise;
                    }

                    // Detect content type and switch editor mode accordingly
                    let isRichText = false;
                    if (typeof content === 'string' && content.trim()) {
                        try {
                            const parsed = JSON.parse(content);
                            if (parsed && (parsed.type === 'quill-table-content' || parsed.ops)) {
                                isRichText = true;
                                content = parsed;
                            }
                        } catch (e) {
                            // Not JSON, check if it contains HTML formatting
                            isRichText = content.includes('</') || content.includes('/>');
                        }
                    }

                    // Switch to appropriate editor mode
                    console.log("[DEBUG] Content type detected:", isRichText ? "rich text" : "plain text");
                    const editorButtons = $panel.querySelectorAll('.nav p');
                    const targetButton = editorButtons[isRichText ? 1 : 0]; // 0 for plain text, 1 for rich text
                    if (!targetButton.classList.contains('show')) {
                        targetButton.click();
                        // Give time for mode switch to complete
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }

                    // Load content into the appropriate editor
                    if (isRichText) {
                        await dualSnippetEditorObj.setRichText(content);
                    } else {
                        dualSnippetEditorObj.setPlainText(content);
                    }
                } catch (e) {
                    console.error("[DEBUG] Error setting up editor:", e);
                    await dualSnippetEditorObj.setPlainText("");
                }
            }
        }
    };
}

/** functions common to snip and folder
 * @param {String} panelName snip or folder only
 * @returns {Function} extracts text from elms, passes them for validation, callsback
 */
function commonValidation(panelName) {
    const panel = qClsSingle(`panel_${panelName}_edit`);

    async function manipulateElmForValidation(elm, validateFunc, errorElm) {
        let text;
        if (elm) {
            text = elm.value;
        } else {
            text = await dualSnippetEditorObj.getShownTextForSaving();
        }

        console.log('Validating text:', text);

        const textVld = validateFunc(text),
            textErrorElm = errorElm || elm.nextElementSibling;
        let isTextValid = textVld === "true";

        // when we are editing snippet/folder it does
        // not matter if the name remains same
        if (
            textVld === Generic.prototype.getDuplicateObjectsText(text, panelName)
            && elm && elm.dataset.name === text
        ) {
            isTextValid = true;
        }

        if (isTextValid) {
            textErrorElm.removeClass(SHOW_CLASS);
        } else {
            textErrorElm.addClass(SHOW_CLASS).html(textVld);
        }

        console.log('Validation result:', { text, isTextValid, validation: textVld });
        return [text, isTextValid];
    }

    return async function (callback) {
        const nameElm = panel.q(".name input"),
            selectList = panel.qClsSingle("selectList"),
            folder = Folder.getSelectedFolderInSelectList(selectList),
            isSnippet = /snip/.test(panel.className);
        let name,
            body;

        console.log('Starting validation for:', { isSnippet, folder });

        if (isSnippet) {
            name = await manipulateElmForValidation(nameElm, (text) => Generic.prototype.isValidName(text, Generic.SNIP_TYPE));
            body = await manipulateElmForValidation(undefined, (text) => text.length ? "true" : "Empty body field", panel.q(".body .error"));
        } else {
            name = await manipulateElmForValidation(nameElm, (text) => Generic.prototype.isValidName(text, Generic.FOLDER_TYPE));
        }

        const allValid = name[1] && (isSnippet ? body[1] : true),
            oldName = nameElm.dataset.name;

        console.log('Validation complete:', { allValid, oldName, name: name[0], body: body ? body[0] : undefined });

        if (allValid) {
            if (isSnippet) {
                toggleSnippetEditPanel(undefined, true);
            } else {
                toggleFolderEditPanel(undefined, true);
            }

            callback(oldName, name[0], body && body[0], folder);
        }
    };
}

export function initSnippetWork() {
    // define element variables
    const $searchBtn = qClsSingle("search_btn"),
        $searchPanel = qClsSingle("panel_search"),
        $searchField = q(".panel_search input[type=text]"),
        $closeBtn = qCls("close_btn"),
        $snippetSaveBtn = q(".panel_snip_edit .tick_btn"),
        $folderSaveBtn = q(".panel_folder_edit .tick_btn"),
        $addNewBtns = Q(".panel_snippets [class^=\"add_new\"]"),
        $sortBtn = q(".panel_snippets .sort_btn"),
        $sortPanel = qClsSingle("panel_sort"),
        // the button that actually initiates sorting
        $sortPanelBtn = q(".panel_sort input[type=button]"),
        $bulkActionBtn = q(".panel_snippets .checkbox_btn"),
        $bulkActionPanel = q(".panel_snippets .panel_bulk_action"),
        folderPath = qClsSingle("folder_path"),
        $selectList = qCls("selectList");

    validateSnippetData = commonValidation(Generic.SNIP_TYPE);
    validateFolderData = commonValidation(Generic.FOLDER_TYPE);
    toggleSnippetEditPanel = setupEditPanel(Generic.SNIP_TYPE);
    toggleFolderEditPanel = setupEditPanel(Generic.FOLDER_TYPE);
    dualSnippetEditorObj = new DualTextbox(qId("body-editor"));

    /**
     * Delegated handler for edit, delete, clone buttons
     */
    $containerSnippets.on("click", (e) => {
        const node = e.target;
        console.log('Click event:', e.target);

        // Check if it's a button click
        if (node.classList.contains('edit_btn') || node.classList.contains('delete_btn') || node.classList.contains('clone_btn')) {
            const objectElm = node.closest('.generic');
            if (!objectElm) {
                console.log('No parent element found');
                return true;
            }

            console.log('Object element found:', objectElm);

            if (node.classList.contains('edit_btn')) {
                const isSnip = objectElm.classList.contains("snip");
                const type = isSnip ? Generic.SNIP_TYPE : Generic.FOLDER_TYPE;
                const name = objectElm.querySelector('.name').dataset.name;
                const obj = Data.snippets.getUniqueObject(name, type);
                
                console.log('Editing object:', obj);
                if (Folder.isFolder(obj)) {
                    toggleFolderEditPanel(obj);
                } else {
                    toggleSnippetEditPanel(obj);
                }
            } else if (node.classList.contains('delete_btn')) {
                deleteOnClick.call(objectElm);
            } else if (node.classList.contains('clone_btn')) {
                cloneBtnOnClick.call(objectElm);
            }

            return false;
        }

        return true;
    });

    function deleteOnClick() {
        const isSnip = this.classList.contains("snip");
        const type = isSnip ? Generic.SNIP_TYPE : Generic.FOLDER_TYPE;
        const name = this.querySelector('.name').dataset.name;
        const object = Data.snippets.getUniqueObject(name, type);
        const warning = isSnip ? "" : " (and ALL its contents)";

        if (window.confirm(`Delete '${name}' ${type}${warning}?`)) {
            // Send delete request to service worker
            chrome.runtime.sendMessage({ 
                type: 'deleteSnippet',
                data: { 
                    snippetId: name,
                    type: type
                }
            }, response => {
                if (response.success) {
                    window.latestRevisionLabel = `deleted ${type} "${name}"`;
                    // Remove the element from DOM
                    const elementToRemove = this.closest('.list_item');
                    if (elementToRemove) {
                        elementToRemove.remove();
                    }
                    // Update data
                    const folder = object.getParentFolder();
                    saveSnippetData(undefined, folder ? folder.name : undefined);
                } else {
                    console.error('Failed to delete snippet:', response.error);
                    alert(`Failed to delete snippet: ${response.error}`);
                }
            });
        }
    }

    folderPath.on("click", (e) => {
        const node = e.target;
        let folderName,
            folder;

        if (node.matches(".chevron")) {
            folder = Folder.getListedFolder();
            folder.getParentFolder().listSnippets();
        } else if (node.matches(".path_part") || node.parentElement.matches(".path_part")) {
            // sometimes the click wil have target as the span.notranslate
            folderName = node.innerText;
            folder = Data.snippets.getUniqueFolder(folderName);
            folder.listSnippets();
        }
    });

    /**
     * @param {Element} $panel the snippet or folder panel being edited
     * @param {Element} $objectName the input element containing the object name
     * @returns {Boolean} if the text typed in the panel is edited (true)
     */
    function userHasEditedTextPresentInPanel($panel, $objectName) {
        const $body = $panel.qClsSingle("body"),
            objectName = $objectName.value,
            nameChanged = $objectName.dataset.name !== objectName;

        if (!$body || nameChanged) {
            return nameChanged;
        }

        if (objectName === "") {
            return false;
        }

        const body = dualSnippetEditorObj.getShownTextForSaving(),
            snip = Data.snippets.getUniqueSnip(objectName),
            bodyChanged = snip ? snip.body !== body : false;

        return bodyChanged;
    }

    function closePanel($panel) {
        $panel.removeClass(SHOW_CLASS);
        $panelSnippets.addClass(SHOW_CLASS);
    }

    $closeBtn.on("click", function () {
        const $panel = this.parent(".panel"),
            $objectName = $panel.q(".name input");

        if ($objectName && userHasEditedTextPresentInPanel($panel, $objectName)) {
            if (window.confirm("You have unsaved edits. Are you sure you wish to leave?")) {
                closePanel($panel);
            }
        } else {
            // not an edit panel, but rather some export popup
            closePanel($panel);
        }
    });

    $snippetSaveBtn.on("click", handlerSaveObject(Generic.SNIP_TYPE));
    $folderSaveBtn.on("click", handlerSaveObject(Generic.FOLDER_TYPE));

    function cloneBtnOnClick() {
        const clickedObject = Generic.getObjectThroughDOMListElm(this),
            objectClone = clickedObject.clone();
        window.latestRevisionLabel = `cloned ${clickedObject.type} "${clickedObject.name}"`;

        // keep the same snippet highlighted as well (object.name)
        // so that user can press clone button repeatedly
        saveSnippetData(undefined, objectClone.getParentFolder().name, [
            clickedObject.name,
            objectClone.name,
        ]);
    }

    $selectList.on("click", function (e) {
        const clickedNode = e.target,
            classSel = "selected",
            collapsedClass = "collapsed";
        let otherNodes,
            $containerDIV;

        if (clickedNode.tagName === "P") {
            // do not use $selectList
            // as it is a NodeList
            $containerDIV = clickedNode.parentNode;
            $containerDIV.toggleClass(collapsedClass);

            otherNodes = this.qCls(classSel);
            if (otherNodes) {
                otherNodes.removeClass(classSel);
            }
            clickedNode.addClass(classSel);
        }
    });

    // for searchBtn and $searchPanel
    // $addNewBtn and $addNewPanel
    // and other combos
    function toggleBtnAndPanel(btn, panel) {
        const existingPanel = q(".sub_panel.show");
        panel.addClass(SHOW_CLASS);
        if (existingPanel) {
            existingPanel.removeClass(SHOW_CLASS);
        }

        const existingBtn = q(".panel_btn.active");
        btn.addClass("active");
        if (existingBtn) {
            existingBtn.removeClass("active");
        }

        // we need these checks as another might have been clicked
        // to remove the search/checkbox panel and so we need to remove
        // their type of list
        if (!$searchPanel.hasClass(SHOW_CLASS) && Folder.getListedFolder().isSearchResultFolder) {
            Data.snippets.listSnippets();
        }

        // if checkbox style list is still shown
        if (
            $containerSnippets.q("input[type=\"checkbox\"]")
            && !$bulkActionPanel.hasClass(SHOW_CLASS)
        ) {
            Data.snippets
                .getUniqueFolder($bulkActionPanel.dataset.originalShownFolderName)
                .listSnippets();
        }
    }

    $sortBtn.on("click", () => {
        toggleBtnAndPanel($sortBtn, $sortPanel);
    });

    $sortPanelBtn.on("click", () => {
        let sortDir = $sortPanel.q(".sort-dir :checked").parentNode.innerText,
            sortType = $sortPanel.q(".sort-type :checked").parentNode.innerText;
        const descendingFlag = (sortDir = sortDir === "Descending"),
            folder = Folder.getListedFolder();

        sortType = sortType === "Name" ? "alphabetic" : "date";

        folder.sort(sortType, descendingFlag);
        window.latestRevisionLabel = `sorted folder "${folder.name}"`;
        saveSnippetData(undefined, folder.name);
    });

    $addNewBtns.on("click", function () {
        if (/snip/i.test(this.className)) {
            toggleSnippetEditPanel();
        } else {
            toggleFolderEditPanel();
        }
    });

    $searchBtn.on("click", () => {
        toggleBtnAndPanel($searchBtn, $searchPanel);
        $searchField.html("").focus();
        // now hidden search panel, so re-list the snippets
        if (!$searchPanel.hasClass(SHOW_CLASS)) {
            Folder.getListedFolder().listSnippets();
        }
    });

    $searchBtn.attr("title", "Search for folders or snips");
    $searchField.on(
        "keyup",
        debounce(function searchFieldHandler() {
            const searchText = this.value,
                listedFolder = Folder.getListedFolder(),
                searchResult = listedFolder.searchSnippets(searchText);

            searchResult.listSnippets();
        }, 150),
    );

    (function bulkActionsWork() {
        let selectedObjects,
            DOMcontainer;
        const moveToBtn = $bulkActionPanel.q(".bulk_actions input:first-child"),
            deleteBtn = $bulkActionPanel.q(".bulk_actions input:last-child"),
            toggleAllButton = $bulkActionPanel.q(".selection_count input"),
            folderSelect = $bulkActionPanel.qClsSingle("folderSelect"),
            selectList = $bulkActionPanel.qClsSingle("selectList");

        function updateSelectionCount() {
            selectedObjects = DOMcontainer.Q("input:checked") || [];

            selectedObjects = selectedObjects.map((e) => {
                const div = e.nextElementSibling.nextElementSibling,
                    { name } = div.dataset,
                    img = e.nextElementSibling,
                    type = img.src.match(/\w+(?=\.svg)/)[0];

                return Data.snippets.getUniqueObject(name, type);
            });

            $bulkActionPanel.q(".selection_count span").html(selectedObjects.length);

            $bulkActionPanel.Q(".bulk_actions input").forEach((elm) => {
                elm.disabled = !selectedObjects.length;
            });
        }

        $bulkActionBtn.on("click", function () {
            let originalShownFolderName,
                originalShownFolder;

            toggleBtnAndPanel(this, $bulkActionPanel);

            if ($bulkActionPanel.hasClass(SHOW_CLASS)) {
                originalShownFolderName = Folder.getListedFolderName();
                originalShownFolder = Data.snippets.getUniqueFolder(originalShownFolderName);
                DOMcontainer = Folder.insertBulkActionDOM(originalShownFolder);

                $bulkActionPanel.dataset.originalShownFolderName = originalShownFolderName;

                DOMcontainer.on("click", (event) => {
                    const nodeClicked = event.target,
                        parentGeneric = nodeClicked.matches(".generic")
                            ? nodeClicked
                            : nodeClicked.parent(".generic"),
                        inputCheckbox = parentGeneric.children[0];

                    if (nodeClicked.tagName !== "INPUT") {
                        inputCheckbox.checked = !inputCheckbox.checked;
                    }

                    updateSelectionCount();
                });

                updateSelectionCount();
                folderSelect.removeClass(SHOW_CLASS);
            }
        });

        toggleAllButton.on("click", () => {
            const checkboxes = DOMcontainer.Q("input");
            let allCheckedBoxesChecked = true,
                finalCheckState;

            checkboxes.some((checkbox) => {
                if (!checkbox.checked) {
                    allCheckedBoxesChecked = false;
                    return true;
                }
                return false;
            });

            finalCheckState = !allCheckedBoxesChecked;

            checkboxes.forEach((checkbox) => {
                checkbox.checked = finalCheckState;
            });

            updateSelectionCount();
        });

        // move to folder button
        moveToBtn.on("click", () => {
            let selectFolderName,
                selectedFolder,
                atleastOneElementMoved = false;

            if (!folderSelect.hasClass(SHOW_CLASS)) {
                Folder.refreshSelectList(selectList);
                folderSelect.addClass(SHOW_CLASS);
            } else {
                selectedFolder = Folder.getSelectedFolderInSelectList(selectList);
                selectFolderName = selectedFolder.name;
                selectedObjects.forEach((selObj) => {
                    if (selObj.canNestUnder(selectedFolder)) {
                        atleastOneElementMoved = true;
                        selObj.moveTo(selectedFolder);
                    } else {
                        window.alert(
                            `Cannot move ${selObj.type} "${selObj.name}" to "${
                                selectedFolder.name
                            }"`
                            + "; as it is the same as (or a parent folder of) the destination folder",
                        );
                    }
                });

                // do not list new folder if nothing was moved
                if (!atleastOneElementMoved) {
                    return;
                }

                window.latestRevisionLabel = `moved ${
                    selectedObjects.length
                } objects to folder "${selectFolderName}"`;

                saveSnippetData(
                    () => {
                        // hide the bulk action panel
                        $bulkActionBtn.click();
                    },
                    selectFolderName,
                    selectedObjects.map(e => e.name),
                );
            }
        });

        deleteBtn.on("click", () => {
            if (
                window.confirm(
                    `Are you sure you want to delete these ${selectedObjects.length} items? `
                    + "Remember that deleting a folder will also delete ALL its contents.",
                )
            ) {
                selectedObjects.forEach((selObj) => {
                    selObj.remove();
                });

                window.latestRevisionLabel = `deleted ${selectedObjects.length} objects`;

                saveSnippetData(() => {
                    // hide the bulk action panel
                    $bulkActionBtn.click();
                }, Folder.getListedFolderName());
            }
        });
    }());

    (function displayChangelog() {
        const $changeLog = qClsSingle("change-log"),
            $button = $changeLog.q("button"),
            // ls set by background page
            isUpdate = localStorage.extensionUpdated === "true";

        $button.on("click", () => {
            $changeLog.removeClass(SHOW_CLASS);
            localStorage.extensionUpdated = "false";
        });

        if (isUpdate) {
            $changeLog.addClass(SHOW_CLASS);

            $button.on("click", () => {
                $changeLog.removeClass(SHOW_CLASS);
                localStorage.extensionUpdated = "false";
                chrome.browserAction.setBadgeText({ text: "" });
            });
        }
    }());

    Data.snippets.listSnippets();
}
