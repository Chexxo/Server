import { CertificateProvider } from "./certificate/CertificateProvider";

export class ChexxoServer {
  private certificateProvider: CertificateProvider;
  private apiProvider: APIProvider;

  public constructor(
    certificateProvider: CertificateProvider,
    apiProvider: APIProvider
  ) {
    this.certificateProvider = certificateProvider;
    this.apiProvider = apiProvider;
    this.fetchCertificateByUrl = this.fetchCertificateByUrl.bind(this);
  }

  public init(): void {
    this.apiProvider.init(this.fetchCertificateByUrl);
  }

  public async fetchCertificateByUrl(
    url: string
  ): Promise<Record<string, unknown>> {
    return this.certificateProvider.fetchCertificateByUrl(url);
  }
}
