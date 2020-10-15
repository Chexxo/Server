const https = require("https");

class Options {
  host: string;
  port: number;
  method: string;
}

class CertificateProvider {
  options: Options;

  constructor() {
    this.options = {
      host: "",
      port: 443,
      method: "GET",
    };
  }

  async getCertificate(url: string) : Promise<object> {
    this.options.host = url;
    return new Promise((resolve, reject) => {
        const req = https.request(this.options,
            (res : any) => {
            let body = '';
            res.on('error', reject);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 299) {
                resolve(res.connection.getPeerCertificate());
                } else {
                reject('Request failed. status: ' + res.statusCode + ', body: ' + body);
                }
            });
            });
        req.on('error', reject);
        req.end();
    });
  }
}

module.exports.CertificateProvider = CertificateProvider;