/* Service worker classes */

// functions common to Snip and Folder
function Generic() {
    this.matchesUnique = function (name) {
        return this.name.toLowerCase() === name.toLowerCase();
    };

    this.matchesNameLazy = function (text) {
        return new RegExp(text, "i").test(this.name);
    };

    this.matchesLazy = function (text) {
        return new RegExp(text, "i").test(this.name + this.strippedBody);
    };

    this.matchesWord = function (text) {
        return new RegExp(`\\b${text}\\b`, "i").test(this.name + this.strippedBody);
    };

    this.remove = function (rootFolder) {
        const index = rootFolder.getUniqueObjectIndex(this.name, this.type),
            thisIndex = index[index.length - 1];

        this.getParentFolder(rootFolder).list.splice(thisIndex, 1);
        Folder.setIndices(rootFolder);
    };

    this.getParentFolder = function (rootFolder) {
        let index = rootFolder.getUniqueObjectIndex(this.name, this.type),
            parent = rootFolder;

        for (let i = 0; i < index.length - 1; i++) {
            parent = parent.list[index[i]];
        }

        return parent;
    };
}

// Static properties
Generic.FOLDER_TYPE = "folder";
Generic.SNIP_TYPE = "snip";

function Snip(name, body, timestamp) {
    this.name = name || "";
    this.body = body || "";
    this.timestamp = timestamp || Date.now();
    this.type = Generic.SNIP_TYPE;
}

// Set up prototype chain
Snip.prototype = Object.create(Generic.prototype);
Snip.prototype.constructor = Snip;

// Add toJSON method
Snip.prototype.toJSON = function () {
    return {
        type: this.type,
        name: this.name,
        body: this.body,
        timestamp: this.timestamp,
    };
};

// Static method
Snip.fromObject = function (snip) {
    if (!snip || !snip.name) { return null; }

    const nSnip = new Snip(snip.name, snip.body);

    // remove "Created on " part from timestamp
    nSnip.timestamp = !snip.timestamp
        ? Date.now() // can be undefined
        : typeof snip.timestamp === "number"
            ? snip.timestamp
            : Date.parse(snip.timestamp.substring(11));

    return nSnip;
};

function Folder(name, list, timestamp) {
    this.name = name || "";
    this.type = Generic.FOLDER_TYPE;
    this.timestamp = timestamp || Date.now();
    this.list = Array.isArray(list) ? list : [];
}

// Set up prototype chain
Folder.prototype = Object.create(Generic.prototype);
Folder.prototype.constructor = Folder;

// Add instance methods
Folder.prototype.getUniqueObjectIndex = function (name, type) {
    if (!name || !type) { return []; }
    const result = [];

    for (let i = 0; i < this.list.length; i++) {
        const item = this.list[i];
        if (item && item.matchesUnique
            && item.matchesUnique(name)
            && item.type === type) {
            result.push(i);
            if (item.type === Generic.FOLDER_TYPE) {
                result.push(...item.getUniqueObjectIndex(name, type));
            }
        }
    }

    return result;
};

Folder.prototype.listSnippets = function () {
    const snippets = [],
        processItem = (item) => {
            if (!item) { return; }

            if (item.type === Generic.SNIP_TYPE) {
                snippets.push(item);
            } else if (item.type === Generic.FOLDER_TYPE && Array.isArray(item.list)) {
                item.list.forEach(processItem);
            }
        };

    this.list.forEach(processItem);
    return snippets;
};

Folder.prototype.toJSON = function () {
    return {
        type: this.type,
        name: this.name,
        timestamp: this.timestamp,
        list: this.list.map((item) => {
            if (item instanceof Folder || item instanceof Snip) {
                return item.toJSON();
            }
            return item;
        }),
    };
};

// Add static properties to Folder
Folder.MAIN_SNIPPETS_NAME = "Snippets";
Folder.SEARCH_RESULTS_NAME = "Search Results in ";

Folder.indices = {
    [Generic.FOLDER_TYPE]: {},
    [Generic.SNIP_TYPE]: {},
};

// Add static methods
Folder.setIndices = function (rootFolder) {
    function set(type, name, indexArray) {
        if (!name) {
            console.warn("[SET_INDICES] Attempted to set index with empty name:", { type, indexArray });
            return;
        }
        Folder.indices[type][name.toLowerCase()] = indexArray;
    }

    function repeat(folder, mainIndexArray) {
        if (!folder || !folder.list) {
            console.warn("[SET_INDICES] Invalid folder in repeat:", folder);
            return;
        }

        let indexCounter = 0;
        set(folder.type, folder.name, mainIndexArray);

        folder.list.forEach((elm) => {
            if (!elm || !elm.type) {
                console.warn("[SET_INDICES] Invalid list item:", elm);
                return;
            }

            const currIndexArray = mainIndexArray.concat(indexCounter);

            if (elm.type === Generic.FOLDER_TYPE) {
                repeat(elm, currIndexArray);
            } else {
                set(elm.type, elm.name, currIndexArray);
            }

            indexCounter++;
        });
    }

    // reset indices
    Folder.indices = {
        [Generic.FOLDER_TYPE]: {},
        [Generic.SNIP_TYPE]: {},
    };

    if (rootFolder) {
        repeat(rootFolder, []);
    }
};

