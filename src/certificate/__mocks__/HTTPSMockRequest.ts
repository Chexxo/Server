import { IncomingMessage } from "http";
import { RequestOptions } from "https";
import NodeError from "../../types/errors/NodeError";
import HTTPSMockResponse from "./HTTPSMockResponse";

export default class HTTPSMockRequest {
  constructor(
    readonly options: RequestOptions,
    readonly callback?: (res: IncomingMessage) => void
  ) {}

  public on = jest.fn().mockImplementation((event, cb) => {
    switch (event) {
      case "error":
        const error = new NodeError();
        switch (this.options.host) {
          case "no.host.example.com":
            error.code = "ENOTFOUND";
            cb(error);
            break;
          case "connection.refused.example.com":
            error.code = "ECONNREFUSED";
            cb(error);
            break;
          case "--":
            error.code = "--";
            cb(error);
            break;
        }
        break;
      default:
        cb();
        break;
    }
  });
  public end = jest.fn().mockImplementation(() => {
    const response = new HTTPSMockResponse(this.options);
    this.callback(<IncomingMessage>(<unknown>response));
  });
}
