'use strict'

module.exports = {
  entry: {
    index: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/dev-server',
      'mocha!./test/index.js'
    ]
  },

  output: {
    path: __dirname,
    filename: 'test-bundle.js'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }]
  }
}
