import CertificateProvider from "../certificate/CertificateProvider";
import APIResponse from "../types/CommonTypes/api/APIResponse";
import ResponseFactory from "./ResponseFactory";

jest.mock("../certificate/CertificateProvider");

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
      expect(data.statusCode).toBe(500);
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
