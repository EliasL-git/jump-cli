# Jump CLI Tool Plan (Multifile Version)

## Overview

Jump is a Node.js CLI tool to bookmark directories and files with aliases for quick navigation. This version uses a multifile structure for maintainability and scalability.

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
