import { CertificateProvider } from "./certificate/CertificateProvider.js";
import { ExpressAPIProvider } from "./api/ExpressAPIProvider.js";

export class ChexxoServer {
  private certificateProvider: CertificateProvider;
  private apiProvider: APIProvider;

  public constructor(certificateProvider: CertificateProvider, apiProvider: APIProvider) {
    this.certificateProvider = certificateProvider;
    this.apiProvider = apiProvider;
    this.certificateCallback = this.certificateCallback.bind(this);
    this.apiProvider.init(this.certificateCallback);
  }

  public async certificateCallback(url: string): Promise<object> {
    return this.certificateProvider.getCertificate(url);
  }
}
