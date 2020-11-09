import CertificateProvider from "../certificate/CertificateProvider";
import ServerError from "../types/CommonTypes/errors/ServerError";
import APIResponse from "../types/api/APIResponse";
import CodedError from "../types/CommonTypes/errors/CodedError";

class ErrorResponse {
  constructor(readonly code: number, readonly publicMessage: string) {}
}

class ResponseBody {
  constructor(readonly error: ErrorResponse, readonly certificate: string) {}
}

export default class ResponseFactory {
  constructor(private certificateProvider: CertificateProvider) {
    this.createResponse = this.createResponse.bind(this);
  }

  public async createResponse(url: string): Promise<APIResponse> {
    try {
      const result = await this.certificateProvider.fetchCertificateByUrl(url);
      const responseBody = new ResponseBody(null, result.pem);
      return new APIResponse(200, responseBody);
    } catch (e) {
      //Log error
      if (!(e instanceof CodedError)) {
        e = new ServerError(e);
      }

      const responseBody = new ResponseBody(
        new ErrorResponse(e.code, e.publicMessage),
        null
      );

      return new APIResponse(500, responseBody);
    }
  }
}
