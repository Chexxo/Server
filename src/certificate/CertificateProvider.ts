import { request } from "https";
import { parse as parseUrl } from "url";
import Certificate from "../types/CommonTypes/certificate/Certificate";
import InvalidResponseError from "../types/CommonTypes/errors/InvalidResponseError";
import NodeError from "../types/errors/NodeError";
import CertificateFactory from "./CertificateFactory";
import ErrorFactory from "../errors/ErrorFactory";

class HTTPSOptions {
  public host: string;
  public port: number;
  public method: string;
  public agent?: boolean;
}

/**
 * The CertificareProvider class is responsible for fetching the certificate from the specified url.
 */
export default class CertificateProvider {
  options: HTTPSOptions;

  public constructor() {
    this.options = {
      host: "",
      port: 443,
      method: "GET",
      agent: false,
    };
    this.fetchCertificateByUrl = this.fetchCertificateByUrl.bind(this);
  }

  /**
   * Fetches the https certificate from the given url.
   * @param url The url of the webserver from which the certificate should be fetched.
   * @return A promise which resolves to the fetched certificate or a CertificateError if fetching failed.
   */
  public async fetchCertificateByUrl(url: string): Promise<Certificate> {
    this.options.host = url;

    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req = request(this.options, function (res: any) {
        res.on("error", (responseError: NodeError) => {
          const error = ErrorFactory.getClassFromError(responseError);
          reject(error);
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        res.on("data", function () {});
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            resolve(
              CertificateFactory.fabricateCertificate(
                res.socket.getPeerCertificate()
              )
            );
          } else if (res.statusCode == 301 || res.statusCode == 302) {
            if (parseUrl(res.headers.location).hostname == url) {
              resolve(
                CertificateFactory.fabricateCertificate(
                  res.socket.getPeerCertificate()
                )
              );
            } else {
              reject(new InvalidResponseError(res.statusCode));
            }
          } else {
            reject(new InvalidResponseError(res.statusCode));
          }
        });
      });
      req.on("error", (requestError: NodeError) => {
        const error = ErrorFactory.getClassFromError(requestError);
        reject(error);
      });
      req.end();
    });
  }
}
