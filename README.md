<p align="center" style="font-family: 'Fira Code', 'Roboto Mono', 'Consolas', monospace; font-size: 36px;">svere</p>

<p align="center" style="font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif">
  Write components once, run everywhere. Make svelte components run inside React or Vue applications.
</p>

<p align="center">
  <a href="https://github.com/FE-PIRL/svere/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://github.com/FE-PIRL/svere/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
  <a href="https://npmjs.org/package/svere"><img alt="Downloads" src="https://img.shields.io/npm/dm/svere.svg?style=flat-square" /></a>
  <a href="https://npmjs.org/package/svere" rel="nofollow"><img alt="Version" src="https://img.shields.io/npm/v/svere.svg?style=flat-square"></a>
</p>

---

- [Intro](#intro)
- [Install](#install)
- [Use it](#use-it)
- [Examples](#examples)
    - [React](#react)
    - [Vue2](#vue2)
    - [Vue3](#vue3)
- [Todos](#todos)

# Intro

Managing support for libraries that provide UI components across frameworks is a pain, 
especially when [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) are not an option (e.g. for server side rendering, best performance, etc).

At present, the [svelte](https://svelte.dev/) framework is developing rapidly. 
It is a good backward compatibility solution to make svelte components run in the old `react` or `vue` project, 
especially when the team's technology stack is not unified, this provides an idea of cross-framework sharing component.

`Svere` contains several `adapters` for React/Vue2/Vue3 which allows you to pass props and respond to events in a way that makes sense for that library.
Also, it provides a `cli` to quickly create svelte components that can be shared across components.

# Install

With [npm](https://www.npmjs.com/):

```bash
npm install svere
```

Or with [yarn](https://yarnpkg.com/lang/en/):

```bash
yarn add svere
```