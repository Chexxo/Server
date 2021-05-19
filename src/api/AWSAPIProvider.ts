import { CertificateProvider } from "../certificate/CertificateProvider";
import { Logger } from "../shared/logger/Logger";
import { APIResponse } from "../shared/types/api/APIResponse";
import { APIProvider } from "./APIProvider";
import { ResponseFactory } from "./ResponseFactory";

/**
 * The {@link APIProvider} implementation for AWS. This
 * provider has to be used by AWS-Lambda. The callback
 * function for lambda is {@link AWSAPIProvider.getCertificate}.
 */
export class AWSAPIProvider implements APIProvider {
  /**
   * The certificate Provider which will be used to get the
   * {@link RawCertificate} for the url.
   */
  private certificateProvider: CertificateProvider;
  private logger: Logger;

  public constructor() {
    this.certificateProvider = null;
    this.getCertificate = this.getCertificate.bind(this);
  }

  /**
   * The function to initialize the API-Provider.
   *
   * @param certificateProvider The certificate provider to be used.
   * @param logger The logger to be used.
   */
  public init(certificateProvider: CertificateProvider, logger: Logger): void {
    this.certificateProvider = certificateProvider;
    this.logger = logger;
  }

  /**
   * The AWS-Lambda callback. It provides a response according
   * to the AWS-Lambda specifications.
   *
   * @param event The AWS generated event for the request.
   * @returns Stringified AWS-Lambda conform json body or error
   * if no endpoint could be applied. Returning an error leads
   * to AWS returning a server error by itself.
   */
  public async getCertificate(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    event: any,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    context: any
  ): Promise<unknown | Error> {
    const userAgent = event.headers["user-agent"];
    const requestUuid = context.awsRequestId;
    const url = event.pathParameters.domain;

    const response = await this.fetchResponse(requestUuid, url, userAgent);
    return {
      cookies: [],
      isBase64Encoded: false,
      statusCode: response.statusCode,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response.body),
    };
  }

  /**
   * Gets the response of the certificate provider and
   * generates an {@link APIResponse} from it.
   *
   * @param requestUuid The uuid of the request which lead
   * to this response
   * @param url The url which was requested.
   * @param userAgent The user-agent header field of the client
   * to be passed through to the target server.
   */
  private async fetchResponse(
    requestUuid: string,
    url: string,
    userAgent: string
  ): Promise<APIResponse> {
    let response: APIResponse;
    try {
      const result = await this.certificateProvider.fetchCertificateByUrl(
        url,
        userAgent
      );
      response = await ResponseFactory.createResponse(
        requestUuid,
        result,
        url,
        this.logger
      );
    } catch (certificateError) {
      response = ResponseFactory.createErrorResponse(
        requestUuid,
        certificateError,
        url,
        this.logger
      );
    }
    return response;
  }
}
