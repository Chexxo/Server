import RawCertificate from "../../types/CommonTypes/certificate/RawCertificate";
import InvalidResponseError from "../../types/CommonTypes/errors/InvalidResponseError";
import ServerError from "../../types/CommonTypes/errors/ServerError";

export default class CertificateProvider {
  async fetchCertificateByUrl(url: string): Promise<RawCertificate> {
    return new Promise((resolve, reject) => {
      switch (url) {
        case "invalid.status.example.com":
          reject(new InvalidResponseError(301));
        case "unexpected.example.com":
          reject(new Error());
        case "example.com":
          resolve(new RawCertificate("dadssadsa"));
        default:
          reject(new ServerError(new Error()));
      }
    });
  }
}
