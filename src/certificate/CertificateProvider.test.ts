jest.mock("https");

import { RawCertificate } from "../shared/types/certificate/RawCertificate";
import { ConnectionRefusedError } from "../shared/types/errors/ConnectionRefusedError";
import { InvalidResponseError } from "../shared/types/errors/InvalidResponseError";
import { InvalidUrlError } from "../shared/types/errors/InvalidUrlError";
import { NoHostError } from "../shared/types/errors/NoHostError";
import { ServerError } from "../shared/types/errors/ServerError";
import { CertificateProvider } from "./CertificateProvider";
// eslint-disable-next-line jest/no-mocks-import
import { TestCertificateStore } from "./__mocks__/TestCertificateStore";

const certificateProvider = new CertificateProvider(3000);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const https = require("https");

afterEach(() => {
  https.request.mockClear();
});

test("No host", () => {
  return certificateProvider
    .fetchCertificateByUrl("no.host.example.com")
    .catch((data: NoHostError) => expect(data).toBeInstanceOf(NoHostError));
});

test("Host refused", () => {
  return certificateProvider
    .fetchCertificateByUrl("connection.refused.example.com")
    .catch((data: ConnectionRefusedError) =>
      expect(data).toBeInstanceOf(ConnectionRefusedError)
    );
});

test("Unexpected request error", () => {
  return certificateProvider
    .fetchCertificateByUrl("unexpected.error.example.com")
    .catch((data: ServerError) => expect(data).toBeInstanceOf(ServerError));
});

test("Invalid response code", () => {
  return certificateProvider
    .fetchCertificateByUrl("invalid.response.example.com")
    .catch((data: InvalidResponseError) =>
      expect(data).toBeInstanceOf(InvalidResponseError)
    );
});

test("Valid redirect", () => {
  return certificateProvider
    .fetchCertificateByUrl("valid.redirect.example.com")
    .then((data: RawCertificate) =>
      expect(data).toBeInstanceOf(RawCertificate)
    );
});

test("Invalid redirect", () => {
  return certificateProvider
    .fetchCertificateByUrl("invalid.redirect.example.com")
    .catch((data: InvalidResponseError) =>
      expect(data).toBeInstanceOf(InvalidResponseError)
    );
});

test("Unexpected response error", () => {
  return certificateProvider
    .fetchCertificateByUrl("error.response.example.com")
    .catch((data: ServerError) => expect(data).toBeInstanceOf(ServerError));
});

test("Invalid url error", () => {
  return certificateProvider
    .fetchCertificateByUrl("com")
    .catch((data: ServerError) => expect(data).toBeInstanceOf(InvalidUrlError));
});

test("user-agent proxy", () => {
  return certificateProvider
    .fetchCertificateByUrl("www.example.com", "Mozilla 5.0")
    .then(() => {
      expect(https.request).toHaveBeenLastCalledWith(
        expect.objectContaining({
          headers: {
            "User-Agent": "Mozilla 5.0",
          },
        }),
        expect.anything()
      );
    });
});

test("Sunny case", () => {
  return certificateProvider
    .fetchCertificateByUrl("example.com")
    .then((data: RawCertificate) =>
      expect(data).toBeInstanceOf(RawCertificate)
    );
});

test("Sunny case data", () => {
  return certificateProvider
    .fetchCertificateByUrl("example.com")
    .then((data: RawCertificate) =>
      expect(data.pem).toBe(TestCertificateStore.extendedPem)
    );
});
