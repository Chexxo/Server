import RawCertificate from "../../types/CommonTypes/certificate/RawCertificate";
import InvalidResponseError from "../../types/CommonTypes/errors/InvalidResponseError";
import ServerError from "../../types/CommonTypes/errors/ServerError";

export default class CertificateProvider {
  fetchCertificateByUrl(url: string): RawCertificate {
    switch (url) {
      case "invalid.status.example.com":
        throw new InvalidResponseError(301);
      case "unexpected.example.com":
        throw new Error();
      case "example.com":
        return new RawCertificate("dadssadsa");
      default:
        throw new ServerError(new Error());
    }
  }
}
