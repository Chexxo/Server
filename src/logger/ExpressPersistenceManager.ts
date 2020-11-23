import { LogEntry } from "../shared/types/logger/LogEntry";
import { LogLevel } from "../shared/logger/Logger";
import { UUIDFactory } from "../helpers/UUIDFactory";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
} from "fs";
import { ExpressPersistenceManagerConfig } from "./ExpressPersistenceManagerConfig";
import { LogFactory } from "../shared/logger/LogFactory";

/**
 * Class to persist logs when using Express. The logs
 * are written into the log subfolder and also conveyed to
 * the console.
 */
export class ExpressPersistenceManager {
  private static millisecondsADay = 86_400_000;

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
   * @param logEntry The log entry to be persisted.
   */
  public save(logEntry: LogEntry): void {
    let uuid = null;
    if (logEntry.error) {
      uuid = logEntry.error.uuid;
    } else if (logEntry.logLevel < LogLevel.INFO) {
      uuid = UUIDFactory.uuidv4();
    }

    const logEntryReadable = LogFactory.formatLogEntry(logEntry, uuid);
    console.log(logEntryReadable);
    if (logEntry.logLevel < LogLevel.INFO) {
      try {
        if (!existsSync(this.config.logDir)) {
          mkdirSync(this.config.logDir);
        }

        this.logRotate();
        this.writeLog(logEntry);
        this.writeLogReadable(logEntryReadable);
      } catch (e) {
        const noLogEntryMessage = new LogEntry(
          LogLevel.WARNING,
          Date.now(),
          "Log could not be persisted."
        );
        const noLogEntryMessageReadable = LogFactory.formatLogEntry(
          noLogEntryMessage,
          UUIDFactory.uuidv4()
        );
        console.log(noLogEntryMessageReadable);
      }
    }
  }

  /**
   * Writes a {@link LogEntry} to the system readable
   * log file.
   * @param logEntry The log entry to be written.
   */
  private writeLog(logEntry: LogEntry) {
    appendFileSync(
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
  private writeLogReadable(logEntry: string) {
    appendFileSync(
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
   */
  private logRotate(): void {
    const files = readdirSync(this.config.logDir);
    const deadline =
      Date.parse(ExpressPersistenceManager.getDatePrefix()) -
      this.config.logDays * ExpressPersistenceManager.millisecondsADay;
    files.forEach((file) => {
      const millisecondTimestamp = ExpressPersistenceManager.getTimestampFromFilename(
        file
      );
      if (millisecondTimestamp !== null && millisecondTimestamp <= deadline) {
        unlinkSync(this.config.logDir + file);
        const removedFileInfo = new LogEntry(
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
