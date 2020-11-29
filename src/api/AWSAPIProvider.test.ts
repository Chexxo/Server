jest.mock("../certificate/CertificateProvider");

import { AWSAPIProvider } from "./AWSAPIProvider";
import { CertificateProvider } from "../certificate/CertificateProvider";

let apiProvider: AWSAPIProvider;

beforeEach(() => {
  apiProvider = new AWSAPIProvider();
  apiProvider.init(new CertificateProvider(), null);
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
      rawPath: "-/certificate/",
    })
    .catch((data: Error) => expect(data).toBeInstanceOf(Error));
});

test("Sunny case", () => {
  return apiProvider
    .getCertificate({
      rawPath: "example.com/certificate/",
      requestContext: {
        requestId: "abc123",
      },
    })
    .then((data: { body: unknown }) =>
      expect(data.body).toBe(
        '{"requestUuid":"abc123","error":null,"certificate":"dadssadsa"}'
      )
    );
});
