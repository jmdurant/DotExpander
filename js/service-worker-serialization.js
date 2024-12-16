// Service worker serialization helpers
import { Folder, Snip, Generic } from './service-worker-classes.js';

/**
 * Creates a proper class instance from serialized data
 * @param {Object|Array} data The data to create an instance from
 * @param {boolean} isRoot Whether this is the root snippets folder
 * @returns {Object} A proper class instance
 */
function createInstance(data, isRoot = false) {
    console.log('[CREATE_INSTANCE] Input:', {
        data,
        isRoot,
        type: Array.isArray(data) ? 'array' : typeof data
    });

    if (!data) {
        console.warn('[CREATE_INSTANCE] No data provided');
        return null;
    }

    // Handle array format for backwards compatibility
    if (Array.isArray(data)) {
        console.log('[CREATE_INSTANCE] Legacy array format detected:', {
            firstElement: data[0],
            length: data.length
        });
        return Folder.fromArray(data, isRoot);
    }

    // Handle string type identifier ('r' or 'o')
    if (typeof data === 'string' && (data === 'r' || data === 'o')) {
        console.log('[CREATE_INSTANCE] String type identifier detected:', data);
        if (data === 'r') {
            const folder = new Folder(Folder.MAIN_SNIPPETS_NAME, [], Date.now());
            folder.type = Generic.FOLDER_TYPE;
            return folder;
        }
        const snip = new Snip('', '', Date.now());
        snip.type = Generic.SNIP_TYPE;
        return snip;
    }

    // Determine type based on structure first, then fallback to type field
    let type;
    if (data.list && Array.isArray(data.list)) {
        type = Generic.FOLDER_TYPE;
    } else if (data.body !== undefined) {
        type = Generic.SNIP_TYPE;
    } else {
        type = convertLegacyType(data.type);
    }

    console.log('[CREATE_INSTANCE] Object format detected:', {
        type,
        name: data.name,
        isRoot,
        hasBody: data.body !== undefined,
        hasList: data.list !== undefined
    });

    if (type === Generic.FOLDER_TYPE) {
        // For root folder, ensure it uses the correct name
        const name = isRoot ? Folder.MAIN_SNIPPETS_NAME : data.name;
        const folder = new Folder(name, [], data.timestamp);
        folder.type = Generic.FOLDER_TYPE;
        
        if (data.list && Array.isArray(data.list)) {
            data.list.forEach(item => {
                const instance = createInstance(item, false);
                if (instance) {
                    instance.type = instance instanceof Folder ? Generic.FOLDER_TYPE : Generic.SNIP_TYPE;
                    folder.list.push(instance);
                }
            });
        }
        
        return folder;
    } else if (type === Generic.SNIP_TYPE) {
        const snip = new Snip(data.name, data.body || '', data.timestamp);
        snip.type = Generic.SNIP_TYPE;
        return snip;
    }

    console.warn('[CREATE_INSTANCE] Unknown type:', type);
    return null;
}

/**
 * Serializes an object for storage
 * @param {Object} obj The object to serialize
 * @returns {Object} The serialized object
 */
function serialize(obj) {
    console.log('[SERIALIZE] Input:', obj?.type);
    
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    // If it's an array, serialize each item
    if (Array.isArray(obj)) {
        return obj.map(item => serialize(item));
    }

    // Handle string type identifier ('r' or 'o')
    if (typeof obj === 'string' && (obj === 'r' || obj === 'o')) {
        return {
            type: convertLegacyType(obj),
            name: obj === 'r' ? Folder.MAIN_SNIPPETS_NAME : '',
            timestamp: Date.now()
        };
    }

    // Determine the type based on instance type first
    let type;
    if (obj instanceof Folder) {
        type = Generic.FOLDER_TYPE;
    } else if (obj instanceof Snip) {
        type = Generic.SNIP_TYPE;
    } else if (obj.list && Array.isArray(obj.list)) {
        type = Generic.FOLDER_TYPE;
    } else if (obj.body !== undefined) {
        type = Generic.SNIP_TYPE;
    } else {
        type = convertLegacyType(obj.type);
    }

    const serialized = {
        type: type,
        name: obj.name || '',
        timestamp: obj.timestamp || Date.now()
    };

    // Add type-specific properties based on determined type
    if (type === Generic.FOLDER_TYPE) {
        serialized.list = (obj.list || []).map(item => serialize(item));
    } else if (type === Generic.SNIP_TYPE) {
        serialized.body = obj.body || '';
    }

    console.log('[SERIALIZE] Output:', serialized);
    return serialized;
}

