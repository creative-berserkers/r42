
var webpack = require('webpack'),
    config = require('./webpack.config.dev'),
    dev = require('webpack-dev-middleware'),
    hot = require('webpack-hot-middleware'),
    express = require('express'),
    path = require('path')

var compiler = webpack(config)

var app = express()

app.use(dev(compiler, {noInfo: true, publicPath: config.output.publicPath}))
app.use(hot(compiler))

app.get('/testrom', function(req, res){
  res.sendFile(path.join(__dirname, 'opus5.gb'));
})

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
})

console.log('Compiling...')
app.listen(3000, 'localhost', function(err) {
  if (err) console.log(err)
  else console.log('Listening at http://localhost:3000');
})
