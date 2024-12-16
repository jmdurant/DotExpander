// Service worker operations for snippet management
import { Folder, Snip } from './service-worker-classes.js';
import { serializeSnippetData, deserializeSnippetData } from './service-worker-serialization.js';

/**
 * Creates a new snippet
 * @param {Object} data The snippet data
 * @param {string} data.name The name of the snippet
 * @param {string} data.body The body of the snippet
 * @param {string[]} data.folderPath Array of folder names representing the path to the target folder
 * @param {Object} rootData The root data object containing all snippets
 * @returns {Object} Result object with success status and error message if applicable
 */
export async function createSnippet(data, rootData) {
    try {
        console.log('[CREATE_SNIPPET] Starting creation:', { data, rootData });
        
        // Validate input
        if (!data?.name || !data?.body) {
            throw new Error('Invalid snippet data: name and body are required');
        }

        // Create new snippet instance
        const newSnippet = new Snip(data.name, data.body);
        
        // Find target folder
        let targetFolder = rootData.snippets;
        if (data.folderPath?.length) {
            for (const folderName of data.folderPath) {
                const nextFolder = targetFolder.list.find(
                    item => item instanceof Folder && item.name.toLowerCase() === folderName.toLowerCase()
                );
                if (!nextFolder) {
                    throw new Error(`Folder not found: ${folderName}`);
                }
                targetFolder = nextFolder;
            }
        }

        // Check for duplicate names in target folder
        const isDuplicate = targetFolder.list.some(
            item => item.name.toLowerCase() === data.name.toLowerCase()
        );
        if (isDuplicate) {
            throw new Error(`Snippet with name "${data.name}" already exists in this folder`);
        }

        // Add snippet to folder
        targetFolder.list.push(newSnippet);
        
        // Update indices
        Folder.setIndices(rootData.snippets);

        console.log('[CREATE_SNIPPET] Successfully created snippet:', newSnippet);
        return { success: true, snippet: newSnippet };
    } catch (error) {
        console.error('[CREATE_SNIPPET] Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Edits an existing snippet
 * @param {Object} data The snippet update data
 * @param {string} data.snippetId The ID of the snippet to edit
 * @param {string} data.name The new name of the snippet
 * @param {string} data.body The new body of the snippet
 * @param {string[]} [data.folderPath] Optional new folder path if moving the snippet
 * @param {Object} rootData The root data object containing all snippets
 * @returns {Object} Result object with success status and error message if applicable
 */
export async function editSnippet(data, rootData) {
    try {
        console.log('[EDIT_SNIPPET] Starting edit:', { data, rootData });
        
        // Validate input
        if (!data?.snippetId || (!data?.name && !data?.body && !data?.folderPath)) {
            throw new Error('Invalid edit data: snippetId and at least one change (name, body, or folderPath) required');
        }

        // Find the snippet and its parent folder
        let currentFolder = rootData.snippets;
        let snippet = null;
        let parentFolder = null;

        function findSnippet(folder) {
            for (let i = 0; i < folder.list.length; i++) {
                const item = folder.list[i];
                if (item instanceof Snip && item.name === data.snippetId) {
                    snippet = item;
                    parentFolder = folder;
                    return true;
                } else if (item instanceof Folder) {
                    if (findSnippet(item)) {
                        return true;
                    }
                }
            }
            return false;
        }

        findSnippet(currentFolder);

        if (!snippet) {
            throw new Error(`Snippet "${data.snippetId}" not found`);
        }

        // If moving to a new folder
        if (data.folderPath?.length) {
            let targetFolder = rootData.snippets;
            for (const folderName of data.folderPath) {
                const nextFolder = targetFolder.list.find(
                    item => item instanceof Folder && item.name.toLowerCase() === folderName.toLowerCase()
                );
                if (!nextFolder) {
                    throw new Error(`Target folder not found: ${folderName}`);
                }
                targetFolder = nextFolder;
            }

            // Remove from current folder
            const index = parentFolder.list.indexOf(snippet);
            if (index !== -1) {
                parentFolder.list.splice(index, 1);
            }

            // Add to new folder
            targetFolder.list.push(snippet);
        }

        // Update snippet properties
        if (data.name) {
            snippet.name = data.name;
        }
        if (data.body) {
            snippet.body = data.body;
        }

        // Update indices
        Folder.setIndices(rootData.snippets);

        console.log('[EDIT_SNIPPET] Successfully edited snippet:', snippet);
        return { success: true, snippet };
    } catch (error) {
        console.error('[EDIT_SNIPPET] Error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Deletes a snippet
 * @param {Object} data The deletion data
 * @param {string} data.snippetId The ID of the snippet to delete
 * @param {Object} rootData The root data object containing all snippets
 * @returns {Object} Result object with success status and error message if applicable
 */
export async function deleteSnippet(data, rootData) {
    try {
        console.log('[DELETE_SNIPPET] Starting deletion:', { data, rootData });

        // Validate input
        if (!data?.snippetId) {
            throw new Error('Invalid delete data: snippetId is required');
        }

        // Find the snippet and its parent folder
        let currentFolder = rootData.snippets;
        let snippet = null;
        let parentFolder = null;

        function findSnippet(folder) {
            for (let i = 0; i < folder.list.length; i++) {
                const item = folder.list[i];
                if (item instanceof Snip && item.name === data.snippetId) {
                    snippet = item;
                    parentFolder = folder;
                    return true;
                } else if (item instanceof Folder) {
                    if (findSnippet(item)) {
                        return true;
                    }
                }
            }
            return false;
        }

        findSnippet(currentFolder);

        if (!snippet) {
            throw new Error(`Snippet "${data.snippetId}" not found`);
        }

        // Remove snippet from parent folder
        const index = parentFolder.list.indexOf(snippet);
        if (index !== -1) {
            parentFolder.list.splice(index, 1);
        }

        // Update indices
        Folder.setIndices(rootData.snippets);

        console.log('[DELETE_SNIPPET] Successfully deleted snippet:', data.snippetId);
        return { success: true };
    } catch (error) {
        console.error('[DELETE_SNIPPET] Error:', error);
        return { success: false, error: error.message };
    }
}
