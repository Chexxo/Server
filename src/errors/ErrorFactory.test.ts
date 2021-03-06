import { ConnectionRefusedError } from "../shared/types/errors/ConnectionRefusedError";
import { HostUnreachableError } from "../shared/types/errors/HostUnreachableError";
import { NoHostError } from "../shared/types/errors/NoHostError";
import { ServerError } from "../shared/types/errors/ServerError";
import { ErrorFactory } from "./ErrorFactory";

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

test("Check no route", () => {
  const error = { code: "EHOSTUNREACH", name: "", message: "" };
  expect(ErrorFactory.getClassFromError(error)).toBeInstanceOf(
    HostUnreachableError
  );
});

test("Check default", () => {
  const error = { code: "", name: "", message: "" };
  expect(ErrorFactory.getClassFromError(error)).toBeInstanceOf(ServerError);
});
