import { bold } from "kleur/colors";
import { logger } from "../helpers/logger";
import * as fs from "fs";
import execa from "execa";
import { LoggerOptions } from "../types";
const path = require("path");
const pkg = require(path.join(__dirname, "../../package.json"));
const version = pkg.version;

export async function command(commandOptions: any) {
  let template = commandOptions.template;
  const targetDir = path.join(
    process.cwd(),
    commandOptions.targetDir || `svelte-${template.replace("/", "-")}`
  );
  const degit = require("degit");
  const githubRepo = pkg.repository.url.match(/github\.com\/(.*).git/)[1];
  const beta = pkg.version.indexOf("beta") > -1;
  const degitPath = `${githubRepo}/templates/${template}${beta ? "#beta" : ""}`;
  const degitOptions = {
    cache: commandOptions.cache,
    force: commandOptions.force,
    verbose: commandOptions.debug,
    mode: "tar"
  };
  if (commandOptions.debug) {
    logger.debug(`degit ${degitPath}`, degitOptions as LoggerOptions);
  }
  const emitter = degit(degitPath, degitOptions);

  emitter.on("info", info => {
    logger.info(info.message);
  });
  emitter.on("warn", warning => {
    logger.warn(warning.message);
  });
  emitter.on("error", error => {
    logger.error(error.message, error);
  });

  await emitter.clone(targetDir);
  logger.info(`created ${targetDir}`);
  await updatePkg(targetDir);

  if (!commandOptions.skipInstall) {
    await installDependencies(targetDir, commandOptions.packageManager);
  }

  if (!commandOptions.skipGit) {
    await gitInit(targetDir);
    if (!commandOptions.skipCommit) {
      await gitCommit(targetDir);
    }
  }

  logger.info(
    `File created! Open ${bold("svere.config.js")} to customize your project.`
  );
}

async function updatePkg(dir) {
  const pkgFile = path.join(dir, "package.json");
  const pkg = require(pkgFile);
  pkg.name = path.basename(dir);
  pkg.devDependencies.svite = `^${version}`;
  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));
}

async function installDependencies(dir, packageManager) {
  try {
    if (packageManager === "yarn2") {
      try {
        await execa("yarn", ["set", "version", "berry"], { cwd: dir });
      } catch (e) {
        console.error(`yarn set version berry failed in ${dir}`, e);
        throw e;
      }
      packageManager = "yarn";
    }
    await execa(packageManager, ["install"], { cwd: dir });
  } catch (e) {
    console.error(`${packageManager} install failed in ${dir}`, e);
    throw e;
  }
}

async function gitInit(dir) {
  try {
    await execa("git", ["init"], { cwd: dir });
  } catch (e) {
    console.error(`git init failed in ${dir}`, e);
    throw e;
  }
}

async function gitCommit(dir) {
  try {
    await execa("git", ["add", "."], { cwd: dir });
    await execa("git", ["commit", "-m initial commit"], { cwd: dir });
  } catch (e) {
    console.error(`git commit failed in ${dir}`, e);
    throw e;
  }
}
