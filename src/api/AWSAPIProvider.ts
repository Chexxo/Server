import { CertificateProvider } from "../certificate/CertificateProvider";
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

  public constructor() {
    this.certificateProvider = null;
    this.getCertificate = this.getCertificate.bind(this);
  }

  public init(certificateProvider: CertificateProvider): void {
    this.certificateProvider = certificateProvider;
  }

  /**
   * The AWS-Lambda callback. It provides a response according
   * to the AWS-Lambda specifications.
   * @param event The AWS generated event for the request.
   * @returns Stringified AWS-Lambda conform json body or error
   * if no endpoint could be applied. Returning an error leads
   * to AWS returning a server error by itself.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public async getCertificate(event: any): Promise<unknown | Error> {
    const path = event.rawPath.toLowerCase();
    if (!path.includes("/getcertificate/")) {
      throw Error();
    }
    const url = path.replace("/getcertificate/", "");
    let response;
    try {
      const result = await this.certificateProvider.fetchCertificateByUrl(url);
      response = await ResponseFactory.createResponse(result);
    } catch (certificateError) {
      response = ResponseFactory.createErrorResponse(certificateError);
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
