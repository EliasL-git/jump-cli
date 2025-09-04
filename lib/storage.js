const fs = require('fs');
const path = require('path');
const os = require('os');

class Storage {
    constructor() {
        this.filePath = path.join(os.homedir(), '.jump.json');
    }

    /**
     * Read bookmarks from the JSON file
     * @returns {Object} The bookmarks object
     */
    read() {
        try {
            if (!fs.existsSync(this.filePath)) {
                return {};
            }
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading bookmarks file: ${error.message}`);
            return {};
        }
    }

    /**
     * Write bookmarks to the JSON file
     * @param {Object} bookmarks - The bookmarks object to save
     */
    write(bookmarks) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(bookmarks, null, 2), 'utf8');
        } catch (error) {
            console.error(`Error writing bookmarks file: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get the path to the bookmarks file
     * @returns {string} The file path
     */
    getFilePath() {
        return this.filePath;
    }
}

module.exports = Storage;