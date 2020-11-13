import APIProvider from "./api/APIProvider";
import ResponseFactory from "./api/ResponseFactory";
import CertificateProvider from "./certificate/CertificateProvider";

export default class ChexxoServer {
  public constructor(
    private apiProvider: APIProvider,
    private certificateProvider: CertificateProvider
  ) {}

  public init(): void {
    this.apiProvider.init(new CertificateProvider());
  }
}
