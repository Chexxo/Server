import NodeError from "../types/errors/NodeError";
import ServerError from "../types/CommonTypes/errors/ServerError";
import ExpiredError from "../types/CommonTypes/errors/certificate/ExpiredError";
import NoHostError from "../types/CommonTypes/errors/NoHostError";
import SelfSignedError from "../types/CommonTypes/errors/certificate/SelfSignedError";
import UntrustedRootError from "../types/CommonTypes/errors/certificate/UntrustedRootError";
import InvalidDomainError from "../types/CommonTypes/errors/certificate/InvalidDomainError";
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
      case "DEPTH_ZERO_SELF_SIGNED_CERT":
      case "UNABLE_TO_VERIFY_LEAF_SIGNATURE":
        return new SelfSignedError(error.stack);
      case "CERT_HAS_EXPIRED":
        return new ExpiredError(error.stack);
      case "ERR_TLS_CERT_ALTNAME_INVALID":
        return new InvalidDomainError(error.stack);
      case "SELF_SIGNED_CERT_IN_CHAIN":
        return new UntrustedRootError(error.stack);
      case "ENOTFOUND":
        return new NoHostError(error.stack);
      case "ECONNREFUSED":
        return new ConnectionRefusedError(error.stack);
      default:
        return new ServerError(error);
    }
  }
}
