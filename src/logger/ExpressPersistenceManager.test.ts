jest.mock("fs");
global.console = <Console>(<unknown>{ log: jest.fn() });

import fs = require("fs");
import { LogLevel } from "../shared/logger/Logger";
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

const logEntryError = new LogEntry(LogLevel.ERROR, Date.now(), "Hello");
const logEntryInfo = new LogEntry(LogLevel.INFO, Date.now(), "Hello");

beforeEach(() => {
  jest.resetAllMocks();
  fsAny.__setMockFiles(MOCK_FILE_INFO);
  persistence = new ExpressPersistenceManager(
    new ExpressPersistenceManagerConfig()
  );
});

test("Writes error to both log files", () => {
  persistence.save(logEntryError);
  expect(fsAny.appendFileSync).toHaveBeenCalledTimes(2);
});

test("Does not write info to file", () => {
  persistence.save(logEntryInfo);
  expect(fsAny.appendFileSync).not.toHaveBeenCalled();
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

test("Writes message on error", () => {
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
  expect(fs.unlinkSync).toHaveBeenLastCalledWith("");
});
