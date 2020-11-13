import APIProvider from "./APIProvider";
import ResponseFactory from "./ResponseFactory";

/**
 * The {@link APIProvider} implementation for AWS. This
 * provider has to be used by AWS-Lambda. The callback
 * function for lambda is {@link AWSAPIProvider.getCertificate}.
 */
export default class AWSAPIProvider implements APIProvider {
  /**
   * The response factory which will be used to get the
   * correct {@link APIResponse}.
   */
  private responseFactory: ResponseFactory;

  public constructor() {
    this.responseFactory = null;
    this.getCertificate = this.getCertificate.bind(this);
  }

  public init(responseFactory: ResponseFactory): void {
    this.responseFactory = responseFactory;
  }

  /**
   * The AWS-Lambda callback. It provides a response according
   * to the AWS-Lambda specifications.
   * @param event The AWS generated event for the request.
   * @returns Stringified AWS-Lambda conform json body or error
   * if no endpoint could be applied. Returning an error leads
   * to AWS returning a Server error by itself.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public async getCertificate(event: any): Promise<unknown> {
    const path = event.rawPath.toLowerCase();
    if (!path.includes("/getcertificate/")) {
      throw Error();
    }
    const url = path.replace("/getcertificate/", "");
    const apiResponse = await this.responseFactory.createResponse(url);
    return {
      cookies: [],
      isBase64Encoded: false,
      statusCode: apiResponse.statusCode,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiResponse.body),
    };
  }
}
