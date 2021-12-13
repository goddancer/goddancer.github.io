var path = require('path');
var config = require('../config/build.conf');

exports.assetsPath = function (_path) {
  var assetsSubDirectory =
    process.env.NODE_ENV === 'production'
      ? config.prod.assetsSubDirectory
      : config.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
};