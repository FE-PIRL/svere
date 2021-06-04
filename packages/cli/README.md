# SVERE CLI

A CLI for svere. 

<p align="left">
  <a href="https://github.com/FE-PIRL/svere/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://github.com/FE-PIRL/svere/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@svere/cli"><img alt="Downloads" src="https://img.shields.io/npm/dm/@svere/cli" /></a>
  <a href="https://www.npmjs.com/package/@svere/cli" rel="nofollow"><img src="https://img.shields.io/npm/v/@svere/cli.svg?sanitize=true"></a>
</p>

English | [简体中文](https://github.com/FE-PIRL/svere/blob/master/packages/cli/README_ZH.md)

---

- [Intro](#intro)
- [Features](#features)
- [Install](#install)
- [Quick Start](#quick-start)
- [Customization](#customization)
- [Publishing](#publishing)
- [API Reference](#api-reference)
- [Author](#author) 
- [License](#license) 

# Intro

Although you can build your own project to produce target files that meet the requirements, you still have a lot of work to do. Our goal is to help you get rid of the tedious work and let you concentrate on the development of business components. `Svere cli` is a zero-config scaffold, involving life cycles of component such as `development`, `packaging`, `syntax checking`, `testing`, `documentation` and `publishing`, to make you having a relaxed component development experience.

# Features

* Live reload and watch mode
* Works with Typescript
* Run crypress and Jest via `svere test`
* ESLint and Stylelint with Prettier via `svere lint`
* Run storybook via `svere doc`
* Escape hatches for customization via `svere.config.js` and exported files of [code-specification-unid](https://github.com/FE-PIRL/code-specification-unid)

# Install

With [npm](https://www.npmjs.com/):

```bash
npm install -g @svere/cli
```

Or with [yarn](https://yarnpkg.com/lang/en/):

```bash
yarn add global @svere/cli
```

# Quick Start

```bash
svere create mycom
cd mycom
yarn start
```

That's it. You don't need to worry about setting up TypeScript or Rollup or Jest or other plumbing. 
Just start editing `src/components/MyComponent.svelte` and go!

Below is a list of commands you will probably find useful:

```npm start``` or ```yarn start```

Runs the project in development/watch mode. Your project will be rebuilt upon changes. 

```npm run build``` or ```yarn build```

Bundles the package to the dist folder. The package is optimized and bundled with Rollup into multiple formats (UMD, and ES Module).

```npm test``` or ```yarn test```

This template uses [Cypress](https://www.cypress.io/) & [testing-library](https://testing-library.com/docs/cypress-testing-library/intro/) for testing.

It is highly recommended going through their docs if you intend on testing your components.

You can witness a simple example by running `svere test -co`.

```npm run lint``` or ```yarn lint```

This template integrates with [code-specification-unid](https://github.com/FE-PIRL/code-specification-unid) for linting.

It is highly recommended going through their docs if you intend on linting your components.

The default command without options will run Eslint and Stylelint with Prettier.

```npm run doc``` or ```yarn doc```

This template integrates with [Storybook](https://storybook.js.org/) for docs.

You can generate static doc files by runing `svere doc -b`.


# Customization

### Rollup

> **❗⚠️❗ Warning**: <br>
> These modifications will override the default behavior and configuration of SVERE. As such they can invalidate internal guarantees and assumptions. These types of changes can break internal behavior and can be very fragile against updates. Use with discretion!

SVERE uses Rollup under the hood. The defaults are solid for most packages (Formik uses the defaults!). However, if you do wish to alter the rollup configuration, you can do so by creating a file called `svere.config.js` at the root of your project like so:

```js
// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    return config; // always return a config.
  },
};
```

The `options` object contains the following:

```tsx
export interface SvereOptions {
  // Name of package
  name: string;
  // Port for dev
  port: number;
  // path to file
  input: string;
  // never launch browser automatically
  silent: boolean;
  // Module format
  format: 'cjs' | 'umd' | 'esm' | 'system';
  // Environment
  env: 'development' | 'production';
  // Path to tsconfig file
  tsconfig?: string;
  // Is error extraction running?
  extractErrors?: boolean;
  // Is minifying?
  minify?: boolean;
  // Is this the very first rollup config (and thus should one-off metadata be extracted)?
  writeMeta?: boolean;
  // Only transpile, do not type check (makes compilation faster)
  transpileOnly?: boolean;
}
```

#### Example: Adding Postcss

```js
const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        plugins: [
          autoprefixer(),
          cssnano({
            preset: 'default',
          }),
        ],
        inject: false,
        // only write out CSS for the first bundle (avoids pointless extra files):
        extract: !!options.writeMeta,
      })
    );
    return config;
  },
};
```


# Publishing


# API Reference

### ```svere start```

```bash
Usage: svere start [options]

start development server

Options:
  --entry <string>     specify entry file for dev (default: "src/main.ts")
  -d, --debug          more debug logging (default: false)
  -s, --silent         never launch the browser (default: false)
  -p, --port <number>  specify port for dev (default: "5000")
  -h, --help           display help for command
```


### ```svere build```

```bash
Usage: svere build [options]

Build your component once and exit

Options:
  --entry <string>        specify entry file for build (default: "src/components/index.ts")
  --fileName <string>     specify fileName exposed in UMD builds
  --format <string>       specify module format(s) (default: "umd,esm")
  --transpileOnly         skip type checking (default: true)
  -d, --debug             more debug logging (default: false)
  -bsb, --buildStorybook  build storybook to static files (default: false)
  -h, --help              display help for command
```


### ```svere test```

```bash
Usage: svere test [options]

Run cypress and jest test runner

Options:
  -co, --cypressOpen   run cypress open (default: false)
  -p, --port <number>  specify port for test (default: "5000")
  -h, --help           display help for command
```


### ```svere lint```

```bash
Usage: svere lint [options]

Run eslint and stylelint with prettier

Options:
  -js, --js                     run eslint with prettier only (default: false)
  -css, --css                   run stylelint with prettier only (default: false)
  -f, --format                  run prettier only (default: false)
  -jfs, --jsFiles <string>      specify files for eslint (default: "src/**/*.{js,jsx,ts,tsx,svelte}")
  -cfs, --cssFiles <string>     specify files for stylelint (default: "src/**/*.{less,postcss,css,scss,svelte}")
  -ffs, --formatFiles <string>  specify files for prettier (default: "src/**/*.{js,json,ts,tsx,svelte,css,less,scss,html,md}")
  -h, --help                    display help for command
```


### ```svere doc```

```bash
Usage: svere doc [options]

Start storybook for component

Options:
  -p, --port <number>  specify port to run storybook (default: "6006")
  -b, --build          build storybook to static files (default: false)
  -h, --help           display help for command
```

# Author

[benyasin](https://github.com/benyasin)

# License

[MIT](https://oss.ninja/mit/jaredpalmer/)


# Todos

* Add a command to publish the component to npm or cdn
