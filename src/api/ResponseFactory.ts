import CertificateProvider from "../certificate/CertificateProvider";
import ServerError from "../types/CommonTypes/errors/ServerError";
import APIResponse from "../types/api/APIResponse";
import CodedError from "../types/CommonTypes/errors/CodedError";

class ErrorResponse {
  constructor(readonly code: number, readonly publicMessage: string) {}
}

class ResponseBody {
  constructor(readonly error: ErrorResponse) {}
}

export default class ResponseFactory {
  constructor(private certificateProvider: CertificateProvider) {
    this.createResponse = this.createResponse.bind(this);
  }

  public async createResponse(url: string): Promise<APIResponse> {
    try {
      const result = await this.certificateProvider.fetchCertificateByUrl(url);
      return new APIResponse(200, result);
    } catch (e) {
      if (e instanceof ServerError) {
        //Log error
        const responseBody = new ResponseBody(
          new ErrorResponse(e.code, e.publicMessage)
        );
        return new APIResponse(500, responseBody);
      } else if (e instanceof CodedError) {
        const responseBody = new ResponseBody(
          new ErrorResponse(e.code, e.message)
        );
        return new APIResponse(418, responseBody);
      } else {
        //log error
        e = new ServerError(e);
        const responseBody = new ResponseBody(
          new ErrorResponse(e.code, e.publicMessage)
        );
        return new APIResponse(500, responseBody);
      }
    }
  }
}
