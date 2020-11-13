/**
 * Implemenetation of the standard error class with the additional Attribute code.
 * Is used in order to analyze the errors thrown by the NodeJS https module.
 */
export default class NodeError extends Error {
  public code: string;
}
