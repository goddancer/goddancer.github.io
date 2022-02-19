const rootDevConf = require('../../../../webpack/webpack.dev.conf');
const { merge } = require('webpack-merge');
const path = require('path');

module.exports = merge(rootDevConf, {
  output: {
    path: path.resolve(__dirname, '../lib'),
  },
  resolve: {
    modules: [path.resolve(__dirname, '../node_modules'), path.resolve(__dirname, '../../../../node_modules')],
    extensions: [' ', '.js', '.ts', '.vue', '.less', '.scss', 'css'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
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