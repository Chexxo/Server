import { ConnectionRefusedError } from "../types/CommonTypes/errors/ConnectionRefusedError";
import { NoHostError } from "../types/CommonTypes/errors/NoHostError";
import { ServerError } from "../types/CommonTypes/errors/ServerError";
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

test("Check default", () => {
  const error = { code: "", name: "", message: "" };
  expect(ErrorFactory.getClassFromError(error)).toBeInstanceOf(ServerError);
});
