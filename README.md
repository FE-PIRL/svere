<p align="center"><img width="200" alt="svere" src="https://user-images.githubusercontent.com/1866848/118639391-7100e580-b80a-11eb-88e1-4a2b547ad475.png"></p>

<p align="center">
  Write components once, run everywhere. Make svelte components run inside React or Vue applications.
</p>

<p align="center">
  <a href="https://github.com/FE-PIRL/svere/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://github.com/FE-PIRL/svere/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@svere/core"><img alt="Downloads" src="https://img.shields.io/npm/dm/@svere/core" /></a>
  <a href="https://www.npmjs.com/package/@svere/core" rel="nofollow"><img src="https://img.shields.io/npm/v/@svere/core.svg?sanitize=true"></a>
</p>

---

Managing support for libraries that provide UI components across frameworks is a pain,
especially when [Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) are not an option (e.g. for server side rendering, best performance, etc).

At present, the [svelte](https://svelte.dev/) framework is developing rapidly.
It is a good backward compatibility solution to make svelte components run in the old `react` or `vue` project,
especially when the team's technology stack is not unified, this provides an idea of cross-framework sharing component.


# [CORE](https://github.com/FE-PIRL/svere/blob/master/packages/core/README.md)

> #### Adapters for react、vue2 and vue3

# [CLI](https://github.com/FE-PIRL/svere/blob/master/packages/cli/README.md)

> #### An all-in-one cli for quickly create svelte components


## How does it work

<p align="center">
<img style="width: 500px" src="https://user-images.githubusercontent.com/1866848/120762292-afa3d900-c548-11eb-9602-934730de2623.png">
</p>

`Svere` contains several `adapters` for `React/Vue2/Vue3` which allows you to pass props and respond to events in a way that makes sense for that library.
Also, it provides a [cli](https://github.com/FE-PIRL/svere/blob/master/packages/cli/README.md) to quickly create svelte components that can be shared across components.

<p align="center" style="width: 500px">
<img style="width: 80%" src="https://user-images.githubusercontent.com/1866848/120759562-b5e48600-c545-11eb-8ae4-95c901581f7c.png">
</p>

Svere use the life cycle hooks of each framework to complete the mounting, updating and uninstalling of svelte components.

## Value and efficacy

1. Increased efficiency
   
>   Focus on the writing of business components without caring about the user, which greatly improves the development efficiency

2. Cross-stack reuse
   
> Solve the problem of sharing a single component between different technology stacks, and achieve a certain sense of environment independence

3. Visual Unity
   
> Only one piece of code is maintained, and the performance of components under different technology stacks can be guaranteed to be consistent