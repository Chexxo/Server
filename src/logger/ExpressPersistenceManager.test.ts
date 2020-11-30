jest.mock("fs");

import fs = require("fs");
import { UUIDFactory } from "../helpers/UUIDFactory";
import { LogLevel } from "../shared/logger/Logger";
import { ConnectionRefusedError } from "../shared/types/errors/ConnectionRefusedError";
import { LogEntry } from "../shared/types/logger/LogEntry";
import { ExpressPersistenceManager } from "./ExpressPersistenceManager";
import { ExpressPersistenceManagerConfig } from "./ExpressPersistenceManagerConfig";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fsAny = <any>fs;

let persistence: ExpressPersistenceManager;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let MOCK_FILE_INFO = <any>{
  "/path/to/file1.js": 'console.log("file1 contents");',
  "/path/to/file2.txt": "file2 contents",
};

const logEntryInfo = new LogEntry(LogLevel.INFO, Date.now(), "Hello Info!");
const logEntryWarning = new LogEntry(
  LogLevel.WARNING,
  Date.now(),
  "Hello Warning!"
);
const logEntryError = new LogEntry(LogLevel.ERROR, Date.now(), "Hello Error!");

const consoleSave = global.console;
let requestUuid: string;

beforeAll(() => {
  global.console = <Console>(<unknown>{
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  });
});

beforeEach(() => {
  jest.resetAllMocks();
  fsAny.__setMockFiles(MOCK_FILE_INFO);
  persistence = new ExpressPersistenceManager(
    new ExpressPersistenceManagerConfig()
  );
  requestUuid = UUIDFactory.uuidv4();
});

describe("save()", () => {
  test("Writes info to console", () => {
    persistence.save(requestUuid, logEntryInfo);
    return persistence.save(requestUuid, logEntryInfo).then(() => {
      expect(global.console.log).toHaveBeenLastCalledWith(
        expect.stringMatching(/Hello Info!/)
      );
    });
  });

  test("Writes warning to console", () => {
    return persistence.save(requestUuid, logEntryWarning).then(() => {
      expect(global.console.warn).toHaveBeenLastCalledWith(
        expect.stringMatching(/Hello Warning!/)
      );
    });
  });

  test("Writes error to console", () => {
    persistence.save(requestUuid, logEntryError);
    return persistence.save(requestUuid, logEntryError).then(() => {
      expect(global.console.error).toHaveBeenLastCalledWith(
        expect.stringMatching(/Hello Error!/)
      );
    });
  });

  test("Takes uuid from request", () => {
    const logEntry = new LogEntry(
      LogLevel.ERROR,
      Date.now(),
      "Hello",
      new ConnectionRefusedError()
    );
    return persistence.save("abc123", logEntry).then(() => {
      expect(global.console.error).toHaveBeenLastCalledWith(
        expect.stringMatching(/\[abc123\]/)
      );
    });
  });
});

describe("persistence()", () => {
  test("Does not persist info", () => {
    return persistence.save(requestUuid, logEntryInfo).then(() => {
      expect(fsAny.promises.appendFile).toHaveBeenCalledTimes(0);
    });
  });

  test("Writes warning to both log files", () => {
    return persistence.save(requestUuid, logEntryWarning).then(() => {
      expect(fsAny.promises.appendFile).toHaveBeenCalledTimes(2);
    });
  });

  test("Writes error to both log files", () => {
    return persistence.save(requestUuid, logEntryError).then(() => {
      expect(fsAny.promises.appendFile).toHaveBeenCalledTimes(2);
    });
  });

  test("Writes dir if not exists", () => {
    persistence = new ExpressPersistenceManager(
      new ExpressPersistenceManagerConfig(7, "./nolog/")
    );
    return persistence.save(requestUuid, logEntryError).then(() => {
      expect(fsAny.promises.mkdirMock).toHaveBeenCalledWith("./nolog/");
    });
  });

  test("Catches error if dir exists.", () => {
    persistence = new ExpressPersistenceManager(
      new ExpressPersistenceManagerConfig(7, "./errorPath/mkdir/")
    );
    return persistence.save(requestUuid, logEntryError).then(() => {
      expect(console.warn).not.toHaveBeenCalled();
    });
  });

  test("Does not catch unhandled mkdir error.", () => {
    persistence = new ExpressPersistenceManager(
      new ExpressPersistenceManagerConfig(7, "./errorPath/mkdir/other/")
    );
    return persistence.save(requestUuid, logEntryError).then(() => {
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringMatching(/Log could not be persisted./)
      );
    });
  });

  test("Writes message on log error", () => {
    persistence = new ExpressPersistenceManager(
      new ExpressPersistenceManagerConfig(7, "./errorPath/")
    );
    return persistence.save(requestUuid, logEntryError).then(() => {
      expect(global.console.warn).toHaveBeenLastCalledWith(
        expect.stringMatching(/Log could not be persisted./)
      );
    });
  });
});

