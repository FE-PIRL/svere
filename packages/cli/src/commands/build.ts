import { logger } from "../helpers/logger";
import { cleanDistFolder } from "../helpers/utils";
import { normalizeOpts } from "../helpers/utils";
import { createBuildConfig } from "../helpers/createBuildConfig";
import { rollup, RollupOptions, OutputOptions } from "rollup";
import asyncro from "asyncro";

export async function command(commandOptions: any) {
  const opts = await normalizeOpts(commandOptions);
  const buildConfigs = await createBuildConfig(opts);
  await cleanDistFolder();
  try {
    const promise = asyncro
      .map(
        buildConfigs,
        async (inputOptions: RollupOptions & { output: OutputOptions }) => {
          let bundle = await rollup(inputOptions);
          await bundle.write(inputOptions.output);
        }
      )
      .catch((e: any) => {
        throw e;
      })
      .then(async () => {
        //await deprecated.moveTypes();
      });
    logger.info("Building modules");
    await promise;
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
