import { isTextNode, q } from "./pre";

/**
 * add indents to `<li>`s; it is NOT innerHTML;
 * content is obtained through regex
 */
function genericFormatterCreator(sep0, sep1) {
    return function (listParent) {
        let resultString = sep1;

        listParent.Q("li").forEach((li) => {
            resultString += `${sep0}<li>${li.innerHTML}</li>${sep1}`;
        });

        listParent.innerHTML = resultString;
    };
}

// CE node does not have indentation otherwise
// &nbsp; will occupy the place and mess up display
const formatOLULInListParentForCEnode = genericFormatterCreator("", "");

function setHTMLPurificationForListSnippets(node) {
    // after we start splitting these text nodes and insert <br>s
    // the original text nodes and their count gets lost
    function getCurrentTextNodes() {
        const textNodesInNode = node.childNodes.filter(child => isTextNode(child));

        return textNodesInNode;
    }
    const list = getCurrentTextNodes(),
        childCount = list.length;
    let count = 0,
        child,
        textNodes,
        i,
        len,
        tNode,
        $br,
        text;

    for (; count < childCount; count++) {
        child = list[count];

        // if a textnode has a single newline
        // => it is present between two element nodes
        // otherwise it would have had some text as well
        // so replace ONE newline first
        // BUT BUT this leads to loss of newline after
        // a simpler element node like <a> or <b>
        // hence, DO NOT do this

        textNodes = child.textContent.split(/\n/g);
        i = 0;
        len = textNodes.length;

        for (; i < len; i++) {
            text = textNodes[i];
            tNode = document.createTextNode(text);
            $br = q.new("br");
            node.insertBefore($br, child);
            node.insertBefore(tNode, $br);
        }
        // textNodes may be:
        // ["a"] or ["a", "b"]
        // the former implies there was NO newline in case like
        // <pre></pre>a<bq></bq>
        // hence have to remove the LAST newline that we've inserted
        node.removeChild($br);
        node.removeChild(child);
    }

    // block level elements already occupy a full line, hence, remove
    // ONE <br> after them
    node.Q("pre, blockquote, ol, ul").forEach((elm) => {
        const br = elm.nextElementSibling;
        if (br && br.tagName === "BR") {
            br.parentNode.removeChild(br);
        }
    });

    node.Q("ol, ul").forEach(formatOLULInListParentForCEnode);
}

// returns innerText
function getText(node) {
    return getHTML(node, "innerText");
}

// sets innerText
function setText(node, newVal) {
    return setHTML(node, newVal, "innerText");
}

function getHTML(node, prop) {
    if (!node) {
        return undefined;
    }

    if (isTextNode(node)) {
        return node.textContent.replace(/\u00a0/g, " ");
    }

    switch (node.tagName) {
    case "TEXTAREA":
    case "INPUT":
        return node.value;
    default:
        return node[prop || "innerHTML"];
    }
}

function setHTML(node, newVal, prop, isListSnippets) {
    // in case number is passed; .replace won't work
    newVal = newVal.toString();

    if (isTextNode(node)) {
        node.textContent = newVal.replace(/ /g, "\u00a0");
        return node;
    }

    switch (node.tagName) {
    case "TEXTAREA":
    case "INPUT":
        node.value = newVal.replace("<br>", "\n").replace("&nbsp;", " ");
        break;
    default:
        if (prop === "innerText") {
            // but innertext will collapse consecutive spaces
            // do not use textContent as it will collapse even single newlines
            node.innerText = newVal.replace("<br>", "\n").replace("&nbsp;", " ");
        } else {
            // first .replace is required as at the end of any text
            // as gmail will not display single space for unknown reason
            try {
                node.innerHTML = newVal.replace(/ $/g, "&nbsp;").replace(/ {2}/g, " &nbsp;");

                if (!isListSnippets) {
                    node.innerHTML = node.innerHTML.replace(/\n/g, "<br>");
                } else {
                    setHTMLPurificationForListSnippets(node);
                }
            } catch (e) {
                console.log("From setHTML: `node` argment is undefined");
            }
        }
    }

    return node;
}

/**
 * Converts text between plain text and HTML format
 * @param {string} text - The text to convert
 * @param {boolean} toHTML - If true, converts to HTML format. If false, converts to plain text.
 * @returns {string} The converted text
 */
function convertBetweenHTMLTags(text, toHTML) {
    if (toHTML) {
        // Convert plain text to HTML
        return text
            .replace(/\n/g, "<br>")
            .replace(/ {2}/g, " &nbsp;")
            .replace(/ $/g, "&nbsp;");
    }
    // Convert HTML to plain text
    return text
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/&nbsp;/g, " ");
}

export {
    setHTML,
    setText,
    getHTML,
    getText,
    genericFormatterCreator,
    formatOLULInListParentForCEnode,
    convertBetweenHTMLTags,
};
