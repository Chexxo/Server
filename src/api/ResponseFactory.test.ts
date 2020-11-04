import CertificateAnalyzer from "../certificate/CertificateAnalyzer";
import CertificateProvider from "../certificate/CertificateProvider";
import APIResponse from "../types/api/APIResponse";
import ResponseFactory from "./ResponseFactory";

jest.mock("../certificate/CertificateProvider");
jest.mock("../certificate/CertificateAnalyzer");

let responseFactory: ResponseFactory;
beforeEach(() => {
  responseFactory = new ResponseFactory(new CertificateProvider());
});

test("Check ServerError", () => {
  return responseFactory
    .createResponse("www.google.com")
    .then((data: APIResponse) => expect(data.statusCode).toBe(500));
});

test("Check error response", () => {
  return responseFactory
    .createResponse("invalid.status.example.com")
    .then((data: APIResponse) => {
      expect(data.statusCode).toBe(418);
    });
});

test("Check unexpected error response", () => {
  return responseFactory
    .createResponse("unexpected.example.com")
    .then((data: APIResponse) => {
      expect(data.statusCode).toBe(500);
    });
});

test("Check sunny case", () => {
  return responseFactory
    .createResponse("example.com")
    .then((data: APIResponse) => {
      expect(data.statusCode).toBe(200);
    });
});
