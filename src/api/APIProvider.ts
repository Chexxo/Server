import ResponseFactory from "./ResponseFactory";

/**
 * Interface for abstracting the APIProvider
 */
export default interface APIProvider {
  /**
   * The init function responsible for starting the APIProvider.
   *
   * @param responseFactory The response factory which will be
   * used by the APIProvider in order to get the correct
   * {@link APIResponse}.
   **/
  init(responseFactory: ResponseFactory): void;
}
