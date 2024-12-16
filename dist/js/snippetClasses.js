/* global Data, listOfSnippetCtxIDs */
/* global Quill, $containerFolderPath, $containerSnippets */

import {
    isObject,
    q,
    chromeAPICallWrapper,
    escapeRegExp,
    OBJECT_NAME_LIMIT,
    isTextNode,
    SHOW_CLASS,
    gTranlateImmune,
} from "./pre";
import { getText, genericFormatterCreator, formatOLULInListParentForCEnode } from "./textmethods";
import {
    getTotalDeviationFrom30DaysMonth, getFormattedDate, MILLISECONDS_IN_A_DAY, DATE_MACROS,
} from "./dateFns";

// functions common to Snip and Folder
function Generic() {
    this.matchesUnique = function (name) {
        return this.name.toLowerCase() === name.toLowerCase();
    };

    this.matchesNameLazy = function (text) {
        return new RegExp(text, "i").test(this.name);
    };

    // CAUTION: used only by searchField (since `strippedBody` set)
    this.matchesLazy = function (text) {
        // searching is case-insensitive
        return new RegExp(text, "i").test(this.name + this.strippedBody);
    };

    // CAUTION: used only by searchField (since `strippedBody` set)
    this.matchesWord = function (text) {
        return new RegExp(`\\b${text}\\b`, "i").test(this.name + this.strippedBody);
    };

    // deletes `this` from parent folder
    this.remove = function () {
        const index = Data.snippets.getUniqueObjectIndex(this.name, this.type),
            thisIndex = index[index.length - 1];

        this.getParentFolder().list.splice(thisIndex, 1);
        Folder.setIndices();
    };

    this.getParentFolder = function () {
        let index = Data.snippets.getUniqueObjectIndex(this.name, this.type),
            parent = Data.snippets;

        // last element is `this` index, we want parent so -1
        for (let i = 0, lim = index.length - 1; i < lim; i++) {
            parent = parent.list[index[i]];
        }

        return parent;
    };

    this.moveTo = function (newFolder) {
        const x = this.getDuplicatedObject();
        this.remove();
        Folder.insertObject(x, newFolder);
        return x;
    };

    // a folder cannot be nested under its subfolders, hence a check
    this.canNestUnder = function (newFolder) {
        if (Folder.isFolder(this)) {
            while (newFolder.name !== Folder.MAIN_SNIPPETS_NAME) {
                if (this.name === newFolder.name) {
                    return false;
                }

                newFolder = newFolder.getParentFolder();
            }
        }

        // no need to check for snippets
        return true;
    };

    /**
     * @return {Generic} clone of this object
     * (if it is a folder, its snippets' names remain as they were)
     */
    this.getClone = function () {
        if (this.type === Generic.SNIP_TYPE) {
            return new Snip(this.name, this.body, this.timestamp);
        }

        const clonedFolder = new Folder(this.name, [], this.timestamp);
        this.list.forEach((object) => {
            clonedFolder.list.push(object.getClone());
        });

        return clonedFolder;
    };

    /**
     * inserts the given object stepValue places after/before this under the same parent folder list
     * to maintain sanity you should pass the clone of the object you're trying to insert
     * @param {Generic} newObject to be inserted at given position
     * @param {Number} stepValue how far after this to be inserted (default immediately next)
     */
    this.insertAdjacent = function (newObject, stepValue, insertBeforeFlag) {
        const thisName = this.name,
            thisType = this.type,
            thisIndexArray = Data.snippets.getUniqueObjectIndex(thisName, thisType),
            thisIndex = thisIndexArray[thisIndexArray.length - 1],
            parentFolderList = this.getParentFolder().list,
            posToInsertObject = thisIndex + (stepValue ? +stepValue : 1) * (insertBeforeFlag ? 0 : 1);

        parentFolderList.splice(posToInsertObject, 0, newObject);
        Folder.setIndices();
    };
}

// Static properties
Generic.HIGHLIGHTING_CLASS = "highlighting";
Generic.FOLDER_TYPE = "folder";
Generic.SNIP_TYPE = "snip";
Generic.CTX_START = {};
Generic.CTX_START[Generic.SNIP_TYPE] = `${Generic.SNIP_TYPE}_`;
Generic.CTX_START[Generic.FOLDER_TYPE] = `${Generic.FOLDER_TYPE}_`;
Generic.CTX_SNIP_REGEX = new RegExp(Generic.CTX_START[Generic.SNIP_TYPE]);

// Prototype methods
Generic.prototype.getDOMElement = function (objectNamesToHighlight) {
    objectNamesToHighlight = objectNamesToHighlight === undefined
        ? []
        : !Array.isArray(objectNamesToHighlight)
            ? [objectNamesToHighlight]
            : objectNamesToHighlight;

    const divMain = q.new("div").addClass([this.type, "generic", Snip.DOMContractedClass]),
        img = q.new("img");
    img.src = `../imgs/${this.type}.svg`;

    divMain.appendChild(img);

    // creating the short `div` element
    const divName = q.new("div")
        // text with newlines does not fit in one line
        .html(gTranlateImmune(this.name))
        .addClass("name");
    divName.dataset.name = this.name;
    divMain.appendChild(divName);

    divMain.appendChild(this.getButtonsDOMElm());

    if (objectNamesToHighlight.indexOf(this.name) > -1) {
        if (objectNamesToHighlight[0] !== false) {
            divMain.removeClass(Snip.DOMContractedClass);
        }

        // highlight so the user may notice it
        // remove class after 3 seconds else it will
        // highlight repeatedly
        divMain.addClass(Generic.HIGHLIGHTING_CLASS);
        setTimeout(() => {
            divMain.removeClass(Generic.HIGHLIGHTING_CLASS);
        }, 3000);
    }

    return divMain;
};

Generic.prototype.getButtonsDOMElm = function () {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "buttons";

    const editButton = document.createElement("div");
    editButton.classList.add("edit_btn");
    editButton.classList.add("panel_btn");
    editButton.title = "Edit";

    const deleteButton = document.createElement("div");
    deleteButton.classList.add("delete_btn");
    deleteButton.classList.add("panel_btn");
    deleteButton.title = "Delete";

    const cloneButton = document.createElement("div");
    cloneButton.classList.add("clone_btn");
    cloneButton.classList.add("panel_btn");
    cloneButton.title = "Clone";

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(cloneButton);

    return buttonContainer;
};

Generic.prototype.preventButtonClickOverride = function (handler) {
    return function (e) {
        if (!e.target.matches(".buttons, .buttons div")) {
            handler.call(this, e);
        }
    };
};

Generic.prototype.getDuplicateObjectsText = function (text, type) {
    return `A ${type} with name '${text}' already exists (possibly with the same letters in upper/lower case.)`;
};

/**
 * @param {String} name
 * @param {String} type
 * @returns {String} validation result
 */
Generic.prototype.isValidName = function (name, type) {
    if (name.length === 0) {
        return "Empty name field";
    }
    if (name.length > OBJECT_NAME_LIMIT) {
        return `Name cannot be greater than ${OBJECT_NAME_LIMIT} characters. Current name has ${name.length
            - OBJECT_NAME_LIMIT} more characters.`;
    }

    // error may occur during no-db-restore
    try {
        const dupeExists = Data.snippets.getUniqueObject(name, type);
        if (dupeExists) { return Generic.getDuplicateObjectsText(name, type); }
        return "true";
    } catch (e) {
        return "true";
    }
};

/**
 * @param {Element} listElm The DOM element .snip or .folder, whose buttons, etc. were clicked
 * @returns {Generic} the snip/folder object associated with the listElm
 */
Generic.prototype.getObjectThroughDOMListElm = function (listElm) {
    const isSnip = listElm.classList.contains("snip"),
        type = isSnip ? Generic.SNIP_TYPE : Generic.FOLDER_TYPE,
        { name } = listElm.qClsSingle("name").dataset;

    return Data.snippets.getUniqueObject(name, type);
};

