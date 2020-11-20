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

export class ExpressPersistenceManager {
  static readonly millisecondsADay = 86_400_000;

  private logDays = 7;
  private logDir = "./log/";
  private logFileSystem = "system.log";
  private logFileHuman = "human.log";

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
      if (!existsSync(this.logDir)) {
        mkdirSync(this.logDir);
      }

      this.logRotate();
      this.writeEntry(logEntry);
      this.writeString(logEntryReadable);
    }
  }

  public getAll(): LogEntry[] {
    return [];
  }

  private writeEntry(logEntry: LogEntry) {
    appendFileSync(
      this.logDir +
        ExpressPersistenceManager.getCurrentPrefix() +
        "_" +
        this.logFileSystem,
      JSON.stringify(logEntry) + "\n"
    );
  }

  private writeString(logEntry: string) {
    appendFileSync(
      this.logDir +
        ExpressPersistenceManager.getCurrentPrefix() +
        "_" +
        this.logFileHuman,
      logEntry + "\n"
    );
  }

  private logRotate(): void {
    const files = readdirSync(this.logDir);
    const deadline =
      Date.parse(ExpressPersistenceManager.getCurrentPrefix()) -
      this.logDays * ExpressPersistenceManager.millisecondsADay;
    files.forEach((file) => {
      const millisecondTimestamp = ExpressPersistenceManager.getTimestampFromFilename(
        file
      );
      if (millisecondTimestamp !== undefined) {
        if (millisecondTimestamp <= deadline) {
          unlinkSync(this.logDir + file);
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

  private static getTimestampFromFilename(
    filename: string
  ): number | undefined {
    const split = filename.split("_");
    return Date.parse(split[0]);
  }
}
