---
layout: post
title: Asset Modules Of Webpack5
categories: [webpack5]
description: webpack5支持4种module types，来处理静态资源；不再需要raw-loader,url-loader,file-loader。
keywords: webpack5, asset module
---

> Asset Modules is a type of module that allows one to use asset files(fonts, icons, etc) without configuring addtional loaders.

![asset-module]({{site.url}}/mind/webpack5/asset-module.png)

## custome output filename

### 1、by setting `output.assetModuleFilename`

```javascript
module.exports = {
  output: {
    assetModuleFilename: 'assets/[hash][ext][query]',
  }
}
```

### 2、by setting loader `generator.filename`

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.html/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]?[hash:8]',
        }
      }
    ]
  }
}
```

## asset type 的区别

启动一个最简单的例子，看直观看一下dist文件的区别。前期准备：

```javascript
// webpack core

// main.js
import './test.text'

// test.text
this is test text!
```

### 1、asset/inline

* **将`test.text`的文件内容，采用`data URI`的形式进行了inline输出。**

```javascript
// webpack core
module.exports = {
  module: {
    rules: [
      {
        test: /\.text$/,
        type: 'asset/inline',
      }
    ]
  }
}

// output
(()=>{"use strict";var r={709:r=>{r.exports="data:text/plain;base64,dGhpcyBpcyB0ZXN0IHRleHQh"}},t={};function e(p){var s=t[p];if(void 0!==s)return s.exports;var a=t[p]={exports:{}};return r[p](a,a.exports,e),a.exports}e(709)})();
```
### 2、asset/resource

* **对`test.text`做了rename操作，并导出URL**
* **将`test.text`文件输出到了`dist`目录**

```javascript
// webpack core
module.exports = {
  module: {
    rules: [
      {
        test: /\.text$/,
        type: 'asset/resource',
        generator: {
          filename: '[hash][ext]?[query]',
        }
      }
    ]
  }
}

// output
(()=>{"use strict";var t={706:(t,r,e)=>{t.exports=e.p+"test.text?fea5d322"}},r={};function e(s){var o=r[s];if(void 0!==o)return o.exports;var p=r[s]={exports:{}};return t[s](p,p.exports,e),p.exports}e.p="",e(706)})();
```

### 3、asset/source

* **将`test.text`的文件内容直接进行了导出**

```javascript
// webpack core
module.exports = {
  module: {
    rules: [
      {
        test: /\.text$/,
        type: 'asset/source',
        generator: {
          filename: '[hash][ext]?[query]',
        }
      }
    ]
  }
}

// output
(()=>{"use strict";var t={345:t=>{t.exports="this is test text!"}},r={};function e(s){var o=r[s];if(void 0!==o)return o.exports;var i=r[s]={exports:{}};return t[s](i,i.exports,e),i.exports}e(345)})();
```

### 4、asset

* **通过`maxSize`自动选择是`resource`模式还是`inline`dataURI模式**

```javascript
// webpack core
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1 * 1024, // 1kb
          }
        },
      }
    ]
  }
}

// output auto
```