jest.mock("../certificate/CertificateProvider");

import { AWSAPIProvider } from "./AWSAPIProvider";
import { CertificateProvider } from "../certificate/CertificateProvider";

let apiProvider: AWSAPIProvider;

beforeEach(() => {
  apiProvider = new AWSAPIProvider();
  apiProvider.init(new CertificateProvider(800), null);
});

test("Unsupported endpoint", () => {
  return apiProvider
    .getCertificate(
      {
        rawPath: "www.google.com/",
      },
      {
        awsRequestId: "abc123",
      }
    )
    .catch((data: Error) => expect(data).toBeInstanceOf(Error));
});

test("Unexpected CertificateProvider error", () => {
  return apiProvider
    .getCertificate(
      {
        rawPath: "-/certificate/",
      },
      {
        awsRequestId: "abc123",
      }
    )
    .catch((data: Error) => expect(data).toBeInstanceOf(Error));
});

test("Sunny case", () => {
  return apiProvider
    .getCertificate(
      {
        rawPath: "example.com/certificate/",
      },
      {
        awsRequestId: "abc123",
      }
    )
    .then((data: { body: unknown }) =>
      expect(data.body).toBe(
        '{"requestUuid":"abc123","error":null,"certificate":"dadssadsa"}'
      )
    );
});
