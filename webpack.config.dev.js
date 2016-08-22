var path = require('path')
var webpack = require('webpack')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve:{
    modulesDirectories: ['node_modules', 'src']
  },
  plugins: [],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      include: path.join(__dirname, 'src'),
      query: {
        presets: [['es2015', {
          "modules": false
        }]],
        plugins: ['transform-object-rest-spread','transform-react-jsx']
      }
    },
    { test: /\.css$/, loader: "style-loader!css-loader"}
  ]
  }
};
