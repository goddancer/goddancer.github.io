const rootProdConf = require('../../../webpack/webpack.prod.conf.js');
const { merge } = require('webpack-merge');
const path = require('path');

console.log('__dirname123: ', __dirname);
module.exports = merge(rootProdConf, {
  output: {
    path: path.resolve(__dirname, '../lib'),
  }
});