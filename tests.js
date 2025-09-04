const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Use a temporary bookmarks file for testing
const testBookmarksPath = path.join(os.tmpdir(), 'jump-test.json');

// Test directories and files
const testItems = {
  dir1: '/tmp/jump-test-dir1',
  dir2: '/tmp/jump-test-dir2', 
  file1: '/tmp/jump-test-file.txt',
  file2: '/tmp/jump-test-script.js'
};

// Function to run jump command with test bookmarks
function runJump(args) {
  const env = { 
    ...process.env, 
    JUMP_BOOKMARKS_PATH: testBookmarksPath,
    EDITOR: '' // Unset EDITOR to prevent file opening during tests
  };
  try {
    const result = execSync(`node bin/jump.js ${args}`, { 
      env, 
      encoding: 'utf8', 
      timeout: 5000,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { output: result.trim(), success: true };
  } catch (error) {
    const output = error.stdout ? error.stdout.trim() : '';
    const stderr = error.stderr ? error.stderr.trim() : '';
    return { 
      output: output || stderr, 
      success: false, 
      exitCode: error.status,
      stderr: stderr
    };
  }
}

// Setup test environment
function setup() {
  console.log('🔧 Setting up test environment...');
  
  // Clean up any existing test items first
  cleanup();
  
  // Create test directories
  Object.values(testItems).forEach(item => {
    try {
      if (item.endsWith('.txt') || item.endsWith('.js')) {
        // Create file
        const dir = path.dirname(item);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(item, `Test content for ${path.basename(item)}`);
        console.log(`   Created file: ${item}`);
      } else {
        // Create directory
        fs.mkdirSync(item, { recursive: true });
        console.log(`   Created directory: ${item}`);
      }
    } catch (error) {
      console.error(`   Failed to create ${item}: ${error.message}`);
    }
  });
  console.log('');
}

// Clean up test environment
function cleanup() {
  console.log('🧹 Cleaning up test environment...');
  
  // Remove test bookmarks file
  if (fs.existsSync(testBookmarksPath)) {
    fs.unlinkSync(testBookmarksPath);
    console.log(`   Removed bookmarks file: ${testBookmarksPath}`);
  }
  
  // Remove test directories and files
  Object.values(testItems).forEach(item => {
    try {
      if (fs.existsSync(item)) {
        if (fs.statSync(item).isDirectory()) {
          fs.rmdirSync(item, { recursive: true });
          console.log(`   Removed directory: ${item}`);
        } else {
          fs.unlinkSync(item);
          console.log(`   Removed file: ${item}`);
        }
      }
    } catch (error) {
      console.log(`   Warning: Could not remove ${item}: ${error.message}`);
    }
  });
  console.log('');
}

// Run a single test
function runTest(testNumber, name, command, expectedCondition, description = '') {
  console.log(`Test ${testNumber}: ${name}`);
  if (description) {
    console.log(`   Description: ${description}`);
  }
  console.log(`   Command: jump-cli-beta ${command}`);
  
  const result = runJump(command);
  const passed = expectedCondition(result);
  
  console.log(`   Output: ${result.output || '(no output)'}`);
  if (result.stderr && result.stderr !== result.output) {
    console.log(`   Stderr: ${result.stderr}`);
  }
  
  if (!passed) {
    console.log(`   ❌ FAILED`);
    if (result.exitCode) console.log(`   Exit code: ${result.exitCode}`);
  } else {
    console.log(`   ✅ PASSED`);
  }
  console.log('');
  return passed;
}

// Main test function
function runAllTests() {
  console.log('🚀 Starting jump-cli comprehensive functionality tests...\n');

  setup();

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Create directory bookmark
  totalTests++;
  if (runTest(
    1,
    'Create directory bookmark',
    `create ${testItems.dir1} testdir`,
    (result) => result.success && result.output.includes('created'),
    'Should successfully create a bookmark for a directory'
  )) passedTests++;

  // Test 2: Create file bookmark
  totalTests++;
  if (runTest(
    2,
    'Create file bookmark',
    `create ${testItems.file1} testfile`,
    (result) => result.success && result.output.includes('created'),
    'Should successfully create a bookmark for a file'
  )) passedTests++;

  // Test 3: List bookmarks
  totalTests++;
  if (runTest(
    3,
    'List all bookmarks',
    'list',
    (result) => result.success && result.output.includes('testdir') && result.output.includes('testfile'),
    'Should display all created bookmarks in a table'
  )) passedTests++;

  // Test 4: Navigate to directory bookmark
  totalTests++;
  if (runTest(
    4,
    'Navigate to directory',
    'to testdir',
    (result) => result.success && result.output.includes(testItems.dir1),
    'Should output the directory path for shell navigation'
  )) passedTests++;

  // Test 5: Navigate to file bookmark
  totalTests++;
  if (runTest(
    5,
    'Navigate to file',
    'to testfile',
    (result) => result.success && result.output.includes(testItems.file1),
    'Should output the file path'
  )) passedTests++;

  // Test 6: Remove bookmark
  totalTests++;
  if (runTest(
    6,
    'Remove bookmark',
    'remove testdir',
    (result) => result.success && result.output.includes('removed'),
    'Should successfully remove an existing bookmark'
  )) passedTests++;

  // Test 7: Try to navigate to removed bookmark
  totalTests++;
  if (runTest(
    7,
    'Navigate to removed bookmark (should fail)',
    'to testdir',
    (result) => !result.success && result.output.includes('not found'),
    'Should fail when trying to navigate to a removed bookmark'
  )) passedTests++;

  // Test 8: Create bookmark with existing alias (should fail)
  totalTests++;
  if (runTest(
    8,
    'Create duplicate alias (should fail)',
    `create ${testItems.dir2} testfile`,
    (result) => !result.success && result.output.includes('already exists'),
    'Should fail when trying to create a bookmark with an existing alias'
  )) passedTests++;

  // Test 9: Create bookmark with invalid path (should fail)
  totalTests++;
  if (runTest(
    9,
    'Create bookmark with invalid path (should fail)',
    'create /this/path/does/not/exist invalid',
    (result) => !result.success && result.output.includes('does not exist'),
    'Should fail when trying to bookmark a non-existent path'
  )) passedTests++;

  // Test 10: Help command
  totalTests++;
  if (runTest(
    10,
    'Display help',
    'help',
    (result) => result.success && (result.output.includes('Usage') || result.output.includes('Commands')),
    'Should display help information'
  )) passedTests++;

  // Test 11: Create another bookmark and test listing
  totalTests++;
  if (runTest(
    11,
    'Create second file bookmark',
    `create ${testItems.file2} script`,
    (result) => result.success && result.output.includes('created'),
    'Should create a second bookmark for testing'
  )) passedTests++;

  // Test 12: Verify both bookmarks in list
  totalTests++;
  if (runTest(
    12,
    'List multiple bookmarks',
    'list',
    (result) => result.success && result.output.includes('testfile') && result.output.includes('script'),
    'Should list all remaining bookmarks'
  )) passedTests++;

  // Test 13: Remove all remaining bookmarks
  totalTests++;
  if (runTest(
    13,
    'Remove remaining bookmarks',
    'remove testfile',
    (result) => result.success && result.output.includes('removed'),
    'Should remove the first remaining bookmark'
  )) passedTests++;

  totalTests++;
  if (runTest(
    14,
    'Remove last bookmark',
    'remove script',
    (result) => result.success && result.output.includes('removed'),
    'Should remove the last bookmark'
  )) passedTests++;

  // Test 15: List empty bookmarks
  totalTests++;
  if (runTest(
    15,
    'List empty bookmarks',
    'list',
    (result) => result.success && (result.output.includes('No bookmarks') || result.output.length === 0),
    'Should handle empty bookmark list gracefully'
  )) passedTests++;

  cleanup();

  // Final report
  console.log('📊 Final Test Results:');
  console.log('═'.repeat(50));
  console.log(`   Total Tests: ${totalTests}`);
  console.log(`   Passed: ${passedTests} ✅`);
  console.log(`   Failed: ${totalTests - passedTests} ❌`);
  console.log(`   Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  console.log('═'.repeat(50));

  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The jump-cli is working perfectly.');
    console.log('📦 Ready for production use!');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
    console.log('🔍 Review the failed tests above for debugging information.');
    process.exit(1);
  }
}

runAllTests();
