'use strict';

var express = require('express');
var path = require('path');
var http = require('http');
var socketIO = require('socket.io');
var fs = require('fs');
var redux = require('redux');

const winston = require('winston');
const path$1 = require('path');

const logger = new winston.Logger({
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: path$1.join(__dirname, 'data/server.log') })]
});

var log = {
  debug(...args) {
    logger.debug(...args);
  },
  info(...args) {
    logger.info(...args);
  },
  warn(...args) {
    logger.warn(...args);
  },
  error(...args) {
    logger.error(...args);
  }
};

function contextReducer(state = {}, action) {}

function allContextsReducer(state = {}, action) {
  switch (action.type) {
    case 'CONTEXT_SPAWNED':
      return Object.assign({}, state, { [action.id]: Object.assign({}, contextReducer(state, action), {
          active: true
        }) });
    case 'CONTEXT_DESPAWNED':
      return Object.assign({}, state, { [action.id]: Object.assign({}, contextReducer(state[action.id], action), {
          active: false
        }) });
    default:
      return state;
  }
}

redux.combineReducers({
  contexts: allContextsReducer
});

const Redux = require('redux');

const store = Redux.createStore(allContextsReducer);

store.subscribe(function persistState() {
  const currentState = store.getState();
  fs.writeFile(path.join(__dirname, 'data/state.json'), JSON.stringify(currentState), function (err) {
    if (err) {
      return log.error(err);
    }
  });
});

const clientGUIDs = {};

function onSocket(socket) {
  const ipAddress = socket.request.connection.remoteAddress;
  const clientId = `${ ipAddress }`;
  log.info(`client ??@${ clientId } connected`);

  socket.on('authentication', function (authToken) {
    clientGUIDs[socket.id] = authToken;
    log.info(`client ??@${ clientId } authenticated as ${ authToken }`);
    store.dispatch({
      type: 'CONTEXT_SPAWNED_REQUEST',
      id: clientGUIDs[socket.id]
    });
  });

  socket.on('disconnect', function () {
    log.info(`client ${ clientGUIDs[socket.id] }@${ clientId } disconnected`);
    store.dispatch({
      type: 'CONTEXT_DESPAWNED_REQUEST',
      id: clientGUIDs[socket.id]
    });
    clientGUIDs[socket.id] = undefined;
  });

  socket.on('command_request', function (action) {
    if (action.type !== 'COMMAND_REQUEST') return;
    log.info(`command_request id:${ socket.id } command:${ JSON.stringify(action.command) }`);
    const stateBeforeRequest = store.getState();
    store.dispatch({
      type: action.type,
      command: action.command,
      id: clientGUIDs[socket.id]
    });
    const stateAfterRequest = store.getState();
    stateAfterRequest.contexts.keys().forEach(key => {
      if (stateAfterRequest.contexts[key] !== stateBeforeRequest.contexts[key]) {
        log.info(`sending action back to client ${ key }`);
      }
    });
  });
}

const app = express();

app.use('/static', express.static('public'));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', onSocket);

server.listen(3000, 'localhost', function (err) {
  if (err) log.error(err);else {
    log.info('Listening at http://localhost:3000');
  }
});
