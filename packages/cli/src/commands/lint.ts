import execa from "execa";
import { logger } from "../helpers/logger";
import ora from "ora";
import { appName } from "../constants";
import path from "path";

export async function command(commandOptions: any) {
  try {
    if (commandOptions.debug) {
      logger.level = "debug";
    }

    if (commandOptions.js) {
      const runSpinner = ora({
        text: `Running eslint with prettier ...\n`,
        prefixText: `[${appName}]`
      });
      try {
        runSpinner.start();
        const subprocess = execa(
          "npx",
          ["eslint", "--fix", commandOptions.jsFiles],
          {
            cwd: "."
          }
        );
        subprocess.stdout.pipe(process.stdout);
        subprocess.stderr.pipe(process.stderr);
        await (async () => {
          await subprocess;
          runSpinner.succeed(`End run eslint with prettier`);
        })();
      } catch (e) {
        runSpinner.fail(`Failed run eslint with prettier :` + e);
      }
    }

    if (commandOptions.css) {
      const runSpinner = ora({
        text: `Running stylelint with prettier ...\n`,
        prefixText: `[${appName}]`
      });
      try {
        runSpinner.start();
        await execa("npx", ["stylelint", "--fix", commandOptions.cssFiles], {
          cwd: "."
        }).stdout.pipe(process.stdout);
        runSpinner.succeed(`End run stylelint with prettier`);
      } catch (e) {
        runSpinner.fail(`Failed run stylelint with prettier :` + e);
      }
    }

    if (commandOptions.format) {
      const runSpinner = ora({
        text: `Running prettier ...\n`,
        prefixText: `[${appName}]`
      });
      try {
        runSpinner.start();
        await execa(
          "npx",
          ["prettier", "--write", commandOptions.formatFiles],
          {
            cwd: "."
          }
        ).stdout.pipe(process.stdout);
        runSpinner.succeed(`End run prettier`);
      } catch (e) {
        runSpinner.fail(`Failed run prettier :` + e);
      }
    }

    if (!commandOptions.js && !commandOptions.css && !commandOptions.format) {
      const runSpinner = ora({
        text: `Running eslint and stylelint with prettier ...\n`,
        prefixText: `[${appName}]`
      });
      try {
        runSpinner.start();
        const subprocess = execa(
          "npx",
          ["eslint", "--fix", commandOptions.jsFiles],
          {
            cwd: "."
          }
        );
        subprocess.stdout.pipe(process.stdout);
        subprocess.stderr.pipe(process.stderr);

        await (async () => {
          await subprocess;
          await execa("npx", ["stylelint", commandOptions.cssFiles], {
            cwd: "."
          }).stdout.pipe(process.stdout);
          await execa(
            "npx",
            ["prettier", "--write", commandOptions.formatFiles],
            {
              cwd: "."
            }
          ).stdout.pipe(process.stdout);
          runSpinner.succeed(`End run eslint and stylelint with prettier`);
        })();
      } catch (e) {
        runSpinner.fail(`Failed run eslint and stylelint with prettier :` + e);
      }
    }
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
