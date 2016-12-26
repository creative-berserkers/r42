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

const initialState$1 = {
  messages: []
};

function contextReducer(state = initialState$1, action) {
  switch (action.type) {
    case 'SAY':
      return Object.assign({}, state, {
        messages: state.messages.concat({
          from: action.id,
          message: action.message
        })
      });
    default:
      return state;
  }
}

function shallowEqual(oldState, newState) {
  const resultOldToNew = Object.keys(oldState).reduce((result, oldKey) => {
    return result === true ? result : oldState[oldKey] !== newState[oldKey];
  }, false);

  const resultNewToOld = Object.keys(newState).reduce((result, newKey) => {
    return result === true ? result : oldState[newKey] !== newState[newKey];
  }, false);

  return !resultNewToOld && !resultOldToNew;
}

function changed(oldState, newState) {

  return shallowEqual(oldState, newState) ? oldState : newState;
}

const initialState = {
  connected: false,
  shared: contextReducer(undefined, { type: '@INIT@' })
};

function clientContextReducer(state = initialState, action) {
  switch (action.type) {
    case 'CONTEXT_SPAWNED':
      return {
        shared: contextReducer(state.shared, action),
        connected: true
      };
    case 'CONTEXT_DESPAWNED':
      return {
        shared: contextReducer(state.shared, action),
        connected: false
      };
    default:
      return changed(state, Object.assign({}, state, {
        shared: contextReducer(state.shared, action)
      }));
  }
}

function allContextsReducer(state = {}, action) {
  switch (action.type) {
    case 'CONTEXT_SPAWNED':
      return Object.assign({}, state, { [action.id]: clientContextReducer(state[action.id], action) });
    case 'CONTEXT_DESPAWNED':
      return Object.assign({}, state, { [action.id]: clientContextReducer(state[action.id], action) });
    default:
      return changed(state, Object.keys(state).reduce((newState, context) => {
        newState[context] = clientContextReducer(state[context], action);
        return newState;
      }, {}));
  }
}

var globalReducer = redux.combineReducers({
  contexts: allContextsReducer
});

var chatActionHandler = function (state, action, dispatch) {
  const fullCommand = action.command;
  if (fullCommand.size > 1024) return;
  let command,
      args = [];
  const commandSegments = fullCommand.split(' ');
  if (fullCommand.startsWith('/')) {
    [command, ...args] = commandSegments;
  } else {
    command = '/say';
    args = commandSegments;
  }

  switch (command) {
    case '/say':
      dispatch({
        type: 'SAY',
        id: action.id,
        to: 'all',
        message: args.join(' ')
      });
  }
};

const Redux = require('redux');
const stateFilePath = path.join(__dirname, 'data/state.json');

let stateStr = fs.readFileSync(stateFilePath, 'utf8');
if (stateStr.trim().length === 0) stateStr = '{}';
const store = Redux.createStore(globalReducer, JSON.parse(stateStr));

store.subscribe(function persistState() {
  const currentState = store.getState();
  fs.writeFile(stateFilePath, JSON.stringify(currentState, null, 2), function (err) {
    if (err) {
      return log.error(err);
    }
  });
});

const clientSocketIdToGuid = {};
const clientGuidToSocket = {};

function onSocket(io, socket) {
  const ipAddress = socket.request.connection.remoteAddress;
  const clientId = `${ ipAddress }`;
  log.info(`client ??@${ clientId } connected`);

  socket.on('authentication', function (authToken) {
    clientSocketIdToGuid[socket.id] = authToken;
    clientGuidToSocket[authToken] = socket;
    log.info(`client ??@${ clientId } authenticated as ${ authToken }`);
    store.dispatch({
      type: 'CONTEXT_SPAWNED',
      id: clientSocketIdToGuid[socket.id]
    });
    socket.send('initial_state', store.getState().contexts[authToken].shared);
  });

  socket.on('disconnect', function () {
    log.info(`client ${ clientSocketIdToGuid[socket.id] }@${ clientId } disconnected`);
    store.dispatch({
      type: 'CONTEXT_DESPAWNED',
      id: clientSocketIdToGuid[socket.id]
    });
    clientGuidToSocket[clientSocketIdToGuid[socket.id]] = undefined;
    clientSocketIdToGuid[socket.id] = undefined;
  });

  socket.on('command_request', function (action) {
    if (action.type !== 'COMMAND_REQUEST') return;
    log.info(`client ${ clientSocketIdToGuid[socket.id] }@${ clientId } command:${ JSON.stringify(action.command) }`);

    chatActionHandler(store.getState(), {
      type: action.type,
      command: action.command,
      id: clientSocketIdToGuid[socket.id]
    }, action => {
      log.info(`dispatching ${ JSON.stringify(action) }`);
      const stateBeforeRequest = store.getState();
      store.dispatch(action);
      const stateAfterRequest = store.getState();
      Object.keys(stateBeforeRequest.contexts).forEach(key => {

        const stateChanged = !shallowEqual(stateBeforeRequest.contexts[key].shared, stateAfterRequest.contexts[key].shared);
        const targetSocket = clientGuidToSocket[key];
        if (stateChanged) {
          log.info(`After ${ action.type } state for ${ key } changed, sending action`);
          targetSocket.send('action', action);
        } else {
          log.info(`After ${ action.type } state for ${ key } is same`);
        }
      });
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

io.on('connection', onSocket.bind(undefined, io));

server.listen(3000, 'localhost', function (err) {
  if (err) log.error(err);else {
    log.info('Listening at http://localhost:3000');
  }
});
