import { LogEntry } from "../shared/types/logger/LogEntry";
import { LogLevel } from "../shared/logger/Logger";
import { LogFactory } from "../shared/logger/LogFactory";
import { LoggerPersistenceManager } from "../shared/logger/LoggerPersistenceManager";

/**
 * Class to persist logs in AWS. Since AWS has it's own
 * log mechanisms this manager only has to convey the log
 * messages to the console.
 */
export class AWSPersistenceManager implements LoggerPersistenceManager {
  /**
   * Logs the given {@link LogEntry} to the console.
   *
   * @param logEntry The log entry to be persisted.
   */
  public save(logEntry: LogEntry): void {
    const logEntryReadable = LogFactory.formatLogEntry(logEntry, true);
    let logFunction;
    switch (logEntry.logLevel) {
      case LogLevel.WARNING:
        logFunction = console.warn;
        break;
      case LogLevel.INFO:
        logFunction = console.log;
        break;
      default:
        logFunction = console.error;
    }
    logFunction(logEntryReadable);
  }
}
