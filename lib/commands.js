const Bookmarks = require('./bookmarks');
const Utils = require('./utils');
const { spawn } = require('child_process');

class Commands {
    constructor() {
        this.bookmarks = new Bookmarks();
    }

    /**
     * Handle the create command
     * @param {string} inputPath - The path to bookmark
     * @param {string} alias - The alias for the bookmark
     */
    create(inputPath, alias) {
        if (!inputPath || !alias) {
            console.error(Utils.formatError('Usage: jump create <path> <alias>'));
            process.exit(1);
        }

        const result = this.bookmarks.create(inputPath, alias);
        
        if (result.success) {
            console.log(Utils.formatSuccess(result.message));
        } else {
            console.error(Utils.formatError(result.message));
            process.exit(1);
        }
    }

    /**
     * Handle the list command
     */
    list() {
        const bookmarks = this.bookmarks.list();
        const formatted = Utils.formatBookmarksTable(bookmarks);
        console.log(formatted);
    }

    /**
     * Handle the to command (navigation)
     * @param {string} alias - The alias to navigate to
     */
    to(alias) {
        if (!alias) {
            console.error(Utils.formatError('Usage: jump to <alias>'));
            process.exit(1);
        }

        const result = this.bookmarks.get(alias);
        
        if (!result.success) {
            console.error(Utils.formatError(result.message));
            process.exit(1);
        }

        // For directories, output the path (for shell wrapper to cd)
        if (result.isDirectory) {
            console.log(result.path);
        } else if (result.isFile) {
            // For files, try to open with default editor or output path
            const editor = process.env.EDITOR;
            if (editor) {
                this.openFile(result.path, editor);
            } else {
                console.log(result.path);
            }
        } else {
            console.log(result.path);
        }
    }

    /**
     * Handle the remove command
     * @param {string} alias - The alias to remove
     */
    remove(alias) {
        if (!alias) {
            console.error(Utils.formatError('Usage: jump remove <alias>'));
            process.exit(1);
        }

        const result = this.bookmarks.remove(alias);
        
        if (result.success) {
            console.log(Utils.formatSuccess(result.message));
        } else {
            console.error(Utils.formatError(result.message));
            process.exit(1);
        }
    }

    /**
     * Open a file with the specified editor
     * @param {string} filePath - Path to the file
     * @param {string} editor - Editor command
     */
    openFile(filePath, editor) {
        try {
            const child = spawn(editor, [filePath], {
                stdio: 'inherit',
                detached: true
            });

            child.on('error', (error) => {
                console.error(Utils.formatError(`Failed to open file with ${editor}: ${error.message}`));
                console.log(filePath); // Fallback to outputting the path
            });

            // Don't wait for the editor to close
            child.unref();
        } catch (error) {
            console.error(Utils.formatError(`Failed to open file: ${error.message}`));
            console.log(filePath); // Fallback to outputting the path
        }
    }

    /**
     * Handle unknown commands or show help
     * @param {string} command - The unknown command
     */
    handleUnknown(command) {
        if (command) {
            console.error(Utils.formatError(`Unknown command: ${command}`));
        }
        this.showHelp();
        process.exit(1);
    }

    /**
     * Show help information
     */
    showHelp() {
        console.log(`
Jump CLI - Quick navigation with bookmarks

Usage:
  jump create <path> <alias>    Create a new bookmark
  jump to <alias>               Navigate to a bookmark
  jump list                     List all bookmarks
  jump remove <alias>           Remove a bookmark
  jump --help                   Show this help

Examples:
  jump create /var/www/project WORK
  jump create ~/documents/notes.txt NOTES
  jump list
  jump to WORK
  jump remove WORK

Shell Integration:
  Add this to your ~/.bashrc or ~/.zshrc for directory navigation:
  
  function jump() {
      local result=$(jump-cli "$@")
      if [[ "$1" == "to" && -d "$result" ]]; then
          cd "$result"
      else
          echo "$result"
      fi
  }
        `);
    }
}

module.exports = Commands;