# SVERE CORE

svere的核心适配器.

<p align="center">
  <a href="https://github.com/FE-PIRL/svere/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
  <a href="https://github.com/FE-PIRL/svere/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@svere/core"><img alt="Downloads" src="https://img.shields.io/npm/dm/@svere/core" /></a>
  <a href="https://www.npmjs.com/package/@svere/core" rel="nofollow"><img src="https://img.shields.io/npm/v/@svere/core.svg?sanitize=true"></a>
</p>

简体中文 | [English](https://github.com/FE-PIRL/svere/blob/master/packages/core/README.md)

---

- [介绍](#介绍)
- [安装](#安装)
- [用法](#用法)
- [示例](#示例)
    - [React](#react)
    - [Vue2](#vue2)
    - [Vue3](#vue3)
- [命令行](#命令行)
- [待办](#待办)

# 介绍

众所周知, 使提供UI组件的库跨框架使用是一件痛苦的事,
尤其当[Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 不是一个选项的时候(比如服务端渲染,最佳性能等).

目前, [svelte](https://www.sveltejs.cn/) 框架正在快速发展. 
让svelte组件跑在旧的`react`或`vue` 工程中是一个好的向后兼容的方案, 
尤其当团队的技术栈不统一时,这提供了一个跨框架共享组件的思路.

`Svere`包含了几个对`React/Vue2/Vue3`的`适配器`, 允许你使用一种对组件有意义的方式传递参数和响应事件.
同时，它提供一个[cli](https://github.com/FE-PIRL/svere/blob/master/packages/cli/README_ZH.md) 可以用来快速创建可跨框架共享的组件的模板.

# 安装

使用 [npm](https://www.npmjs.com/):

```bash
npm install @svere/core
```

或 [yarn](https://yarnpkg.com/lang/en/):

```bash
yarn add @svere/core
```

# 用法

svere的核心暴露了几个适配器函数, 可称之为`toReact`, `toVue` 和 `toVue3`.
每个适配器都是一个简单的函数, 它接受一个svelte组件和一些选项并且返回可以在Vue模板或JSX中使用的Vue或React组件.

所有的适配器函数都有如下相同的入参, 例如:
```ts
toReact(Component: SvelteComponent, wrapperProps?: WrapperProps) : Component
```
- `Component` 是一个编译过的svelte组件,使用rollup时配合rollup-plugin-svelte，或使用webpack时配合svelte-loader，作为构建过程中的一步进行预编译或编译.
- `wrapperProps` (可选) 是一个包裹对象, 包含了 `element`, `id`, `className` 和 `styles`.
   - `element` : 所有组件都有一个基础的包裹元素, 默认是`<div>` 但你也可以传入一个字符串来定制它 (比如: 'span', 'li' 等.)
   - `id` : 在基础包裹元素上添加id属性, 默认是`svelte-wrapper`.
   - `className` : 在基础包裹元素上添加class属性，允许你在样式文件定义实现.
   - `styles` : 在基础包裹元素上添加内联样式属性, 可以覆盖`className`中的样式定义.

# 示例

在下面的例子中, 我们要使用的[svelte component](https://github.com/FE-PIRL/svere/blob/master/examples/src/Component.svelte) 是一个接受prop后渲染, 通过点击触发事件的简单组件.
将它打包成`umd`格式的单文件, 以便于可以被其它框架方便地引入.

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

# 命令行
使用我们的[CLI](https://github.com/FE-PIRL/svere/tree/master/packages/cli) 在本地尝试svere.

使用 [npm](https://www.npmjs.com/):

```bash
npm install @svere/core
```

或 [yarn](https://yarnpkg.com/lang/en/):

```bash
yarn add @svere/core
```

# 待办

- 添加更多特性到core中, 例如: 子组件、插槽.