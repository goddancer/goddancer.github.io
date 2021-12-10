const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const HtmlWebpackPluginWithVersion = require('./plugin/html-webpack-plugin-withversion');

const pkg = require('../package.json');
const config = require('../config/build.conf');
const utils = require('./utils');
const srcDirPath = path.resolve(__dirname, '../src');
const rootPath = path.resolve(__dirname, '../');

const isProd = process.env.NODE_ENV === 'production';
let isDebuger = process.env.DATA == 'debuger';
console.log('process.env.DATA', isDebuger);
let isConcole = process.env.LOG === 'true';
console.log('process.env.CONSOLE', isConcole);
let projectName = process.env.PROJECT_NAME || 'common';
console.log('process.env.projectName', projectName);
const projectConfig = require('../config/project.config')[projectName];

module.exports = {
  entry: {
    app: projectConfig.entryIndex,
  },
  output: {
    path: projectConfig.assetsRoot || config.prod.assetsRoot,
    publicPath: isProd ? config.prod.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: [' ', '.js', '.ts', '.vue', '.scss'],
    alias: projectConfig.alias,
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: rootPath,
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: rootPath,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
          {
            loader: 'sass-resources-loader',
            options: {
              resources: path.join(srcDirPath, '/components/yf-comp/styles/theme.scss'),
            },
          },
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        include: [path.join(srcDirPath, '/assets/noHash')],
        options: {
          limit: 1000,
          esModule: false,
          name: utils.assetsPath('img/[name].[ext]'),
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [
          path.join(srcDirPath, '/components/yf-comp/assets/icons'),
          path.join(srcDirPath, '/assets/noHash'),
        ],
        options: {
          limit: 10000,
          esModule: false,
          name: utils.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [path.join(srcDirPath, '/components/yf-comp/assets/icons')],
        options: {
          symbolId: 'icon-[name]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
        },
      },
      {
        test: /.*\.preprocess\.htm/,
        loader: path.resolve(__dirname, '../common-module/htmlEnv/wfhtml-loader.js'),
        exclude: /(src\/vendor\/|node_modules)/,
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
      VERSION: JSON.stringify(pkg.version),
      ISDEBUGER: isDebuger,
      ISCONSOLE: isConcole,
      ENV: JSON.stringify(process.env.ENV),
      PROJECT_NAME: JSON.stringify(projectName),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css?[contenthash:8]',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.preprocess.htm',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),
    // new HtmlWebpackPluginWithVersion({
    //   version: String(+new Date()).substring(6),
    // }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      automaticNameDelimiter: '.',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /node_modules/,
          priority: 1,
        },
        vue: {
          name: 'vue-vendors',
          test: module => {
            return (
              module.resource &&
              /\/@vue|vue-router|vuex|vue-i18n|vue[/]dist\//.test(module.resource)
            );
          },
          priority: 2,
        },
        otherVendors: {
          name: 'other-vendors',
          test: module => {
            return (
              module.resource && /\/lodash|vant|axios|events|tapable[/]lib\//.test(module.resource)
            );
          },
          priority: 2,
        },
        subVendors: {
          name: 'sub-vendors',
          test: module => {
            return module.resource && /\/semver|crypto-js|elliptic|bn.js\//.test(module.resource);
          },
          priority: 2,
        },
        browserify: {
          name: 'browserify',
          test: module => {
            return (
              module.resource &&
              /\/browserify-sign|stream-browserify|browserify-des|browserify-aes\//.test(
                module.resource,
              )
            );
          },
          priority: 2,
        },
        runtime: {
          name: 'runtime',
          test: module => {
            return (
              module.resource &&
              /\/core-js|stream-browserify|@babel-runtime\//.test(module.resource)
            );
          },
          priority: 2,
        },
        yfComp: {
          name: 'youyu-verdors',
          test: module => {
            // /[/]src[/]components[/]yf-comp[/]|[/]common-module[/]|[/]/
            return (
              module.resource &&
              /[/]src[/]components[/]yf-comp[/]|[/]common-module[/]|@youyu/.test(module.resource)
            );
          },
          priority: 1,
        },
        components: {
          name: 'view-comps',
          test: /[/]src[/]components[/]view-comp[/]|[/]src[/]assets[/]/,
          priority: 1,
        },
        lang: {
          name: 'lang',
          test: /[/]src[/]locales[/]/,
          priority: 1,
        },
      },
    },
  },
};
