jest.mock("https");
import ExpiredError from "../types/CommonTypes/errors/certificate/ExpiredError";
import SelfSignedError from "../types/CommonTypes/errors/certificate/SelfSignedError";
import UntrustedRootError from "../types/CommonTypes/errors/certificate/UntrustedRootError";
import InvalidDomainError from "../types/CommonTypes/errors/certificate/InvalidDomainError";
import NoHostError from "../types/CommonTypes/errors/NoHostError";
import CertificateProvider from "./CertificateProvider";
import ServerError from "../types/errors/ServerError";

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

test("Check unexpected", () => {
  return certificateProvider
    .fetchCertificateByUrl("--")
    .catch((data: ServerError) => expect(data).toBeInstanceOf(ServerError));
});

// eslint-disable-next-line jest/no-commented-out-tests
/*test("Check invalid response", () => {
  return certificateProvider
    .fetchCertificateByUrl("example.com")
    .catch((data: ServerError) => expect(data).toBeInstanceOf(ServerError));
});*/
