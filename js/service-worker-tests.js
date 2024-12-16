// Service worker operation tests
import { Folder, Snip } from "./service-worker-classes.js";
import { createSnippet, editSnippet, deleteSnippet } from "./service-worker-operations.js";

// Mock data for testing
const mockData = {
    snippets: new Folder("root", [
        new Snip("test1", "Test content 1", Date.now()),
        new Folder("folder1", [
            new Snip("test2", "Test content 2", Date.now()),
        ]),
        new Folder("folder2", []),
    ]),
};

// Test helper to run a series of tests
async function runTests() {
    console.group("Running Service Worker Operation Tests");
    try {
        // Test 1: Create snippet
        console.group("Test 1: Create Snippet");
        const createResult = await createSnippet({
            name: "newSnippet",
            body: "New snippet content",
            folderPath: ["folder1"],
        }, mockData);
        console.assert(createResult.success, "Create snippet should succeed");
        console.assert(createResult.snippet.name === "newSnippet", "Snippet should have correct name");
        console.log("Create result:", createResult);
        console.groupEnd();

        // Test 2: Create snippet with duplicate name (should fail)
        console.group("Test 2: Create Duplicate Snippet");
        const duplicateResult = await createSnippet({
            name: "test1",
            body: "Duplicate content",
        }, mockData);
        console.assert(!duplicateResult.success, "Duplicate creation should fail");
        console.assert(duplicateResult.error.includes("already exists"), "Should have duplicate error message");
        console.log("Duplicate result:", duplicateResult);
        console.groupEnd();

        // Test 3: Edit snippet
        console.group("Test 3: Edit Snippet");
        const editResult = await editSnippet({
            snippetId: "test1",
            name: "test1-edited",
            body: "Edited content",
        }, mockData);
        console.assert(editResult.success, "Edit snippet should succeed");
        console.assert(editResult.snippet.name === "test1-edited", "Snippet should have new name");
        console.log("Edit result:", editResult);
        console.groupEnd();

        // Test 4: Move snippet to new folder
        console.group("Test 4: Move Snippet");
        const moveResult = await editSnippet({
            snippetId: "test2",
            folderPath: ["folder2"],
        }, mockData);
        console.assert(moveResult.success, "Move snippet should succeed");
        console.assert(mockData.snippets.list[2].list.includes(moveResult.snippet), "Snippet should be in new folder");
        console.log("Move result:", moveResult);
        console.groupEnd();

        // Test 5: Delete snippet
        console.group("Test 5: Delete Snippet");
        const deleteResult = await deleteSnippet({
            snippetId: "test1-edited",
        }, mockData);
        console.assert(deleteResult.success, "Delete snippet should succeed");
        console.assert(deleteResult.deletedSnippet.name === "test1-edited", "Should return deleted snippet");
        console.log("Delete result:", deleteResult);
        console.groupEnd();

        // Test 6: Delete non-existent snippet (should fail)
        console.group("Test 6: Delete Non-existent Snippet");
        const deleteNonExistentResult = await deleteSnippet({
            snippetId: "nonexistent",
        }, mockData);
        console.assert(!deleteNonExistentResult.success, "Delete non-existent should fail");
        console.assert(deleteNonExistentResult.error.includes("not found"), "Should have not found error message");
        console.log("Delete non-existent result:", deleteNonExistentResult);
        console.groupEnd();

        // Print final state
        console.group("Final Data State");
        console.log("Data structure:", JSON.stringify(mockData, null, 2));
        console.groupEnd();
    } catch (error) {
        console.error("Test suite error:", error);
    }
    console.groupEnd();
}

// Run tests when imported
runTests().catch(console.error);
