'use strict'

import serverIO from 'server/server-io'

const WebSocketServer = require('ws').Server,
  express = require('express'),
  path = require('path'),
  http = require('http'),
  socketIO = require('socket.io')

const app = express()

app.use('/static', express.static('public'))

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

const server = http.createServer(app)
var io = socketIO(server)

const connections = {}

io.on('connection', serverIO);

server.listen(3000, 'localhost', function(err) {
  if (err) console.log(err)
  else {
    console.log('Listening at http://localhost:3000')
  }
})
