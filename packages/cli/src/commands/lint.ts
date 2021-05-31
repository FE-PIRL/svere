import execa from "execa";
import { logger } from "../helpers/logger";

export async function command(commandOptions: any) {
  try {
    if (commandOptions.debug) {
      logger.level = "debug";
    }

    if (commandOptions.js) {
      logger.info("Run eslint with prettier");
      await execa(
        "npx",
        ["eslint", "src", "--fix", "--ext", ".js,.jsx,.ts,.tsx,.svelte"],
        {
          cwd: "."
        }
      ).stdout.pipe(process.stdout);
    }

    if (commandOptions.css) {
      logger.info("Run stylelint with prettier");
      await execa(
        "npx",
        ["stylelint", "--fix", "src/**/*.{less,postcss,css,scss,svelte}"],
        {
          cwd: "."
        }
      ).stdout.pipe(process.stdout);
    }

    if (commandOptions.format) {
      logger.info("Run prettier only");
      await execa(
        "npx",
        [
          "prettier",
          "--write",
          "src/**/*.{js,json,ts,tsx,svelte,css,less,scss,html,md}"
        ],
        {
          cwd: "."
        }
      ).stdout.pipe(process.stdout);
    }

    if (commandOptions.all) {
      logger.info("Run eslint and stylelint with prettier");
      await execa(
        "npx",
        ["eslint", "src", "--fix", "--ext", ".js,.jsx,.ts,.tsx,.svelte"],
        {
          cwd: "."
        }
      ).stdout.pipe(process.stdout);
      await execa(
        "npx",
        ["stylelint", "--fix", "src/**/*.{less,postcss,css,scss,svelte}"],
        {
          cwd: "."
        }
      ).stdout.pipe(process.stdout);
      await execa(
        "npx",
        [
          "prettier",
          "--write",
          "src/**/*.{js,json,ts,tsx,svelte,css,less,scss,html,md}"
        ],
        {
          cwd: "."
        }
      ).stdout.pipe(process.stdout);
    }
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
