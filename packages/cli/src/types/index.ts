export type LoggerLevel = "debug" | "info" | "warn" | "error" | "silent"; // same as Pino
export type LoggerEvent = "debug" | "info" | "warn" | "error";
export interface LoggerOptions {
  /** (optional) change name at beginning of line */
  name?: string;
  /** (optional) do some additional work after logging a message, if log level is enabled */
  task?: Function;
}
export interface PackageJson {
  name: string;
  version: string;
  author: string;
  repository: any;
}

interface SharedOpts {
  commandName?: string;
  // JS target
  target: "node" | "browser";
  // Path to tsconfig file
  tsconfig?: string;
  // Is error extraction running?
  extractErrors?: boolean;
}

export type ModuleFormat = "cjs" | "umd" | "esm" | "iife";

export interface BuildOpts extends SharedOpts {
  fileName?: string;
  entry?: string | string[];
  format: "umd,esm";
  target: "browser";
}

export interface WatchOpts extends BuildOpts {
  verbose?: boolean;
  noClean?: boolean;
  // callback hooks
  onFirstSuccess?: string;
  onSuccess?: string;
  onFailure?: string;
}

export interface NormalizedOpts
  extends Omit<WatchOpts, "name" | "input" | "format"> {
  name: string;
  input: string[];
  format: [ModuleFormat, ...ModuleFormat[]];
}

export interface SvereOptions extends SharedOpts {
  // Name of package
  name: string;
  // Port for dev
  port: number;
  // never launch browser automatically
  silent: boolean;
  // path to file
  input: string;
  // Environment
  env: "development" | "production";
  // Module format
  format: ModuleFormat;
  // Is minifying?
  minify?: boolean;
  // Is this the very first rollup config (and thus should one-off metadata be extracted)?
  writeMeta?: boolean;
  // Only transpile, do not type check (makes compilation faster)
  transpileOnly?: boolean;
}

export interface PackageJson {
  name: string;
  source?: string;
  jest?: any;
  eslint?: any;
  dependencies?: { [packageName: string]: string };
  devDependencies?: { [packageName: string]: string };
  engines?: {
    node?: string;
  };
}
