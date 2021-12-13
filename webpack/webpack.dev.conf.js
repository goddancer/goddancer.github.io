const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const USE_HTTPS = process.env.ENV === 'qa';

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  target: 'web',
  devServer: {
    open: true,
    historyApiFallback: true,
    compress: true,
    hot: true,
    host: USE_HTTPS ? 'local-qa.goddancer.com' : 'local.goddancer.com',
    port: 8082,
    https: USE_HTTPS,
    allowedHosts: ['local.goddancer.com', 'local-qa.goddancer.com'],
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin(), new webpack.HotModuleReplacementPlugin()],
});
