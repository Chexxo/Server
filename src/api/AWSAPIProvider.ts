import APIProvider from "./APIProvider";
import ResponseFactory from "./ResponseFactory";

export default class AWSAPIProvider implements APIProvider {
  private responseFactory: ResponseFactory;

  public constructor() {
    this.responseFactory = null;
    this.getCertificate = this.getCertificate.bind(this);
  }

  public init(responseFactory: ResponseFactory): void {
    this.responseFactory = responseFactory;
  }

  /**
   *
   * @param event The AWS generated event for the request.
   * @returns Stringified APIResponse-body or error if no endpoint could be applied. This leads to AWS returning a Server error by itself.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public async getCertificate(event: any): Promise<string> {
    const path = event.rawPath.toLowerCase();
    if (!path.includes("/getcertificate/")) {
      throw Error();
    }
    const url = path.replace("/getcertificate/", "");
    return JSON.stringify(
      (await this.responseFactory.createResponse(url)).body
    );
  }
}
