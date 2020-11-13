import ServerError from "../types/CommonTypes/errors/ServerError";
import APIResponse from "../types/CommonTypes/api/APIResponse";
import CodedError from "../types/CommonTypes/errors/CodedError";
import APIResponseBody from "../types/CommonTypes/api/APIResponseBody";
import APIResponseError from "../types/CommonTypes/api/APIResponseError";
import RawCertificate from "../types/CommonTypes/certificate/RawCertificate";

export default abstract class ResponseFactory {
  public static createResponse(rawCert: RawCertificate): APIResponse {
    const responseBody = new APIResponseBody(null, rawCert.pem);
    return new APIResponse(200, responseBody);
  }

  public static createErrorResponse(e: Error): APIResponse {
    let error = <CodedError>e;

    if (!(e instanceof CodedError)) {
      error = new ServerError(e);
    }

    const responseBody = new APIResponseBody(
      new APIResponseError(error.code, error.publicMessage),
      null
    );

    return new APIResponse(500, responseBody);
  }
}
