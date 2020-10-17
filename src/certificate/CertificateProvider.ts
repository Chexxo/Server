const https = require("https");

class HTTPSOptions {
  host: string;
  port: number;
  method: string;
}

class CertificateProvider {
  options: HTTPSOptions;

  constructor() {
    this.options = {
      host: "",
      port: 443,
      method: "GET",
    };
  }

  async getCertificate(url: string): Promise<object> {
    // Implement error handling like revocation etc.
    this.options.host = url;
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

module.exports.CertificateProvider = CertificateProvider;
