import { CertificateProvider } from "./certificate/CertificateProvider";

export class ChexxoServer {
  public constructor(
    private certificateProvider: CertificateProvider,
    private apiProvider: APIProvider
  ) {}

  public init(): void {
    this.apiProvider.init(this.certificateProvider.fetchCertificateByUrl);
  }
}
