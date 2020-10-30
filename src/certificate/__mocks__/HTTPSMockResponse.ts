import { RequestOptions } from "https";
import NodeError from "../../types/errors/NodeError";

export default class HTTPSMockResponse {
  public statusCode = 200;

  constructor(readonly options: RequestOptions) {}

  public on = jest.fn().mockImplementation((event, cb) => {
    switch (event) {
      case "error":
        const error = new NodeError();
        switch (this.options.host) {
          case "error.response.example.com":
            error.code = "Nothing";
            cb(error);
            break;
        }
        break;
      case "end":
        switch (this.options.host) {
          case "invalid.response.example.com":
            this.statusCode = 301;
          default:
            cb();
            break;
        }
      default:
        cb();
        break;
    }
  });

  public socket = {
    getPeerCertificate: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
}
