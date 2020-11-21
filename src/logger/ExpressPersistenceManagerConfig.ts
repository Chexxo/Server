export class ExpressPersistenceManagerConfig {
  public constructor(
    readonly logDays = 7,
    readonly logDir = "./log/",
    readonly logFileSystem = "system.log",
    readonly logFileHuman = "human.log"
  ) {}
}
