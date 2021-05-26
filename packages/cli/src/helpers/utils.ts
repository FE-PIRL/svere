import path from "path";
import * as fs from "fs-extra";
import camelCase from "camelcase";
import { ModuleFormat, NormalizedOpts, WatchOpts } from "../types";
import { concatAllArray } from "jpjs";
import glob from "tiny-glob/sync";
import { paths } from "../constants";
import { PackageJson } from "../types";
import { logger } from "../helpers/logger";

let appPackageJson: PackageJson;

try {
  appPackageJson = fs.readJSONSync(paths.appPackageJson);
} catch (e) {
  logger.error(e);
}

// Remove the package name scope if it exists
export const removeScope = (name: string) => name.replace(/^@.*\//, "");

// UMD-safe package name
export const safeVariableName = (name: string) =>
  camelCase(
    removeScope(name)
      .toLowerCase()
      .replace(/((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, "")
  );

export const safePackageName = (name: string) =>
  name
    .toLowerCase()
    .replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g, "");

export const external = (id: string) =>
  !id.startsWith(".") && !path.isAbsolute(id);

export async function cleanDistFolder() {
  await fs.remove(paths.appDist);
}

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
export const appDirectory = fs.realpathSync(process.cwd());
export const resolvePath = function(relativePath: string) {
  return path.resolve(appDirectory, relativePath);
};

export const isDir = (name: string) =>
  fs
    .stat(name)
    .then(stats => stats.isDirectory())
    .catch(() => false);

export const isFile = (name: string) =>
  fs
    .stat(name)
    .then(stats => stats.isFile())
    .catch(() => false);

async function getInputs(
  entries?: string | string[],
  source?: string
): Promise<string[]> {
  return concatAllArray(
    ([] as any[])
      .concat(
        entries && entries.length
          ? entries
          : (source && resolvePath(source)) || (await isDir(resolvePath("src")))
      )
      .map(file => glob(file))
  );
}

export async function normalizeOpts(opts: WatchOpts): Promise<NormalizedOpts> {
  return {
    ...opts,
    name: opts.name || appPackageJson.name,
    input: await getInputs(opts.entry, appPackageJson.source),
    format: opts.format.split(",").map((format: string) => {
      if (format === "es") {
        return "esm";
      }
      return format;
    }) as [ModuleFormat, ...ModuleFormat[]]
  };
}
