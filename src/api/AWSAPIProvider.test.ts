jest.mock("../certificate/CertificateProvider");

import { AWSAPIProvider } from "./AWSAPIProvider";
import { CertificateProvider } from "../certificate/CertificateProvider";

let apiProvider: AWSAPIProvider;
let certificateProvider: CertificateProvider;
let event: {
  rawPath: string;
  pathParameters: { domain: string };
  headers?: { "user-agent": string };
};
let context: { awsRequestId: string };

beforeEach(() => {
  event = {
    rawPath: "example.com/certificate/",
    pathParameters: {
      domain: "example.com",
    },
    headers: {
      "user-agent": "Mozilla",
    },
  };
  context = {
    awsRequestId: "abc123",
  };
  apiProvider = new AWSAPIProvider();
  certificateProvider = new CertificateProvider(800);
  apiProvider.init(certificateProvider, null);
});

test("relay user-agent to provider", () => {
  return apiProvider.getCertificate(event, context).then(() => {
    expect(certificateProvider.fetchCertificateByUrl).toHaveBeenLastCalledWith(
      expect.anything(),
      "Mozilla"
    );
  });
});

test("Sunny case", () => {
  return apiProvider
    .getCertificate(event, context)
    .then((data: { body: unknown }) =>
      expect(data.body).toBe(
        '{"requestUuid":"abc123","error":null,"certificate":"dadssadsa"}'
      )
    );
});
