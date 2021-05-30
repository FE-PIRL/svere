import execa from "execa";
import { logger } from "../helpers/logger";

export async function command(commandOptions: any) {
  try {
    if (commandOptions.debug) {
      logger.level = "debug";
    }
    if (commandOptions.open) {
      logger.info("Run cypress open");
      await execa("npx", ["cypress", "open"], {
        cwd: "."
      }).stdout.pipe(process.stdout);
    } else {
      logger.info("Run cypress and jest test runner");
      await execa(
        "npx",
        [
          "start-server-and-test",
          "dev",
          "http://localhost:5000",
          "cypress run"
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
