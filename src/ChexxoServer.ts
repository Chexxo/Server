import { CertificateProvider } from "./certificate/CertificateProvider.js";
import { ExpressAPIProvider } from "./api/ExpressAPIProvider.js";

export class ChexxoServer {
  private certificateProvider: CertificateProvider;
  private apiProvider: APIPRovider;

  public constructor() {
    this.certificateProvider = new CertificateProvider();
    this.apiProvider = new ExpressAPIProvider();
    this.certificateCallback = this.certificateCallback.bind(this);
    this.apiProvider.init(this.certificateCallback);
  }

  public async certificateCallback(url: string): Promise<object> {
    return this.certificateProvider.getCertificate(url);
  }
}
