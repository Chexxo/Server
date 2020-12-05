import { IncomingMessage } from "http";
import { RequestOptions } from "https";
import { NodeError } from "../../types/errors/NodeError";
import { HTTPSMockResponse } from "./HTTPSMockResponse";

export class HTTPSMockRequest {
  constructor(
    readonly options: RequestOptions,
    readonly callback?: (res: IncomingMessage) => void
  ) {}

  public destroy = jest.fn();

  // eslint-disable-next-line max-lines-per-function
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
          case "unexpected.error.example.com":
            error.code = "--";
            cb(error);
            break;
        }
        break;
      case "socket":
        cb({
          on: jest.fn((event, cb) => {
            cb();
          }),
        });
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
