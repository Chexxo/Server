import { LogEntry } from "../types/CommonTypes/logger/LogEntry";

export interface LoggerPersistenceManager {
  save(logEntry: LogEntry): void;
  getAll(): LogEntry[];
}
