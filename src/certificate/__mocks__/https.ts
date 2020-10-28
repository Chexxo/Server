import { RequestOptions } from "http";
import NodeError from "../../types/errors/NodeError";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const https = <any>jest.createMockFromModule("https");

https.request = jest
  .fn()
  .mockImplementation((options: RequestOptions): unknown => {
    const emitter = {
      on: jest.fn(),
    };

    emitter.on.mockImplementation((event, cb) => {
      if (event === "error") {
        const error = new NodeError();
        switch (options.host) {
          case "self-signed.example.com":
            error.code = "DEPTH_ZERO_SELF_SIGNED_CERT";
            break;
          case "expired.example.com":
            error.code = "CERT_HAS_EXPIRED";
            break;
          case "wrong.host.example.com":
            error.code = "ERR_TLS_CERT_ALTNAME_INVALID";
            break;
          case "untrusted.root.example.com":
            error.code = "SELF_SIGNED_CERT_IN_CHAIN";
            break;
          case "no.host.example.com":
            error.code = "ENOTFOUND";
            break;
          default:
            error.code = "";
            break;
        }
        cb(error);
      }
    });

    return emitter;
  });

module.exports = https;
