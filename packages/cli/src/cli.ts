import program from "commander";
import path from "path";
import { command as initCommand } from "./commands/create";
import { command as buildCommand } from "./commands/build";
import { logger } from "./helpers/logger";

const pkg = require(path.join(__dirname, "../package.json"));
const version = pkg.version;
const templates = ["default"];

export async function main() {
  program
    .version(version, "-v, --version")
    .description("svere - build svelte apps with svere");

  program.command("dev", { isDefault: true }).description("start dev server");

  program
    .command("build")
    .description("Build your component once and exit")
    .option("--entry <string>", "Entry module", "src/components/index.ts")
    //.option("--name", "Specify name exposed in UMD builds")
    .option("--format <string>", "Specify module format(s)", "umd,esm")
    .option("--transpileOnly", "Skip type checking",true)
    .action(async cmd => {
      const options = cmd.opts();
      await buildCommand(options);
    });

  program
    .command("create [targetDir]")
    .description(
      'create a new project. If you do not specify targetDir, "svere-component" will be used'
    )
    .option(
      "-t, --template <string>",
      `template for new project. ${JSON.stringify(templates)}`,
      "default"
    )
    .option(
      "-pm, --packageManager <string>",
      'which package manager to use. ["npm","pnpm","yarn","yarn2"]',
      "npm"
    )
    .option(
      "-f, --force",
      "force operation even if targetDir exists and is not empty",
      false
    )
    .option("-c, --cache", "cache template for later use", false)
    .option("-d, --debug", "more verbose logging", false)
    .option("-si, --skip-install", "skip install", false)
    .option("-sg, --skip-git", "skip git init", false)
    .option("-sc, --skip-commit", "skip initial commit", false)
    .action(async (targetDir, cmd) => {
      const options = cmd.opts();
      options.targetDir = targetDir;

      let template = options.template;
      if (!templates.includes(template)) {
        logger.error(
          `invalid template ${template}. Valid: ${JSON.stringify(templates)}`
        );
        return;
      }

      await initCommand(options);
    });
  await program.parseAsync(process.argv);
}
