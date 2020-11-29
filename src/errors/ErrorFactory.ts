import { CodedError } from "../shared/types/errors/CodedError";
import { ConnectionRefusedError } from "../shared/types/errors/ConnectionRefusedError";
import { HostUnreachableError } from "../shared/types/errors/HostUnreachableError";
import { NoHostError } from "../shared/types/errors/NoHostError";
import { ServerError } from "../shared/types/errors/ServerError";
import { NodeError } from "../types/errors/NodeError";

/**
 * The ErrorFactory contains helper methods which create a {@link CodedError}
 * from another object.
 */
export class ErrorFactory {
  /**
   * Converts the error thrown by the NodeJS https module into a {@link CodedError}.
   * @param error The error thrown by the NodeJS https module.
   * @returns The specific {@link CodedError} or {@link ServerError} if no matching
   * error has been found.
   */
  public static getClassFromError(error: NodeError): CodedError {
    switch (error.code) {
      case "ENOTFOUND":
        return new NoHostError(error.stack);
      case "ECONNREFUSED":
        return new ConnectionRefusedError(error.stack);
      case "EHOSTUNREACH":
        return new HostUnreachableError(error.stack);
      default:
        return new ServerError(error);
    }
  }
}
