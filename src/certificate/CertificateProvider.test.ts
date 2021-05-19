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
  return expect(
    certificateProvider.fetchCertificateByUrl("no.host.example.com")
  ).rejects.toBeInstanceOf(NoHostError);
});

test("Host refused", () => {
  return expect(
    certificateProvider.fetchCertificateByUrl("connection.refused.example.com")
  ).rejects.toBeInstanceOf(ConnectionRefusedError);
});

test("Unexpected request error", () => {
  return expect(
    certificateProvider.fetchCertificateByUrl("unexpected.error.example.com")
  ).rejects.toBeInstanceOf(ServerError);
});

test("Invalid response code", () => {
  return expect(
    certificateProvider.fetchCertificateByUrl("invalid.response.example.com")
  ).rejects.toBeInstanceOf(InvalidResponseError);
});

test("Valid redirect", () => {
  return expect(
    certificateProvider.fetchCertificateByUrl("valid.redirect.example.com")
  ).resolves.toBeInstanceOf(RawCertificate);
});

test("Invalid redirect", () => {
  return expect(
    certificateProvider.fetchCertificateByUrl("invalid.redirect.example.com")
  ).rejects.toBeInstanceOf(InvalidResponseError);
});

test("Unexpected response error", () => {
  return expect(
    certificateProvider.fetchCertificateByUrl("error.response.example.com")
  ).rejects.toBeInstanceOf(ServerError);
});

test("Invalid url error", () => {
  return expect(
    certificateProvider.fetchCertificateByUrl("com")
  ).rejects.toBeInstanceOf(InvalidUrlError);
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
