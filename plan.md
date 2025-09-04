# Jump CLI Tool Plan (Multifile Version)

## Overview

Jump is a Node.js CLI tool to bookmark directories and files with aliases for quick navigation. This version uses a multifile structure for maintainability and scalability.

## Prerequisites

* Node.js (version 16 or higher)
* npm (comes with Node.js)
* Git (for development)

## Dependencies

* `commander` or `yargs` - CLI argument parsing
* `fs` (built-in) - File system operations for JSON storage
* `path` (built-in) - Path manipulation and validation
* `os` (built-in) - Home directory detection
* `child_process` (built-in) - Optional file opening functionality

## Project Structure

```
jump-cli/
│
├─ bin/
│   └─ jump.js           # CLI entry point, executable
│
├─ lib/
│   ├─ bookmarks.js      # CRUD for bookmarks (create, read, update, delete)
│   ├─ storage.js        # Handles reading/writing JSON file (~/.jump.json)
│   ├─ utils.js          # Helper functions (path validation, formatting)
│   └─ commands.js       # Logic for CLI commands (create, to, list, remove)
│
├─ package.json
├─ README.md
└─ .gitignore
```

## Features

* **Create Bookmark:** `jump create <path> <alias>`
* **Go To Bookmark:** `jump to <alias>`
* **List Bookmarks:** `jump list`
* **Remove Bookmark:** `jump remove <alias>`
* **Open File Bookmark:** Optionally open a file in the default editor.

## Storage

* Bookmarks stored locally in JSON: `~/.jump.json`

```json
{
  "PERSONAL": "/var/www/mycoolfile.txt",
  "WORK": "/home/user/work"
}
```

## CLI Commands

### Create

```
jump create <path> <alias>
```

* Validates path exists
* Adds entry to JSON
* Confirms creation

### Go To

```
jump to <alias>
```

* Checks if alias exists
* If directory → outputs path for `cd`
* If file → optionally open with `$EDITOR`
* Example shell function wrapper:

```bash
function jump() { cd "$(jump-cli "$@")"; }
```

### List

```
jump list
```

* Outputs all bookmarks in table format

### Remove

```
jump remove <alias>
```

* Removes alias from JSON
* Confirms deletion

## Implementation

* Node.js + `commander` or `yargs` for CLI parsing
* `fs` for JSON storage
* `path` for path handling
* Optional `child_process` for opening files
* Multifile design for maintainability

## Extra Features (Optional)

* Search bookmarks by partial alias or path
* Tag bookmarks (e.g., work, personal)
* Export/import bookmarks

## Installation

* Publish as npm package
* Users install globally: `npm install -g jump-cli`

### Development Setup

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Link for local development: `npm link`
4. Run tests: `npm test`
5. Build: `npm run build` (if build step needed)

## Development Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Implement changes following the project structure
3. Add unit tests for new functionality
4. Run linter: `npm run lint`
5. Run tests: `npm test`
6. Create pull request

## Testing Strategy

* Unit tests for each module in `lib/`
* Integration tests for CLI commands
* Test framework: Jest or Mocha
* Coverage target: 80%+
* Test files: `test/` or `__tests__/` directory

## Usage Example

```
jump create /var/www/mycoolfile.txt PERSONAL
jump list
jump to PERSONAL  # outputs path or opens file
jump remove PERSONAL
```

## Notes

* Changing the parent shell's directory requires a shell wrapper.
* Multifile structure allows easy addition of new features in the future.

## Troubleshooting

### Common Issues

* **Permission denied**: Check file permissions for ~/.jump.json
* **Command not found**: Ensure global npm installation or use npx
* **Path not found**: Verify bookmarked paths still exist

### Shell Integration

For the `jump to` command to change directories in the current shell, add this to ~/.bashrc or ~/.zshrc:

```bash
function jump() {
    local result=$(jump-cli "$@")
    if [[ "$1" == "to" && -d "$result" ]]; then
        cd "$result"
    else
        echo "$result"
    fi
}
```

## Version Control

* Use semantic versioning (semver)
* Tag releases: `git tag -a v1.0.0 -m "Release version 1.0.0"`
* Maintain changelog in CHANGELOG.md
* Use conventional commits for clear history

## Future Enhancements

* **v1.1**: Search functionality and fuzzy matching
* **v1.2**: Tag system for categorizing bookmarks
* **v1.3**: Import/export functionality
* **v2.0**: Cloud synchronization between devices
