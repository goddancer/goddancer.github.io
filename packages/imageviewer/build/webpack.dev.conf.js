const rootDevConf = require('../../../webpack/webpack.dev.conf.js');
const { merge } = require('webpack-merge');
const path = require('path');

module.exports = merge(rootDevConf, {
  output: {
    path: path.resolve(__dirname, '../dist'),
  }
});