describe("logrotate()", () => {
  test("Deletes old files", () => {
    MOCK_FILE_INFO = {
      "./log/2020-10-05_human.log": 'console.log("file1 contents");',
      "/path/to/file2.txt": "file2 contents",
    };
    fsAny.__setMockFiles(MOCK_FILE_INFO);
    return persistence.save(requestUuid, logEntryError).then(() => {
      expect(fs.promises.unlink).toHaveBeenLastCalledWith(
        "./log/2020-10-05_human.log"
      );
    });
  });

  test("Does not delete old files more than once a day.", () => {
    MOCK_FILE_INFO = {
      "./log/2020-10-05_human.log": 'console.log("file1 contents");',
      "/path/to/file2.txt": "file2 contents",
    };
    fsAny.__setMockFiles(MOCK_FILE_INFO);
    persistence["logRotateTime"] = Date.now();
    return persistence.save(requestUuid, logEntryError).then(() => {
      expect(fs.promises.unlink).not.toHaveBeenCalled();
    });
  });

  test("Deletes multiple files", () => {
    MOCK_FILE_INFO = {
      "./log/2020-10-05_human.log": 'console.log("file1 contents");',
      "./log/2020-10-06_human.log": 'console.log("file1 contents");',
      "/path/to/file2.txt": "file2 contents",
    };
    fsAny.__setMockFiles(MOCK_FILE_INFO);
    return persistence.save(requestUuid, logEntryError).then(() => {
      expect(fs.promises.unlink).toHaveBeenCalledTimes(2);
    });
  });

  test("Writes message on file removed", () => {
    MOCK_FILE_INFO = {
      "./log/2020-10-05_human.log": 'console.log("file1 contents");',
      "/path/to/file2.txt": "file2 contents",
    };
    fsAny.__setMockFiles(MOCK_FILE_INFO);
    return persistence.save(requestUuid, logEntryError).then(() => {
      expect(global.console.log).toHaveBeenLastCalledWith(
        expect.stringMatching(/has been removed./)
      );
    });
  });

  test("Does not delete files which aren't expired", () => {
    const year = new Date().getFullYear() + 5;
    const fileString = `./log/${year}-10-05_human.log`;
    MOCK_FILE_INFO = {
      "/path/to/file2.txt": "file2 contents",
    };
    MOCK_FILE_INFO[fileString] = 'console.log("file1 contents");';
    fsAny.__setMockFiles(MOCK_FILE_INFO);
    return persistence.save(requestUuid, logEntryError).then(() => {
      expect(fs.promises.unlink).not.toHaveBeenCalled();
    });
  });

  test("Does not delete invalid files", () => {
    MOCK_FILE_INFO = {
      "./log/human.txt": "Test file",
      "/path/to/file2.txt": "file2 contents",
    };
    fsAny.__setMockFiles(MOCK_FILE_INFO);
    persistence.save(requestUuid, logEntryError);
    return persistence.save(requestUuid, logEntryError).then(() => {
      expect(fs.promises.unlink).not.toHaveBeenCalled();
    });
  });
});

afterAll(() => {
  global.console = consoleSave;
});
