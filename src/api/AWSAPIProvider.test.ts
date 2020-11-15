jest.mock("../certificate/CertificateProvider");

import AWSAPIProvider from "./AWSAPIProvider";
import CertificateProvider from "../certificate/CertificateProvider";

let apiProvider: AWSAPIProvider;

beforeEach(() => {
  apiProvider = new AWSAPIProvider();
  apiProvider.init(new CertificateProvider());
});

test("Unsupported endpoint", () => {
  return apiProvider
    .getCertificate({
      rawPath: "www.google.com/",
    })
    .catch((data: Error) => expect(data).toBeInstanceOf(Error));
});

test("Unexpected CertificateProvider error", () => {
  return apiProvider
    .getCertificate({
      rawPath: "-/getcertificate/",
    })
    .catch((data: Error) => expect(data).toBeInstanceOf(Error));
});

test("Sunny case", () => {
  return apiProvider
    .getCertificate({
      rawPath: "example.com/getcertificate/",
    })
    .then((data: { body: unknown }) =>
      expect(data.body).toBe('{"error":null,"certificate":"dadssadsa"}')
    );
});
