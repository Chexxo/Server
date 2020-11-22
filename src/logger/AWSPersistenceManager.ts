import { LogEntry } from "../shared/types/logger/LogEntry";
import { Logger, LogLevel } from "../shared/logger/Logger";
import { UUIDFactory } from "../helpers/UUIDFactory";

/**
 * Class to persist logs in AWS. Since AWS has it's own
 * log mechanisms this manager only has to convey the log
 * messages to the console.
 */
export class AWSPersistenceManager {
  /**
   * Logs the given {@link LogEntry} to the console.
   *
   * @param logEntry The log entry to be persisted.
   */
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
