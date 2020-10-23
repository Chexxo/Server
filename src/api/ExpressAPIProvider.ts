import { Request, Response, Application } from 'express';
import express = require('express');;
import { Server } from "http";

export class ExpressAPIProvider implements APIProvider {
  private app: express.Application;
  private callback: (url: string) => Promise<Record<string, unknown>>;
  private server: Server;

  public constructor() {
    this.app = express();
    this.callback = () => {
      throw new Error("Provider not initialized");
    };
    this.init = this.init.bind(this);
  }

  public init(
    callback: (url: string) => Promise<Record<string, unknown>>
  ): void {
    this.callback = callback;
    this.configureAPI();
    this.startAPI();
  }

  private configureAPI(): void {
    this.app.get("/getCertificate/:url", async (req: Request, res: Response) => {
      const cert = await this.callback(req.params.url);
      res.json(cert);
    });
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
