jest.mock("../certificate/CertificateProvider");

import { Application, Request, Response } from "express";
import { CertificateProvider } from "../certificate/CertificateProvider";
import { ExpressPersistenceManager } from "../logger/ExpressPersistenceManager";
import { ExpressPersistenceManagerConfig } from "../logger/ExpressPersistenceManagerConfig";
import { Logger } from "../shared/logger/Logger";
import { ExpressAPIProvider } from "./ExpressAPIProvider";

let apiProvider: ExpressAPIProvider;
const request = {
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

beforeEach(() => {
  apiProvider = new ExpressAPIProvider();
  apiProvider["app"] = <Application>(<unknown>app);
  apiProvider["certificateProvider"] = new CertificateProvider();
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

test("Has correct endpoint", () => {
  apiProvider.init(
    new CertificateProvider(),
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
    new CertificateProvider(),
    new Logger(
      new ExpressPersistenceManager(new ExpressPersistenceManagerConfig())
    )
  );
  expect(app.listen).toHaveBeenLastCalledWith(3000, expect.anything());
});

test("Changes port", () => {
  apiProvider = new ExpressAPIProvider(8080);
  apiProvider["app"] = <Application>(<unknown>app);
  apiProvider["certificateProvider"] = new CertificateProvider();
  apiProvider.init(
    new CertificateProvider(),
    new Logger(
      new ExpressPersistenceManager(new ExpressPersistenceManagerConfig())
    )
  );
  expect(app.listen).toHaveBeenLastCalledWith(8080, expect.anything());
});

test("Closes server", () => {
  apiProvider.init(
    new CertificateProvider(),
    new Logger(
      new ExpressPersistenceManager(new ExpressPersistenceManagerConfig())
    )
  );
  apiProvider.close();
  expect(close).toHaveBeenCalled();
});
