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
          case "self-signed.example.com":
            error.code = "DEPTH_ZERO_SELF_SIGNED_CERT";
            cb(error);
            break;
          case "expired.example.com":
            error.code = "CERT_HAS_EXPIRED";
            cb(error);
            break;
          case "wrong.host.example.com":
            error.code = "ERR_TLS_CERT_ALTNAME_INVALID";
            cb(error);
            break;
          case "untrusted.root.example.com":
            error.code = "SELF_SIGNED_CERT_IN_CHAIN";
            cb(error);
            break;
          case "no.host.example.com":
            error.code = "ENOTFOUND";
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
