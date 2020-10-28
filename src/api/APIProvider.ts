import Certificate from "../CommonTypes/certificate/Certificate";
import APIResponse from "../types/api/APIResponse";

export default interface APIProvider {
  init(responseCallback: (url: string) => Promise<APIResponse>): void;
}
