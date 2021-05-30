import execa from "execa";
import { logger } from "../helpers/logger";

export async function command(commandOptions: any) {
  try {
    if (commandOptions.debug) {
      logger.level = "debug";
    }
    if (commandOptions.build) {
      logger.info("Building storybook to static files...");
      const subprocess = execa("npx", ["build-storybook"]);
      subprocess.stdout.pipe(process.stdout);
      (async () => {
        await subprocess;
        logger.info("Built storybook to static files successfully");
      })();
    } else {
      logger.info("Start storybook for component");
      await execa("npx", ["start-storybook", "-p", commandOptions.port], {
        cwd: "."
      }).stdout.pipe(process.stdout);
    }
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
