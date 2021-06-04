# SVERE Core

Adpaters for svere.

<p align="center">
  <a href="https://github.com/FE-PIRL/svere/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://github.com/FE-PIRL/svere/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@svere/core"><img alt="Downloads" src="https://img.shields.io/npm/dm/@svere/core" /></a>
  <a href="https://www.npmjs.com/package/@svere/core" rel="nofollow"><img src="https://img.shields.io/npm/v/@svere/core.svg?sanitize=true"></a>
</p>

English | [简体中文](https://github.com/FE-PIRL/svere/blob/master/packages/core/README_ZH.md)

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
Also, it provides a [cli](https://github.com/FE-PIRL/svere/blob/master/packages/cli/README.md) to quickly create svelte components that can be shared across components.

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

# Examples

In the examples below, the [svelte component](https://github.com/FE-PIRL/svere/blob/master/examples/src/Component.svelte) we will be using is a simple component that accepts a prop that will be rendered and emits an event upon clicking a button.
Bundle it to a single file with `umd` format, then it will be imported by other framework  conveniently.

```sveltehtml
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let name: string;

  let count = 0;

  function handleChangeCount(event) {
    count += 1;
    dispatch('someEvent', count);
  }
  function handleChangeName() {
    name = 'boss';
  }
</script>

<main>
  <h1>Hello {name}, welcome!</h1>
  <button on:click={handleChangeCount}>
    add count: {count}
  </button>
  <button on:click={handleChangeName}>
    update name: {name}
  </button>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>
```

## React

```jsx
import React, { useState } from "react";
import SvelteComponent from "./svelte-component";
import toReact from '@svere/core/dist/react.js'

const wrapperProps = {
  element: "section",
  className: "section-css",
  id: "svelte-react",
  styles: {
    border: "1px solid gray",
  },
};
const ReactComponent = toReact(SvelteComponent, wrapperProps);

const App = () => {
  const [name, setName] = useState('ben');
  const changeName = () => setName(n => {
    return name === 'ben' ? 'yasin' : 'ben'
  });

  const handleEventCallback = (e) => {
    console.log(e.detail)
  };

  const handleWatchCallback = (name) => {
    console.log(name)
  };

  return (
    <div>
      <ReactComponent
          name={name}
          onSomeEvent={handleEventCallback}
          watchName={handleWatchCallback}
      />

      <br/>

      <button onClick={changeName}> change inner variable name </button>
    </div>
  );
};
```

## Vue2

```vue
<template>
  <div>
    <VueComponent
      :name="name"
      @someEvent="handleEventCallback"
      @watch:name="handleWatchCallback"
    />
    <button @click="changeName">change inner variable name</button>
  </div>
</template>

<script>
import SvelteComponent from "./svelte-component";
import toVue from '@svere/core/dist/vue.js'

export default {
  components: {
    VueComponent: toVue(SvelteComponent)
  },
  data() {
    return {
      name: 'ben'
    };
  },
  methods: {
    changeName() {
       this.name = this.name === 'ben' ? 'yasin' : 'ben'
    },
    handleEventCallback(e){
      console.log(e.detail)
    },
    handleWatchCallback(name){
      console.log(name)
    }
  }
};
</script>
```

## Vue3

```vue
<template>
  <VueComponent
          :name="name"
          @someEvent="handleEventCallback"
          @watch:name="handleWatchCallback"
  />
  <br/>
  <button @click="changeName">change inner variable name</button>
</template>

<script>
import {ref} from 'vue'
import SvelteComponent from "./svelte-component";
import toVue3 from '@svere/core/dist/vue3.js'
const wrapperProps = {
  element: "section",
  className: "section-css",
  id: "svelte-react",
  styles: {
    border: "1px solid gray",
  },
};
export default {
  name: 'App',
  components: {
    VueComponent: toVue3(SvelteComponent,wrapperProps)
  },
  setup() {
    const name = ref('ben')
    const changeName = () => {
      name.value = name.value === 'ben' ? 'yasin' : 'ben'
    }
    const handleEventCallback = (e)=>{
      console.log(e.detail)
    }
    const handleWatchCallback = (name)=>{
      console.log(name)
    }
    return {
      name,
      changeName,
      handleEventCallback,
      handleWatchCallback
    }
  }
}
</script>

<style>
body {
  text-align: center;
}
</style>
```

# Cli
Try svere out locally with our [CLI](https://github.com/FE-PIRL/svere/tree/master/packages/cli)

With [npm](https://www.npmjs.com/):

```bash
npm install @svere/cli
```

Or with [yarn](https://yarnpkg.com/lang/en/):

```bash
yarn add @svere/cli
```

# Todos

- develop core to add more features, eg: sub-component, slots.