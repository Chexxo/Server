import { RawCertificate } from "../../shared/types/certificate/RawCertificate";
import { InvalidResponseError } from "../../shared/types/errors/InvalidResponseError";
import { ServerError } from "../../shared/types/errors/ServerError";

export class CertificateProvider {
  fetchCertificateByUrl = jest.fn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (url: string, userAgent?: string): Promise<RawCertificate> => {
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
  );
}
