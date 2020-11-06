export default class APIResponse {
  constructor(readonly statusCode: number, readonly body: unknown) {}
}
