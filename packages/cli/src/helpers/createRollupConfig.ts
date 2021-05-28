import { safeVariableName, safePackageName, external } from "./utils";
import { paths } from "../constants";
import { RollupOptions } from "rollup";
import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import resolve, {
  DEFAULTS as RESOLVE_DEFAULTS
} from "@rollup/plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import ts from "typescript";
import { SvereOptions } from "../types";
import svelte from "rollup-plugin-svelte";
import { scss } from "svelte-preprocess";
import livereload from "rollup-plugin-livereload";
import css from "rollup-plugin-css-only";

export async function createRollupConfig(
  opts: SvereOptions,
  outputNum: number
): Promise<RollupOptions> {
  const shouldMinify =
    opts.minify !== undefined ? opts.minify : opts.env === "production";

  const outputName =
    opts.commandName === "dev"
      ? "public/bundle.js"
      : [
          `${paths.appDist}/${safePackageName(opts.name)}`,
          opts.format,
          opts.env,
          shouldMinify ? "min" : "",
          "js"
        ]
          .filter(Boolean)
          .join(".");

  const tsconfigPath = opts.tsconfig || paths.tsconfigJson;
  // borrowed from https://github.com/facebook/create-react-app/pull/7248
  const tsconfigJSON = ts.readConfigFile(tsconfigPath, ts.sys.readFile).config;
  // borrowed from https://github.com/ezolenko/rollup-plugin-typescript2/blob/42173460541b0c444326bf14f2c8c27269c4cb11/src/parse-tsconfig.ts#L48
  const tsCompilerOptions = ts.parseJsonConfigFileContent(
    tsconfigJSON,
    ts.sys,
    "./"
  ).options;

  const serve = () => {
    let server;

    function toExit() {
      if (server) server.kill(0);
    }

    return {
      writeBundle() {
        if (server) return;
        server = require("child_process").spawn(
          "npm",
          ["run", "start", "--", "--dev"],
          {
            stdio: ["ignore", "inherit", "inherit"],
            shell: true
          }
        );

        process.on("SIGTERM", toExit);
        process.on("exit", toExit);
      }
    };
  };

  const plugins =
    opts.commandName === "dev"
      ? [
          svelte({
            compilerOptions: {
              dev: true
            },
            preprocess: [
              scss({
                /** options */
              })
            ]
          }),
          // we'll extract any component CSS out into
          // a separate file - better for performance
          css({ output: "bundle.css" }),

          // If you have external dependencies installed from
          // npm, you'll most likely need these plugins. In
          // some cases you'll need additional configuration -
          // consult the documentation for details:
          // https://github.com/rollup/plugins/tree/master/packages/commonjs
          resolve({
            browser: true,
            dedupe: ["svelte"]
          }),
          commonjs(),
          serve(),
          livereload("public")
        ]
      : [
          svelte({
            preprocess: [
              scss({
                /** options */
              })
            ],
            emitCss: false
          }),
          resolve({
            mainFields: [
              "module",
              "main",
              opts.target !== "node" ? "browser" : undefined
            ].filter(Boolean) as string[],
            extensions: [...RESOLVE_DEFAULTS.extensions, ".svelte"]
          }),
          // all bundled external modules need to be converted from CJS to ESM
          commonjs({
            // use a regex to make sure to include eventual hoisted packages
            include:
              opts.format === "umd"
                ? /\/node_modules\//
                : /\/regenerator-runtime\//
          }),
          json(),
          typescript({
            typescript: ts,
            tsconfig: opts.tsconfig,
            tsconfigDefaults: {
              exclude: [
                // all TS test files, regardless whether co-located or in test/ etc
                "**/*.spec.ts",
                "**/*.test.ts",
                "**/*.spec.tsx",
                "**/*.test.tsx",
                // TS defaults below
                "node_modules",
                "bower_components",
                "jspm_packages",
                paths.appDist
              ],
              compilerOptions: {
                sourceMap: true,
                declaration: true,
                jsx: "react"
              }
            },
            tsconfigOverride: {
              compilerOptions: {
                // TS -> esnext, then leave the rest to babel-preset-env
                target: "esnext",
                // don't output declarations more than once
                ...(outputNum > 0
                  ? { declaration: false, declarationMap: false }
                  : {})
              }
            },
            check: !opts.transpileOnly && outputNum === 0,
            useTsconfigDeclarationDir: Boolean(
              tsCompilerOptions?.declarationDir
            )
          }),
          opts.env !== undefined &&
            replace({
              preventAssignment: true,
              "process.env.NODE_ENV": JSON.stringify(opts.env)
            }),
          sourceMaps(),
          shouldMinify &&
            terser({
              output: { comments: false },
              compress: {
                keep_infinity: true,
                pure_getters: true,
                passes: 10
              },
              ecma: 5,
              toplevel: opts.format === "umd"
            })
        ];

  return {
    external: ["svelte"],
    // Tell Rollup the entry point to the package
    input: opts.input,
    // Rollup has treeshaking by default, but we can optimize it further...
    treeshake: {
      propertyReadSideEffects: false
    },
    // Establish Rollup output
    output: {
      // Set filenames of the consumer's package
      file: outputName,
      // Pass through the file format
      format: opts.format,
      // Do not let Rollup call Object.freeze() on namespace import objects
      // (i.e. import * as namespaceImportObject from...) that are accessed dynamically.
      freeze: false,
      // Respect tsconfig esModuleInterop when setting __esModule.
      esModule: Boolean(tsCompilerOptions?.esModuleInterop),
      name: opts.name || safeVariableName(opts.name),
      sourcemap: opts.commandName !== "dev",
      exports: "named"
    },
    plugins,
    watch: {
      clearScreen: true
    }
  };
}
