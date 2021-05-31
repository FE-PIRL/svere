import ora from "ora";
import path from "path";
import execa from "execa";
import fs from "fs-extra";
import degit from "degit";
import * as colors from "kleur/colors";
import { logger } from "../helpers/logger";
import { appName } from "../constants";
import { LoggerOptions, PackageJson } from "../types";
const pkg: PackageJson = require(path.join(__dirname, "../../package.json"));
//TODO fetch from remote github
const templates = ["default"];

export async function command(commandOptions: any) {
  const force = commandOptions.force;
  const cache = commandOptions.cache;
  const debug = commandOptions.debug;
  const template = commandOptions.template;
  if (debug) {
    logger.level = "debug";
  }

  const targetDir = path.join(
    process.cwd(),
    commandOptions.targetDir || `svere-${template.replace("/", "-")}`
  );
  if (!templates.includes(template)) {
    logger.error(
      `invalid template ${template}. Valid: ${colors.green(
        JSON.stringify(templates)
      )}`
    );
    return;
  }

  await installTemplate(targetDir, template, force, cache, debug);
  await updatePackage(targetDir);

  if (!commandOptions.skipGit) {
    await gitInit(targetDir);
    if (!commandOptions.skipCommit) {
      await gitCommit(targetDir);
    }
  }

  if (!commandOptions.skipInstall) {
    await installDependencies(targetDir, commandOptions.packageManager);
  }

  await quickStart(
    targetDir,
    commandOptions.packageManager,
    !commandOptions.skipInstall
  );
}

async function installTemplate(targetDir, template, force, cache, debug) {
  const cloneSpinner = ora({
    text: `Creating ${colors.cyan(targetDir)} from template ...\n`,
    prefixText: `[${appName}]`
  });
  try {
    cloneSpinner.start();
    const empty =
      !fs.existsSync(targetDir) || !fs.readdirSync(targetDir).length;
    if (!empty) {
      if (!force) {
        throw Error(
          `Directory ${colors.cyan(
            targetDir
          )} not empty, use -f or --force to overwrite it`
        );
      }
    }
    await fs.emptyDir(targetDir);

    const githubRepo = pkg.repository.templates.match(
      /github\.com\/(.*).git/
    )[1];
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
      throw Error(error.message);
    });

    await emitter.clone(targetDir);
    cloneSpinner.succeed(`Created ${colors.cyan(targetDir)} successfully`);
  } catch (error) {
    cloneSpinner.fail(`Failed to create ${colors.cyan(targetDir)}`);
    logger.error(error.message);
    process.exit(1);
  }
}

async function updatePackage(dir) {
  const pkgFile = path.join(dir, "package.json");
  const pkg = require(pkgFile);
  pkg.name = path.basename(dir);
  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));
}

function _installProcess(packageManager, npmInstallOptions) {
  switch (packageManager) {
    case "npm":
      return execa(
        "npm",
        ["install", "--loglevel", "error"],
        npmInstallOptions
      );
    case "yarn":
      return execa("yarn", ["--silent"], npmInstallOptions);
    case "pnpm":
      return execa("pnpm", ["install", "--reporter=silent"], npmInstallOptions);
    default:
      throw new Error("Unspecified package installer.");
  }
}

async function installDependencies(dir, packageManager) {
  const installSpinner = ora({
    text: `Installing dependencies, this might take a while ...\n`,
    prefixText: `[${appName}]`
  });
  try {
    installSpinner.start();
    const npmInstallOptions = {
      cwd: dir,
      stdio: "inherit"
    } as any;

    const npmInstallProcess = _installProcess(
      packageManager,
      npmInstallOptions
    );
    npmInstallProcess.stdout && npmInstallProcess.stdout.pipe(process.stdout);
    npmInstallProcess.stderr && npmInstallProcess.stderr.pipe(process.stderr);
    await npmInstallProcess;

    installSpinner.succeed("Installed dependencies");
  } catch (error) {
    installSpinner.fail("Failed to install dependencies");
    logger.error(error.message);
    process.exit(1);
  }
}

async function gitInit(dir) {
  const gitInitSpinner = ora({
    text: `Initialing git repo ...\n`,
    prefixText: `[${appName}]`
  });
  try {
    gitInitSpinner.start();
    await execa("git", ["init"], { cwd: dir });
    gitInitSpinner.succeed("Initialized git repo");
  } catch (error) {
    gitInitSpinner.fail("Failed to initialize git repo");
    logger.error(`Failed to initialize git in ${dir}` + error.message);
    process.exit(1);
  }
}

async function gitCommit(dir) {
  const gitCommitSpinner = ora({
    text: `Committing git ...\n`,
    prefixText: `[${appName}]`
  });
  try {
    gitCommitSpinner.start();
    await execa("git", ["add", "."], { cwd: dir });
    await execa("git", ["commit", "-m initial commit"], { cwd: dir });
    gitCommitSpinner.succeed("Completed initial commit");
  } catch (error) {
    gitCommitSpinner.fail("Failed to commit git");
    logger.error(`Failed to commit git in ${dir}` + error.message);
    process.exit(1);
  }
}

async function quickStart(dir, pm, installed) {
  function _formatCommand(command, description) {
    return "  " + command.padEnd(17) + colors.dim(description);
  }

  console.log(``);
  console.log(colors.bold(colors.underline(`Quickstart:`)));
  console.log(``);
  console.log(`  cd ${dir}`);
  console.log(`  ${pm} start`);
  console.log(``);
  console.log(colors.bold(colors.underline(`All Commands:`)));
  console.log(``);
  console.log(
    _formatCommand(
      `${pm} install`,
      `Install your dependencies. ${
        installed
          ? "(We already ran this one for you!)"
          : "(You asked us to skip this step!)"
      }`
    )
  );
  console.log(_formatCommand(`${pm} start`, "Start development server."));
  console.log(_formatCommand(`${pm} run build`, "Build your component."));
  console.log(
    _formatCommand(`${pm} run lint`, "Check code quality and formatting.")
  );
  console.log(_formatCommand(`${pm} run test`, "Run your tests."));
  console.log(_formatCommand(`${pm} run doc`, "Run storybook for component."));
  console.log(``);
}
