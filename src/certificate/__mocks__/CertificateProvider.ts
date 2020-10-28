import Certificate from "../../types/CommonTypes/certificate/Certificate";
import InvalidResponseError from "../../types/CommonTypes/errors/InvalidResponseError";
import ServerError from "../../types/errors/ServerError";

export default class CertificateProvider {
  fetchCertificateByUrl(url: string): Certificate {
    switch (url) {
      case "invalid.status.example.com":
        throw new InvalidResponseError(301);
        break;
      default:
        throw new ServerError(new Error());
    }
  }
}
