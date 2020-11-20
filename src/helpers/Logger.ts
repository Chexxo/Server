import { CodedError } from "../types/CommonTypes/errors/CodedError";
import { LogEntry } from "../types/CommonTypes/logger/LogEntry";
import { LoggerPersistenceManager } from "./LoggerPersistenceManager";

export enum LogLevel {
  ERROR,
  WARNING,
  INFO,
}

export class Logger {
  constructor(readonly persistence: LoggerPersistenceManager) {}

  public log(logLevel: LogLevel, message: string, error?: CodedError): void {
    const millisecTimestamp = Date.now();
    const logEntry = new LogEntry(logLevel, millisecTimestamp, message, error);
    this.persistence.save(logEntry);
  }

  public static logLevelToString(logLevel: LogLevel): string {
    switch (logLevel) {
      case LogLevel.ERROR:
        return "err";
      case LogLevel.WARNING:
        return "warn";
      case LogLevel.INFO:
        return "info";
      default:
        return "unknown";
    }
  }

  public static formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    const millisec = String(date.getMilliseconds()).padStart(3, "0");
    return (
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second +
      " +" +
      millisec
    );
  }

  public static formatLogEntry(logEntry: LogEntry, uuid?: string): string {
    let uuidString = "";
    if (uuid) {
      uuidString = "[" + uuid + "]";
    }

    let errorString = "";
    if (logEntry.error) {
      errorString =
        `    Error: ${logEntry.error.name}[${logEntry.error.code}]\n` +
        `        Message: ${logEntry.error.message}\n` +
        `        Trace:   ${logEntry.error.stack.replace(
          /\n/g,
          "\n                 "
        )}`;
    }

    const humanReadable =
      "(" +
      Logger.formatTimestamp(logEntry.millisecTimestamp) +
      ")" +
      uuidString +
      "[" +
      Logger.logLevelToString(logEntry.logLevel) +
      "] " +
      logEntry.message +
      "\n" +
      errorString;

    return humanReadable;
  }
}
