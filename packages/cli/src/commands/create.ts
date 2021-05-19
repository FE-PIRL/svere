import * as colors from "kleur/colors";
import { logger } from "../helpers/logger";
import execa from "execa";
import fs from "fs-extra";
import { LoggerOptions } from "../types";
const path = require("path");
const pkg = require(path.join(__dirname, "../../package.json"));
const degit = require("degit");

export async function command(commandOptions: any) {
  const template = commandOptions.template;
  const force = commandOptions.force;
  const cache = commandOptions.cache;
  const debug = commandOptions.debug;
  const targetDir = path.join(
    process.cwd(),
    commandOptions.targetDir || `svere-${template.replace("/", "-")}`
  );

  await installTemplate(targetDir, template, force, cache, debug);
  await updatePackage(targetDir);

  if (!commandOptions.skipInstall) {
    await installDependencies(targetDir, commandOptions.packageManager);
  }

  if (!commandOptions.skipGit) {
    await gitInit(targetDir);
    if (!commandOptions.skipCommit) {
      await gitCommit(targetDir);
    }
  }
}

async function installTemplate(targetDir, template, force, cache, debug) {
  const empty = !fs.existsSync(targetDir) || !fs.readdirSync(targetDir).length;
  if (!empty) {
    if (!force) {
      logger.error(
        `Directory ${colors.cyan(
          targetDir
        )} not empty, use -f or --force to overwrite it`
      );
      return;
    }
  }
  await fs.emptyDir(targetDir);

  const githubRepo = pkg.repository.templates.match(/github\.com\/(.*).git/)[1];
  const beta = pkg.version.indexOf("beta") > -1;
  const degitPath = `${githubRepo}/${template}${beta ? "#beta" : ""}`;
  const degitOptions = {
    cache,
    force,
    verbose: debug,
    mode: "tar"
  };
  if (debug) {
    logger.debug(
      `degit ${colors.cyan(degitPath)}`,
      degitOptions as LoggerOptions
    );
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
  logger.info(`Created ${colors.cyan(targetDir)} successfully.`);
}

async function updatePackage(dir) {
  const pkgFile = path.join(dir, "package.json");
  const pkg = require(pkgFile);
  pkg.name = path.basename(dir);
  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));
}

async function installDependencies(dir, packageManager) {
  try {
    if (packageManager === "yarn2") {
      try {
        await execa("yarn", ["set", "version", "berry"], { cwd: dir });
      } catch (e) {
        logger.error(`yarn set version berry failed in ${colors.cyan(dir)}`, e);
        throw e;
      }
      packageManager = "yarn";
    }
    await execa(packageManager, ["install"], { cwd: dir });
  } catch (e) {
    logger.error(`${packageManager} install failed in ${colors.cyan(dir)}`, e);
    throw e;
  }
}

async function gitInit(dir) {
  try {
    await execa("git", ["init"], { cwd: dir });
  } catch (e) {
    logger.error(`git init failed in ${dir}`, e);
    throw e;
  }
}

async function gitCommit(dir) {
  try {
    await execa("git", ["add", "."], { cwd: dir });
    await execa("git", ["commit", "-m initial commit"], { cwd: dir });
  } catch (e) {
    logger.error(`git commit failed in ${colors.cyan(dir)}`, e);
    throw e;
  }
}
