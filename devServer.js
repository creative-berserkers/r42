'use strict'

const webpack = require('webpack'),
  WebSocketServer = require('ws').Server,
  config = require('./webpack.config.dev'),
  dev = require('webpack-dev-middleware'),
  hot = require('webpack-hot-middleware'),
  express = require('express'),
  path = require('path'),
  http = require('http'),
  createGame = require('./src/server/createGame')


const compiler = webpack(config)

const app = express()

app.use(dev(compiler, {noInfo: true, publicPath: config.output.publicPath}))
app.use(hot(compiler))
app.use('/static', express.static('public'));

app.get('/testrom', function(req, res){
  res.sendFile(path.join(__dirname,'roms', req.query['name']));
})

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
})

const server = http.createServer(app)

const wss = new WebSocketServer({server: server, path: "/severEndpoint"})

const game = createGame()

wss.on('connection', function(ws){
  game.clientConnected(ws)
});

console.log('Compiling...')
server.listen(3000, 'localhost', function(err) {
  if (err) console.log(err)
  else {
    console.log('Listening at http://localhost:3000')
    game.gameStarted()
  }
})
