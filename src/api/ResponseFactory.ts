import CertificateProvider from "../certificate/CertificateProvider";
import ServerError from "../types/CommonTypes/errors/ServerError";
import APIResponse from "../types/CommonTypes/api/APIResponse";
import CodedError from "../types/CommonTypes/errors/CodedError";
import APIResponseBody from "../types/CommonTypes/api/APIResponseBody";
import APIResponseError from "../types/CommonTypes/api/APIResponseError";

export default class ResponseFactory {
  constructor(private certificateProvider: CertificateProvider) {
    this.createResponse = this.createResponse.bind(this);
  }

  public async createResponse(url: string): Promise<APIResponse> {
    try {
      const result = await this.certificateProvider.fetchCertificateByUrl(url);
      const responseBody = new APIResponseBody(null, result.pem);
      return new APIResponse(200, responseBody);
    } catch (e) {
      //Log error
      if (!(e instanceof CodedError)) {
        e = new ServerError(e);
      }

      const responseBody = new APIResponseBody(
        new APIResponseError(e.code, e.publicMessage),
        null
      );

      return new APIResponse(500, responseBody);
    }
  }
}
