const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const projectConfig = require('../config/project.config');
const USE_HTTPS = process.env.ENV === 'qa';
const PROJECT_NAME = process.env.PROJECT_NAME || 'common';
const config = projectConfig[PROJECT_NAME];
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  target: 'web',
  devServer: {
    open: true,
    openPage: config.openPage,
    historyApiFallback: true,
    contentBase: config.contentBase,
    compress: true,
    hot: true,
    host: USE_HTTPS ? 'local-qa.youyu.cn' : 'local.reotest.com',
    port: 8082,
    https: USE_HTTPS,
    allowedHosts: ['local.reotest.com', 'local-qa.youyu.cn'],
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin(), new webpack.HotModuleReplacementPlugin()],
});
