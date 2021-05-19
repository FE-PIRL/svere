<p align="center"><img width="200" alt="svere" src="https://user-images.githubusercontent.com/1866848/118639391-7100e580-b80a-11eb-88e1-4a2b547ad475.png"></p>

<p align="center">
  Write components once, run everywhere. Make svelte components run inside React or Vue applications.
</p>

<p align="center">
  <a href="https://github.com/FE-PIRL/svere/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://github.com/FE-PIRL/svere/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@svere/core"><img alt="Downloads" src="https://img.shields.io/npm/dm/svere.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@svere/core" rel="nofollow"><img alt="Version" src="https://img.shields.io/npm/v/svere.svg?style=flat-square"></a>
</p>

---

- [Intro](#intro)
- [Install](#install)
- [Usage](#usage)
- [Examples](#examples)
    - [React](#react)
    - [Vue2](#vue2)
    - [Vue3](#vue3)
- [Cli](#cli)
- [Todos](#todos)

# Intro

Managing support for libraries that provide UI components across frameworks is a pain, 
especially when [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) are not an option (e.g. for server side rendering, best performance, etc).

At present, the [svelte](https://svelte.dev/) framework is developing rapidly. 
It is a good backward compatibility solution to make svelte components run in the old `react` or `vue` project, 
especially when the team's technology stack is not unified, this provides an idea of cross-framework sharing component.

`Svere` contains several `adapters` for `React/Vue2/Vue3` which allows you to pass props and respond to events in a way that makes sense for that library.
Also, it provides a `cli` to quickly create svelte components that can be shared across components.

# Install

With [npm](https://www.npmjs.com/):

```bash
npm install @svere/core
```

Or with [yarn](https://yarnpkg.com/lang/en/):

```bash
yarn add @svere/core
```
# Usage

The core of svere exposes several adapter functions, namely `toReact`, `toVue` and `toVue3`.
Each adapter is a simple function that takes a svelte component and a few options and returns a Vue or React component that can be used in Vue templates or JSX as you would expect.

All adapters have the same signature as below, eg:
```ts
toReact(Component: SvelteComponent, wrapperProps?: WrapperProps) : Component
```
- `Component` should be a compiled svelte component, either precompiled or compiled as part of your build step using rollup-plugin-svelte for rollup or svelte-loader from webpack.
- `wrapperProps` (optional) should be an object contains wrapper `element`, `id`, `className` and `styles`.
   - `element` : all component have a base wrapper element, by default this is a `<div>` but you can pass in a string to customise this behaviour (eg: 'span', 'li', etc.)
   - `id` : add an id attribute to the base wrapper element, by default this is `svelte-wrapper`.
   - `className` : add a class attribute to the base wrapper element which you can define styles in your css files.
   - `styles` : add an inline styles attribute to the base wrapper element which can override the `className` attribute.
  
# Cli
Try svere out locally with our [CLI](https://github.com/FE-PIRL/svere/tree/master/packages/cli)

With [npm](https://www.npmjs.com/):

```bash
npm install -g @svere/cli
```

Or with [yarn](https://yarnpkg.com/lang/en/):

```bash
yarn add global @svere/cli
```