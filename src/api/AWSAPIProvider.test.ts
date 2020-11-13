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
  return (
    apiProvider
      .getCertificate({
        rawPath: "example.com/getcertificate/",
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data: any) =>
        expect(data.body).toBe('{"error":null,"certificate":"dadssadsa"}')
      )
  );
});
