import ResponseFactory from "./ResponseFactory";

export default interface APIProvider {
  init(responseFactory: ResponseFactory): void;
}
