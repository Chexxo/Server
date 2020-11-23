import { UUIDFactory } from "../../helpers/UUIDFactory";
import { RawCertificate } from "../../shared/types/certificate/RawCertificate";
import { InvalidResponseError } from "../../shared/types/errors/InvalidResponseError";
import { ServerError } from "../../shared/types/errors/ServerError";

export class CertificateProvider {
  async fetchCertificateByUrl(url: string): Promise<RawCertificate> {
    return new Promise((resolve, reject) => {
      switch (url) {
        case "invalid.status.example.com":
          reject(new InvalidResponseError(UUIDFactory.uuidv4(), 301));
        case "unexpected.example.com":
          reject(new Error());
        case "example.com":
          resolve(new RawCertificate("dadssadsa"));
        default:
          reject(new ServerError(UUIDFactory.uuidv4(), new Error()));
      }
    });
  }
}
