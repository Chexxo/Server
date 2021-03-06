import { APIProvider } from "../api/APIProvider";
import { CertificateProvider } from "../certificate/CertificateProvider";
import { Logger } from "../shared/logger/Logger";

/**
 * Represents the chexxo server. Holds all server
 * components and initalizes objects needed.
 */
export class ChexxoServer {
  public constructor(
    /**
     * The {@link APIProvider} that will be used
     * in order to expose the server functionality
     * to the user.
     */
    private apiProvider: APIProvider,
    /**
     * The {@link CertificateProvider} which will
     * be used to get the certificate from a
     * requested domain.
     */
    private certificateProvider: CertificateProvider,
    /**
     * The {@link Logger} which will
     * be used to log events.
     */
    private logger: Logger
  ) {}

  /**
   * Initalizes the {@link APIProvider}. In case of
   * express this starts the express instance.
   */
  public init(): void {
    this.apiProvider.init(this.certificateProvider, this.logger);
  }
}