function Snip(name, body, timestamp) {
    this.name = name;
    this.body = body;
    this.timestamp = timestamp || Date.now();
    this.type = Generic.SNIP_TYPE;

    this.edit = function (newName, newBody) {
        this.name = newName;

        // If the body is already in our special format, use it directly
        try {
            if (typeof newBody === 'string' && newBody.startsWith('{')) {
                const parsed = JSON.parse(newBody);
                if (parsed && (parsed.type === 'quill-table-content' || parsed.type === 'html')) {
                    this.body = newBody;
                    return;
                }
            }
        } catch (e) {
            console.log('Error parsing body JSON:', e);
        }

        // Store as regular HTML if not in special format
        this.body = JSON.stringify({
            type: 'html',
            html: newBody,
            delta: null
        });
    };

    // "index" is index of this snip in Data.snippets
    this.getDOMElement = function (objectNamesToHighlight) {
        const divMain = Generic.prototype.getDOMElement.call(this, objectNamesToHighlight),
            divName = divMain.qClsSingle("name"),
            divBody = q.new("div").addClass("body");

        function processContent(content) {
            try {
                if (typeof content === 'string' && content.trim().startsWith('{')) {
                    const parsed = JSON.parse(content);
                    if (parsed && parsed.html) {
                        if (parsed.type === 'quill-table-content') {
                            return parsed.html
                                .replace(/<table/g, '<table class="prokeys-table"')
                                .replace(/<td/g, '<td class="prokeys-cell"')
                                .replace(/<th/g, '<th class="prokeys-cell"');
                        }
                        return parsed.html;
                    }
                }
            } catch (e) {
                // Not JSON or invalid format, use as is
                console.log('Content is not JSON, using as plain text');
            }
            // For plain text, wrap in a div and convert newlines to <br>
            return `<div>${String(content).replace(/\n/g, '<br>')}</div>`;
        }

        function toggleDivBodyText(snip) {
            const processedContent = processContent(snip.body);
            
            if (divMain.hasClass(Snip.DOMContractedClass)) {
                // Show collapsed preview
                const plainText = processedContent
                    .replace(/\<[^\>]+\>/g, ' ') // Remove HTML tags
                    .replace(/\s+/g, ' ')        // Normalize whitespace
                    .replace(/&[^;]+;/g, ' ')    // Remove HTML entities
                    .trim()
                    .substring(0, Snip.MAX_COLLAPSED_CHARACTERS_DISPLAYED);
                divBody.text(plainText);
                
                setTimeout(() => {
                    divBody.style.width = `calc(100% - 100px - ${divName.clientWidth}px)`;
                }, 1);
            } else {
                // Show full content with formatting
                divBody.html(processedContent).style.width = "";
            }
        }

        divMain.appendChild(divBody);
        divMain.appendChild(
            q.new("div")
                .addClass("clickable")
                .on("click", Generic.prototype.preventButtonClickOverride(() => {
                    divMain.toggleClass(Snip.DOMContractedClass);
                    toggleDivBodyText(this);
                }))
        );

        toggleDivBodyText(this);
        
        const timestampElm = q.new("div")
            .addClass("timestamp")
            .html(Snip.getTimestampString(this));
        divMain.appendChild(timestampElm);

        return divMain;
    };

    this.getDuplicatedObject = function () {
        return new Snip(this.name, this.body, this.timestamp);
    };

    // returns object representation of this Snip object
    this.toArray = function () {
        return {
            name: this.name,
            body: this.body,
            timestamp: this.timestamp,
        };
    };

    this.formatMacros = function (callback) {
        const embeddedSnippetsList = [this.name],
            // optimization for more than one embeds of the same snippet
            embeddingResultsCached = {};

        function embedSnippets(snipBody) {
            return snipBody.replace(/\[\[%s\((.*?)\)\]\]/g, (wholeMatch, snipName) => {
                // to avoid circular referencing
                if (embeddedSnippetsList.indexOf(snipName) > -1) {
                    return wholeMatch;
                }

                const matchedSnip = Data.snippets.getUniqueSnip(snipName),
                    matchedSnipName = matchedSnip && matchedSnip.name;

                if (matchedSnip) {
                    embeddedSnippetsList.push(matchedSnipName);
                    if (embeddingResultsCached[matchedSnipName]) {
                        return embeddingResultsCached[matchedSnipName];
                    }
                    embeddingResultsCached[matchedSnipName] = embedSnippets(matchedSnip.body);
                    return embeddingResultsCached[matchedSnipName];
                }
                return wholeMatch;
            });
        }

        const MAX_LENGTH = 100;

        function getListTillN(string, delimiter, length, startReplacement) {
            string = string.replace(new RegExp(`^\\${startReplacement}`), "");

            const array = string.split(new RegExp(`\\${delimiter}`, "g")),
                usefulArray = array.slice(0, length),
                output = usefulArray.join(delimiter);

            return output ? startReplacement + output : "";
        }

        function getExactlyNthItem(string, delimiter, index, startReplacement) {
            return string.replace(new RegExp(`^\\${startReplacement}`), "").split(delimiter)[
                index - 1
            ];
        }

        // snippet embedding shuold be performed first, so that if the newly embedded
        // snippet body has some macros, they would be evaluated in the below replacements
        let snipBody = embedSnippets(this.body);

        // Date/Time macro replacement
        // sameTimeFlag: indicates whether all calculations will be dependent (true)
        // on each other or independent (false) of each other
        snipBody = snipBody.replace(
            /\[\[%d\((!?)(.*?)\)\]\]/g,
            (wholeMatch, sameTimeFlag, userInputMacroText) => {
                let macro,
                    macroRegex,
                    macroRegexString,
                    macroFunc,
                    dateArithmeticChange,
                    date = new Date(),
                    operableDate,
                    // `text` was earlier modifying itself
                    // due to this, numbers which became shown after
                    // replacement got involved in dateTime arithmetic
                    // to avoid it; we take a substitute
                    replacedOutput = userInputMacroText;

                function dateReplacer(match, dateArithmeticMatch) {
                    let timeChange = 0;

                    if (dateArithmeticMatch) {
                        dateArithmeticMatch = parseInt(dateArithmeticMatch, 10);

                        // if the macro is a month, we need to account for the deviation days being changed
                        if (/M/.test(macroRegexString)) {
                            timeChange
                                += getTotalDeviationFrom30DaysMonth(dateArithmeticMatch)
                                * MILLISECONDS_IN_A_DAY;
                        }

                        timeChange += dateArithmeticChange * dateArithmeticMatch;
                    } else {
                        macroRegexString = macroRegexString
                            .replace(/[^a-zA-Z\\/]/g, "")
                            .replace("\\d", "");
                    }

                    if (sameTimeFlag) {
                        date.setTime(date.getTime() + timeChange);
                    }

                    operableDate = sameTimeFlag ? date : new Date(Date.now() + timeChange);

                    replacedOutput = replacedOutput.replace(
                        new RegExp(macroRegexString),
                        macroFunc(operableDate),
                    );
                }

                sameTimeFlag = !!sameTimeFlag;

                // operate on text (it is the one inside brackets of %d)
                for (const macroItem of DATE_MACROS) {
                    macro = macroItem;
                    [macroRegexString, [macroFunc, dateArithmeticChange]] = macro;
                    macroRegex = new RegExp(macroRegexString, "g");

                    userInputMacroText.replace(macroRegex, dateReplacer);
                }

                return replacedOutput;
            },
        );

        // browser URL macros
        snipBody = snipBody.replace(/\[\[%u\((.*?)\)\]\]/g, (wholeMatch, query) => {
            let output = "",
                pathLength = query.match(/(q?)\d+/),
                searchParamLength = query.match(/q(\d+)/);

            pathLength = !pathLength ? MAX_LENGTH : pathLength[1] ? 0 : +pathLength[0];
            searchParamLength = !searchParamLength
                ? 0
                : !searchParamLength[1]
                    ? MAX_LENGTH
                    : +searchParamLength[1];

            if (/p/i.test(query)) {
                output += `${window.location.protocol}//`;
            }
            if (/w/i.test(query)) {
                output += "www.";
            }

            output += window.location.host;

            output += getListTillN(window.location.pathname, "/", pathLength, "/");

            output += getListTillN(window.location.search, "&", searchParamLength, "?");

            if (/h/i.test(query)) {
                output += window.location.hash;
            }

            return output;
        });

        snipBody = snipBody.replace(/\[\[%u\{(\w|\d+|q\d+)\}\]\]/g, (wholeMatch, query) => {
            let hash;

            if (Number.isInteger(+query)) {
                return getExactlyNthItem(window.location.pathname, "/", +query, "/");
            }
            if (query === "p") {
                return window.location.protocol.replace(/:$/, "");
            }
            if (query === "w") {
                return "www";
            }
            if (query === "h") {
                ({ hash } = window.location);
                return (hash && hash.substring(1)) || "";
            }
            if (query[0] === "q") {
                return getExactlyNthItem(window.location.search, "&", +query.substring(1), "?");
            }

            return "";
        });

        if (Snip.PASTE_MACRO_REGEX.test(snipBody)) {
            chrome.runtime.sendMessage(
                "givePasteData",
                chromeAPICallWrapper((pasteData) => {
                    callback(snipBody.replace(Snip.PASTE_MACRO_REGEX, pasteData));
                }),
            );
        } else {
            callback(snipBody);
        }
    };
}
Snip.prototype = new Generic();
Snip.MAX_COLLAPSED_CHARACTERS_DISPLAYED = 200; // issues#67
Snip.DOMContractedClass = "contracted"; // to show with ellipsis
Snip.PASTE_MACRO_REGEX = /\[\[%p\]\]/gi;
Snip.CARET_POSITION_CLASS = "caretPlacement";
Snip.CARET_POSITION_EMPTY_REGEX = /\[\[%c(\(\))?\]\]/;
Snip.CARET_POSITION_STUFFED_REGEX = /\[\[%c\([v^<>\d]+\)\]\]/;
Snip.CARET_POSITION_SELECTION_START_REGEX = /\[\[%c\(s\)\]\]/;
Snip.CARET_POSITION_SELECTION_END_REGEX = /\[\[%c\(e\)\]\]/;
Snip.CARET_POSITION_SELECTION_END_STRING = "[[%c(e)]]";

Snip.fromObject = function (snip) {
    const nSnip = new Snip(snip.name, snip.body);

    // remove "Created on " part from timestamp
    nSnip.timestamp = !snip.timestamp
        ? Date.now() // can be undefined
        : typeof snip.timestamp === "number"
            ? snip.timestamp
            : Date.parse(snip.timestamp.substring(11));

    return nSnip;
};
Snip.isValidName = function (name) {
    const vld = Generic.isValidName(name, Generic.SNIP_TYPE);

    return /^%.+%$/.test(name) ? "Name cannot be of the form '%abc%'" : vld;
};
Snip.isValidBody = function (body) {
    return body.length ? "true" : "Empty body field";
};
Snip.getTimestampString = function (snip) {
    return `Created on ${getFormattedDate(snip.timestamp)}`;
};
/*
1. removes and replaces the spammy p nodes with \n
2. leaves pre, blockquote, u, etc. as it is (since they're useful in markdown)
3. replaces br element with \n
*/
Snip.makeHTMLSuitableForTextareaThroughString = function (html) {
    // Create a temporary div to hold the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return Snip.makeHTMLSuitableForTextarea(tempDiv);
};

