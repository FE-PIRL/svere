import asyncro from "asyncro";
import { logger } from "../helpers/logger";
import { cleanDistFolder } from "../helpers/utils";
import { normalizeOpts } from "../helpers/utils";
import { createBuildConfig } from "../helpers/createBuildConfig";
import { rollup, RollupOptions, OutputOptions } from "rollup";

export async function command(commandOptions: any) {
  try {
    if (commandOptions.debug) {
      logger.level = "debug";
    }
    const opts = await normalizeOpts(commandOptions);
    const buildConfigs = await createBuildConfig(opts);
    await cleanDistFolder();
    const promise = asyncro
      .map(
        buildConfigs,
        async (inputOptions: RollupOptions & { output: OutputOptions }) => {
          const bundle = await rollup(inputOptions);
          await bundle.write(inputOptions.output);
        }
      )
      .catch((e: any) => {
        throw e;
      });
    logger.info("Build component successfully");
    await promise;
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
