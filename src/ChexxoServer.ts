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
    this.certificateCallback = this.certificateCallback.bind(this);
  }

  public init(): void {
    this.apiProvider.init(this.certificateCallback);
  }

  public async certificateCallback(
    url: string
  ): Promise<Record<string, unknown>> {
    return this.certificateProvider.getCertificate(url);
  }
}
