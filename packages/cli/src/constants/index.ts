import * as fs from "fs-extra";
import path from "path";
export const appDirectory = fs.realpathSync(process.cwd());
export const resolvePath = function(relativePath: string) {
  return path.resolve(appDirectory, relativePath);
};
export const paths = {
  appPackageJson: resolvePath("package.json"),
  tsconfigJson: resolvePath("tsconfig.json"),
  appRoot: resolvePath("."),
  appSrc: resolvePath("src"),
  appDist: resolvePath("dist"),
  appPublic: resolvePath("public"),
  appConfig: resolvePath("svere.config.js"),
  jestConfig: resolvePath("jest.config.js")
};
