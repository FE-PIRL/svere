import { filesystem } from "gluegun";
const fs = require("fs-extra");
const { version } = require("../package.json");
const exec = require("child_process").exec;
const root = filesystem.path(__dirname, "..");
const script = filesystem.path(root, "bin", "svere-cli");

function cli(args, cwd) {
  return new Promise(resolve => {
    exec(
      `node ${script} ${args.join(" ")}`,
      { cwd },
      (error, stdout, stderr) => {
        resolve({
          code: error && error.code ? error.code : 0,
          error,
          stdout,
          stderr
        });
      }
    );
  });
}

test("outputs version", async () => {
  const output = await cli(["--version"], ".");
  // @ts-ignore
  expect(output.stdout).toContain(version);
});

test("create from template", async () => {
  jest.setTimeout(80 * 1000);

  await cli(["create test-install -d -f -si"], ".");

  // rollup.config.js is a file we can test for to assume successful
  // install, since it’s added at the end.
  const rollupConfig = filesystem.path(
    root,
    "test-install",
    "rollup.config.js"
  );
  const rollupConfigExists = fs.existsSync(rollupConfig);
  expect(rollupConfigExists).toBe(true);

  // install node_modules by default
  const modules = filesystem.path(root, "test-install", "node_modules");
  const modulesExist = fs.existsSync(modules);
  expect(modulesExist).toBe(false);
});

test("build component", async () => {
  jest.setTimeout(80 * 1000);

  // assume you had run test case above and executed npm install
  const result = await cli(["build --fileName test"], "./test-install");
  //console.log(result);
  const dist = filesystem.path(root, "test-install", "dist");
  const distExists = fs.existsSync(dist);
  expect(distExists).toBe(true);

  const testFile = filesystem.path(root, "test-install", "dist", "test.esm.js");
  const testFileExists = fs.existsSync(testFile);
  expect(testFileExists).toBe(true);
});
