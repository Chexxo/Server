jest.mock("https");

import NoHostError from "../types/CommonTypes/errors/NoHostError";
import CertificateProvider from "./CertificateProvider";
import ServerError from "../types/CommonTypes/errors/ServerError";
import InvalidResponseError from "../types/CommonTypes/errors/InvalidResponseError";
import ConnectionRefusedError from "../types/CommonTypes/errors/ConnectionRefusedError";
import RawCertificate from "../types/CommonTypes/certificate/RawCertificate";

const certificateProvider = new CertificateProvider();

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
    .fetchCertificateByUrl("--")
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

test("Sunny case", () => {
  return certificateProvider
    .fetchCertificateByUrl("example.com")
    .then((data: RawCertificate) =>
      expect(data).toBeInstanceOf(RawCertificate)
    );
});
