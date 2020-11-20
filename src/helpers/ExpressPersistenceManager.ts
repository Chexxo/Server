import { LogEntry } from "../types/CommonTypes/logger/LogEntry";
import { Logger, LogLevel } from "./Logger";
import { UUIDFactory } from "./UUIDFactory";
import { appendFileSync } from "fs";

export class ExpressPersistenceManager {
  private logFileSystem = "log/system.log";
  private logFileHuman = "log/human.log";

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
      this.writeEntry(logEntry);
      this.writeString(logEntryReadable);
    }
  }

  public getAll(): LogEntry[] {
    return [];
  }

  private writeEntry(logEntry: LogEntry) {
    appendFileSync(this.logFileSystem, JSON.stringify(logEntry) + "\n");
  }

  private writeString(logEntry: string) {
    appendFileSync(this.logFileHuman, logEntry + "\n");
  }

  private logRotate(): void {
    return;
  }
}
