import { Request, Response, Application } from 'express';
import express = require('express');

export class ExpressAPIProvider implements APIPRovider {
  private app: Application;
  private callback: (url: string) => object;

  public constructor() {
    this.app = express();
    this.callback = () => {
      throw new Error("Provider not initialized");
    };
    this.init = this.init.bind(this);
  }

  public init(callback: (url: string) => object): void {
    this.callback = callback;
    this.configureAPI();
    this.startAPI();
  }

  private configureAPI(): void {
    this.app.get("/getCertificate/:url", async (req: Request, res: Response, next) => {
      let cert = await this.callback(req.params.url);
      res.json(cert);
    });
  }

  private startAPI(): void {
    this.app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  }
}
