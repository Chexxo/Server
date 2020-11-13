import { Request, Response, Application } from "express";
import express = require("express");
import { Server } from "http";
import CertificateProvider from "../certificate/CertificateProvider";
import APIProvider from "./APIProvider";
import ResponseFactory from "./ResponseFactory";

/**
 * The {@link APIProvider} implementation for Express.
 */
export default class ExpressAPIProvider implements APIProvider {
  private app: express.Application;
  private server: Server;
  private certificateProvider: CertificateProvider;

  /**
   * Initializes the express server but does not start it.
   */
  public constructor() {
    this.app = express();
    this.certificateProvider = null;
  }

  /**
   * Configures and starts the Express-Server on port 3000.
   * @param certificateProvider The certificate provider
   * which will be used by the APIProvider in order to get
   * the {@link RawCertificate} for the url provided.
   */
  public init(certificateProvider: CertificateProvider): void {
    this.certificateProvider = certificateProvider;
    this.configureAPI();
    this.startAPI();
  }

  /**
   * Configures the endpoints of the express server.
   */
  private configureAPI(): void {
    this.app.get("/getCertificate/:url", this.getCertificate);
  }

  /**
   * Starts the express server on port 3000.
   */
  private startAPI(): void {
    this.server = this.app.listen(3000, () => {
      console.log("Server running on port 3000");
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
    try {
      const result = await this.certificateProvider.fetchCertificateByUrl(
        req.params.url
      );
      response = await ResponseFactory.createResponse(result);
    } catch (certificateError) {
      response = ResponseFactory.createErrorResponse(certificateError);
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
