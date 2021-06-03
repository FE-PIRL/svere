import program from "commander";
import * as fs from "fs-extra";
import { paths } from "./constants";
import { command as initCommand } from "./commands/create";
import { command as startCommand } from "./commands/start";
import { command as buildCommand } from "./commands/build";
import { command as testCommand } from "./commands/test";
import { command as lintCommand } from "./commands/lint";
import { command as docCommand } from "./commands/doc";
const { version } = fs.readJSONSync(paths.appPackageJson);

export async function main() {
  program
    .version(version, "-v, --version")
    .description("svere - develop svelte apps with svere");

  program
    .command("create [targetDir]")
    .description(
      'create a new project. If you do not specify targetDir, "svere-default" will be used'
    )
    .option(
      "-t, --template <string>",
      `specify template for new project`,
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
    .option("-d, --debug", "more debug logging", false)
    .option("-si, --skip-install", "skip install", false)
    .option("-sg, --skip-git", "skip git init", false)
    .option("-sc, --skip-commit", "skip initial commit", false)
    .action(async (targetDir, cmd) => {
      const options = cmd.opts();
      options.targetDir = targetDir;
      await initCommand(options);
    });

  program
    .command("start")
    .description("start development server")
    .option("--entry <string>", "specify entry file for dev", "src/main.ts")
    .option("-d, --debug", "more debug logging", false)
    .option("-s, --silent", "never launch the browser", false)
    .option("-p, --port <number>", "specify port for dev", "5000")
    .action(async cmd => {
      const options = cmd.opts();
      options.commandName = cmd._name;
      await startCommand(options);
    });

  program
    .command("build")
    .description("Build your component once and exit")
    .option(
      "--entry <string>",
      "specify entry file for build",
      "src/components/index.ts"
    )
    .option("--fileName <string>", "specify fileName exposed in UMD builds")
    .option("--format <string>", "specify module format(s)", "umd,esm")
    .option("--transpileOnly", "skip type checking", true)
    .option("-d, --debug", "more debug logging", false)
    .option("-bsb, --buildStorybook", "build storybook to static files", false)
    .action(async cmd => {
      const options = cmd.opts();
      options.commandName = cmd._name;
      await buildCommand(options);
    });

  program
    .command("test")
    .description("Run cypress and jest test runner")
    .option("-co, --cypressOpen", "run cypress open", false)
    .option("-p, --port <number>", "specify port for test", "5000")
    .action(async cmd => {
      const options = cmd.opts();
      await testCommand(options);
    });

  program
    .command("lint")
    .description("Run eslint and stylelint with prettier")
    .option("-js, --js", "run eslint with prettier only", false)
    .option("-css, --css", "run stylelint with prettier only", false)
    .option("-f, --format", "run prettier only", false)
    .option(
      "-jfs, --jsFiles <string>",
      "specify files for eslint",
      "src/**/*.{js,jsx,ts,tsx,svelte}"
    )
    .option(
      "-cfs, --cssFiles <string>",
      "specify files for stylelint",
      "src/**/*.{less,postcss,css,scss,svelte}"
    )
    .option(
      "-ffs, --formatFiles <string>",
      "specify files for prettier",
      "src/**/*.{js,json,ts,tsx,svelte,css,less,scss,html,md}"
    )
    .action(async cmd => {
      const options = cmd.opts();
      await lintCommand(options);
    });

  program
    .command("doc")
    .description("Start storybook for component")
    .option("-p, --port <number>", "specify port to run storybook", "6006")
    .option("-b, --build", "build storybook to static files", false)
    .action(async cmd => {
      const options = cmd.opts();
      await docCommand(options);
    });

  await program.parseAsync(process.argv);
}
