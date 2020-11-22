jest.mock("fs");

import fs = require("fs");
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

beforeAll(() => {
  global.console = <Console>(<unknown>{ log: jest.fn() });
});

beforeEach(() => {
  jest.resetAllMocks();
  fsAny.__setMockFiles(MOCK_FILE_INFO);
  persistence = new ExpressPersistenceManager(
    new ExpressPersistenceManagerConfig()
  );
});

test("Writes info to console", () => {
  persistence.save(logEntryInfo);
  expect(global.console.log).toHaveBeenLastCalledWith(
    expect.stringMatching(/Hello Info!/)
  );
});

test("Writes warning to console", () => {
  persistence.save(logEntryWarning);
  expect(global.console.log).toHaveBeenLastCalledWith(
    expect.stringMatching(/Hello Warning!/)
  );
});

test("Writes error to console", () => {
  persistence.save(logEntryError);
  expect(global.console.log).toHaveBeenLastCalledWith(
    expect.stringMatching(/Hello Error!/)
  );
});

test("Writes error to both log files", () => {
  persistence.save(logEntryError);
  expect(fsAny.appendFileSync).toHaveBeenCalledTimes(2);
});

test("Writes warning to both log files", () => {
  persistence.save(logEntryWarning);
  expect(fsAny.appendFileSync).toHaveBeenCalledTimes(2);
});

test("Does not write info to file", () => {
  persistence.save(logEntryInfo);
  expect(fsAny.appendFileSync).not.toHaveBeenCalled();
});

test("Takes uuid from error", () => {
  const logEntry = new LogEntry(
    LogLevel.ERROR,
    Date.now(),
    "Hello",
    new ConnectionRefusedError("abc123")
  );
  persistence.save(logEntry);
  expect(global.console.log).toHaveBeenLastCalledWith(
    expect.stringMatching(/\[abc123\]/)
  );
});

test("Writes dir if not exists", () => {
  persistence = new ExpressPersistenceManager(
    new ExpressPersistenceManagerConfig(7, "./nolog/")
  );
  persistence.save(logEntryError);
  expect(fsAny.mkdirSync).toHaveBeenCalledWith("./nolog/");
});

test("Does not write dir if exists", () => {
  persistence.save(logEntryError);
  expect(fsAny.mkdirSync).not.toHaveBeenCalled();
});

test("Writes message on log error", () => {
  persistence = new ExpressPersistenceManager(
    new ExpressPersistenceManagerConfig(7, "./errorPath/")
  );
  persistence.save(logEntryError);
  expect(global.console.log).toHaveBeenLastCalledWith(
    expect.stringMatching(/Log could not be persisted./)
  );
});

test("Deletes old files", () => {
  MOCK_FILE_INFO = {
    "./log/2020-10-05_human.log": 'console.log("file1 contents");',
    "/path/to/file2.txt": "file2 contents",
  };
  fsAny.__setMockFiles(MOCK_FILE_INFO);
  persistence.save(logEntryError);
  expect(fs.unlinkSync).toHaveBeenLastCalledWith("./log/2020-10-05_human.log");
});

test("Writes message on file removed", () => {
  MOCK_FILE_INFO = {
    "./log/2020-10-05_human.log": 'console.log("file1 contents");',
    "/path/to/file2.txt": "file2 contents",
  };
  fsAny.__setMockFiles(MOCK_FILE_INFO);
  persistence.save(logEntryError);
  expect(global.console.log).toHaveBeenLastCalledWith(
    expect.stringMatching(/has been removed./)
  );
});

test("Does not delete files which aren't expired", () => {
  const year = new Date().getFullYear() + 5;
  const fileString = `./log/${year}-10-05_human.log`;
  MOCK_FILE_INFO = {
    "/path/to/file2.txt": "file2 contents",
  };
  MOCK_FILE_INFO[fileString] = 'console.log("file1 contents");';
  fsAny.__setMockFiles(MOCK_FILE_INFO);
  persistence.save(logEntryError);
  expect(fs.unlinkSync).not.toHaveBeenCalled();
});

test("Does not delete invalid files", () => {
  MOCK_FILE_INFO = {
    "./log/human.txt": "Test file",
    "/path/to/file2.txt": "file2 contents",
  };
  fsAny.__setMockFiles(MOCK_FILE_INFO);
  persistence.save(logEntryError);
  expect(fs.unlinkSync).not.toHaveBeenCalled();
});

afterAll(() => {
  global.console = consoleSave;
});
