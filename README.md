# Jump CLI

A Node.js CLI tool to bookmark directories and files with aliases for quick navigation.

## Features

- **Create Bookmark**: `jump create <path> <alias>` - Bookmark any directory or file
- **Navigate**: `jump to <alias>` - Quickly jump to bookmarked locations
- **List**: `jump list` - See all your bookmarks in a table
- **Remove**: `jump remove <alias>` - Delete bookmarks you no longer need

## Installation

### Development Setup

#!! Make SURE to run npm test BEFORE commiting to git!!

1. Clone the repository:
   ```bash
   git clone https://github.com/EliasL-git/jump-cli
   cd jump-cli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link for local development:
   ```bash
   npm link
   ```

### Global Installation (when published)

```bash
npm install -g jump-cli-beta
```

## Usage

### Basic Commands

```bash
# Create a bookmark for a directory
jump create /var/www/project WORK

# Create a bookmark for a file
jump create ~/documents/notes.txt NOTES

# List all bookmarks
jump list

# Navigate to a bookmark (outputs path)
jump to WORK

# Remove a bookmark
jump remove WORK
```

### Shell Integration

For the `jump to` command to change directories in your current shell, add this function to your `~/.bashrc` or `~/.zshrc`:

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

After adding this function, you can use:
```bash
jump to WORK  # This will actually change your current directory
```

## Storage

Bookmarks are stored locally in a JSON file at `~/.jump.json`:

```json
{
  "WORK": "/var/www/project",
  "NOTES": "/home/user/documents/notes.txt"
}
```

## Requirements

- Node.js 16 or higher
- npm (comes with Node.js)

## Project Structure

```
jump-cli/
├── bin/
│   └── jump.js           # CLI entry point
├── lib/
│   ├── bookmarks.js      # CRUD operations for bookmarks
│   ├── storage.js        # JSON file handling
│   ├── utils.js          # Helper functions
│   └── commands.js       # CLI command implementations
├── package.json
├── README.md
└── .gitignore
```

## License

MIT
