import { UUIDFactory } from "../helpers/UUIDFactory";
import { Logger } from "../shared/logger/Logger";
import { RawCertificate } from "../shared/types/certificate/RawCertificate";
import { InvalidResponseError } from "../shared/types/errors/InvalidResponseError";
import { ServerError } from "../shared/types/errors/ServerError";
import { ResponseFactory } from "./ResponseFactory";

let requestUuid: string;
beforeEach(() => {
  requestUuid = UUIDFactory.uuidv4();
});

test("Error response", () => {
  const response = ResponseFactory.createErrorResponse(
    requestUuid,
    new Error()
  );
  expect(response.statusCode).toBe(500);
  expect(response.body.error.code).toBe(500);
});

test("ServerError response", () => {
  const response = ResponseFactory.createErrorResponse(
    requestUuid,
    new ServerError(new Error())
  );
  expect(response.statusCode).toBe(500);
  expect(response.body.error.code).toBe(500);
});

test("CodedError response", () => {
  const response = ResponseFactory.createErrorResponse(
    requestUuid,
    new InvalidResponseError(302)
  );
  expect(response.statusCode).toBe(500);
  expect(response.body.error.code).toBe(502);
});

test("Sunny case", () => {
  const certificate = new RawCertificate("TestCert");
  const response = ResponseFactory.createResponse(requestUuid, certificate);
  expect(response.statusCode).toBe(200);
});

test("Sunny case data", () => {
  const certificate = new RawCertificate("TestCert");
  const response = ResponseFactory.createResponse(requestUuid, certificate);
  expect(response.body.certificate).toBe("TestCert");
});

test("Logger called error", () => {
  const logger = {
    log: jest.fn(),
  };
  ResponseFactory.createErrorResponse(
    requestUuid,
    new InvalidResponseError(302),
    "example.com",
    <Logger>(<unknown>logger)
  );
  expect(logger.log).toHaveBeenCalled();
});

test("Logger called ServerError", () => {
  const logger = {
    log: jest.fn(),
  };
  ResponseFactory.createErrorResponse(
    requestUuid,
    new ServerError(),
    "example.com",
    <Logger>(<unknown>logger)
  );
  expect(logger.log).toHaveBeenCalled();
});

test("Logger called no error", () => {
  const logger = {
    log: jest.fn(),
  };
  ResponseFactory.createResponse(
    requestUuid,
    new RawCertificate(""),
    "example.com",
    <Logger>(<unknown>logger)
  );
  expect(logger.log).toHaveBeenCalled();
});
