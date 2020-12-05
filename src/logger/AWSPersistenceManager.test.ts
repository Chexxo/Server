import { LogLevel } from "../shared/logger/Logger";
import { ConnectionRefusedError } from "../shared/types/errors/ConnectionRefusedError";
import { LogEntry } from "../shared/types/logger/LogEntry";
import { AWSPersistenceManager } from "./AWSPersistenceManager";

const requestUuid = "abc123";
let persistence: AWSPersistenceManager;

const logEntryInfo = new LogEntry(
  requestUuid,
  LogLevel.INFO,
  Date.now(),
  "Hello Info!"
);
const logEntryWarning = new LogEntry(
  requestUuid,
  LogLevel.WARNING,
  Date.now(),
  "Hello Warning!"
);
const logEntryError = new LogEntry(
  requestUuid,
  LogLevel.ERROR,
  Date.now(),
  "Hello Error!"
);

const consoleSave = global.console;

beforeAll(() => {
  global.console = <Console>(<unknown>{
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  });
});

beforeEach(() => {
  jest.resetAllMocks();
  persistence = new AWSPersistenceManager();
});

test("Does not contain uuid from request", () => {
  const logEntry = new LogEntry(
    requestUuid,
    LogLevel.ERROR,
    Date.now(),
    "Hello",
    new ConnectionRefusedError()
  );
  persistence.save(logEntry);
  expect(global.console.error).toHaveBeenLastCalledWith(
    expect.not.stringMatching(/\[abc123\]/)
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
  expect(global.console.warn).toHaveBeenLastCalledWith(
    expect.stringMatching(/Hello Warning!/)
  );
});

test("Writes error to console", () => {
  persistence.save(logEntryError);
  expect(global.console.error).toHaveBeenLastCalledWith(
    expect.stringMatching(/Hello Error!/)
  );
});

afterAll(() => {
  global.console = consoleSave;
});
