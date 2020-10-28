import { Request, Response, Application } from "express";
import express = require("express");
import { Server } from "http";
import APIResponse from "../types/api/APIResponse";
import APIProvider from "./APIProvider";

export default class ExpressAPIProvider implements APIProvider {
  private app: express.Application;
  private responseCallback: (url: string) => Promise<APIResponse>;
  private server: Server;

  public constructor() {
    this.app = express();
    this.responseCallback = () => {
      throw new Error("Provider not initialized");
    };
    this.init = this.init.bind(this);
  }

  public init(responseCallback: (url: string) => Promise<APIResponse>): void {
    this.responseCallback = responseCallback;
    this.configureAPI();
    this.startAPI();
  }

  private configureAPI(): void {
    this.app.get(
      "/getCertificate/:url",
      async (req: Request, res: Response) => {
        let response;
        try {
          response = await this.responseCallback(req.params.url);
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
