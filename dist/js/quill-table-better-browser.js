// Make sure Quill is available globally
if (typeof Quill === 'undefined') {
    throw new Error('Quill must be loaded before quill-table-better');
}

// Original quill-table-better code, but modified to use global Quill
(function(Quill) {
    // Paste the minified code here, but remove the UMD wrapper
    // The table module will be attached to window.QuillTableBetter
    
    // Your existing table module code goes here
    window.QuillTableBetter = QuillTableBetter;
})(Quill);
