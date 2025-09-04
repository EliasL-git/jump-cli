#!/usr/bin/env node

const { Command } = require('commander');
const Commands = require('../lib/commands');
const packageJson = require('../package.json');

const program = new Command();
const commands = new Commands();

program
    .name('jump-cli-beta')
    .description('CLI tool to bookmark directories and files with aliases for quick navigation')
    .version(packageJson.version);

// Create command
program
    .command('create <path> <alias>')
    .description('Create a new bookmark')
    .action((path, alias) => {
        commands.create(path, alias);
    });

// To command (navigation)
program
    .command('to <alias>')
    .description('Navigate to a bookmark')
    .action((alias) => {
        commands.to(alias);
    });

// List command
program
    .command('list')
    .description('List all bookmarks')
    .action(() => {
        commands.list();
    });

// Remove command
program
    .command('remove <alias>')
    .alias('rm')
    .description('Remove a bookmark')
    .action((alias) => {
        commands.remove(alias);
    });

// Help command
program
    .command('help')
    .description('Show help information')
    .action(() => {
        commands.showHelp();
    });

// Parse command line arguments
program.parse(process.argv);

// If no command provided, show help
if (!process.argv.slice(2).length) {
    commands.showHelp();
}