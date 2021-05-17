import { LogEntry } from "../shared/types/logger/LogEntry";
import { LogLevel } from "../shared/logger/Logger";
import { ExpressPersistenceManagerConfig } from "./ExpressPersistenceManagerConfig";
import { LogFactory } from "../shared/logger/LogFactory";
import { LoggerPersistenceManager } from "../shared/logger/LoggerPersistenceManager";
// eslint-disable-next-line import/no-unresolved
import { promises } from "fs";
import { UUIDFactory } from "../helpers/UUIDFactory";

/**
 * Class to persist logs when using Express. The logs
 * are written into the log subfolder and also conveyed to
 * the console.
 */
export class ExpressPersistenceManager implements LoggerPersistenceManager {
  private static millisecondsADay = 86_400_000;
  private logRotateTime = 0;

  /**
   * Constructs a persistence manager with the configuration
   * given.
   *
   * @param config The config which will be used to persist the logs.
   */
  public constructor(private config: ExpressPersistenceManagerConfig) {}

  /**
   * Persists the given {@link LogEntry}. Dependent on the {@link LogLevel}
   * the log will be written to the console and a logfile or just to the
   * console.
   *
   * Be aware that this function is not awaited by the parent and therefore
   * some logs might not be persisted to file if the express server is
   * shutdown whilst requests are still coming in.
   *
   * @param logEntry The log entry to be persisted.
   */
  public async save(logEntry: LogEntry): Promise<void> {
    const logEntryReadable = LogFactory.formatLogEntry(logEntry);
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

    if (logEntry.logLevel < LogLevel.INFO) {
      await this.persist(logEntry, logEntryReadable);
    }
  }

  /**
   * Persists the given values on a log file on disk.
   * Also calls logrotate if necessary.
   *
   * @param logEntry The log entry to be persistet.
   * @param logEntryReadable The human readable
   * version of the log entry.
   */
  private async persist(logEntry: LogEntry, logEntryReadable: string) {
    try {
      try {
        await promises.mkdir(this.config.logDir);
      } catch (e) {
        if (e.code !== "EEXIST") {
          throw e;
        }
      }

      const yesterday = Date.now() - ExpressPersistenceManager.millisecondsADay;
      if (this.logRotateTime < yesterday) {
        await this.logRotate(logEntry.requestUuid);
        this.logRotateTime = Date.now();
      }
      this.writeLog(logEntry);
      this.writeLogReadable(logEntryReadable);
    } catch (e) {
      const noLogEntryMessage = new LogEntry(
        UUIDFactory.uuidv4(),
        LogLevel.WARNING,
        Date.now(),
        "Log could not be persisted."
      );
      const noLogEntryMessageReadable =
        LogFactory.formatLogEntry(noLogEntryMessage);
      console.warn(noLogEntryMessageReadable);
    }
  }

  /**
   * Writes a {@link LogEntry} to the system readable
   * log file.
   *
   * @param logEntry The log entry to be written.
   */
  private async writeLog(logEntry: LogEntry) {
    await promises.appendFile(
      this.config.logDir +
        ExpressPersistenceManager.getDatePrefix() +
        "_" +
        this.config.logFileSystem,
      JSON.stringify(logEntry) + "\n"
    );
  }

  /**
   * Writes a string to the human readable
   * log file.
   * @param logEntry The string to be written.
   */
  private async writeLogReadable(logEntry: string) {
    await promises.appendFile(
      this.config.logDir +
        ExpressPersistenceManager.getDatePrefix() +
        "_" +
        this.config.logFileHuman,
      logEntry + "\n"
    );
  }

  /**
   * Removes expired log files according to the
   * configuration provided in the {@link ExpressPersistenceManagerConfig}.
   *
   * @param requestUuid The uuid of the request which lead to this rotate.
   */
  private async logRotate(requestUuid: string): Promise<void> {
    const files = await promises.readdir(this.config.logDir);
    const deadline =
      Date.parse(ExpressPersistenceManager.getDatePrefix()) -
      this.config.logDays * ExpressPersistenceManager.millisecondsADay;
    files.forEach(async (file) => {
      const millisecondTimestamp =
        ExpressPersistenceManager.getTimestampFromFilename(file);
      if (millisecondTimestamp !== null && millisecondTimestamp <= deadline) {
        await promises.unlink(this.config.logDir + file);
        const removedFileInfo = new LogEntry(
          requestUuid,
          LogLevel.INFO,
          Date.now(),
          "Logrotate: " + this.config.logDir + file + " has been removed."
        );
        this.save(removedFileInfo);
      }
    });
  }

  /**
   * Creates a date prefix to be used int log files.
   *
   * @returns The created date prefix.
   */
  private static getDatePrefix(): string {
    const date = new Date(Date.now());
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return year + "-" + month + "-" + day;
  }

  /**
   * Extracts the timestamp from the name of a logfile.
   *
   * @param filename The name of the logfile from which the
   * timestamp should be extracted.
   *
   * @returns The timestamp of the date on which the log file
   * was last written.
   */
  private static getTimestampFromFilename(filename: string): number | null {
    const split = filename.split("_");
    const date = Date.parse(split[0]);
    if (isNaN(date)) {
      return null;
    }
    return date;
  }
}
