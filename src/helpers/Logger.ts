import UUIDFactory from "./UUIDFactory";

export enum LogLevel {
  ERROR,
  WARNING,
  INFO,
}

export default abstract class Logger {
  public static log(
    logLevel: LogLevel,
    message: string,
    object?: unknown
  ): void {
    const date = new Date(Date.now());
    console.log(
      "(" +
        Logger.formatDate(date) +
        ") " +
        "[" +
        Logger.logLevelToString(logLevel) +
        "] " +
        message +
        "\n",
      object
    );
    console.log(UUIDFactory.uuidv4());
    if (logLevel < LogLevel.INFO) {
      console.log("yeet");
    }
  }

  private static logLevelToString(logLevel: LogLevel): string {
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

  private static formatDate(date: Date): string {
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
}
