const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: {
    autoprefixer,
    'postcss-pxtorem': {
      rootValue: 37.5,
      unitPrecision: 5,
      propList: ['*'],
    },
  },
}
