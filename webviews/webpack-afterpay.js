const path = require('path')
const config = require('./webpack.js')

module.exports = {
  ...config,
  output: {
    ...config.output,
    filename: 'afterpay.js',
    path: path.join(__dirname, '../assets/webviews/build/afterpay/')
  },
  entry: ['@babel/polyfill', path.join(__dirname, 'src/afterpay/index.js')]
}
