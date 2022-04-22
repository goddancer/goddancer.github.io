---
layout: post
title: mono-repo
categories: [Javascript]
description: mono-repo
keywords: monorepo, mono-repo
---

1、通过root dir整合公共依赖资源，如webpack、bable、ts、eslint、prettier等，目的是使单monorepo架构项目集合的各个子项目规范宏观一致
2、每个子项目都应该严格有自己的dependence以及devDependence，及时yarn会hoist，也需要有严格的依赖声明，使得项目迁移变得简单
3、

## 打包配置

### 兼容性抹平

* 需要保证无论引入的`ts`还是`js`文件，都需要经过`babel`进行语法抹平

```javascript
// webpack rule
{
  test: /\.js$/,
  exclude: [/node_modules/],
  loader: 'babel-loader',
  options: {
    rootMode: 'upward',
  },
},
{
  test: /\.tsx?$/,
  use: [{
    loader: 'babel-loader',
    options: {
      rootMode: 'upward',
    }
  }, 'ts-loader'],
  exclude: /node_modules/,
},
```

```javascript
// babel
{
  "presets": [
    [
      "minify",
      {
        "builtIns": false
      }
    ],
    [
      "@babel/preset-env",
      {
        "modules": "auto",
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ],
    "@babel/preset-typescript"
  ],
  "plugins": [
    [
      "import",
      {
        "libraryName": "vant",
        "libraryDirectory": "es",
        "style": true
      },
      "vant"
    ],
    "@babel/plugin-transform-typescript",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-optional-chaining"
  ],
  "babelrcRoots": ["."],
  "overrides": [
    {
      "ignore": [
        "**/node_modules/*",
        "**/vendor/*"
      ]
    }
  ]
}
```

--

[1] [项目级 monorepo 策略最佳实践](https://segmentfault.com/a/1190000039157365)