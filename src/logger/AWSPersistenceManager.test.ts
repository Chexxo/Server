import { UUIDFactory } from "../helpers/UUIDFactory";
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
  global.console = <Console>(<unknown>{
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  });
});

let requestUuid: string;
beforeEach(() => {
  jest.resetAllMocks();
  persistence = new AWSPersistenceManager();
  requestUuid = UUIDFactory.uuidv4();
});

test("Does not contain uuid from request", () => {
  const logEntry = new LogEntry(
    LogLevel.ERROR,
    Date.now(),
    "Hello",
    new ConnectionRefusedError()
  );
  persistence.save("abc123", logEntry);
  expect(global.console.error).toHaveBeenLastCalledWith(
    expect.not.stringMatching(/\[abc123\]/)
  );
});

test("Writes info to console", () => {
  persistence.save(requestUuid, logEntryInfo);
  expect(global.console.log).toHaveBeenLastCalledWith(
    expect.stringMatching(/Hello Info!/)
  );
});

test("Writes warning to console", () => {
  persistence.save(requestUuid, logEntryWarning);
  expect(global.console.warn).toHaveBeenLastCalledWith(
    expect.stringMatching(/Hello Warning!/)
  );
});

test("Writes error to console", () => {
  persistence.save(requestUuid, logEntryError);
  expect(global.console.error).toHaveBeenLastCalledWith(
    expect.stringMatching(/Hello Error!/)
  );
});

afterAll(() => {
  global.console = consoleSave;
});
