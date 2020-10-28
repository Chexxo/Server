import CertificateAnalyzer from "../certificate/CertificateAnalyzer";
import CertificateProvider from "../certificate/CertificateProvider";
import ServerError from "../types/errors/ServerError";
import APIResponse from "../types/api/APIResponse";

export default class ResponseFactory {
  constructor(
    private certificateProvider: CertificateProvider,
    private certificateAnalyzer: CertificateAnalyzer
  ) {
    this.createResponse = this.createResponse.bind(this);
  }

  public async createResponse(url: string): Promise<APIResponse> {
    try {
      const result = await this.certificateProvider.fetchCertificateByUrl(url);
      return new APIResponse(200, result);
    } catch (e) {
      if (e instanceof ServerError) {
        //Log error
        return new APIResponse(500, {
          error: {
            code: e.code,
            message: e.publicMessage,
          },
        });
      }

      return new APIResponse(418, {
        error: {
          code: e.code,
          message: e.message,
        },
      });
    }
  }
}
