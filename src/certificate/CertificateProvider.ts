import * as https from "https";

class HTTPSOptions {
  public host: string;
  public port: number;
  public method: string;
}

export class CertificateProvider {
  options: HTTPSOptions;

  public constructor() {
    this.options = {
      host: "",
      port: 443,
      method: "GET",
    };
    this.getCertificate = this.getCertificate.bind(this);
  }

  public async getCertificate(url: string): Promise<object> {
    // Implement error handling like revocation etc.
    this.options.host = url;
    console.log("Provider:" + this.options.host);
    return new Promise((resolve, reject) => {
      const req = https.request(this.options, function (res: any) {
        res.on("error", reject);
        res.on("data", function () {});
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            resolve(res.socket.getPeerCertificate());
          } else {
            reject("Request failed. Status: " + res.statusCode);
          }
        });
      });
      req.on("error", reject);
      req.end();
    });
  }
}
