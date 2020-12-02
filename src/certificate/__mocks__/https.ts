import { IncomingMessage, RequestOptions } from "http";
import { HTTPSMockRequest } from "./HTTPSMockRequest";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const https = <any>jest.createMockFromModule("https");

https.request = jest.fn(
  (
    options: RequestOptions,
    callback?: (res: IncomingMessage) => void
  ): unknown => {
    return new HTTPSMockRequest(options, callback);
  }
);

module.exports = https;
