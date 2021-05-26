import { RollupOptions, OutputOptions } from "rollup";
import * as fs from "fs-extra";
import { concatAllArray } from "jpjs";

import { paths } from "../constants";
import { SvereOptions, NormalizedOpts } from "../types";

import { createRollupConfig } from "./createRollupConfig";

// check for custom svere.config.js
let svereConfig = {
  rollup(config: RollupOptions, _options: SvereOptions): RollupOptions {
    return config;
  }
};

if (fs.existsSync(paths.appConfig)) {
  svereConfig = require(paths.appConfig);
}

export async function createBuildConfig(
  opts: NormalizedOpts
): Promise<Array<RollupOptions & { output: OutputOptions }>> {
  const allInputs = concatAllArray(
    opts.input.map((input: string) =>
      createAllFormats(opts, input).map(
        (options: SvereOptions, index: number) => ({
          ...options,
          // We want to know if this is the first run for each entryfile
          // for certain plugins (e.g. css)
          writeMeta: index === 0
        })
      )
    )
  );

  return await Promise.all(
    allInputs.map(async (options: SvereOptions, index: number) => {
      // pass the full rollup config to tsdx.config.js override
      const config = await createRollupConfig(options, index);
      return svereConfig.rollup(config, options);
    })
  );
}

function createAllFormats(
  opts: NormalizedOpts,
  input: string
): [SvereOptions, ...SvereOptions[]] {
  return [
    opts.format.includes("esm") && { ...opts, format: "esm", input },
    opts.format.includes("umd") && {
      ...opts,
      format: "umd",
      env: "development",
      input
    },
    opts.format.includes("umd") && {
      ...opts,
      format: "umd",
      env: "production",
      input
    }
  ].filter(Boolean) as [SvereOptions, ...SvereOptions[]];
}
