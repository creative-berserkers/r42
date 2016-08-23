'use strict'

const WebSocketServer = require('ws').Server,
  express = require('express'),
  path = require('path'),
  http = require('http')

import createGame from './src/server/createGame'

const app = express()

app.use('/static', express.static('public'))


app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

const server = http.createServer(app)

const wss = new WebSocketServer({server: server, path: "/severEndpoint"})

const game = createGame()

wss.on('connection', function(ws){
  game.clientConnected(ws)
});

server.listen(3000, 'localhost', function(err) {
  if (err) console.log(err)
  else {
    console.log('Listening at http://localhost:3000')
    game.gameStarted()
  }
})
