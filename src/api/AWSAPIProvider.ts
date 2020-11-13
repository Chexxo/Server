import CertificateProvider from "../certificate/CertificateProvider";
import APIProvider from "./APIProvider";
import ResponseFactory from "./ResponseFactory";

export default class AWSAPIProvider implements APIProvider {
  private certificateProvider: CertificateProvider;

  public constructor() {
    this.certificateProvider = null;
    this.getCertificate = this.getCertificate.bind(this);
  }

  public init(certificateProvider: CertificateProvider): void {
    this.certificateProvider = certificateProvider;
  }

  /**
   *
   * @param event The AWS generated event for the request.
   * @returns Stringified APIResponse-body or error if no endpoint could be applied. This leads to AWS returning a Server error by itself.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public async getCertificate(event: any): Promise<unknown> {
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
