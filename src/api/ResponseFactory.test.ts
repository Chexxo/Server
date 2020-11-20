import { UUIDFactory } from "../helpers/UUIDFactory";
import { RawCertificate } from "../shared/types/certificate/RawCertificate";
import { InvalidResponseError } from "../shared/types/errors/InvalidResponseError";
import { ServerError } from "../shared/types/errors/ServerError";
import { ResponseFactory } from "./ResponseFactory";

test("Error response", () => {
  const response = ResponseFactory.createErrorResponse(new Error());
  expect(response.statusCode).toBe(500);
  expect(response.body.error.code).toBe(500);
});

test("ServerError response", () => {
  const response = ResponseFactory.createErrorResponse(
    new ServerError(UUIDFactory.uuidv4(), new Error())
  );
  expect(response.statusCode).toBe(500);
  expect(response.body.error.code).toBe(500);
});

test("CodedError response", () => {
  const response = ResponseFactory.createErrorResponse(
    new InvalidResponseError(UUIDFactory.uuidv4(), 302)
  );
  expect(response.statusCode).toBe(500);
  expect(response.body.error.code).toBe(502);
});

test("Sunny case", () => {
  const certificate = new RawCertificate("TestCert");
  const response = ResponseFactory.createResponse(certificate);
  expect(response.statusCode).toBe(200);
});

test("Sunny case data", () => {
  const certificate = new RawCertificate("TestCert");
  const response = ResponseFactory.createResponse(certificate);
  expect(response.body.certificate).toBe("TestCert");
});
