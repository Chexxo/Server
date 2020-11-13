import APIProvider from "./api/APIProvider";
import CertificateProvider from "./certificate/CertificateProvider";

export default class ChexxoServer {
  public constructor(
    private apiProvider: APIProvider,
    private certificateProvider: CertificateProvider
  ) {}

  public init(): void {
    this.apiProvider.init(this.certificateProvider);
  }
}
