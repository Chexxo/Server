import { Request, Response, Application } from "express";
import express = require("express");
import { Server } from "http";
import APIProvider from "./APIProvider";
import ResponseFactory from "./ResponseFactory";

/**
 * The {@link APIProvider} implementation for Express.
 */
export default class ExpressAPIProvider implements APIProvider {
  private app: express.Application;
  private server: Server;
  private responseFactory: ResponseFactory;

  /**
   * Initializes the express server but does not start it.
   */
  public constructor() {
    this.app = express();
    this.responseFactory = null;
  }

  /**
   * Configures and starts the Express-Server on port 3000.
   * @param responseFactory The response factory which will be
   * used by the APIProvider in order to get the correct
   * {@link APIResponse}.
   */
  public init(responseFactory: ResponseFactory): void {
    this.responseFactory = responseFactory;
    this.configureAPI();
    this.startAPI();
  }

  /**
   * Configures the endpoints of the express server and is
   * therefore responsible for setting the correct response
   * callback.
   */
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

  /**
   * Starts the express server on port 3000.
   */
  private startAPI(): void {
    this.server = this.app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  }

  /**
   * Closes the express server.
   */
  public close(): void {
    this.server.close();
  }
}
