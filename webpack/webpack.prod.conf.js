const path = require('path');
const { merge } = require('webpack-merge');
const compressionWebpackPlugin = require('compression-webpack-plugin');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const packageJSON = require('../package.json');
const baseWebpackConfig = require('./webpack.base.conf');

const BundleAnalyzerPlugin = webpackBundleAnalyzer.BundleAnalyzerPlugin;

var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  output: {
    path:  path.resolve(__dirname, '../dist') + '/' + packageJSON.version,
    publicPath: '',
    filename: path.posix.join('./js/', '[name].js?[contenthash:8]'),
    chunkFilename: '[name].js',
  },
  plugins: [
    new compressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp(`\\.(${['html', 'js', 'css'].join('.*|')}.*)$`),
      threshold: 100 * 1000,
      minRatio: 0.8,
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        parallel: 4,
        extractComments: false,
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
