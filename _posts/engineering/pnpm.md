---
layout: post
title: 前端工程化-pnpm
categories: [Engineering]
description: 前端工程化-pnpm
keywords: pnpm, yarn, npm
---

### 什么是幻影依赖问题？

```js
resolve: {
  extensions: ['.js', '.vue', '.json'],
  alias: {
    '@': path.join(__dirname, '../src'),
  },
  modules: [path.join(__dirname, 'node_modules'), upper.resolve('../node_modules')],
},
```

集合上面代码，我们可以更方便的理解：
* 当`packageA`安装了依赖包`B`，采用`yarn`/`npm`方式安装，会默认进行`hoist`以节约磁盘空间，所以`B`被提升到顶级`node_modules`
  * 不限于`mono-repo`架构，单例`project`也会存在这个问题，因为`project`下可能存在某子包依赖被提升的问题
  * 此时，只有子包声明了该依赖，但是因为`hoist`，整个`project`都可以访问到这个被提升的依赖包
* 此时集合`node_modules`解析命令配置，在`mono-repo`架构下，也会存在这个问题，因为提升，导致了某`package`未声明某依赖，已然可以访问的问题
  * 假如将该项目从`mono-repo`架构迁移出来，则有可能无法正常运行
* **幻影依赖的本质：某依赖未被显式声明，但仍可以访问/依赖到**

---

[1] []()
