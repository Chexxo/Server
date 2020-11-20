jest.mock("../certificate/CertificateProvider");

import { Request, Response } from "express";
import { CertificateProvider } from "../certificate/CertificateProvider";
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

beforeEach(() => {
  apiProvider = new ExpressAPIProvider();
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
