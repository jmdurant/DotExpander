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
        console.log('[CREATE_SNIPPET] Starting creation with data:', {
            snippetName: data?.name,
            snippetBody: data?.body?.substring(0, 50) + '...',
            folderPath: data?.folderPath,
            rootDataExists: !!rootData,
            rootSnippetsExists: !!rootData?.snippets,
            rootSnippetsType: rootData?.snippets?.constructor?.name,
            rootSnippetsName: rootData?.snippets?.name
        });
        
        // Validate input
        if (!data?.name || !data?.body) {
            throw new Error('Invalid snippet data: name and body are required');
        }

        // Ensure root snippets is a proper Folder instance
        if (!(rootData.snippets instanceof Folder)) {
            console.log('[CREATE_SNIPPET] Converting root snippets to Folder instance');
            rootData.snippets = deserializeSnippetData(rootData.snippets);
        }

        // Create new snippet instance
        const newSnippet = new Snip(data.name, data.body);
        console.log('[CREATE_SNIPPET] Created new snippet instance:', {
            name: newSnippet.name,
            type: newSnippet.type,
            bodyLength: newSnippet.body?.length
        });
        
        // Find target folder - default to root if no path specified
        let targetFolder = rootData.snippets;
        console.log('[CREATE_SNIPPET] Initial target folder:', {
            name: targetFolder?.name,
            type: targetFolder?.type,
            isFolderInstance: targetFolder instanceof Folder,
            hasListProperty: !!targetFolder?.list,
            listLength: targetFolder?.list?.length
        });

        // Only process folder path if one is specified
        if (data.folderPath?.length) {
            console.log('[CREATE_SNIPPET] Resolving folder path:', data.folderPath);
            // Navigate the folder path for nested folders
            for (const folderName of data.folderPath) {
                console.log('[CREATE_SNIPPET] Looking for folder:', folderName);
                const nextFolder = targetFolder.list.find(
                    item => item instanceof Folder && item.name.toLowerCase() === folderName.toLowerCase()
                );
                if (!nextFolder) {
                    console.error('[CREATE_SNIPPET] Folder not found:', {
                        searchName: folderName,
                        currentFolderName: targetFolder.name,
                        availableFolders: targetFolder.list
                            .filter(item => item instanceof Folder)
                            .map(f => f.name)
                    });
                    throw new Error(`Folder not found: ${folderName}`);
                }
                targetFolder = nextFolder;
                console.log('[CREATE_SNIPPET] Found next folder:', {
                    name: targetFolder.name,
                    type: targetFolder.type,
                    listLength: targetFolder.list.length
                });
            }
        } else {
            console.log('[CREATE_SNIPPET] No folder path specified, using root folder');
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
