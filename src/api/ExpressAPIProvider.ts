import e, { Request, Response, Application } from "express";
import { Server } from "http";
import { CertificateProvider } from "../certificate/CertificateProvider";
import { UUIDFactory } from "../helpers/UUIDFactory";
import { Logger } from "../shared/logger/Logger";
import { APIProvider } from "./APIProvider";
import { ResponseFactory } from "./ResponseFactory";

/**
 * The {@link APIProvider} implementation for Express.
 */
export class ExpressAPIProvider implements APIProvider {
  private port: number;
  private app: Application;
  private server: Server;
  private certificateProvider: CertificateProvider;
  private logger: Logger;

  /**
   * Initializes the express server but does not start it.
   */
  public constructor(port?: number) {
    this.port = port || 3000;
    this.app = e();
    this.certificateProvider = null;
    this.getCertificate = this.getCertificate.bind(this);
  }

  /**
   * Configures and starts the Express-Server on the
   * defined port or port 3000 if no port has been provided.
   * @param certificateProvider The certificate provider
   * which will be used by the APIProvider in order to get
   * the {@link RawCertificate} for the url provided.
   */
  public init(certificateProvider: CertificateProvider, logger: Logger): void {
    this.certificateProvider = certificateProvider;
    this.logger = logger;
    this.configureAPI();
    this.startAPI();
  }

  /**
   * Configures the endpoints of the express server.
   */
  private configureAPI(): void {
    this.app.get("/certificate/:url", this.getCertificate);
  }

  /**
   * Starts the express server on the defined port or
   * port 3000 if no port has been provided.
   */
  private startAPI(): void {
    this.server = this.app.listen(this.port, () => {
      console.log("Server running on port " + this.port);
    });
  }

  /**
   * Is called as soon as the /getCertificate endpoint gets
   * requested by a user. Returns the appropriate Chexxo
   * server API response.
   * @param req The express request that lead to the invocation
   * of this function.
   * @param res The response that will be returned by express.
   */
  private async getCertificate(req: Request, res: Response) {
    let response;
    const requestUuid = UUIDFactory.uuidv4();

    try {
      const result = await this.certificateProvider.fetchCertificateByUrl(
        req.params.url
      );
      response = ResponseFactory.createResponse(
        requestUuid,
        result,
        req.params.url,
        this.logger
      );
    } catch (error) {
      response = ResponseFactory.createErrorResponse(
        requestUuid,
        error,
        req.params.url,
        this.logger
      );
    }
    res.statusCode = response.statusCode;
    res.json(response.body);
  }

  /**
   * Closes the express server.
   */
  public close(): void {
    this.server.close();
  }
}
