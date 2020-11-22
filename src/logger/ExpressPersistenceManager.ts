import { LogEntry } from "../shared/types/logger/LogEntry";
import { Logger, LogLevel } from "../shared/logger/Logger";
import { UUIDFactory } from "../helpers/UUIDFactory";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
} from "fs";
import { ExpressPersistenceManagerConfig } from "./ExpressPersistenceManagerConfig";

export class ExpressPersistenceManager {
  private static millisecondsADay = 86_400_000;

  public constructor(private config: ExpressPersistenceManagerConfig) {}

  public save(logEntry: LogEntry): void {
    let uuid = null;
    if (logEntry.error) {
      uuid = logEntry.error.uuid;
    } else if (logEntry.logLevel < LogLevel.INFO) {
      uuid = UUIDFactory.uuidv4();
    }

    const logEntryReadable = Logger.formatLogEntry(logEntry, uuid);
    console.log(logEntryReadable);
    if (logEntry.logLevel < LogLevel.INFO) {
      try {
        if (!existsSync(this.config.logDir)) {
          mkdirSync(this.config.logDir);
        }

        this.logRotate();
        this.writeEntry(logEntry);
        this.writeString(logEntryReadable);
      } catch (e) {
        const noLogEntryMessage = new LogEntry(
          LogLevel.WARNING,
          Date.now(),
          "Log could not be persisted."
        );
        const noLogEntryMessageReadable = Logger.formatLogEntry(
          noLogEntryMessage,
          null
        );
        console.log("\n" + noLogEntryMessageReadable);
      }
    }
  }

  private writeEntry(logEntry: LogEntry) {
    appendFileSync(
      this.config.logDir +
        ExpressPersistenceManager.getCurrentPrefix() +
        "_" +
        this.config.logFileSystem,
      JSON.stringify(logEntry) + "\n"
    );
  }

  private writeString(logEntry: string) {
    appendFileSync(
      this.config.logDir +
        ExpressPersistenceManager.getCurrentPrefix() +
        "_" +
        this.config.logFileHuman,
      logEntry + "\n"
    );
  }

  private logRotate(): void {
    const files = readdirSync(this.config.logDir);
    const deadline =
      Date.parse(ExpressPersistenceManager.getCurrentPrefix()) -
      this.config.logDays * ExpressPersistenceManager.millisecondsADay;
    files.forEach((file) => {
      const millisecondTimestamp = ExpressPersistenceManager.getTimestampFromFilename(
        file
      );
      if (millisecondTimestamp !== null) {
        if (millisecondTimestamp <= deadline) {
          unlinkSync(this.config.logDir + file);
        }
      }
    });
    return;
  }

  private static getCurrentPrefix(): string {
    const date = new Date(Date.now());
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return year + "-" + month + "-" + day;
  }

  private static getTimestampFromFilename(filename: string): number | null {
    const split = filename.split("_");
    const date = Date.parse(split[0]);
    if (isNaN(date)) {
      return null;
    }
    return date;
  }
}
