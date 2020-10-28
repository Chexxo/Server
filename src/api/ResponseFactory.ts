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
    const responseBody = {
      error: {
        code: -1,
        message: "",
      },
    };
    try {
      const result = await this.certificateProvider.fetchCertificateByUrl(url);
      return new APIResponse(200, this.certificateAnalyzer.analyze(result));
    } catch (e) {
      if (e instanceof ServerError) {
        //Log error
        responseBody.error.code = e.code;
        responseBody.error.message = e.publicMessage;
        return new APIResponse(500, responseBody);
      }

      responseBody.error.code = e.code;
      responseBody.error.message = e.message;
      return new APIResponse(418, responseBody);
    }
  }
}
