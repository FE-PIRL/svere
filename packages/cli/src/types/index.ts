export type LoggerLevel = "debug" | "info" | "warn" | "error" | "silent"; // same as Pino
export type LoggerEvent = "debug" | "info" | "warn" | "error";
export interface LoggerOptions {
  /** (optional) change name at beginning of line */
  name?: string;
  /** (optional) do some additional work after logging a message, if log level is enabled */
  task?: Function;
}
