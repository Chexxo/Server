jest.mock("https");
jest.mock("./CertificateFactory");

import ExpiredError from "../types/CommonTypes/errors/certificate/ExpiredError";
import SelfSignedError from "../types/CommonTypes/errors/certificate/SelfSignedError";
import UntrustedRootError from "../types/CommonTypes/errors/certificate/UntrustedRootError";
import InvalidDomainError from "../types/CommonTypes/errors/certificate/InvalidDomainError";
import NoHostError from "../types/CommonTypes/errors/NoHostError";
import CertificateProvider from "./CertificateProvider";
import ServerError from "../types/CommonTypes/errors/ServerError";
import InvalidResponseError from "../types/CommonTypes/errors/InvalidResponseError";
import Certificate from "../types/CommonTypes/certificate/Certificate";
import ConnectionRefusedError from "../types/CommonTypes/errors/ConnectionRefusedError";

const certificateProvider = new CertificateProvider();

test("Check self signed", () => {
  return certificateProvider
    .fetchCertificateByUrl("self-signed.example.com")
    .catch((data: SelfSignedError) =>
      expect(data).toBeInstanceOf(SelfSignedError)
    );
});

test("Check expired", () => {
  return certificateProvider
    .fetchCertificateByUrl("expired.example.com")
    .catch((data: ExpiredError) => expect(data).toBeInstanceOf(ExpiredError));
});

test("Check invalid domain", () => {
  return certificateProvider
    .fetchCertificateByUrl("wrong.host.example.com")
    .catch((data: InvalidDomainError) =>
      expect(data).toBeInstanceOf(InvalidDomainError)
    );
});

test("Check untrusted root", () => {
  return certificateProvider
    .fetchCertificateByUrl("untrusted.root.example.com")
    .catch((data: UntrustedRootError) =>
      expect(data).toBeInstanceOf(UntrustedRootError)
    );
});

test("Check no host", () => {
  return certificateProvider
    .fetchCertificateByUrl("no.host.example.com")
    .catch((data: NoHostError) => expect(data).toBeInstanceOf(NoHostError));
});

test("Check host refused", () => {
  return certificateProvider
    .fetchCertificateByUrl("connection.refused.example.com")
    .catch((data: ConnectionRefusedError) =>
      expect(data).toBeInstanceOf(ConnectionRefusedError)
    );
});

test("Check unexpected request error", () => {
  return certificateProvider
    .fetchCertificateByUrl("--")
    .catch((data: ServerError) => expect(data).toBeInstanceOf(ServerError));
});

test("Check invalid response code", () => {
  return certificateProvider
    .fetchCertificateByUrl("invalid.response.example.com")
    .catch((data: InvalidResponseError) =>
      expect(data).toBeInstanceOf(InvalidResponseError)
    );
});

test("Check valid redirect", () => {
  return certificateProvider
    .fetchCertificateByUrl("valid.redirect.example.com")
    .catch((data: Certificate) => expect(data).toBeInstanceOf(Certificate));
});

test("Check invalid redirect", () => {
  return certificateProvider
    .fetchCertificateByUrl("invalid.redirect.example.com")
    .catch((data: InvalidResponseError) =>
      expect(data).toBeInstanceOf(InvalidResponseError)
    );
});

test("Check unexpected response error", () => {
  return certificateProvider
    .fetchCertificateByUrl("error.response.example.com")
    .catch((data: ServerError) => expect(data).toBeInstanceOf(ServerError));
});

test("Check sunny case", () => {
  return certificateProvider
    .fetchCertificateByUrl("example.com")
    .then((data: Certificate) => expect(data).toBeInstanceOf(Certificate));
});
