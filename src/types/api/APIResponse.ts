export default class APIResponse extends Object {
  constructor(readonly statusCode: number, readonly body: unknown) {
    super();
  }
}
