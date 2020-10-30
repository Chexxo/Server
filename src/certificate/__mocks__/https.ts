import { IncomingMessage, RequestOptions } from "http";
import NodeError from "../../types/errors/NodeError";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const https = <any>jest.createMockFromModule("https");

https.request = (
  options: RequestOptions,
  callback?: (res: IncomingMessage) => void
): unknown => {
  const request = {
    on: jest.fn(),
    statusCode: 200,
    end: jest.fn(),
  };

  request.on.mockImplementation((event, cb) => {
    switch (event) {
      case "error":
        const error = new NodeError();
        switch (options.host) {
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

  request.end.mockImplementation(() => {
    const response = {
      statusCode: 301,
      on: jest.fn(),
      socket: {
        getPeerCertificate: jest.fn(),
      },
    };

    response.on.mockImplementation((event, cb) => {
      switch (event) {
        case "error":
          const error = new NodeError();
          switch (options.host) {
            case "error.response.example.com":
              error.code = "Nothing";
              cb(error);
              break;
          }
          break;
        case "end":
          switch (options.host) {
            case "example.com":
              response.statusCode = 200;
            default:
              cb();
              break;
          }
        default:
          cb();
          break;
      }
    });

    response.socket.getPeerCertificate.mockImplementation(() => {
      return {};
    });

    callback(<IncomingMessage>(<unknown>response));
  });

  return request;
};

module.exports = https;
