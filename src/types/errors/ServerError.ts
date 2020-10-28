/**
 * Defines a not handled error inside the server component.
 */
export default class ServerError implements Error {
  readonly name: string;
  readonly message: string;
  readonly stack?: string;
  readonly code = 500;
  readonly publicMessage = "An internal server error occured.";

  /**
   *
   * @param error The error which lead to this exception.
   */
  constructor(error: Error) {
    this.name = error.name;
    this.message = error.message;
    this.stack = error.stack;
  }
}
