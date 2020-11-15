import NodeError from "../types/errors/NodeError";
import ServerError from "../types/CommonTypes/errors/ServerError";
import NoHostError from "../types/CommonTypes/errors/NoHostError";
import ConnectionRefusedError from "../types/CommonTypes/errors/ConnectionRefusedError";
import CodedError from "../types/CommonTypes/errors/CodedError";

/**
 * The ErrorFactory contains helper methods which create a {@link CodedError}
 * from another object.
 */
export default class ErrorFactory {
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
      default:
        return new ServerError(error);
    }
  }
}
