---
layout: post
title: webpack hash and chunkhash and contenthash
categories: [Webpack]
description: webpack hash and chunkhash and contenthash
keywords: webpack, hash, chunkhash, contenthash
---
## module and chunk and bundle

一句话解释：**我们写出来的是module，webpack处理时是chunk，处理完成后可直接被浏览器解析的是bundle**

```text
src/
├── index.css
├── index.html # 这个是 HTML 模板代码
├── index.js
├── common.js
└── utils.js
```

```js
{
  entry: {
    index: "../src/index.js",
      utils: '../src/utils.js',
    },
  output: {
    filename: "[name].bundle.js", // 输出 index.js 和 utils.js
    },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 创建一个 link 标签
          'css-loader', // css-loader 负责解析 CSS 代码, 处理 CSS 中的依赖
        ],
      },
    ]
  }
  plugins: [
    // 用 MiniCssExtractPlugin 抽离出 css 文件，以 link 标签的形式引入样式文件
    new MiniCssExtractPlugin({
      filename: 'index.bundle.css' // 输出的 css 文件名为 index.bundle.css
    }),
  ]
}
```

由以上配置关系，我们运行webpack可得输出如下：

![webpack module and chunk and bundle]({{site.url}}/assets/images/webpack/02.png)

![webpack module and chunk and bundle]({{site.url}}/assets/images/webpack/01.png)

由上可知：

* 首先，我们文件中引用的每个module即为一个单独的子模块，即**module**
* webpack以entry每个文件作为解析入口，进行*module*依赖分析，生成chunk文件，即**chunk**
* webpack对chunk文件进行处理，完成后，输出bundle文件，即**bundle**
  * bundle即经过处理，能被浏览器直接解析的最终文件

一般来说：

* 一个webpack入口entry即对应一个chunk
* 一个chunk即对应一个bundle

但是存在场景：

* 使用 `MiniCssExtractPlugin`进行chunk切分，将js中引用的css部分，从chunk中切分，生成单独的bundle
* 通过配置 `splitchunk`组，将chunk汇总进行切分，生成不同的bundle
  * 目的是切分更新频率低的代码部分，进行高效缓存利用，提升性能
* 配置动态引入/路由时，会有额外的chunk

## hash and chunkhash and contenthash

```js
module.exports = {
  entry: './src/main.js',
  plugins: [],
  output: {
    filename: '[name].[hash/chunhash/contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
}
```

### hash

```js
output: {
  filename: '[name].[hash].js',
  path: path.resolve(__dirname, 'dist'),
},
```

具有一下特征：

* 一次构建，所有bundle的hash是一样的，每次构建都会计算出新的hash，即使文件内容本身没有变更
* 缺点也比较明显：
  * 无法复用缓存逻辑，因为每次构建都会是新的hash，导致所有文件无法缓存
* 优点/价值/意义：
  * 算法相对简单，构建性能更好，更快

### chunkhash

```js
output: {
  filename: '[name].[chunkhash].js',
  path: path.resolve(__dirname, 'dist'),
},
```

具有以下特征：

* 一个chunk组，一次打包出来的bundle的hash是一样的
* 缺点：
  * 使用 `MiniCssExtractPlugin`进行切分以后，css bundle的hash值是复用的切分之前的chunk组hash
  * 也即，因为css bundle是从包含css的jschunk组中切分出来的，所以存在场景，仅当js发生变化时，css的hash值也会发生变化，导致缓存失效

### contenthash

```js
output: {
  filename: '[name].[contenthash].js',
  path: path.resolve(__dirname, 'dist'),
},
```

具有以下特征：

* 无论是否使用 `MiniCssExtractPlugin`进行chunk切分，都不会影响contenthash
  * **因为contenthash是基于bundle计算的**
  * 所以，此时如果只更新了包含css的js代码部分，并不会影响css bundle的缓存，因为css bundle的contenthash是基于拆分chunk生成的bundle单独计算的

---

【1】[webpack-filename-chunkFilename](https://www.cnblogs.com/skychx/p/webpack-filename-chunkFilename.html)
