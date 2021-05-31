import asyncro from "asyncro";
import { logger } from "../helpers/logger";
import { normalizeOpts } from "../helpers/utils";
import { createBuildConfig } from "../helpers/createBuildConfig";
import { watch, RollupOptions, OutputOptions } from "rollup";

export async function command(commandOptions: any) {
  try {
    if (commandOptions.debug) {
      logger.level = "debug";
    }
    const opts = await normalizeOpts(commandOptions);
    const buildConfigs = await createBuildConfig(opts);
    const promise = asyncro
      .map(
        buildConfigs,
        async (inputOptions: RollupOptions & { output: OutputOptions }) => {
          const watcher = await watch(inputOptions);
          watcher.on("change", (id, e) => {
            logger.debug(id + " [" + e.event + "] ");
            return e;
          });
          watcher.close();
          return watcher;
        }
      )
      .catch((e: any) => {
        throw e;
      });
    logger.info("Start application successfully");
    await promise;
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
