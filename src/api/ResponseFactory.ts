import ServerError from "../types/CommonTypes/errors/ServerError";
import APIResponse from "../types/CommonTypes/api/APIResponse";
import CodedError from "../types/CommonTypes/errors/CodedError";
import APIResponseBody from "../types/CommonTypes/api/APIResponseBody";
import APIResponseError from "../types/CommonTypes/api/APIResponseError";
import RawCertificate from "../types/CommonTypes/certificate/RawCertificate";
import Logger from "../helpers/Logger";
import UUIDFactory from "../helpers/UUIDFactory";
import { LogLevel } from "../helpers/LogLevel";

/**
 * Helper class for generating API responses.
 */
export default abstract class ResponseFactory {
  /**
   * Creates an {@link APIResponse} with status `200`.
   * @param rawCert The certificate which should
   * be included into the {@link APIResponse}.
   * @returns The {@link APIResponse} which will be
   * returned by the {@link APIProvider}.
   */
  public static createResponse(rawCert: RawCertificate): APIResponse {
    Logger.log(LogLevel.INFO, "Test Log");
    Logger.log(LogLevel.ERROR, "Test Log", new Error());

    const responseBody = new APIResponseBody(null, rawCert.pem);
    return new APIResponse(200, responseBody);
  }

  /**
   * Creates an {@link APIResponse} with status `500`.
   * @param error The error which should
   * be included into the {@link APIResponse}.
   * @returns The {@link APIResponse} which will be
   * returned by the {@link APIProvider}.
   */
  public static createErrorResponse(e: Error): APIResponse {
    let error = <CodedError>e;

    if (!(e instanceof CodedError)) {
      error = new ServerError(UUIDFactory.uuidv4(), e);
    }

    const responseBody = new APIResponseBody(
      new APIResponseError(
        UUIDFactory.uuidv4(),
        error.code,
        error.publicMessage
      ),
      null
    );

    return new APIResponse(500, responseBody);
  }
}
