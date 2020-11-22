import { LogEntry } from "../shared/types/logger/LogEntry";
import { Logger, LogLevel } from "../shared/logger/Logger";
import { UUIDFactory } from "../helpers/UUIDFactory";

export class AWSPersistenceManager {
  public save(logEntry: LogEntry): void {
    let uuid = null;
    if (logEntry.error) {
      uuid = logEntry.error.uuid;
    } else if (logEntry.logLevel < LogLevel.INFO) {
      uuid = UUIDFactory.uuidv4();
    }

    const logEntryReadable = Logger.formatLogEntry(logEntry, uuid);
    console.log(logEntryReadable);
  }
}
