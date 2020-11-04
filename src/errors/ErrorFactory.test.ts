import ExpiredError from "../types/CommonTypes/errors/certificate/ExpiredError";
import InvalidDomainError from "../types/CommonTypes/errors/certificate/InvalidDomainError";
import SelfSignedError from "../types/CommonTypes/errors/certificate/SelfSignedError";
import UntrustedRootError from "../types/CommonTypes/errors/certificate/UntrustedRootError";
import ConnectionRefusedError from "../types/CommonTypes/errors/ConnectionRefusedError";
import NoHostError from "../types/CommonTypes/errors/NoHostError";
import ServerError from "../types/CommonTypes/errors/ServerError";
import ErrorFactory from "./ErrorFactory";

test("Check self signed", () => {
  const error = { code: "DEPTH_ZERO_SELF_SIGNED_CERT", name: "", message: "" };
  expect(ErrorFactory.getClassFromError(error)).toBeInstanceOf(SelfSignedError);
});

test("Check self signed 2", () => {
  const error = {
    code: "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
    name: "",
    message: "",
  };
  expect(ErrorFactory.getClassFromError(error)).toBeInstanceOf(SelfSignedError);
});

test("Check expired", () => {
  const error = { code: "CERT_HAS_EXPIRED", name: "", message: "" };
  expect(ErrorFactory.getClassFromError(error)).toBeInstanceOf(ExpiredError);
});

test("Check invalid domain", () => {
  const error = { code: "ERR_TLS_CERT_ALTNAME_INVALID", name: "", message: "" };
  expect(ErrorFactory.getClassFromError(error)).toBeInstanceOf(
    InvalidDomainError
  );
});

test("Check untrusted root", () => {
  const error = { code: "SELF_SIGNED_CERT_IN_CHAIN", name: "", message: "" };
  expect(ErrorFactory.getClassFromError(error)).toBeInstanceOf(
    UntrustedRootError
  );
});

test("Check no host", () => {
  const error = { code: "ENOTFOUND", name: "", message: "" };
  expect(ErrorFactory.getClassFromError(error)).toBeInstanceOf(NoHostError);
});

test("Check host refused", () => {
  const error = { code: "ECONNREFUSED", name: "", message: "" };
  expect(ErrorFactory.getClassFromError(error)).toBeInstanceOf(
    ConnectionRefusedError
  );
});

test("Check default", () => {
  const error = { code: "", name: "", message: "" };
  expect(ErrorFactory.getClassFromError(error)).toBeInstanceOf(ServerError);
});
