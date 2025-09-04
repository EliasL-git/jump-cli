const Storage = require('./storage');
const Utils = require('./utils');

class Bookmarks {
    constructor() {
        this.storage = new Storage();
    }

    /**
     * Create a new bookmark
     * @param {string} inputPath - The path to bookmark
     * @param {string} alias - The alias for the bookmark
     * @returns {Object} Result object with success status and message
     */
    create(inputPath, alias) {
        // Validate alias format
        if (!Utils.isValidAlias(alias)) {
            return {
                success: false,
                message: 'Invalid alias format. Use only alphanumeric characters, underscores, and hyphens.'
            };
        }

        // Resolve and validate path
        const resolvedPath = Utils.resolvePath(inputPath);
        if (!Utils.pathExists(resolvedPath)) {
            return {
                success: false,
                message: `Path does not exist: ${resolvedPath}`
            };
        }

        // Read existing bookmarks
        const bookmarks = this.storage.read();

        // Check if alias already exists
        if (bookmarks[alias]) {
            return {
                success: false,
                message: `Alias '${alias}' already exists. Use 'jump remove ${alias}' to remove it first.`
            };
        }

        // Add new bookmark
        bookmarks[alias] = resolvedPath;

        // Save bookmarks
        try {
            this.storage.write(bookmarks);
            return {
                success: true,
                message: `Bookmark '${alias}' created for '${resolvedPath}'`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to save bookmark: ${error.message}`
            };
        }
    }

    /**
     * Get all bookmarks
     * @returns {Object} The bookmarks object
     */
    list() {
        return this.storage.read();
    }

    /**
     * Get a specific bookmark by alias
     * @param {string} alias - The alias to look up
     * @returns {Object} Result object with path if found
     */
    get(alias) {
        const bookmarks = this.storage.read();
        
        if (!bookmarks[alias]) {
            return {
                success: false,
                message: `Bookmark '${alias}' not found`
            };
        }

        const bookmarkPath = bookmarks[alias];
        
        // Check if the bookmarked path still exists
        if (!Utils.pathExists(bookmarkPath)) {
            return {
                success: false,
                message: `Bookmarked path no longer exists: ${bookmarkPath}`
            };
        }

        return {
            success: true,
            path: bookmarkPath,
            isDirectory: Utils.isDirectory(bookmarkPath),
            isFile: Utils.isFile(bookmarkPath)
        };
    }

    /**
     * Remove a bookmark
     * @param {string} alias - The alias to remove
     * @returns {Object} Result object with success status and message
     */
    remove(alias) {
        const bookmarks = this.storage.read();

        if (!bookmarks[alias]) {
            return {
                success: false,
                message: `Bookmark '${alias}' not found`
            };
        }

        const removedPath = bookmarks[alias];
        delete bookmarks[alias];

        try {
            this.storage.write(bookmarks);
            return {
                success: true,
                message: `Bookmark '${alias}' removed (was pointing to '${removedPath}')`
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to remove bookmark: ${error.message}`
            };
        }
    }

    /**
     * Check if any bookmarks exist
     * @returns {boolean} True if bookmarks exist
     */
    hasBookmarks() {
        const bookmarks = this.storage.read();
        return Object.keys(bookmarks).length > 0;
    }

    /**
     * Get the count of bookmarks
     * @returns {number} Number of bookmarks
     */
    count() {
        const bookmarks = this.storage.read();
        return Object.keys(bookmarks).length;
    }
}

module.exports = Bookmarks;