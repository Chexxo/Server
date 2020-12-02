jest.mock("../certificate/CertificateProvider");

import { Application, Request, Response } from "express";
import { CertificateProvider } from "../certificate/CertificateProvider";
import { ExpressPersistenceManager } from "../logger/ExpressPersistenceManager";
import { ExpressPersistenceManagerConfig } from "../logger/ExpressPersistenceManagerConfig";
import { Logger } from "../shared/logger/Logger";
import { ExpressAPIProvider } from "./ExpressAPIProvider";

let apiProvider: ExpressAPIProvider;
let certificateProvider: CertificateProvider;
const request = {
  headers: {
    "user-agent": "Mozilla",
  },
  params: {
    url: "-",
  },
};

const response = {
  json: jest.fn(),
};

const close = jest.fn();
const app = {
  listen: jest.fn((_port, callback) => {
    callback();
    return {
      close: close,
    };
  }),
  get: jest.fn(),
};

const consoleSave = global.console;
beforeAll(() => {
  global.console = <Console>(<unknown>{
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  });
});

beforeEach(() => {
  apiProvider = new ExpressAPIProvider();
  apiProvider["app"] = <Application>(<unknown>app);
  certificateProvider = new CertificateProvider(3000);
  apiProvider["certificateProvider"] = certificateProvider;
  response.json = jest.fn();
});

test("Unsupported url", () => {
  return apiProvider["getCertificate"](
    <Request>(<unknown>request),
    <Response>(<unknown>response)
  ).then(() => {
    expect(response.json.mock.calls[0][0].error).not.toBeNull();
  });
});

test("Invalid status", () => {
  request.params.url = "invalid.status.example.com";
  return apiProvider["getCertificate"](
    <Request>(<unknown>request),
    <Response>(<unknown>response)
  ).then(() => {
    expect(response.json.mock.calls[0][0].error).not.toBeNull();
  });
});

test("Supported url", () => {
  request.params.url = "example.com";
  return apiProvider["getCertificate"](
    <Request>(<unknown>request),
    <Response>(<unknown>response)
  ).then(() => {
    expect(response.json.mock.calls[0][0].error).toBeNull();
  });
});

test("Supported url data", () => {
  request.params.url = "example.com";
  return apiProvider["getCertificate"](
    <Request>(<unknown>request),
    <Response>(<unknown>response)
  ).then(() => {
    expect(response.json.mock.calls[0][0].certificate).toBe("dadssadsa");
  });
});

test("relays user-agent to provider", () => {
  request.params.url = "example.com";
  return apiProvider["getCertificate"](
    <Request>(<unknown>request),
    <Response>(<unknown>response)
  ).then(() => {
    expect(certificateProvider.fetchCertificateByUrl).toHaveBeenLastCalledWith(
      expect.anything(),
      "Mozilla"
    );
  });
});

test("Has correct endpoint", () => {
  apiProvider.init(
    new CertificateProvider(3000),
    new Logger(
      new ExpressPersistenceManager(new ExpressPersistenceManagerConfig())
    )
  );
  expect(app.get).toHaveBeenLastCalledWith(
    "/certificate/:url",
    apiProvider["getCertificate"]
  );
});

test("Has correct default port", () => {
  apiProvider.init(
    new CertificateProvider(3000),
    new Logger(
      new ExpressPersistenceManager(new ExpressPersistenceManagerConfig())
    )
  );
  expect(app.listen).toHaveBeenLastCalledWith(3000, expect.anything());
});

test("Changes port", () => {
  apiProvider = new ExpressAPIProvider(8080);
  apiProvider["app"] = <Application>(<unknown>app);
  apiProvider.init(
    new CertificateProvider(3000),
    new Logger(
      new ExpressPersistenceManager(new ExpressPersistenceManagerConfig())
    )
  );
  expect(app.listen).toHaveBeenLastCalledWith(8080, expect.anything());
});

test("Closes server", () => {
  apiProvider.init(
    new CertificateProvider(3000),
    new Logger(
      new ExpressPersistenceManager(new ExpressPersistenceManagerConfig())
    )
  );
  apiProvider.close();
  expect(close).toHaveBeenCalled();
});

test("Returns correct start message", () => {
  apiProvider = new ExpressAPIProvider(8080);
  apiProvider["app"] = <Application>(<unknown>app);
  apiProvider.init(
    new CertificateProvider(800),
    new Logger(
      new ExpressPersistenceManager(new ExpressPersistenceManagerConfig())
    )
  );
  expect(console.log).toHaveBeenLastCalledWith(expect.stringMatching(/8080/));
});

afterAll(() => {
  global.console = consoleSave;
});
