const rootProdConf = require('../../../../webpack/webpack.prod.conf.js');
const { merge } = require('webpack-merge');
const path = require('path');

module.exports = merge(rootProdConf, {
  output: {
    path: path.resolve(__dirname, '../lib'),
  }
});