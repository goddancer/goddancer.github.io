## build-demo

* js和ts项目可以混用，ts项目引入以后，打包同样需要过一次`babel`，以抹平不兼容语法，如可选链

```javascript
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