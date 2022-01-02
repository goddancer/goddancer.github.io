const rootProdConf = require('../../../webpack/webpack.prod.conf.js');
const { merge } = require('webpack-merge');
const path = require('path');

module.exports = merge(rootProdConf, {
  output: {
    path: path.resolve(__dirname, '../lib'),
  },
  module: {
    rules: [
      {
        test: /\.text$/,
        type: 'asset/source',
        generator: {
          filename: '[name][ext]?[hash:8]',
        }
      }
    ]
  }
});