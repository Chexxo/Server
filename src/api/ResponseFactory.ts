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
   * @param requestsUuid The uuid of the request that lead to
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
    requestsUuid: string,
    rawCert: RawCertificate,
    url = "",
    logger?: Logger
  ): APIResponse {
    if (logger) {
      logger.log(
        requestsUuid,
        LogLevel.INFO,
        `Request: ${url} Response: 200 ok`
      );
    }
    const responseBody = new APIResponseBody(requestsUuid, null, rawCert.pem);
    return new APIResponse(200, responseBody);
  }

  /**
   * Creates an {@link APIResponse} with status `500`.
   *
   * @param requestsUuid The uuid of the request that
   * lead to this response.
   * @param error The errors which should
   * be included into the {@link APIResponse}.
   * @param url The url which was called in order to
   * get this response.
   * @param logger The logger which should be used to
   * log this response.
   *
   * @returns The {@link APIResponse} which will be
   * returned by the {@link APIProvider}.
   */
  // eslint-disable-next-line max-lines-per-function
  public static createErrorResponse(
    requestUuid: string,
    error: Error,
    url = "",
    logger?: Logger
  ): APIResponse {
    let codedError = <CodedError>error;
    if (!(error instanceof CodedError)) {
      codedError = new ServerError(error);
    }
    if (logger) {
      this.logError(logger, requestUuid, url, codedError);
    }
    return new APIResponse(
      500,
      new APIResponseBody(
        requestUuid,
        new APIResponseError(codedError.code, codedError.publicMessage),
        null
      )
    );
  }

  /**
   * Logs the provided error with the given metadata using
   * the specified logger.
   *
   * @param logger The logger to be used for logging.
   * @param requestUuid The uuid of the request which lead
   * to this error.
   * @param url The url which was requested when this error
   * occured.
   * @param codedError The error to be logged.
   */
  private static logError(
    logger: Logger,
    requestUuid: string,
    url: string,
    codedError: CodedError
  ) {
    let logLevel: LogLevel;
    if (codedError instanceof ServerError) {
      logLevel = LogLevel.ERROR;
    } else {
      logLevel = LogLevel.WARNING;
    }
    logger.log(
      requestUuid,
      logLevel,
      `Request: ${url} Response: ${codedError.message}`,
      codedError
    );
  }
}
