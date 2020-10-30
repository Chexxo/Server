import CertificateAnalyzer from "../certificate/CertificateAnalyzer";
import CertificateProvider from "../certificate/CertificateProvider";
import APIResponse from "../types/api/APIResponse";
import ResponseFactory from "./ResponseFactory";

jest.mock("../certificate/CertificateProvider");
jest.mock("../certificate/CertificateAnalyzer");

test("Check ServerError", () => {
  const responseFactory = new ResponseFactory(
    new CertificateProvider(),
    new CertificateAnalyzer()
  );

  return responseFactory
    .createResponse("www.google.com")
    .then((data: APIResponse) => expect(data.statusCode).toBe(500));
});

test("Check error response", () => {
  const responseFactory = new ResponseFactory(
    new CertificateProvider(),
    new CertificateAnalyzer()
  );

  return responseFactory
    .createResponse("invalid.status.example.com")
    .then((data: APIResponse) => {
      expect(data.statusCode).toBe(418);
    });
});

test("Check unexpected error response", () => {
  const responseFactory = new ResponseFactory(
    new CertificateProvider(),
    new CertificateAnalyzer()
  );

  return responseFactory
    .createResponse("unexpected.example.com")
    .then((data: APIResponse) => {
      expect(data.statusCode).toBe(500);
    });
});

test("Check sunny case", () => {
  const responseFactory = new ResponseFactory(
    new CertificateProvider(),
    new CertificateAnalyzer()
  );

  return responseFactory
    .createResponse("example.com")
    .then((data: APIResponse) => {
      expect(data.statusCode).toBe(200);
    });
});