Folder.fromObject = function (obj, isRoot = false) {
    if (!obj) { return null; }

    const name = isRoot ? Folder.MAIN_SNIPPETS_NAME : obj.name,
        folder = new Folder(name, [], obj.timestamp);

    if (obj.list && Array.isArray(obj.list)) {
        obj.list.forEach((item) => {
            if (item.type === Generic.FOLDER_TYPE) {
                const subFolder = Folder.fromObject(item);
                if (subFolder) { folder.list.push(subFolder); }
            } else if (item.type === Generic.SNIP_TYPE) {
                const snip = Snip.fromObject(item);
                if (snip) { folder.list.push(snip); }
            }
        });
    }

    return folder;
};

Folder.fromArray = function (arr, isRoot = false) {
    if (!arr || !Array.isArray(arr)) {
        return null;
    }

    // Handle root folder formats:
    // 1. Old format: ['r', timestamp, ...items]
    // 2. New format: [timestamp, ...items]
    // 3. Named format: ['Snippets', timestamp, ...items]
    let name,
        timestamp,
        items;

    if (isRoot || arr[0] === "r" || arr[0] === Folder.MAIN_SNIPPETS_NAME) {
        if (arr[0] === "r") {
            [, timestamp, ...items] = arr;
        } else if (arr[0] === Folder.MAIN_SNIPPETS_NAME) {
            [, timestamp, ...items] = arr;
        } else {
            [timestamp, ...items] = arr;
        }
        name = Folder.MAIN_SNIPPETS_NAME;
    } else {
        // Regular folder format: [name, timestamp, ...items]
        [name, timestamp, ...items] = arr;
    }

    const folder = new Folder(name, [], timestamp);
    folder.type = Generic.FOLDER_TYPE;

    items.forEach((item) => {
        if (Array.isArray(item)) {
            // If array has more than 2 elements, it's a folder
            if (item.length > 2) {
                const subFolder = Folder.fromArray(item);
                if (subFolder) {
                    folder.list.push(subFolder);
                }
            } else {
                // It's a snippet in array format [name, timestamp]
                const [snipName, snipTimestamp] = item,
                    snip = new Snip(snipName, "", snipTimestamp);
                snip.type = Generic.SNIP_TYPE;
                folder.list.push(snip);
            }
        } else if (typeof item === "object") {
            // Handle legacy type identifiers
            if (item.type === "r" || item.type === "a" || item.type === Generic.FOLDER_TYPE) {
                const subFolder = new Folder(item.name, [], item.timestamp);
                subFolder.type = Generic.FOLDER_TYPE;
                if (item.list) {
                    item.list.forEach((subItem) => {
                        if (subItem.type === "r" || subItem.type === "a" || subItem.type === Generic.FOLDER_TYPE) {
                            const nestedFolder = Folder.fromObject(subItem);
                            if (nestedFolder) {
                                subFolder.list.push(nestedFolder);
                            }
                        } else {
                            const snip = Snip.fromObject(subItem);
                            if (snip) {
                                subFolder.list.push(snip);
                            }
                        }
                    });
                }
                folder.list.push(subFolder);
            } else {
                const snip = Snip.fromObject(item);
                if (snip) {
                    folder.list.push(snip);
                }
            }
        }
    });

    return folder;
};

Folder.getDefaultSnippetData = function () {
    const ts = Date.now(),
        folder = new Folder(Folder.MAIN_SNIPPETS_NAME, [], ts);

    folder.list = [
        new Folder("sampleFolder", [], ts),
        new Snip("sampleSnippet",
            "Hello new user! Thank you for using DotExpander!\n\nThis is a sample snippet. Try using it on any webpage by typing 'sampleSnippet' (snippet name; without quotes), and press the hotkey (default: Shift+Space), and this whole text would come in place of it.",
            ts),
        new Snip("letter",
            "(Sample snippet to demonstrate the power of DotExpander snippets; for more detail on Placeholders, see the Help section)\n\nHello %name%,\n\nYour complaint number %complaint% has been noted. We will work at our best pace to get this issue solved for you. If you experience any more problems, please feel free to contact at me@organization.com.\n\nRegards,\n%my_name%,\nDate: [[%d(D-MM-YYYY)]]",
            ts),
        new Snip("brb", "be right back", ts),
        new Snip("my_sign",
            "<b>DotExpander &#169;</b>\n<i>Created by DoctorDurant LLC</i>\n<u>james@doctordurant.com</u>",
            ts),
        new Snip("dateArithmetic",
            "Use this snippet in any webpage, and you'll see that the following: [[%d(Do MMMM YYYY hh:m:s)]] is replaced by the current date and time.\n\nMoreover, you can perform date/time arithmetic. The following: [[%d(D+5 MMMM+5 YYYY+5 hh-5:m-5:s-5)]] gives the date, month, year, forward by five; and hour, minutes, and seconds backward by 5.\n\nMore info on this in the Help section.",
            ts),
        new Snip("urlMacro",
            "Use the URL macro (details in the Help page) to retrieve parts of the URL of the active webpage. For example, [[%u(host)]] gives the hostname.",
            ts),
    ];

    return folder;
};

// Handle object format
const convertLegacyType = (type) => {
    // If it's already a standard type, return it
    if (type === Generic.FOLDER_TYPE || type === Generic.SNIP_TYPE) {
        return type;
    }

    // Handle legacy types
    const legacyMap = {
        r: Generic.FOLDER_TYPE,
        o: Generic.SNIP_TYPE,
        a: Generic.FOLDER_TYPE,
        i: Generic.SNIP_TYPE,
        folder: Generic.FOLDER_TYPE,
        snip: Generic.SNIP_TYPE,
    };

    // Get the mapped type or return the original type
    return legacyMap[type] || type;
};

export { Folder, Snip, Generic };
