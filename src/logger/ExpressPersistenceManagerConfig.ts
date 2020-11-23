/**
 * Represents the configuration for a {@link ExpressPersistenceManager}.
 */
export class ExpressPersistenceManagerConfig {
  public constructor(
    /**
     * Defines how long logs should be persisted.
     */
    readonly logDays = 7,
    /**
     * The directory where logs should be written to.
     */
    readonly logDir = "./log/",
    /**
     * The suffix of the system-readable logfile.
     */
    readonly logFileSystem = "system.log",
    /**
     * The suffix of the human-readable logfile.
     */
    readonly logFileHuman = "human.log"
  ) {}
}
