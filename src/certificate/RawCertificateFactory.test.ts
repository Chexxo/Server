import RawCertificateFactory from "./RawCertificateFactory";
// eslint-disable-next-line jest/no-mocks-import
import HTTPSMockResponse from "./__mocks__/HTTPSMockResponse";
// eslint-disable-next-line jest/no-mocks-import
import TestCertificateStore from "./__mocks__/TestCertificateStore";

const res = new HTTPSMockResponse({});

test("DER to certificate", () => {
  const cert = RawCertificateFactory.convertDerToRawCertificate(
    Buffer.from(TestCertificateStore.pem, "base64")
  );
  expect(cert.pem).toBe(TestCertificateStore.extendedPem);
});

test("Response to certificate", () => {
  const cert = RawCertificateFactory.getRawCertificateFromResponse(res);
  expect(cert.pem).toBe(TestCertificateStore.extendedPem);
});
