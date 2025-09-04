const fs = require('fs');
const path = require('path');

class Utils {
    /**
     * Validate if a path exists
     * @param {string} inputPath - The path to validate
     * @returns {boolean} True if path exists
     */
    static pathExists(inputPath) {
        try {
            return fs.existsSync(inputPath);
        } catch (error) {
            return false;
        }
    }

    /**
     * Resolve and normalize a path
     * @param {string} inputPath - The path to resolve
     * @returns {string} The resolved absolute path
     */
    static resolvePath(inputPath) {
        return path.resolve(inputPath);
    }

    /**
     * Check if a path is a directory
     * @param {string} inputPath - The path to check
     * @returns {boolean} True if path is a directory
     */
    static isDirectory(inputPath) {
        try {
            return fs.statSync(inputPath).isDirectory();
        } catch (error) {
            return false;
        }
    }

    /**
     * Check if a path is a file
     * @param {string} inputPath - The path to check
     * @returns {boolean} True if path is a file
     */
    static isFile(inputPath) {
        try {
            return fs.statSync(inputPath).isFile();
        } catch (error) {
            return false;
        }
    }

    /**
     * Validate alias format (alphanumeric, underscores, hyphens)
     * @param {string} alias - The alias to validate
     * @returns {boolean} True if alias is valid
     */
    static isValidAlias(alias) {
        const aliasRegex = /^[a-zA-Z0-9_-]+$/;
        return aliasRegex.test(alias) && alias.length > 0;
    }

    /**
     * Format bookmarks for display in table format
     * @param {Object} bookmarks - The bookmarks object
     * @returns {string} Formatted table string
     */
    static formatBookmarksTable(bookmarks) {
        const aliases = Object.keys(bookmarks);
        
        if (aliases.length === 0) {
            return 'No bookmarks found.';
        }

        // Calculate column widths
        const maxAliasLength = Math.max(...aliases.map(alias => alias.length), 'ALIAS'.length);
        const maxPathLength = Math.max(...Object.values(bookmarks).map(path => path.length), 'PATH'.length);

        // Create header
        const header = `${'ALIAS'.padEnd(maxAliasLength)} | ${'PATH'.padEnd(maxPathLength)}`;
        const separator = '-'.repeat(header.length);

        // Create rows
        const rows = aliases.map(alias => {
            return `${alias.padEnd(maxAliasLength)} | ${bookmarks[alias].padEnd(maxPathLength)}`;
        });

        return [header, separator, ...rows].join('\n');
    }

    /**
     * Format a success message
     * @param {string} message - The message to format
     * @returns {string} Formatted success message
     */
    static formatSuccess(message) {
        return `✓ ${message}`;
    }

    /**
     * Format an error message
     * @param {string} message - The message to format
     * @returns {string} Formatted error message
     */
    static formatError(message) {
        return `✗ ${message}`;
    }
}

module.exports = Utils;