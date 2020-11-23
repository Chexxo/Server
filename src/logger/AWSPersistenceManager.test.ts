import { LogLevel } from "../shared/logger/Logger";
import { ConnectionRefusedError } from "../shared/types/errors/ConnectionRefusedError";
import { LogEntry } from "../shared/types/logger/LogEntry";
import { AWSPersistenceManager } from "./AWSPersistenceManager";

let persistence: AWSPersistenceManager;

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
  persistence = new AWSPersistenceManager();
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

afterAll(() => {
  global.console = consoleSave;
});
