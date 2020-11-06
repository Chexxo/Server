import { Request, Response, Application } from "express";
import express = require("express");
import { Server } from "http";
import APIProvider from "./APIProvider";
import ResponseFactory from "./ResponseFactory";

export default class ExpressAPIProvider implements APIProvider {
  private app: express.Application;
  private server: Server;
  private responseFactory: ResponseFactory;

  public constructor() {
    this.app = express();
    this.responseFactory = null;
  }

  public init(responseFactory: ResponseFactory): void {
    this.responseFactory = responseFactory;
    this.configureAPI();
    this.startAPI();
  }

  private configureAPI(): void {
    this.app.get(
      "/getCertificate/:url",
      async (req: Request, res: Response) => {
        let response;
        try {
          response = await this.responseFactory.createResponse(req.params.url);
        } catch (errorResponse) {
          response = errorResponse;
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
