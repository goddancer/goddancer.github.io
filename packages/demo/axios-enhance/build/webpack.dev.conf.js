const rootDevConf = require('../../../../webpack/webpack.dev.conf');
const { merge } = require('webpack-merge');
const path = require('path');

module.exports = merge(rootDevConf, {
  output: {
    path: path.resolve(__dirname, '../dist'),
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