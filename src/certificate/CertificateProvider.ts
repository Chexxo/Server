import { request } from "https";
import Certificate from "../CommonTypes/certificate/Certificate";
import Issuer from "../CommonTypes/certificate/Issuer";
import Subject from "../CommonTypes/certificate/Subject";

class HTTPSOptions {
  public host: string;
  public port: number;
  public method: string;
}

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

  public async fetchCertificateByUrl(
    url: string
  ): Promise<Certificate | string> /*Promise<Record<string, unknown>>*/ {
    // Implement error handling like revocation etc.
    this.options.host = url;
    console.log("Provider:" + this.options.host);
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const req = request(this.options, function (res: any) {
        res.on("error", reject);
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
            reject("Request failed. Status: " + res.statusCode);
          }
        });
      });
      req.on("error", reject);
      req.end();
    });
  }

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
}
