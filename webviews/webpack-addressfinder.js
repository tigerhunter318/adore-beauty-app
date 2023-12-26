const path = require('path')
const config = require('./webpack.js')

module.exports = {
  ...config,
  output: {
    ...config.output,
    filename: 'addressfinder.js',
    path: path.join(__dirname, '../assets/webviews/build/addressfinder/')
  },
  entry: ['@babel/polyfill', path.join(__dirname, 'src/addressfinder/index.js')]
}
