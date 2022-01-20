const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('../package.json');
const rootPath = path.resolve(__dirname, '../');
const packageJSON = require('../package.json');

const isProd = process.env.NODE_ENV === 'production';
let isDebuger = process.env.DATA == 'debuger';
let isConcole = process.env.LOG === 'true';

module.exports = {
  entry: {
    app: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, isProd ? `../dist/${packageJSON.version}` : '../dist'),
    publicPath: isProd ? '/' : '/',
    filename: path.posix.join('./js/', isProd ? '[name].js?[contenthash:8]' : 'js/[name].js'),
    chunkFilename: '[name].js',
    assetModuleFilename: 'img/[name][ext]?[hash:8]',
    clean: true,
  },
  resolve: {
    modules: ['node_modules'],
    extensions: [' ', '.js', '.ts', '.vue', '.less', '.scss'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
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
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1000,
          }
        },
        /* generator: {
          filename: 'img/[name][ext]?[hash:8]',
        } */
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1000,
          }
        },
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
            loader: 'postcss-loader',
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
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /.*\.preprocess\.htm/,
        loader: 'html-loader',
        exclude: /(src\/vendor\/|node_modules)/,
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': 'development',
      VERSION: JSON.stringify(pkg.version),
      ISDEBUGER: isDebuger,
      ISCONSOLE: isConcole,
      ENV: JSON.stringify(process.env.ENV),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css?[contenthash:8]',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.preprocess.htm',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false,
      },
    }),
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
        /* vue: {
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
              /[/]common-module[/]/.test(module.resource)
            );
          },
          priority: 1,
        },
        lang: {
          name: 'lang',
          test: /[/]src[/]locales[/]/,
          priority: 1,
        }, */
      },
    },
  },
};
