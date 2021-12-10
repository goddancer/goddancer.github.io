const path = require('path');
const { merge } = require('webpack-merge');
const compressionWebpackPlugin = require('compression-webpack-plugin');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const config = require('../config/build.conf');
const packageJSON = require('../package.json');
const baseWebpackConfig = require('./webpack.base.conf');

const projectName = process.env.PROJECT_NAME;
const BundleAnalyzerPlugin = webpackBundleAnalyzer.BundleAnalyzerPlugin;

var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: config.prod.productionSourceMap ? 'source-map' : false,
  output: {
    path: config.prod.assetsRoot + '/' + (projectName ? projectName : packageJSON.version),
    publicPath: '',
    filename: path.posix.join('./', '[name].js?[contenthash:8]'),
    chunkFilename: '[name].js',
  },
  plugins: [
    new compressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp(`\\.(${['html', 'js', 'css'].join('.*|')}.*)$`),
      threshold: 300 * 1000,
      minRatio: 0.8,
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        parallel: 4,
        terserOptions: {
          toplevel: true,
          sourceMap: false,
          format: {
            beautify: false,
            comments: false,
          },
          compress: {
            dead_code: true,
            collapse_vars: true,
            reduce_vars: true,
          },
          mangle: {
            reserved: ['GLOBAL_API'],
          },
        },
      }),
    ],
  },
});

if (process.env.USE_REPORT) {
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
