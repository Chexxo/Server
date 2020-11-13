import { Request, Response, Application } from "express";
import express = require("express");
import { Server } from "http";
import CertificateProvider from "../certificate/CertificateProvider";
import APIProvider from "./APIProvider";
import ResponseFactory from "./ResponseFactory";

export default class ExpressAPIProvider implements APIProvider {
  private app: express.Application;
  private server: Server;
  private certificateProvider: CertificateProvider;

  public constructor() {
    this.app = express();
    this.certificateProvider = null;
  }

  public init(certificateProvider: CertificateProvider): void {
    this.certificateProvider = certificateProvider;
    this.configureAPI();
    this.startAPI();
  }

  private configureAPI(): void {
    this.app.get(
      "/getCertificate/:url",
      async (req: Request, res: Response) => {
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
    );
  }

  private startAPI(): void {
    this.server = this.app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  }

  public close(): void {
    this.server.close();
  }
}
