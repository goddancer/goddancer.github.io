const rootProdConf = require('../../../../webpack/webpack.prod.conf.js');
const { merge } = require('webpack-merge');
const path = require('path');
const packageJSON = require('../package.json');

const USE_VERSION_PATH = process.env.USE_VERSION_PATH === 'true';
module.exports = merge(rootProdConf, {
  output: {
    path: path.resolve(__dirname, USE_VERSION_PATH ? `../dist/${packageJSON.version}` : '../lib'),
    publicPath: '/packages/apps/vw-rem/lib',
  },
  resolve: {
    modules: ['node_modules'],
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