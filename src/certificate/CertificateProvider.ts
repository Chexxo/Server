import { request } from "https";
import Certificate from "../types/CommonTypes/certificate/Certificate";
import Issuer from "../types/CommonTypes/certificate/Issuer";
import Subject from "../types/CommonTypes/certificate/Subject";
import ExpiredError from "../types/CommonTypes/errors/certificate/ExpiredError";
import NoHostError from "../types/CommonTypes/errors/NoHostError";
import SelfSignedError from "../types/CommonTypes/errors/certificate/SelfSignedError";
import UntrustedRootError from "../types/CommonTypes/errors/certificate/UntrustedRootError";
import InvalidDomainError from "../types/CommonTypes/errors/certificate/InvalidDomainError";
import InvalidResponseError from "../types/CommonTypes/errors/InvalidResponseError";
import NodeError from "../types/errors/NodeError";
import ServerError from "../types/errors/ServerError";

class HTTPSOptions {
  public host: string;
  public port: number;
  public method: string;
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
    };
    this.fetchCertificateByUrl = this.fetchCertificateByUrl.bind(this);
  }

  /**
   * Fetches the https certificate from the given url.
   * @param url The url of the webserver from which the certificate should be fetched.
   * @return A promise which resolves to the fetched certificate or a CertificateError if fetching failed.
   */
  public async fetchCertificateByUrl(url: string): Promise<Certificate> {
    // Implement error handling like revocation etc.
    this.options.host = url;

    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req = request(this.options, function (res: any) {
        res.on("error", (responseError: NodeError) => {
          const error = this.getClassFromError(responseError);
          reject(error);
        });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        res.on("data", function () {});
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            resolve(
              CertificateProvider.fabricateCertificate(
                res.socket.getPeerCertificate()
              )
            );
          } else {
            reject(new InvalidResponseError(res.statusCode));
          }
        });
      });
      req.on("error", (requestError: NodeError) => {
        const error = this.getClassFromError(requestError);
        reject(error);
      });
      req.end();
    });
  }

  /**
   * Creates a certificate object from the https getPeerCertificate response.
   * @param certObject The NodeJS tlsSocket.getPeerCertificate response.
   * @returns The created certificate object.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static fabricateCertificate(certObject: any): Certificate {
    const issuer = new Issuer(
      certObject.issuer.CN,
      certObject.issuer.O,
      certObject.issuer.OU,
      certObject.issuer.L,
      certObject.issuer.S,
      certObject.issuer.C
    );
    const subject = new Subject(
      certObject.subject.CN,
      certObject.subject.O,
      certObject.subject.OU,
      certObject.subject.L,
      certObject.subject.S,
      certObject.subject.C
    );

    return new Certificate(
      certObject.fingerprint,
      certObject.fingerprint256,
      issuer,
      certObject.serialNumber,
      subject,
      certObject.subjectaltname,
      certObject.valid_from,
      certObject.valid_to,
      false
    );
  }

  /**
   * Converts the error thrown by the NodeJS https module into a CertificateError.
   * @param error The error thrown by the NodeJS https module.
   * @returns The created Certificate error or ServerError if no matching error has been found.
   */
  private getClassFromError(error: NodeError): Error {
    switch (error.code) {
      case "DEPTH_ZERO_SELF_SIGNED_CERT":
      case "UNABLE_TO_VERIFY_LEAF_SIGNATURE":
        return new SelfSignedError(error.stack);
      case "CERT_HAS_EXPIRED":
        return new ExpiredError(error.stack);
      case "ERR_TLS_CERT_ALTNAME_INVALID":
        return new InvalidDomainError(error.stack);
      case "SELF_SIGNED_CERT_IN_CHAIN":
        return new UntrustedRootError(error.stack);
      case "ENOTFOUND":
        return new NoHostError(error.stack);
      default:
        return new ServerError(error);
    }
  }
}
