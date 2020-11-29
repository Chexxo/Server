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
   *
   * @param uuid The uuid of the request that lead to
   * this response.
   * @param rawCert The certificate which should
   * be included into the {@link APIResponse}.
   * @param url The url which was called in order to
   * get this response.
   * @param logger The logger which should be used to
   * log this response.
   *
   * @returns The {@link APIResponse} which will be
   * returned by the {@link APIProvider}.
   */
  public static createResponse(
    uuid: string,
    rawCert: RawCertificate,
    url = "",
    logger?: Logger
  ): APIResponse {
    if (logger) {
      logger.log(uuid, LogLevel.INFO, `Request: ${url} Response: 200 ok`);
    }
    const responseBody = new APIResponseBody(uuid, null, rawCert.pem);
    return new APIResponse(200, responseBody);
  }

  /**
   * Creates an {@link APIResponse} with status `500`.
   *
   * @param uuid The uuid of the request that lead to
   * this response.
   * @param error The error which should
   * be included into the {@link APIResponse}.
   * @param url The url which was called in order to
   * get this response.
   * @param logger The logger which should be used to
   * log this response.
   *
   * @returns The {@link APIResponse} which will be
   * returned by the {@link APIProvider}.
   */
  public static createErrorResponse(
    uuid: string,
    e: Error,
    url = "",
    logger?: Logger
  ): APIResponse {
    let error = <CodedError>e;

    if (!(e instanceof CodedError)) {
      error = new ServerError(e);
    }

    if (logger) {
      if (error instanceof ServerError) {
        logger.log(
          uuid,
          LogLevel.ERROR,
          `Request: ${url} Response: ${error.message}`,
          error
        );
      } else {
        logger.log(
          uuid,
          LogLevel.WARNING,
          `Request: ${url} Response: ${error.message}`,
          error
        );
      }
    }

    const responseBody = new APIResponseBody(
      uuid,
      new APIResponseError(error.code, error.publicMessage),
      null
    );

    return new APIResponse(500, responseBody);
  }
}
