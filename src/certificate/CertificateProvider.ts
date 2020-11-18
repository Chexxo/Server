import { request, Agent } from "https";
import { parse as parseUrl } from "url";
import InvalidResponseError from "../types/CommonTypes/errors/InvalidResponseError";
import NodeError from "../types/errors/NodeError";
import ErrorFactory from "../errors/ErrorFactory";
import RawCertificate from "../types/CommonTypes/certificate/RawCertificate";
import RawCertificateFactory from "./RawCertificateFactory";

class HTTPSOptions {
  public host: string;
  public port: number;
  public method: string;
  public agent?: Agent;
}

/**
 * Class for fetching the certificate of the url provided.
 */
export default class CertificateProvider {
  options: HTTPSOptions;

  public constructor() {
    const agentOptions = { rejectUnauthorized: false, maxCachedSessions: 0 };
    const agent = new Agent(agentOptions);
    this.options = {
      host: "",
      port: 443,
      method: "GET",
      agent: agent,
    };
    this.fetchCertificateByUrl = this.fetchCertificateByUrl.bind(this);
  }

  /**
   * Fetches the https certificate from the given url.
   * @param url The url of the webserver from which the certificate should be fetched.
   * @return A promise which resolves to the fetched certificate or a CertificateError
   * if fetching failed.
   */
  public async fetchCertificateByUrl(url: string): Promise<RawCertificate> {
    this.options.host = url;
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req = request(this.options, (res) => {
        CertificateProvider.handleResponse(res, url, resolve, reject);
      });
      req.on("error", (requestError: NodeError) => {
        const error = ErrorFactory.getClassFromError(requestError);
        reject(error);
      });
      req.end();
    });
  }

  /**
   * Handles the response of the node https module.
   * @param res The node https module response object.
   * @param url The url which was requested.
   * @param resolve The function to resolve the fetchCertificateByUrl promise.
   * @param reject The function to reject the fetchCertificateByUrl promise
   */
  private static handleResponse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res: any,
    url: string,
    resolve: (value?: RawCertificate | PromiseLike<RawCertificate>) => void,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (reason?: any) => void
  ): void {
    res.on("error", (responseError: NodeError) => {
      const error = ErrorFactory.getClassFromError(responseError);
      reject(error);
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    res.on("data", function () {});
    res.on("end", () => {
      if (res.statusCode >= 200 && res.statusCode <= 299) {
        resolve(RawCertificateFactory.getRawCertificateFromResponse(res));
      } else if (res.statusCode === 301 || res.statusCode === 302) {
        if (CertificateProvider.isSameSiteRedirect(url, res.headers.location)) {
          resolve(RawCertificateFactory.getRawCertificateFromResponse(res));
        }
      }
      reject(new InvalidResponseError(res.statusCode));
    });
  }

  /**
   * Validates if the redirect remains on the domain which the user requested.
   *
   * @param url The url which was fetched.
   * @param locationHeader The location header which indicates where the user will
   * be redirected to.
   */
  private static isSameSiteRedirect(
    url: string,
    locationHeader: string
  ): boolean {
    const relativePathRegex = /^[^\/]+\/[^\/].*$|^\/[^\/].*$/g;

    if (url === parseUrl(locationHeader).hostname) {
      return true;
    }
    return relativePathRegex.test(locationHeader);
  }
}
