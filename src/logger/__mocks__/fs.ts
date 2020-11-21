import path = require("path");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fs = <any>jest.createMockFromModule("fs");

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles: string[]) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath: string): string[] {
  if (directoryPath === "./errorPath/") {
    throw new Error();
  }
  return mockFiles[directoryPath] || [];
}

function existsSync(dir: string): boolean {
  if (dir === "./nolog/") {
    return false;
  }
  return true;
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.existsSync = existsSync;
fs.mkdirSync = jest.fn();
fs.appendFileSync = jest.fn();
fs.unlinkSync = jest.fn();

module.exports = fs;
