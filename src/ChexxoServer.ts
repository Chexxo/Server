const certificateProvider = require("./certificate/CertificateProvider.js")
  .CertificateProvider;
const expressAPIProvider = require("./api/ExpressAPIProvider.js")
  .ExpressAPIProvider;

class ChexxoServer {
  certificateProvider: CertificateProvider;
  apiProvider: APIPRovider;

  constructor() {
    this.certificateProvider = new certificateProvider();
    this.apiProvider = new expressAPIProvider();
    this.apiProvider.init(this.certificateCallback);
  }

  async certificateCallback(url: string): Promise<object> {
    return this.certificateProvider.getCertificate(url);
  }
}

module.exports.ChexxoServer = ChexxoServer;
