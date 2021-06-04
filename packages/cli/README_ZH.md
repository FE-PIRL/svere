# SVERE CLI

为svere配套的脚手架.

<p align="center">
  <a href="https://github.com/FE-PIRL/svere/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://github.com/FE-PIRL/svere/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@svere/cli"><img alt="Downloads" src="https://img.shields.io/npm/dm/@svere/cli" /></a>
  <a href="https://www.npmjs.com/package/@svere/cli" rel="nofollow"><img src="https://img.shields.io/npm/v/@svere/cli.svg?sanitize=true"></a>
</p>

[English](https://github.com/FE-PIRL/svere/blob/master/packages/cli/README.md) | 简体中文

---

- [介绍](#intro)
- [特性](#features)
- [安装](#install)
- [快速开始](#quick-start)
- [定制化](#customization)
- [发布](#publishing)
- [API参考](#api-reference)
- [作者](#author)
- [协议](#license)

# 介绍

尽管你可以自己搭建一个工程来生产满足要求的目标文件，但你仍然会有大量的工作要做。我们的目的是帮你处理掉这些繁琐的工作，让你专心于业务组件的开发。`Svere cli`是一个零配置的脚手架，涉及到组件的`开发`，`打包`，`语法检查`、`测试`、`文档编写`、`发布`的生命周期，使你有一个轻松的组件开发体验.

# 特性

* 实时Reload与Watch模式
* 使用Typescript书写
* 通过`svere test`执行crypress与Jest
* 通过`svere lint`执行Eslint、Stylelint与Prettier 
* 通过`svere doc`驱动Storybook
* 通过`svere.config.js`以及[code-specification-unid](https://github.com/FE-PIRL/code-specification-unid)的导出文件来定制化

# 安装

使用 [npm](https://www.npmjs.com/):

```bash
npm install -g @svere/cli
```

或者使用 [yarn](https://yarnpkg.com/lang/en/):

```bash
yarn add global @svere/cli
```

# 快速安装

```bash
svere create mycom
cd mycom
yarn start
```

就是这样,您不需要担心TypeScript、Rollup、Jest或其他工具的配置. 只要开始编辑`src/components/MyComponent.svelte`就可以了！

下面是您可能会发现有用的命令列表:

```npm start``` or ```yarn start```

以开发/监视模式运行项目。您的项目将在更改后重新加载

```npm run build``` or ```yarn build```

使用Rollup, 将包输出到dist文件夹, 经过优化后打成多种格式（UMD和ES模块).

```npm test``` or ```yarn test```

本模板使用了 [Cypress](https://www.cypress.io/) 与 [testing-library](https://testing-library.com/docs/cypress-testing-library/intro/) 用来测试.

如果您打算测试您的组件，强烈建议您阅读他们的文档. 您可以通过运行`svere test-co`来见证一个简单的示例.

```npm run lint``` or ```yarn lint```

本模板整合了 [code-specification-unid](https://github.com/FE-PIRL/code-specification-unid) 用来作质量检查.

如果您打算检查您的组件，强烈建议您阅读他们的文档.

默认的不带选项的命令将会驱动Eslint和Stylelint与Prettier一起工作.

```npm run doc``` or ```yarn doc```

本模板整合了 [Storybook](https://storybook.js.org/) 用来作文档编写.

你可以使用命令`svere doc -b`来生成静态文档.


# 定制化

### Rollup

> **❗⚠️❗ 警告 **: <br>
> 这些修改将覆盖SVERE的默认行为和配置, 因为它们可以使内部保证和假设失效。这些类型的更改会破坏内部行为，并且对更新非常脆弱。谨慎使用！
SVERE使用了Rollup作为打包工具. 大多数的默认配置都是固定的. 但是，如果您确实希望更改rollup的配置, 可以在项目的根目录下创建一个名为`svere.config.js`的文件，如下所示: 

```js
// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    return config; // always return a config.
  },
};
```

对象 `options` 包含了以下属性:

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
  format: 'umd' | 'esm' | 'iife';
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

#### 示例: 添加Postcss插件

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


# 发布


# API参考

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

# 作者

[benyasin](https://github.com/benyasin)

# 协议

[MIT](https://oss.ninja/mit/jaredpalmer/)


# 待办

* 添加一个命令来发布组件到npm或cdn上

