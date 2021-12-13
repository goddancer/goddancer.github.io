// webpack config
const path = require('path');

module.exports = {
  dev: {
    env: 'development',
    port: 8082,
    assetsSubDirectory: '/',
    assetsPublicPath: '/',
    proxyTable: {},
    cssSourceMap: false,
  },
  prod: {
    env: 'production',
    index: path.resolve(__dirname, `../dist/index.html`),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
  },
};
