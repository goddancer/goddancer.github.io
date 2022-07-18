---
layout: post
title: webpack5升级指南
categories: [Webpack]
description: webpack5升级指南
keywords: webpack5
---

## 代码压缩

* webpack5默认内置了terser-webpack-plugin，但如果需要自定义配置时，仍然需要重新安装terser-webpack-plugin，[参考](https://webpack.docschina.org/plugins/terser-webpack-plugin/)

```js
optimization: {
  runtimeChunk: true,
  minimize: true,
  minimizer: [
    new OptimizeCSSAssetsPlugin(),
    new TerserPlugin({
      terserOptions: {
        format: {
          // 是否删除comments
          comments: false,
        },
      },
      // 是否提取comments单独到一个text文件
      extractComments: false,
    }),
    '...',
  ],
},
```

## 第三方verndor拆包

* [参考](https://webpack.docschina.org/concepts/entry-points/#separate-app-and-vendor-entries)
* 当设置如下vendor时，即使main.js中没有引入对应的vendor三方库，打包出来的代码也会包含这部分vendor代码
  * 这部分代码会打包为单独的chunk，内容hash保持不变，使浏览器可以独立地缓存它们，从而减少加载时间

```js
entry: {
  app: './src/main.js',
  vendor: [
    'immutable',
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-dom',
    'redux',
    'antd',
    'moment',
    'moment-timezone',
  ],
},
```

**需要注意，具体是否单独打包为单独的bundle，需要配合splitChunk使用**

* maxSize 0 为默认值，表示webpack尝试将大于maxSize个字节的chunk分割为较小的代码块，这些较小的代码块提及至少为minSize
  * maxSize目的是与HTTP/2和强缓存一起使用，通过增加请求数量以实现更好的缓存效果

```js
splitChunks: {
  chunks: 'async',
  minSize: 30000,
  maxSize: 0, // 比较奇怪的是，只有设置为0时才会拆分为多个vendor js；使用默认值0则不会
  minChunks: 1,
  maxAsyncRequests: 6,
  maxInitialRequests: 4,
  automaticNameDelimiter: '~',
  cacheGroups: {
    commons: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendor',
      chunks: 'all',
    },
  },
},
```

**最佳实践？**
* 看是否可以通过splitChunk切分的方式，单独按照vendor为界限进行切分
* 抉择进行gzip以后，网络请求耗时和文件大小耗时时间的平衡

## process未定义

* webpack5不再引入nodejs变量的polyfill，在前端代码中应避免使用
  * [参考](https://webpack.docschina.org/migrate/5/)
  * [解决办法](https://stackoverflow.com/questions/41359504/webpack-bundle-js-uncaught-referenceerror-process-is-not-defined)

---

[1] []()