// Initialize Quill in the content script context
function initQuill() {
    if (typeof Quill === "undefined") {
        console.error("[DEBUG] Quill not available in content script");
        return;
    }

    try {
        const toolbarOptions = [
                ["bold", "italic", "underline", "strike"],
                ["blockquote", "code-block"],
                [{ header: 1 }, { header: 2 }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ script: "sub" }, { script: "super" }],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ direction: "rtl" }],
                [{ size: ["small", false, "large", "huge"] }],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ color: [] }, { background: [] }],
                [{ font: [] }],
                [{ align: [] }],
                ["clean"],
            ],

            quillEditor = new Quill("#tryit", {
                modules: {
                    toolbar: toolbarOptions,
                },
                theme: "snow",
            });

        // Set initial content
        quillEditor.root.innerHTML = "This is a contenteditable or editable div.\nThese editors are generally found in your email client like Gmail, Outlook, etc.<br><br><i>This editor\n<u>supports</u></i><b> HTML formatting</b>. You can use the \"my_sign\" sample snippet here, and see the effect.";

        // Make Quill instance available to options.js
        window.quillEditor = quillEditor;

        // Notify options.js that Quill is ready
        window.dispatchEvent(new CustomEvent("quill-ready", { detail: { success: true } }));

        console.log("[DEBUG] Quill initialized successfully in content script");
    } catch (error) {
        console.error("[DEBUG] Error initializing Quill in content script:", error);
        window.dispatchEvent(new CustomEvent("quill-ready", { detail: { success: false, error } }));
    }
}

// Wait for Quill to be available
if (document.readyState === "complete") {
    initQuill();
} else {
    window.addEventListener("load", initQuill);
}