Snip.makeHTMLSuitableForTextarea = function (htmlNode) {
    console.log("[DEBUG] makeHTMLSuitableForTextarea input:", htmlNode.innerHTML);
    const DELETE_NEWLINE_SYMBOL = "<!!>";

    // Try to parse JSON content first
    try {
        const content = htmlNode.textContent.trim();
        const jsonContent = JSON.parse(content);
        if (jsonContent && jsonContent.type === 'quill-table-content') {
            // For plain text editors, just return the text content
            if (jsonContent.delta && jsonContent.delta.ops) {
                const textContent = jsonContent.delta.ops
                    .map(op => op.insert || '')
                    .join('')
                    .trim();
                console.log("[DEBUG] Extracted plain text from delta:", textContent);
                return textContent;
            } else if (jsonContent.html) {
                // Create a temporary div to extract text from HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = jsonContent.html;
                const textContent = tempDiv.textContent.trim();
                console.log("[DEBUG] Extracted plain text from HTML:", textContent);
                return textContent;
            }
        }
    } catch (e) {
        // Not JSON content, continue with normal HTML processing
        console.log("[DEBUG] Not JSON content, processing as HTML");
    }

    function getProperTagPair(elm) {
        const tag = elm.tagName.toLowerCase(),
            returnArray = [`<${tag}>`, `</${tag}>`];

        if (tag === "a") {
            returnArray[0] = `<a href='${elm.href}'>`;
        }

        // span is used for font family, sizes, color
        return tag !== "span" ? returnArray : ["", ""];
    }

    // sanitizes elements (starting from top-level and then recursize)
    function elementSanitize(node) {
        if (isTextNode(node)) {
            // if textnode already contains ONE NEWLINE,
            // then remove it as caller is going to add one
            return node.textContent;
        }

        let { tagName } = node,
            resultString = "",
            elm,
            tags,
            children = node.childNodes, // returns [] for no nodes
            i = 0,
            childrenCount = children.length,
            content,
            firstChild,
            firstChildText;

        if (tagName === "PRE") {
            // can't use outerHTML since it includes atributes
            // (like spellcheck=false)
            tags = getProperTagPair(node);
            return tags[0] + node.innerHTML + tags[1];
        }

        if (tagName === "P" && childrenCount === 1) {
            firstChild = children[0];
            firstChildText = firstChild.innerText || firstChild.textContent;

            if (firstChild.tagName === "BR") {
                return "";
            }
            // issues#55
            if (firstChildText.length === 0) {
                return "";
            }
        }

        for (; i < childrenCount; i++) {
            elm = children[i];

            if (elm.nodeType === 1) {
                tags = getProperTagPair(elm);

                content = tags[0] + elementSanitize(elm) + tags[1];

                if (elm.tagName === "LI") {
                    resultString += `    ${content}\n`;
                } else {
                    resultString += content;
                }
            } else {
                resultString += elm.textContent;
            }
        }

        switch (tagName) {
        case "BLOCKQUOTE":
            return `<blockquote>${resultString}</blockquote>`;
        case "OL":
            return `<ol>\n${resultString}</ol>`;
        case "UL":
            return `<ul>\n${resultString}</ul>`;
        case "TABLE":
            return `<table>${resultString}</table>`;
        case "TR":
            return `<tr>${resultString}</tr>`;
        default:
            return resultString;
        }
    }

    let children = htmlNode.childNodes,
        finalString = "",
        len = children.length,
        i = 0,
        elm,
        sanitizedText;

    while (i < len) {
        elm = children[i];
        sanitizedText = elementSanitize(elm);
        finalString += sanitizedText === DELETE_NEWLINE_SYMBOL ? "" : `${sanitizedText}\n`;
        i++;
    }

    finalString = finalString.replace(/&nbsp;/g, " ");
    // quilljs auto inserts a \n in the end; remove it
    finalString = finalString.substring(0, finalString.length - 1);
    console.log("[DEBUG] makeHTMLSuitableForTextarea output:", finalString);
    return finalString;
};
Snip.isSuitableForPastingInTextareaAsIs = function (html) {
    return !(
        Snip.hasFormattedLossyContentWoQuillCls(html)
        // imported snippet body might have no fonts but lots of paragraphs
        // which make it unsuitable for a textarea
        || /<p>|<br>/.test(html)
    );
};
Snip.hasFormattedLossyContentWoQuillCls = function (html) {
    const regElms = [
        /background-color: /,
        /color: /,
        /text-align: /,
        /font-size: /,
        /font-family: /,
    ];

    for (let i = 0, len = regElms.length; i < len; i++) {
        if (regElms[i].test(html)) {
            return true;
        }
    }

    return false;
};
Snip.getQuillClsForFormattedLossyContent = function (html) {
    const reqElms = [
        [/ql-font/, "font"],
        [/ql-align/, "alignment"],
        [/ql-size/, "size"],
        [/color: /, "color"],
        [/background-color: /, "background color"],
    ];

    for (let i = 0, len = reqElms.length; i < len; i++) {
        if (reqElms[i][0].test(html)) {
            return reqElms[i][1];
        }
    }

    return null;
};
Snip.stripAllTags = function (html, $refDiv) {
    if (!$refDiv) {
        $refDiv = q.new("DIV");
    }
    if (html) {
        $refDiv.innerHTML = html;
    }
    // otherwise that elm's html is already set (nested calls)

    const { tagName } = $refDiv;

    switch (tagName) {
    case "DIV": // when not a recursive call
    case "OL":
    case "UL":
        break;
        // for all other elements
    default:
        return $refDiv.innerText.replace(/\n/g, " ");
    }

    const children = $refDiv.childNodes,
        len = children.length;
    let result = "",
        i = 0;
    if (len === 0) {
        return $refDiv.innerText.replace(/\n/g, " ");
    }

    for (; i < len; i++) {
        result += `${Snip.stripAllTags("", children[i])}\n`;
    }

    return result;
};
Snip.defaultLinkSanitize = function (linkVal) {
    // remove the default extension protocol just in case it was
    // prepended by Chrome
    linkVal = linkVal.replace(/^chrome-extension:\/\/[a-z]+\/html\//, "");

    if (/^\w+:/.test(linkVal)) {
        // do nothing, since this implies user's already using a custom protocol
    } else if (!/^https?:/.test(linkVal)) {
        linkVal = `http:${linkVal}`;
    }

    return linkVal;
};

Snip.formatOLULInListParentForTextarea = genericFormatterCreator("    ", "\n");

/*
1. removes and replaces the spammy p nodes with \n
2. leaves pre, blockquote, u, etc. as it is (since they're useful in markdown)
3. replaces br element with \n
*/
Snip.sanitizeTextareaTextForSave = function (text) {
    const htmlNode = q.new("div");
    htmlNode.innerHTML = text;
    // textarea text does not have ANY &nbsp; but adding innerHTML
    // inserts &nbsp; for some unknown reason
    // refer problem4 issue#153
    htmlNode.innerHTML = htmlNode.innerHTML.replace(/&nbsp;/g, " ");

    const aHREFs = htmlNode.querySelectorAll("a");
    aHREFs.forEach((a) => {
        a.href = Snip.defaultLinkSanitize(a.href);
    });

    const listParents = htmlNode.querySelectorAll("ol, ul");
    listParents.forEach(Snip.formatOLULInListParentForTextarea);

    return htmlNode.innerHTML;
};
Snip.validate = function (arr, parentFolder, index) {
    let correctProps = ["name", "body", "timestamp"],
        expectedPropsLength = correctProps.length,
        checks = {
            body: Snip.isValidBody,
            name: Snip.isValidName,
        },
        snippetUnderFolderString = `${index}th snippet under folder ${parentFolder}`,
        propVal,
        snippetVld;

    if (Array.isArray(arr)) {
        snippetVld = Folder.validate(arr);
        if (snippetVld !== "true") {
            return snippetVld;
        }
    } else if (!isObject(arr)) {
        return `${snippetUnderFolderString} is not an object.`;
    } else {
        let propCounter = 0;

        // check whether this item has all required properties
        for (const prop of Object.keys(arr)) {
            // if invalid property or not of string type
            if (correctProps.indexOf(prop) === -1) {
                delete arr[prop];
                continue;
            } else {
                propCounter++;
            }

            propVal = arr[prop];
            const checkFunc = checks[prop];

            if (!checkFunc) {
                continue;
            }
            snippetVld = checkFunc(propVal);
            if (
                snippetVld !== "true"
                && Generic.getDuplicateObjectsText(propVal, Generic.SNIP_TYPE) !== snippetVld
            ) {
                return `Invalid value for property ${prop} in ${snippetUnderFolderString}; received error: ${snippetVld}`;
            }
        }

        if (propCounter !== expectedPropsLength) {
            return `${snippetUnderFolderString} is missing one of the properties: ${JSON.stringify(
                correctProps,
            )}`;
        }
    }

    return "true";
};
function Folder(orgName, list, orgTimestamp, isSearchResultFolder) {
    console.log('[DEBUG] Creating new Folder:', { orgName, list, orgTimestamp, isSearchResultFolder });
    console.log('[DEBUG] IN_OPTIONS_PAGE in Folder constructor:', window.IN_OPTIONS_PAGE);
    
    this.name = orgName;
    this.type = Generic.FOLDER_TYPE;
    this.timestamp = orgTimestamp || Date.now();
    this.list = (list || []).slice(0);
    this.isSearchResultFolder = !!isSearchResultFolder;

    // only options page mutates list
    if (window.IN_OPTIONS_PAGE) {
        console.log('[DEBUG] In options page, observing list');
        observeList(this.list);
    }

    function getObjectCount(type) {
        return function () {
            return this.list.reduce(
                (count, object) => (object.type === type ? count + 1 : count),
                0,
            );
        };
    }

    this.getSnippetCount = getObjectCount(Generic.SNIP_TYPE);

    this.getFolderCount = getObjectCount(Generic.FOLDER_TYPE);

    this.getLastFolderIndex = function () {
        let i = 0,
            len = this.list.length;

        while (i < len && Folder.isFolder(this.list[i])) {
            i++;
        }

        return i - 1;
    };

    function adder(isSnippet) {
        /**
         * body is actually .list in case of folder
         */
        return function (name, body, timestamp) {
            const newObj = isSnippet
                ? new Snip(name, body, timestamp)
                : new Folder(name, body, timestamp);

            Folder.insertObject(newObj, this);

            window.latestRevisionLabel = `created ${newObj.type} "${newObj.name}"`;
        };
    }

    this.addSnip = adder(true);

    function editer(type) {
        return function (oldName, newName, body) {
            const object = Data.snippets.getUniqueObject(oldName, type);

            object.edit(newName, body);
            window.latestRevisionLabel = `edited ${type} "${oldName}"`;
        };
    }

    this.editSnip = editer(Generic.SNIP_TYPE);

    this.addFolder = adder(false);

    this.editFolder = editer(Generic.FOLDER_TYPE);

    this.edit = function (newName) {
        this.name = newName;
    };

    this.getDOMElement = function (objectNamesToHighlight) {
        // get prepared divMain from Generic class
        // and add click handler to the divMain and then return it
        return Generic.prototype.getDOMElement
            .call(this, objectNamesToHighlight)
            .on("click", Generic.prototype.preventButtonClickOverride(this.listSnippets.bind(this)));
    };

    this.getDOMElementFull = function (objectNamesToHighlight) {
        let div = q.new("div"),
            listElm,
            htmlElm,
            emptyDiv,
            len = this.list.length;

        for (let i = 0; i < len; i++) {
            listElm = this.list[i];
            htmlElm = listElm.getDOMElement(objectNamesToHighlight);
            div.appendChild(htmlElm);
        }

        if (len === 0) {
            emptyDiv = q.new("div");
            emptyDiv
                .addClass("empty_folder")
                .html(this.isSearchResultFolder ? "No matches found" : "This folder is empty");
            div.appendChild(emptyDiv);
        }

        return div;
    };

    this.getUniqueObject = function (name, type) {
        const index = this.getUniqueObjectIndex(name, type);

        if (!index) {
            return null;
        }

        let folder = this;

        for (const idx of index) {
            folder = folder.list[idx];
        }

        return folder;
    };

    this.getUniqueObjectIndex = function (name, type) {
        return Folder.indices[type][name.toLowerCase()];
    };

    function getUniqueObjectFn(type) {
        return function (name) {
            return this.getUniqueObject(name, type);
        };
    }

    function getUniqueObjectIndexFn(type) {
        return function (name) {
            return this.getUniqueObjectIndex(name, type);
        };
    }

    this.getUniqueSnip = getUniqueObjectFn(Generic.SNIP_TYPE);

    // return value of index is a n-length array of indexes
    // where each int from 0 to n-2 index in array
    // is the index of folder (0=outermost; n-2=innermost)
    // and (n-1)th value is index of snippet in innnermost folder
    this.getUniqueSnipIndex = getUniqueObjectIndexFn(Generic.SNIP_TYPE);

    this.getUniqueFolder = getUniqueObjectFn(Generic.FOLDER_TYPE);

    this.getUniqueFolderIndex = getUniqueObjectIndexFn(Generic.FOLDER_TYPE);

    // called whens searching starts
    // removes all tags from text and stores as new prperty
    // tags present in snippets might interfere with search
    // we only should work with plaintext
    this.stripAllSnippetsTags = function ($refDiv) {
        $refDiv = $refDiv || q.new("DIV"); // reuse existing DOM
        this.hasStrippedSnippets = true;

        this.list.forEach((elm) => {
            if (Folder.isFolder(elm)) {
                elm.stripAllSnippetsTags($refDiv);
            } else {
                elm.strippedBody = Snip.stripAllTags(elm.body, $refDiv);
            }
        });
    };

    this.searchSnippets = function (text) {
        text = escapeRegExp(text);

        if (!this.hasStrippedSnippets) {
            this.stripAllSnippetsTags();
        }

        return new Folder(
            Folder.SEARCH_RESULTS_NAME + this.name,
            this.list
                .reduce((result, listElm) => {
                    if (Folder.isFolder(listElm)) {
                        result = result.concat(listElm.searchSnippets(text).list);
                    }

                    if (listElm.matchesLazy(text)) {
                        result.push(listElm);
                    }

                    return result;
                }, [])
                .sort((a, b) => (b.matchesUnique(text)
                    ? 1
                    : !a.matchesUnique(text)
                        ? b.matchesNameLazy(text)
                            ? 1
                            : !a.matchesNameLazy(text) && b.matchesWord(text)
                                ? 1
                                : -1
                        : -1)),
            undefined,
            true,
        );
    };

    this.sort = function (filterType, descendingFlag) {
        // sort folders&snippets separately so that
        // folders are always above snippets
        const isAlphabeticSort = filterType === "alphabetic",
            firstSnippetIndex = this.getLastFolderIndex() + 1,
            folders = this.list.slice(0, firstSnippetIndex),
            snippets = this.list.slice(firstSnippetIndex);

        function sort(arr) {
            arr.sort((a, b) => {
                const alphaResult = a.name.localeCompare(b.name);
                // default to alphabetical sort in case timestamps are same
                return isAlphabeticSort ? alphaResult : a.timestamp - b.timestamp || alphaResult;
            });

            return descendingFlag ? arr.reverse() : arr;
        }

        this.list = sort(folders).concat(sort(snippets));
    };

    this.listSnippets = function (objectNamesToHighlight) {
        // can also be a MouseEvent (generated on click)
        objectNamesToHighlight = isObject(objectNamesToHighlight)
            ? undefined
            : objectNamesToHighlight;
        $containerSnippets
            .html("") // first remove previous content
            .appendChild(this.getDOMElementFull(objectNamesToHighlight));
        this.insertFolderPathDOM();
    };

    function insertPathPartDivs(name) {
        const pathPart = q.new("div").addClass("path_part"),
            rightArrow = q.new("div").addClass("right_arrow");
        pathPart.dataset.name = name;
        $containerFolderPath.appendChild(pathPart.html(gTranlateImmune(name)));
        $containerFolderPath.appendChild(rightArrow);
    }

    this.insertFolderPathDOM = function () {
        $containerFolderPath.html(""); // clear previous data

        if (this.isSearchResultFolder) {
            insertPathPartDivs(this.name);
            return;
        }

        insertPathPartDivs(Folder.MAIN_SNIPPETS_NAME);

        let index = Data.snippets.getUniqueFolderIndex(this.name),
            folder = Data.snippets;

        for (const idx of index) {
            folder = folder.list[idx];
            insertPathPartDivs(folder.name);
        }

        Folder.implementChevronInFolderPath();
    };

    // returns array representation of this Folder object
    this.toArray = function () {
        return [this.name, this.timestamp].concat(this.list.map(listElm => listElm.toArray()));
    };

    function stripHTMLTags(text) {
        /**
         * the docs say that "You must escape the five predefined entities to display them as text"
         * however my code doesn't work (gives "xml no name" error) on doing it, and actually works without doing it
         */

        const div = q.new("div");
        /* replacementMap = [["&", "&amp;"], ["<", "&lt;"], [">", "&gt;"], ["'", "&apos;"], ["\"", "&quot;"]] */

        div.innerHTML = text;
        const output = div.innerText.replace(/\n/g, " ");

        /* replacementMap.forEach(function (element) {
            output = output.replace(element[0], element[1]);
        }); */

        return output;
    }

    function highlightMatchText(keyword, textToMatch) {
        return textToMatch.replace(
            new RegExp(escapeRegExp(keyword), "ig"),
            $0 => `<match>${$0}</match>`,
        );
    }

    this.filterSnippetsForOmnibox = function (text, callback) {
        const snipArray = [],
            searchResults = this.searchSnippets(text);

        searchResults.forEachSnippet((snip) => {
            snip.formatMacros((snipBody) => {
                snipBody = stripHTMLTags(snipBody);
                const description = `<url>${highlightMatchText(text, snip.name)}</url> - `
                    + `<dim>${highlightMatchText(text, snipBody)}</dim>`;

                snipArray.push({
                    content: snipBody,
                    description,
                    deletable: true,
                });
            });
        });

        // since formatMacros is an async operation
        const checkFullyLoaded = setInterval(() => {
            if (snipArray.length === searchResults.getSnippetCount()) {
                clearInterval(checkFullyLoaded);
                callback(snipArray);
            }
        }, 100);
    };

    this.getFolderSelectList = function (nameToNotShow) {
        let mainContainer = q.new("div"),
            $folderName = q.new("p").html(gTranlateImmune(this.name)),
            childContainer,
            hasChildFolder = false;

        $folderName.dataset.name = this.name;

        mainContainer.appendChild($folderName);

        if (this.name !== Folder.MAIN_SNIPPETS_NAME) {
            mainContainer.addClass("collapsed");
        }

        this.forEachFolder((e) => {
            if (e.name !== nameToNotShow) {
                hasChildFolder = true;
                childContainer = e.getFolderSelectList(nameToNotShow);
                childContainer.style.marginLeft = "15px";
                mainContainer.appendChild(childContainer);
            }
        }, true);

        if (!hasChildFolder) {
            mainContainer.addClass("empty");
        }

        return mainContainer;
    };

    this.getDuplicatedObject = function () {
        return new Folder(this.name, this.list, this.timestamp);
    };

    this.getUniqueSnippetAtCaretPos = function (node, pos) {
        let val = getText(node),
            snip,
            stringToCheck = "",
            foundSnip = null,
            delimiterChar = val[pos - 1],
            lim = pos < OBJECT_NAME_LIMIT ? pos : OBJECT_NAME_LIMIT;

        for (let i = 1; i <= lim; i++) {
            // the previous delimiter char gets added to the
            // string to check as we move towards left
            stringToCheck = delimiterChar + stringToCheck;
            delimiterChar = val[pos - 1 - i];
            snip = this.getUniqueSnip(stringToCheck);

            const snipNameDelimiterListRegex = new RegExp(
                `[${escapeRegExp(Data.snipNameDelimiterList)}]`,
            );

            if (snip) {
                if (Data.matchDelimitedWord && snipNameDelimiterListRegex) {
                    // delimiter char may not exist if snip name
                    // is at the beginning of the textbox
                    if (
                        !delimiterChar
                        || snipNameDelimiterListRegex.test(delimiterChar)
                        || delimiterChar === "\n"
                    ) {
                        // a new line character is always a delimiter
                        foundSnip = snip;
                    }
                } else {
                    foundSnip = snip;
                }
            }

            if (foundSnip) {
                break;
            }
        }

        return foundSnip;
    };

    // parentID (optional) - if undefined, defaults to top-level
    this.createCtxMenuEntry = function (parentId) {
        let id,
            emptyFolderText = "Empty folder ";

        this.list.forEach((object) => {
            id = Generic.CTX_START[object.type] + object.name;

            chrome.contextMenus.create(
                {
                    contexts: ["editable"],
                    id, // unique id
                    title: object.name,
                    parentId,
                },
                chromeAPICallWrapper(),
            );

            listOfSnippetCtxIDs.push(id);

            if (Folder.isFolder(object)) {
                object.createCtxMenuEntry(id);
            }
        });

        if (this.list.length === 0) {
            id = emptyFolderText + this.name;

            chrome.contextMenus.create(
                {
                    contexts: ["editable"],
                    id, // unique id
                    title: emptyFolderText,
                    parentId,
                },
                chromeAPICallWrapper(),
            );
            listOfSnippetCtxIDs.push(id);
        }
    };

    function genericLooper(type) {
        /**
         * @param {Function} fn function to execute on matching list elm; doesn't retain `this` context
         * @param {boolean} shouldNotNest calls `fn` on snippets/folders inside `this.list` by default
         */
        const ret = function (fn, shouldNotNest) {
            this.list.forEach((listElm) => {
                if (!shouldNotNest && Folder.isFolder(listElm)) {
                    ret.call(listElm, fn, false);
                }

                if (listElm.type === type) {
                    fn(listElm);
                }
            });
        };

        return ret;
    }

    this.forEachSnippet = genericLooper(Generic.SNIP_TYPE);
    this.forEachFolder = genericLooper(Generic.FOLDER_TYPE);
}
Folder.prototype = new Generic();

/**
 * @param {Object[]} `arr` representation of the folder
 * @returns {Folder} based on `arr`
 */
Folder.fromArray = function (arr) {
    // during 2.8.0 version, first element of arr
    // was not the name of folder
    if (typeof arr[0] !== "string") {
        arr.unshift(Folder.MAIN_SNIPPETS_NAME);
    }

    // 2nd elm is timestamp
    if (typeof arr[1] !== "number") {
        arr.splice(1, 0, Date.now());
    }

    const folder = new Folder(arr.shift(), undefined, arr.shift());
    folder.list = arr.map(listElm => (Array.isArray(listElm) ? Folder.fromArray(listElm) : Snip.fromObject(listElm)));

    if (window.IN_OPTIONS_PAGE) {
        observeList(folder.list);
    }

    return folder;
};
Folder.isValidName = function (name) {
    return Generic.isValidName(name, Generic.FOLDER_TYPE);
};
Folder.isFolder = function (elm) {
    return elm && elm.type === Generic.FOLDER_TYPE;
};
Folder.makeFolderIfList = function (data) {
    if (data && Array.isArray(data.snippets)) {
        data.snippets = Folder.fromArray(data.snippets);
    }
};
Folder.makeListIfFolder = function (data) {
    if (Folder.isFolder(data.snippets)) {
        data.snippets = data.snippets.toArray();
    }
};
Folder.MAIN_SNIPPETS_NAME = "Snippets";
Folder.SEARCH_RESULTS_NAME = "Search Results in ";
Folder.CHEVRON_TEXT = "<<";
Folder.setIndices = function () {
    // indexArray is an array denoting nested levels inside folders
    function set(type, name, indexArray) {
        Folder.indices[type][name.toLowerCase()] = indexArray;
    }

    // mainIndexArray - denotes indexArray of parent folder
    // currIndexArray - denotes indexArray of current object
    function repeat(folder, mainIndexArray) {
        let indexCounter = 0,
            currIndexArray;

        set(folder.type, folder.name, mainIndexArray);

        folder.list.forEach((elm) => {
            // using concat to clone arrays and hence avoid mutation
            currIndexArray = mainIndexArray.concat(indexCounter);

            if (Folder.isFolder(elm)) {
                repeat(elm, currIndexArray);
            } else {
                set(elm.type, elm.name, currIndexArray);
            }

            indexCounter++;
        });
    }

    // reset
    Folder.indices = {};
    Folder.indices[Generic.FOLDER_TYPE] = {};
    Folder.indices[Generic.SNIP_TYPE] = {};
    if (Data.snippets !== false) {
        repeat(Data.snippets, []);
    }
};
Folder.copyContents = function (fromFolder, toFolder) {
    const { list } = fromFolder,
        len = list.length;

    // loop in reverse order, so that they are inserted in the correct order
    for (let i = len - 1; i >= 0; i--) {
        Folder.insertObject(list[i].getDuplicatedObject(), toFolder);
    }
};
Folder.insertObject = function (object, folder) {
    if (Folder.isFolder(object)) {
        folder.list.unshift(object);
    } else {
        folder.list.splice(folder.getLastFolderIndex() + 1, 0, object);
    }
};
Folder.insertBulkActionDOM = function (listedFolder) {
    const $container = q.new("div");

    listedFolder.list.forEach((listElm) => {
        const $generic = q.new("div").addClass("generic"),
            $checkbox = q.new("input"),
            $img = q.new("img"),
            $div = q
                .new("div")
                .addClass("name")
                .html(gTranlateImmune(listElm.name));
        $div.dataset.name = listElm.name;
        $checkbox.type = "checkbox";
        $img.src = `../imgs/${listElm.type}.svg`;

        $generic.appendChild($checkbox);
        $generic.appendChild($img);
        $generic.appendChild($div);
        $container.appendChild($generic);
    });

    $containerSnippets
        .html("") // first remove previous content
        .appendChild($container);

    return $container;
};
Folder.getSelectedFolderInSelectList = function (selectList) {
    const selectFolderName = selectList.qClsSingle("selected").dataset.name;

    return Data.snippets.getUniqueFolder(selectFolderName);
};
Folder.refreshSelectList = function (selectList) {
    selectList.html("").appendChild(Data.snippets.getFolderSelectList());

    // select top-most "Snippets" folder; do not use fistChild as it may
    // count text nodes
    selectList.children[0].children[0].addClass("selected");
};
// do not remove newly inserted chevron as it will again exceed
// width causing recursion
Folder.implementChevronInFolderPath = function (notRemoveChevron) {
    const ACTUAL_ARROW_WIDTH = 15;

    function computeTotalWidth() {
        let arrowCount = 0,
            totalWidth = [].slice.call($containerFolderPath.children, 0).reduce((sum, elm) => {
                const isArrow = elm.hasClass("right_arrow");
                return isArrow ? (arrowCount++, sum) : sum + elm.offsetWidth;
            }, 0);

        // arrows, being titled, actually take up less space (half their width)
        totalWidth += arrowCount * ACTUAL_ARROW_WIDTH;

        return totalWidth;
    }

    const width = $containerFolderPath.offsetWidth,
        totalWidth = computeTotalWidth(),
        lastPathPart = $containerFolderPath.lastChild.previousElementSibling,
        folderObj = Folder.getListedFolder();

    if (totalWidth > width) {
        const pathPart = $containerFolderPath.querySelector(".path_part:not(.chevron)");

        if (pathPart === lastPathPart) {
            pathPart.style.width = `${
                $containerFolderPath.offsetWidth - ACTUAL_ARROW_WIDTH - 50 // for the chevron
            }px`;
            pathPart.addClass("ellipsized");
        } else {
            const doesChevronExist = !!$containerFolderPath.querySelector(".chevron");

            // remove the right arrow
            $containerFolderPath.removeChild(pathPart.nextElementSibling);

            // only one chevron allowed
            if (doesChevronExist) {
                $containerFolderPath.removeChild(pathPart);
            } else {
                pathPart.addClass("chevron").html(Folder.CHEVRON_TEXT);
            }

            // recheck if width fits correctly now
            Folder.implementChevronInFolderPath(true);
        }
    } else if (!notRemoveChevron && $containerFolderPath.querySelector(".chevron")) {
        // clear previous chevrons
        folderObj.insertFolderPathDOM();
    }
};
Folder.getListedFolderName = function () {
    return $containerFolderPath.querySelector(":nth-last-child(2)").dataset.name;
};
Folder.getListedFolder = function () {
    let name = Folder.getListedFolderName(),
        idx = name.indexOf(Folder.SEARCH_RESULTS_NAME);

    if (idx !== -1) {
        name = name.substring(Folder.SEARCH_RESULTS_NAME.length);
    }

    return Data.snippets.getUniqueFolder(name);
};
Folder.validate = function (arr) {
    if (typeof arr[0] !== "string") {
        // possibly before 300 version
        arr.unshift(Date.now());
        arr.unshift(Folder.MAIN_SNIPPETS_NAME);
    }

    /* Note: Generic.getDuplicateObjectsText is being used below
        to suppress duplicate snippets warnings. They will NOT be checked.
        If a user creates duplicate folders, it's his own fault. */
    const folderName = arr[0],
        folderTimestamp = arr[1],
        snippets = arr.slice(2),
        folderMsg = `Folder ${folderName}`;
    let snippetVld;

    if (typeof folderName !== "string") {
        return `Name of ${folderMsg} is not a string.`;
    }

    const folderVld = Folder.isValidName(folderName);

    if (
        folderVld !== "true"
        && Generic.getDuplicateObjectsText(folderName, Generic.FOLDER_TYPE) !== folderVld
    ) {
        return `Name of ${folderMsg} is invalid because: ${folderVld}`;
    }

    if (typeof folderTimestamp !== "number") {
        return `Timestamp for ${folderMsg} is not a number`;
    }

    for (let i = 0, len = snippets.length, elm; i < len; i++) {
        elm = snippets[i];

        snippetVld = Snip.validate(elm, folderName, i);

        if (snippetVld !== "true") {
            return snippetVld;
        }
    }

    return "true";
};
Folder.getDefaultSnippetData = function () {
    const name1 = "README-New_UI_Details",
        // using + operator avoids the inadvertently introduced tab characters
        body1 = "Dear user, here are some things you need to know in this new UI:\n\n"
            + "1. You need to click on the name or body of the listed snippet to expand it completely. In the following image, "
            + "the purple area shows where you can click to expand the snippet.\n\n<img src='../imgs/help1.png'>\n\n"
            + "2. Click on the pencil icon to edit and the dustbin icon to delete a snippet/folder.\n"
            + "3. Click on the folder, anywhere in the purple area denoted below, to view its contents.\n\n<img src='../imgs/help2.png'>\n\n"
            + "4. Click on a folder name in the navbar to view its contents. In the example below, the navbar consists of 'Snippets', 'sampleFolder' and 'folder2', "
            + " each nested within the previous.\n\n"
            + "<img src='../imgs/help3.png'>",
        name2 = "clipboard_macro",
        body2 = "Use this snippet anywhere and the following - [[%p]] - will be replaced by "
            + " your clipboard data. Clipboard data includes text that you have previously copied or cut with intention to paste.",
        ts = Date.now(),
        snips = [
            Folder.MAIN_SNIPPETS_NAME,
            ts,
            ["sampleFolder", ts],
            {
                name: "sampleSnippet",
                body:
                    "Hello new user! Thank you for using ProKeys!\n\nThis is a sample snippet. Try using it on any webpage by typing 'sampleSnippet' (snippet name; without quotes), and press the hotkey (default: Shift+Space), and this whole text would come in place of it.",
                timestamp: ts,
            },
            {
                name: "letter",
                body:
                    "(Sample snippet to demonstrate the power of ProKeys snippets; for more detail on Placeholders, see the Help section)\n\nHello %name%,\n\nYour complaint number %complaint% has been noted. We will work at our best pace to get this issue solved for you. If you experience any more problems, please feel free to contact at me@organization.com.\n\nRegards,\n%my_name%,\nDate: [[%d(D-MM-YYYY)]]",
                timestamp: ts,
            },
            {
                name: "brb",
                body: "be right back",
                timestamp: ts,
            },
            {
                name: "my_sign",
                body:
                    "<b>Aquila Softworks &#169;</b>\n<i>Creator Of ProKeys</i>\n<u>prokeys.feedback@gmail.com</u>",
                timestamp: ts,
            },
            {
                name: "dateArithmetic",
                body:
                    "Use this snippet in any webpage, and you'll see that the following: [[%d(Do MMMM YYYY hh:m:s)]] is replaced by the current date and time.\n\nMoreover, you can perform date/time arithmetic. The following: [[%d(D+5 MMMM+5 YYYY+5 hh-5:m-5:s-5)]] gives the date, month, year, forward by five; and hour, minutes, and seconds backward by 5.\n\nMore info on this in the Help section.",
                timestamp: ts,
            },
            {
                name: "urlMacro",
                body:
                    "Use the URL macro (details in the Help page) to retrieve information about the current webpage URL. For example, when executed on any webpage, the code - [[%u(0)]] - outputs the full website name on which it is executed.",
                timestamp: ts,
            },
            {
                name: name1,
                body: body1,
                timestamp: ts,
            },
            {
                name: name2,
                body: body2,
                timestamp: ts,
            },
        ];

    return snips;
};
// inserts a combo rich (quill) and plain (textarea) textbox (default)
// inside of the $container argument with options to swap b/w the two,
// get rich/plain contents, etc.
/* "transferContents" - in case user switches from rich to plain view, he'll
lose all his formatting, so show alert box for a warning and then accordingly transfer contents
to the new shown box */
function DualTextbox($container, isTryItEditor) {
    // contants/flags
    const RICH_EDITOR_CONTAINER_CLASS = "rich_editor_container",
        RICH_EDITOR_CLASS = isTryItEditor ? "normal-editor" : "ql-editor",
        transferContentsToShownEditor = !isTryItEditor,
        // create navbar
        $nav = q.new("DIV").addClass("nav"),
        $span = q.new("SPAN").text("Swap editor mode: "),
        $pTextarea = q
            .new("P")
            .text("Textarea")
            .addClass(SHOW_CLASS),
        $pRich = q.new("P").text("Styled textbox");

    // Instance properties
    this.isCurrModePlain = true; // default is textarea
    this.isQuillInitialized = false;
    this.quillInitPromise = null;
    this.$textarea = null;
    this.$richEditor = null;
    this.quill = null;

    $pTextarea.dataset.containerSelector = "textarea";
    $pRich.dataset.containerSelector = `.${RICH_EDITOR_CONTAINER_CLASS}`;
    $pTextarea.dataset.editorSelector = "textarea";
    $pRich.dataset.editorSelector = `.${RICH_EDITOR_CLASS}`;

    $nav.appendChild($span);
    $nav.appendChild($pTextarea);
    $nav.appendChild($pRich);
    $container.appendChild($nav);
    $container.addClass("dualBoxContainer"); // for css styling

    // create rich/plain boxes
    // (textarea doesn't need a container; so assume itself to be the container)
    this.$textarea = q.new("TEXTAREA").addClass([SHOW_CLASS, $pTextarea.dataset.containerSelector]);
    const $richEditorContainer = q.new("DIV").addClass(RICH_EDITOR_CONTAINER_CLASS);
    this.$richEditor = q.new("DIV");

    // Restore the DOM manipulation code
    $container.appendChild(this.$textarea);
    $richEditorContainer.appendChild(this.$richEditor);
    $container.appendChild($richEditorContainer);

    // Initialize Quill asynchronously but store the promise
    if (!isTryItEditor) {
        this.quillInitPromise = initializeQuill(this.$richEditor, $richEditorContainer).then(quillInstance => {
            if (quillInstance) {
                this.quill = quillInstance;
                this.$richEditor = $container.querySelector($pRich.dataset.editorSelector);
                this.isQuillInitialized = true;
                return quillInstance;
            } else {
                console.error("[DEBUG] Failed to initialize Quill editor");
                return null;
            }
        });
    } else {
        this.$richEditor.addClass(RICH_EDITOR_CLASS).attr("contenteditable", "true");
        this.quillInitPromise = Promise.resolve(null);
        this.isQuillInitialized = true;
    }

    // Wait for Quill to be initialized before allowing mode switch
    const switchEditorMode = async (targetMode) => {
        try {
            if (!this.isQuillInitialized) {
                await this.quillInitPromise;
            }

            let currShown = $container.querySelectorAll(`.${SHOW_CLASS}`),
                currShownEditor = currShown[1],
                $newlyShownContainer,
                $newlyShownEditor;

            // Store current content before switching
            const currentContent = this.isCurrModePlain ? this.getPlainText() : this.getRichText();
            let contentObj = null;
            
            try {
                contentObj = JSON.parse(currentContent);
            } catch (e) {
                // Not JSON content
            }

            // Remove show class from current elements
            if (currShown && currShown.length > 0) {
                currShown.forEach((elm) => elm.removeClass(SHOW_CLASS));
                if (currShownEditor) {
                    currShownEditor.removeAttribute("tab-index");
                }
            }

            // Add show class to new elements
            if (targetMode) {
                targetMode.addClass(SHOW_CLASS);
                $newlyShownContainer = $container.querySelector(targetMode.dataset.containerSelector);
                $newlyShownEditor = $container.querySelector(targetMode.dataset.editorSelector);
                
                if ($newlyShownContainer && $newlyShownEditor) {
                    $newlyShownContainer.addClass(SHOW_CLASS);
                    $newlyShownEditor.attr("tab-index", 20);
                    $newlyShownEditor.focus();
                }
            }

            const wasPlain = this.isCurrModePlain;
            this.isCurrModePlain = !wasPlain;

            // Handle content transfer based on content type
            if (currentContent && currentContent.trim()) {  
                if (contentObj && contentObj.type === 'quill-table-content') {
                    // For table content, use the appropriate format
                    if (this.isCurrModePlain) {
                        this.setPlainText(currentContent); 
                    } else {
                        this.loadContent(currentContent); 
                    }
                } else if (transferContentsToShownEditor) {
                    // For regular content
                    if (this.isCurrModePlain) {
                        if (wasPlain) {
                            this.setPlainText(currentContent);
                        } else {
                            this.setPlainText(Snip.makeHTMLSuitableForTextareaThroughString(currentContent));
                        }
                    } else {
                        this.loadContent(currentContent);
                    }
                }
            } else {
                // For empty content, just clear the editor
                if (this.isCurrModePlain) {
                    this.setPlainText("");
                } else {
                    this.loadContent("");
                }
            }
        } catch (err) {
            console.error("Error in editor swap:", err);
            return false;
        }
    };

    // implement swapping of textbox and richEditor
    $nav.on("click", async (e) => {
        const node = (e.detail && e.detail.target) || e.target; // event delegation

        if (
            !(node.tagName === "P") || // only handle clicks on P elements
            node.hasClass(SHOW_CLASS)   // don't switch if already showing
        ) {
            return false;
        }

        // Check if there's content in the current editor
        const currentContent = this.isCurrModePlain ? this.getPlainText() : this.getRichText();
        console.log("[DEBUG] Current content before trim:", currentContent);
        
        // For rich text editor, check if it's just Quill's empty structure
        if (!this.isCurrModePlain && (
            currentContent === "" || 
            currentContent === "<p><br></p>" ||
            currentContent === "<p><br></p><p><br></p>"
        )) {
            // Editor is empty, allow switch
            return switchEditorMode(node);
        }
        
        // For plain text or non-empty rich text
        if (currentContent && currentContent.trim()) {
            // If there's content, don't allow switching
            console.log("[DEBUG] Editor switch prevented - content present");
            return false;
        }

        return switchEditorMode(node);
    });

    // if user did NOT set alignment, font color, size, family, returns true
    // else gives a confirm box
    this.userAllowsToLoseFormattingOnSwapToTextarea = function () {
        const detected = Snip.getQuillClsForFormattedLossyContent(this.$richEditor.innerHTML);

        if (
            detected
            && !window.confirm(
                `We detected formatted text ${detected} in your expansion. You will lose it after this swap. Are you sure you wish to continue?`,
            )
        ) {
            return false;
        }
        return true;
    };

    this.switchToDefaultView = async function (textToSet) {
        await this.quillInitPromise; // Wait for Quill to be ready
        const targetMode = Snip.isSuitableForPastingInTextareaAsIs(textToSet) ? $pTextarea : $pRich;
        await switchEditorMode(targetMode);
        return this;
    };

    this.setPlainText = function (text) {
        console.log("[DEBUG] Setting plain text:", text);
        
        if (!text) {
            this.$textarea.value = '';
            return this;
        }

        try {
            // Try to parse as JSON first
            const content = typeof text === 'string' ? JSON.parse(text) : text;
            if (content && content.type === 'quill-table-content') {
                // For tables, show a simplified text representation
                const tableText = content.html
                    .replace(/\<table[^\>]*\>/g, '\n[Table Start]\n')
                    .replace(/\<\/table\>/g, '\n[Table End]\n')
                    .replace(/\<tr[^\>]*\>/g, '')
                    .replace(/\<\/tr\>/g, '\n')
                    .replace(/\<td[^\>]*\>/g, '| ')
                    .replace(/\<\/td\>/g, ' ')
                    .replace(/\<p[^\>]*\>/g, '')
                    .replace(/\<\/p\>/g, '')
                    .replace(/\<br\/?\>/g, '\n')
                    .replace(/\<[^\>]+\>/g, '')
                    .replace(/\n{3,}/g, '\n\n')
                    .trim();
                console.log("[DEBUG] Converted table to plain text:", tableText);
                this.$textarea.value = tableText;
                return this;
            } else if (content && content.html) {
                // Handle regular HTML content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content.html;
                this.$textarea.value = tempDiv.textContent.trim();
                return this;
            }
        } catch (e) {
            // Not JSON or invalid format
            console.log("[DEBUG] Using content as plain text");
        }
        
        // Handle plain text
        this.$textarea.value = typeof text === 'string' ? text : String(text);
        return this;
    };

    this.getShownTextForSaving = async function () {
        console.log("[DEBUG] getShownTextForSaving called");

        await this.quillInitPromise; // Wait for Quill to be ready

        if (this.isCurrModePlain) {
            return Snip.sanitizeTextareaTextForSave(this.$textarea.value);
        }

        if (!this.quill) {
            console.error("[DEBUG] Quill not initialized");
            return "";
        }

        // Get both HTML and delta formats
        const html = this.quill.root.innerHTML;
        const delta = this.quill.getContents();
        
        // Store in structured format
        return JSON.stringify({
            type: 'quill-table-content',
            html: html,
            delta: delta
        });
    };
}
DualTextbox.prototype.getPlainText = function () {
    return this.$textarea.value;
};

DualTextbox.prototype.getRichText = function () {
    // If using Quill editor, check if it's truly empty
    if (this.quill) {
        // Quill adds a newline character by default, so length 1 means empty
        if (this.quill.getLength() <= 1) {
            return "";
        }
    }
    return this.$richEditor.innerHTML;
};

DualTextbox.prototype.setRichText = async function(content) {
    console.log("[DEBUG] Setting rich text:", content);
    
    // Wait for Quill initialization if needed
    if (!this.isQuillInitialized && this.quillInitPromise) {
        console.log("[DEBUG] Waiting for Quill initialization");
        await this.quillInitPromise;
    }

    if (!this.quill) {
        console.error("[DEBUG] Quill not available");
        return;
    }

    try {
        // Switch to rich text mode if needed
        if (this.isCurrModePlain && content && typeof content === 'object' && content.type === 'quill-table-content') {
            console.log("[DEBUG] Auto-switching to rich text mode for table content");
            const richTextButton = document.querySelector('.nav p:not(.show)');
            if (richTextButton) {
                richTextButton.click();
                // Give time for mode switch to complete
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        // Load the content
        this.loadContent(content);
    } catch (err) {
        console.error("[DEBUG] Error in setRichText:", err);
        // Set empty content on error
        this.quill.setText('');
    }
    return this;
};
DualTextbox.prototype.loadContent = function(content) {
    console.log("[DEBUG] Loading content:", content);
    try {
        if (!this.quill) {
            console.error("[DEBUG] Quill not initialized");
            return;
        }

        let delta;
        let contentToLoad = content;
        
        // Parse string content if needed
        if (typeof content === 'string' && content.trim()) {
            try {
                contentToLoad = JSON.parse(content);
            } catch (e) {
                // Not JSON, use as is
                console.log("[DEBUG] Content is not JSON structured");
            }
        }
        
        // Helper function to check if content contains a table
        const hasTableContent = (html) => {
            return html && (
                html.includes('<table') || 
                html.includes('</table>') || 
                html.includes('<td') || 
                html.includes('</td>') || 
                html.includes('<th') || 
                html.includes('</th>')
            );
        };

        // Handle structured content format
        if (contentToLoad && typeof contentToLoad === 'object') {
            if (contentToLoad.type === 'quill-table-content' && contentToLoad.html) {
                // Only process as table content if it actually contains table elements
                if (hasTableContent(contentToLoad.html)) {
                    console.log("[DEBUG] Loading structured table content with HTML:", contentToLoad.html);
                    if (contentToLoad.delta && contentToLoad.delta.ops) {
                        // Use the delta directly if available
                        console.log("[DEBUG] Using stored delta");
                        const Delta = this.quill.constructor.import('delta');
                        delta = new Delta(contentToLoad.delta.ops);
                    } else {
                        // Fallback to converting HTML
                        console.log("[DEBUG] Converting HTML to delta");
                        delta = this.quill.clipboard.convert(contentToLoad.html);
                    }
                } else {
                    // Content marked as table but has no table - treat as regular HTML
                    console.log("[DEBUG] Content marked as table but no table found - treating as regular content");
                    delta = this.quill.clipboard.convert(contentToLoad.html);
                }
            } else if (contentToLoad.ops) {
                // Direct delta object
                console.log("[DEBUG] Using provided delta");
                const Delta = this.quill.constructor.import('delta');
                delta = new Delta(contentToLoad.ops);
            }
        } else if (typeof contentToLoad === 'string') {
            // Plain HTML or text content
            console.log("[DEBUG] Converting HTML/text content");
            delta = this.quill.clipboard.convert(contentToLoad);
        }

        if (!delta || !delta.ops || !delta.ops.length) {
            console.log("[DEBUG] No valid delta content, creating empty delta");
            const Delta = this.quill.constructor.import('delta');
            delta = new Delta().insert('\n');
        }

        console.log("[DEBUG] Final delta to apply:", delta);
        
        // Clear existing content first
        this.quill.setText('');
        
        // Apply new content
        this.quill.updateContents(delta, Quill.sources.USER);
        
        // Ensure proper focus and cursor position
        this.quill.focus();
        this.quill.setSelection(0, 0);
        
        console.log("[DEBUG] Content loaded successfully");
    } catch (err) {
        console.error("[DEBUG] Error loading content:", err);
        // Set empty content on error
        this.quill.setText('');
    }
};
Snip.getPreviewText = function (content) {
    try {
        const parsed = typeof content === 'string' ? JSON.parse(content) : content;
        if (parsed && parsed.type === 'quill-table-content') {
            // For preview, show a simplified table representation
            return parsed.html
                .replace(/<table[^>]*>/g, '\n[Table Start]\n')
                .replace(/<\/table>/g, '\n[Table End]\n')
                .replace(/<tr[^>]*>/g, '')
                .replace(/<\/tr>/g, '\n')
                .replace(/<td[^>]*>/g, '| ')
                .replace(/<\/td>/g, ' ')
                .replace(/<p[^>]*>/g, '')
                .replace(/<\/p>/g, '')
                .replace(/<br\/?>/g, '\n')
                .replace(/<[^>]+>/g, '')
                .replace(/\n{3,}/g, '\n\n')
                .trim();
        }
    } catch (e) {
        // Not JSON or wrong format
    }
    return content;
};

Snip.makeHTMLValidForExternalEmbed = function (html, isListingSnippets) {
    console.log('[DEBUG] makeHTMLValidForExternalEmbed input:', html);
    console.log('[DEBUG] Raw input length:', html.length);
    console.log('[DEBUG] Input newline count:', (html.match(/\n/g) || []).length);
    
    if (!html) {
        console.log("[DEBUG] makeHTMLValidForExternalEmbed: empty input");
        return "";
    }

    // Normalize newlines first
    let normalizedHtml = html.replace(/\r\n/g, '\n')  // Convert Windows newlines
                            .replace(/\r/g, '\n')      // Convert Mac newlines
                            .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
                            .trim();
    
    console.log('[DEBUG] After newline normalization:', normalizedHtml);
    console.log('[DEBUG] Normalized newline count:', (normalizedHtml.match(/\n/g) || []).length);

    const $container = q.new("div");
    
    // remove the caret position span element
    normalizedHtml = normalizedHtml.replace(
        new RegExp(`<span[^>]*${Snip.CARET_POSITION_CLASS}[^>]*>`, "g"),
        ""
    );
    console.log('[DEBUG] After caret removal:', normalizedHtml);

    // Convert newlines to paragraphs before setting innerHTML
    if (!normalizedHtml.includes('<p>')) {
        console.log('[DEBUG] Converting newlines to paragraphs');
        let paragraphs = normalizedHtml.split(/\n\s*\n/)
                                     .filter(para => para.trim());
        console.log('[DEBUG] Paragraph count after split:', paragraphs.length);
        normalizedHtml = '<p>' + paragraphs.join('</p><p>') + '</p>';
        
        // Convert single newlines to <br>
        normalizedHtml = normalizedHtml.replace(/\n/g, '<br>');
        console.log('[DEBUG] After paragraph conversion:', normalizedHtml);
    }

    $container.innerHTML = normalizedHtml;
    console.log('[DEBUG] Container HTML after initial set:', $container.innerHTML);
    console.log('[DEBUG] Paragraph elements count:', $container.querySelectorAll('p').length);
    console.log('[DEBUG] BR elements count:', $container.querySelectorAll('br').length);

    // First preserve table formatting
    const tables = $container.querySelectorAll("table");
    tables.forEach((table, index) => {
        console.log(`[DEBUG] Processing table ${index + 1}`);
        table.setAttribute("style", "border-collapse: collapse !important; width: 100% !important; border: 1px solid black !important; margin-bottom: 10px !important;");
        table.className = table.className.replace(/prokeys-table/g, '') + " prokeys-table";
        
        const cells = table.querySelectorAll('td, th');
        console.log(`[DEBUG] Table ${index + 1} cell count:`, cells.length);
    });

    // Clean up empty paragraphs and normalize spacing
    const paragraphs = $container.querySelectorAll("p");
    let removedCount = 0;
    paragraphs.forEach((pElm) => {
        // Normalize internal whitespace
        const originalContent = pElm.innerHTML;
        pElm.innerHTML = pElm.innerHTML.replace(/\s+/g, ' ').trim();
        
        // Remove empty paragraphs
        if (!pElm.innerHTML || pElm.innerHTML === '<br>' || pElm.innerHTML === '&nbsp;') {
            pElm.remove();
            removedCount++;
        }
    });
    console.log('[DEBUG] Removed empty paragraphs count:', removedCount);

    // Final cleanup
    let result = $container.innerHTML
        .replace(/>\s+</g, '><')  // Remove whitespace between tags
        .replace(/\s+/g, ' ')     // Normalize spaces
        .trim();

    console.log('[DEBUG] Final HTML length:', result.length);
    console.log('[DEBUG] Final paragraph count:', (result.match(/<p>/g) || []).length);
    console.log('[DEBUG] Final BR count:', (result.match(/<br>/g) || []).length);
    console.log('[DEBUG] Final processed HTML:', result);
    
    return result;
};
function initializeQuill($editor, $containerGiven) {
    console.log("[DEBUG] Starting Quill initialization");
    console.log("[DEBUG] Quill Version:", Quill.version);

    // Register table-better module first
    try {
        console.log("[DEBUG] Registering table-better module");
        Quill.register({
            'modules/table-better': QuillTableBetter
        }, true);
    } catch (err) {
        console.error("[DEBUG] Error registering table-better module:", err);
        return Promise.resolve(null);
    }

    // Create toolbar after module registration
    const toolbarContainer = document.createElement("div");
    toolbarContainer.id = `toolbar-${Math.random().toString(36).substr(2, 9)}`;
    toolbarContainer.className = "ql-toolbar ql-snow";
    $containerGiven.insertBefore(toolbarContainer, $editor);

    const toolbarOptions = [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block", "link"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["table-better", "image"],
        ["clean"]
    ];

    // Add toolbar buttons to container
    toolbarOptions.forEach(group => {
        const span = document.createElement('span');
        span.className = 'ql-formats';
        group.forEach(format => {
            if (typeof format === 'string') {
                const button = document.createElement('button');
                button.className = `ql-${format}`;
                button.setAttribute('type', 'button');
                span.appendChild(button);
            } else {
                const key = Object.keys(format)[0];
                const select = document.createElement('select');
                select.className = `ql-${key}`;
                if (Array.isArray(format[key])) {
                    format[key].forEach(value => {
                        const option = document.createElement('option');
                        if (value !== false) {
                            option.value = value;
                        }
                        select.appendChild(option);
                    });
                }
                span.appendChild(select);
            }
        });
        toolbarContainer.appendChild(span);
    });

    return new Promise((resolve) => {
        try {
            const options = {
                theme: 'snow',
                modules: {
                    table: false,  // Disable default table module
                    toolbar: {
                        container: toolbarContainer,
                        handlers: {
                            image: function() {
                                const input = document.createElement('input');
                                input.setAttribute('type', 'file');
                                input.setAttribute('accept', 'image/*');
                                input.click();

                                input.onchange = () => {
                                    const file = input.files[0];
                                    if (file) {
                                        // Max size 5MB
                                        if (file.size > 5 * 1024 * 1024) {
                                            alert('Image size must be less than 5MB');
                                            return;
                                        }

                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            const dataUrl = e.target.result;
                                            const range = this.quill.getSelection(true);
                                            this.quill.insertEmbed(range.index, 'image', dataUrl);
                                            this.quill.setSelection(range.index + 1);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                };
                            }
                        }
                    },
                    'table-better': {
                        operationMenu: {
                            items: {
                                unmergeCells: {
                                    text: 'Unmerge cells'
                                }
                            }
                        },
                        menus: ['column', 'row', 'merge', 'table', 'cell', 'wrap', 'delete'],
                        toolbarTable: true
                    },
                    keyboard: {
                        bindings: QuillTableBetter.keyboardBindings
                    }
                }
            };

            const quill = new Quill($editor, options);
            console.log("[DEBUG] Quill instance created successfully");
            resolve(quill);

        } catch (err) {
            console.error("[DEBUG] Error creating Quill instance:", err);
            resolve(null);
        }
    });
}

function observeList(list) {
    const watchProperties = ["push", "pop", "shift", "unshift", "splice"];

    for (const prop of watchProperties) {
        Object.defineProperty(list, prop, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: (function (property) {
                return function (...args) {
                    // do not use list[prop] because it is already overwritten
                    // and so will lead to infinite recursion
                    const ret = [][property].apply(list, args);
                    Folder.setIndices();
                    return ret;
                };
            }(prop)),
        });
    }
}

export {
    Folder, Snip, Generic, DualTextbox,
};
