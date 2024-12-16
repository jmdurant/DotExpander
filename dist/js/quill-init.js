// Initialize Quill in the content script context
(function() {
    function waitForDependencies(callback, retryCount = 0) {
        // Check if Quill is defined
        if (typeof Quill === 'undefined') {
            if (retryCount < 50) {
                console.log('[DEBUG] Waiting for Quill...', { Quill: typeof Quill });
                setTimeout(() => waitForDependencies(callback, retryCount + 1), 100);
                return;
            }
            console.error('[DEBUG] Quill not available after maximum retries');
            return;
        }

        // Make Quill available globally
        window.Quill = Quill;

        // Now wait for QuillBetterTable - check both module and global
        const betterTableModule = typeof QuillBetterTable !== 'undefined' ? QuillBetterTable :
                                typeof window.QuillBetterTable !== 'undefined' ? window.QuillBetterTable :
                                null;

        if (!betterTableModule) {
            if (retryCount < 50) {
                console.log('[DEBUG] Waiting for QuillBetterTable...');
                setTimeout(() => waitForDependencies(callback, retryCount + 1), 100);
                return;
            }
            console.error('[DEBUG] QuillBetterTable not available after maximum retries');
            return;
        }

        // Make QuillBetterTable available globally
        window.QuillBetterTable = betterTableModule;

        callback();
    }

    function initQuill() {
        try {
            console.log('[DEBUG] Initializing Quill...');
            console.log('[DEBUG] Quill version:', Quill.version);
            console.log('[DEBUG] QuillBetterTable available:', !!window.QuillBetterTable);
            
            const betterTable = window.QuillBetterTable.default || window.QuillBetterTable;
            const TableCell = betterTable.TableCell || window.QuillBetterTable.TableCell;
            const TableRow = betterTable.TableRow || window.QuillBetterTable.TableRow;
            
            // Register the table module
            console.log('[DEBUG] Registering table module');
            Quill.register({
                'modules/better-table': betterTable,
                'formats/better-table': TableCell,
                'formats/better-table-row': TableRow,
                'formats/better-table-cell': TableCell
            }, true);

            const toolbarOptions = [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['better-table']
            ];

            // Initialize Quill editor
            window.quillEditor = new Quill('#editor', {
                modules: {
                    toolbar: toolbarOptions,
                    'better-table': true,
                    keyboard: {
                        bindings: betterTable.keyboardBindings
                    }
                },
                theme: 'snow'
            });

            console.log('[DEBUG] Quill initialization complete');
        } catch (error) {
            console.error('[DEBUG] Error initializing Quill:', error);
        }
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => waitForDependencies(initQuill));
    } else {
        waitForDependencies(initQuill);
    }
})();
