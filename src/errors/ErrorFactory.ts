import NodeError from "../types/errors/NodeError";
import ServerError from "../types/CommonTypes/errors/ServerError";
import NoHostError from "../types/CommonTypes/errors/NoHostError";
import ConnectionRefusedError from "../types/CommonTypes/errors/ConnectionRefusedError";

/**
 * The ErrorFactory contains methods which create an Error from another object.
 */
export default class ErrorFactory {
  /**
   * Converts the error thrown by the NodeJS https module into a CertificateError.
   * @param error The error thrown by the NodeJS https module.
   * @returns The created Certificate error or ServerError if no matching error has been found.
   */
  public static getClassFromError(error: NodeError): Error {
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
