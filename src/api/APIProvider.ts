import APIResponse from "../types/api/APIResponse";

export default interface APIProvider {
  init(responseHandler: (url: string) => Promise<APIResponse>): void;
}
