import CertificateProvider from "../certificate/CertificateProvider";
import ServerError from "../types/CommonTypes/errors/ServerError";
import APIResponse from "../types/api/APIResponse";
import CodedError from "../types/CommonTypes/errors/CodedError";

export default class ResponseFactory {
  constructor(private certificateProvider: CertificateProvider) {
    this.createResponse = this.createResponse.bind(this);
  }

  public async createResponse(url: string): Promise<APIResponse> {
    //const buff = Buffer.from(url, "base64");
    //url = buff.toString("ascii");

    const responseBody = {
      error: {
        code: -1,
        publicMessage: "",
      },
    };
    try {
      const result = await this.certificateProvider.fetchCertificateByUrl(url);
      return new APIResponse(200, result);
    } catch (e) {
      if (e instanceof ServerError) {
        //Log error
        responseBody.error.code = e.code;
        responseBody.error.publicMessage = e.publicMessage;
        return new APIResponse(500, responseBody);
      } else if (e instanceof CodedError) {
        responseBody.error.code = e.code;
        responseBody.error.publicMessage = e.message;
        return new APIResponse(418, responseBody);
      } else {
        //log error
        e = new ServerError(e);
        responseBody.error.code = e.code;
        responseBody.error.publicMessage = e.message;
        return new APIResponse(500, responseBody);
      }
    }
  }
}
