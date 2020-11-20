/**
 * Implemenetation of the standard error class with the additional Attribute code.
 * Is used in order to analyze the errors thrown by the Node.JS https module.
 */
export class NodeError extends Error {
  public code: string;
}
