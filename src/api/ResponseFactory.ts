import { ExpressPersistenceManager } from "../logger/ExpressPersistenceManager";
import { Logger, LogLevel } from "../shared/logger/Logger";
import { UUIDFactory } from "../helpers/UUIDFactory";
import { APIResponse } from "../shared/types/api/APIResponse";
import { APIResponseBody } from "../shared/types/api/APIResponseBody";
import { APIResponseError } from "../shared/types/api/APIResponseError";
import { RawCertificate } from "../shared/types/certificate/RawCertificate";
import { CodedError } from "../shared/types/errors/CodedError";
import { NoHostError } from "../shared/types/errors/NoHostError";
import { ServerError } from "../shared/types/errors/ServerError";

/**
 * Helper class for generating API responses.
 */
export abstract class ResponseFactory {
  /**
   * Creates an {@link APIResponse} with status `200`.
   * @param rawCert The certificate which should
   * be included into the {@link APIResponse}.
   * @returns The {@link APIResponse} which will be
   * returned by the {@link APIProvider}.
   */
  public static createResponse(rawCert: RawCertificate): APIResponse {
    const logger = new Logger(new ExpressPersistenceManager());
    logger.log(LogLevel.INFO, "Test Log");
    logger.log(
      LogLevel.ERROR,
      "Test Log",
      new NoHostError("123123", new Error().stack)
    );

    logger.log(LogLevel.ERROR, "Test Log", new NoHostError("123123"));

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
