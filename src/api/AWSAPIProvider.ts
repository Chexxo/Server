import { CertificateProvider } from "../certificate/CertificateProvider";
import { Logger } from "../shared/logger/Logger";
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

  public init(certificateProvider: CertificateProvider, logger: Logger): void {
    this.certificateProvider = certificateProvider;
    this.logger = logger;
  }

  /**
   * The AWS-Lambda callback. It provides a response according
   * to the AWS-Lambda specifications.
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
    const path = event.rawPath.toLowerCase();
    const userAgent = event.headers["user-agent"];
    const requestUuid = context.awsRequestId;

    if (!path.includes("/certificate/")) {
      throw Error();
    }
    const url = path.replace("/certificate/", "");
    let response;
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
}
