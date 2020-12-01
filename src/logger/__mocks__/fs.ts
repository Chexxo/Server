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
    const dir = path.dirname(file) + "/";

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }
    mockFiles[dir].push(path.basename(file));
  }
}

fs.promises = {
  mkdirMock: jest.fn(),
  readdir: (directoryPath: string): string[] => {
    if (directoryPath === "./errorPath/") {
      throw new Error();
    }
    return mockFiles[directoryPath] || [];
  },
  mkdir: (directoryPath: string) => {
    fs.promises.mkdirMock(directoryPath);
    if (directoryPath === "./errorPath/mkdir/") {
      console.error("Hello1");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = <any>new Error();
      e.code = "EEXIST";
      throw e;
    } else if (directoryPath === "./errorPath/mkdir/other/") {
      console.error("Hello2");
      throw new Error();
    }
  },
  appendFile: jest.fn(),
  unlink: jest.fn(),
};

fs.__setMockFiles = __setMockFiles;

module.exports = fs;