/**
 * Serializes snippet data for storage
 * @param {Object} data The data to serialize
 * @returns {Object} Serialized data
 */
function serializeSnippetData(data) {
    console.log('[SERIALIZE] Input:', {
        data,
        type: data?.constructor?.name,
        isFolder: data instanceof Folder,
        isSnip: data instanceof Snip
    });

    if (!data) return null;

    // Handle Folder instances
    if (data instanceof Folder) {
        return {
            name: data.name,
            type: Generic.FOLDER_TYPE,
            list: data.list.map(item => serializeSnippetData(item)),
            dateCreated: data.dateCreated
        };
    }

    // Handle Snip instances
    if (data instanceof Snip) {
        return {
            name: data.name,
            body: data.body,
            type: Generic.SNIP_TYPE,
            dateCreated: data.dateCreated
        };
    }

    console.warn('[SERIALIZE] Unknown data type:', data);
    return data;
}

/**
 * Deserializes snippet data from storage
 * @param {Object} data The data to deserialize
 * @returns {Object} Deserialized data with proper class instances
 */
function deserializeSnippetData(data) {
    console.log('[DESERIALIZE] Input:', {
        data,
        type: Array.isArray(data) ? 'array' : typeof data
    });

    if (!data) return null;

    // Handle array format (legacy)
    if (Array.isArray(data)) {
        return Folder.fromArray(data, true);
    }

    // Handle string type identifiers
    if (typeof data === 'string') {
        if (data === 'r') {
            return new Folder(Folder.MAIN_SNIPPETS_NAME, [], Date.now());
        }
        if (data === 'o') {
            return new Snip('', '', Date.now());
        }
    }

    // Handle object format
    if (typeof data === 'object') {
        // Handle Folder
        if (data.type === Generic.FOLDER_TYPE || data.list) {
            const folder = new Folder(
                data.name || Folder.MAIN_SNIPPETS_NAME,
                (data.list || []).map(item => deserializeSnippetData(item)),
                data.dateCreated || Date.now()
            );
            return folder;
        }

        // Handle Snip
        if (data.type === Generic.SNIP_TYPE || data.body !== undefined) {
            return new Snip(
                data.name || '',
                data.body || '',
                data.dateCreated || Date.now()
            );
        }
    }

    console.warn('[DESERIALIZE] Unknown data format:', data);
    return data;
}

/**
 * Ensures that all objects in the data structure are proper class instances
 * @param {Object} data The data to ensure proper instances for
 * @returns {Object} The data with proper class instances
 */
function ensureProperInstances(data) {
    console.log('[ENSURE_PROPER_INSTANCES] Input:', data);
    if (!data) {
        console.warn('[ENSURE_PROPER_INSTANCES] No data provided');
        return data;
    }

    // If it's already a proper instance, return as is
    if (data instanceof Folder || data instanceof Snip) {
        console.log('[ENSURE_PROPER_INSTANCES] Already a proper instance:', data.constructor.name);
        return data;
    }

    // Create proper instance
    const result = createInstance(data);
    console.log('[ENSURE_PROPER_INSTANCES] Output:', result);
    return result;
}

// Handle object format
const convertLegacyType = (type) => {
    // If it's already a standard type, return it
    if (type === Generic.FOLDER_TYPE || type === Generic.SNIP_TYPE) {
        return type;
    }

    // Handle legacy types
    const legacyMap = {
        'r': Generic.FOLDER_TYPE,
        'o': Generic.SNIP_TYPE,
        'a': Generic.FOLDER_TYPE,
        'i': Generic.SNIP_TYPE,
        'folder': Generic.FOLDER_TYPE,
        'snip': Generic.SNIP_TYPE
    };

    // Get the mapped type or default to snip type
    const mappedType = legacyMap[type];
    if (!mappedType) {
        console.warn('[CONVERT_LEGACY_TYPE] Unknown type:', type);
    }
    return mappedType || Generic.SNIP_TYPE;
};

// Export all functions
export {
    serialize,
    createInstance,
    serializeSnippetData,
    deserializeSnippetData,
    ensureProperInstances
};
