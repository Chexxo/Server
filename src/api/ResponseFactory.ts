import { UUIDFactory } from "../helpers/UUIDFactory";
import { Logger, LogLevel } from "../shared/logger/Logger";
import { APIResponse } from "../shared/types/api/APIResponse";
import { APIResponseBody } from "../shared/types/api/APIResponseBody";
import { APIResponseError } from "../shared/types/api/APIResponseError";
import { RawCertificate } from "../shared/types/certificate/RawCertificate";
import { CodedError } from "../shared/types/errors/CodedError";
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
  public static createResponse(
    rawCert: RawCertificate,
    logger?: Logger
  ): APIResponse {
    if (logger) {
      logger.log(LogLevel.INFO, "Response ok: 200");
    }
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
  public static createErrorResponse(e: Error, logger?: Logger): APIResponse {
    let error = <CodedError>e;

    if (!(e instanceof CodedError)) {
      error = new ServerError(UUIDFactory.uuidv4(), e);
    }

    if (logger) {
      if (error instanceof ServerError) {
        logger.log(LogLevel.ERROR, error.message, error);
      } else {
        logger.log(LogLevel.WARNING, error.message, error);
      }
    }

    const responseBody = new APIResponseBody(
      new APIResponseError(error.uuid, error.code, error.publicMessage),
      null
    );

    return new APIResponse(500, responseBody);
  }
}
