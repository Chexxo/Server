import APIProvider from "./api/APIProvider";
import ResponseFactory from "./api/ResponseFactory";
import CertificateProvider from "./certificate/CertificateProvider";

export default class ChexxoServer {
  public constructor(
    private apiProvider: APIProvider,
    private responseFactory: ResponseFactory
  ) {}

  public init(): void {
    this.apiProvider.init(this.responseFactory.createResponse);
  }
}
