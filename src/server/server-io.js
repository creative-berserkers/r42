import fs from 'fs'
import path from 'path'
import globalReducer from 'model/global-state'
import log from './log'

const Redux = require('redux')

const store = Redux.createStore(globalReducer)

store.subscribe(function persistState(){
  const currentState = store.getState()
  fs.writeFile(path.join(__dirname, 'data/state.json'), JSON.stringify(currentState), function(err) {
    if(err) {
      return log.error(err)
    }
  })
})

const clientGUIDs = {}

export default function onSocket(socket){
  const ipAddress = socket.request.connection.remoteAddress
  const clientId = `${ipAddress}`
  log.info(`client ??@${clientId} connected`)

  socket.on('authentication', function(authToken){
    clientGUIDs[socket.id] = authToken
    log.info(`client ??@${clientId} authenticated as ${authToken}`)
    store.dispatch({
      type: 'CONTEXT_SPAWNED_REQUEST',
      id: clientGUIDs[socket.id]
    })
  })

  socket.on('disconnect', function() {
    log.info(`client ${clientGUIDs[socket.id]}@${clientId} disconnected`)
    store.dispatch({
      type: 'CONTEXT_DESPAWNED_REQUEST',
      id: clientGUIDs[socket.id]
    })
    clientGUIDs[socket.id] = undefined
  })

  socket.on('command_request', function(action){
    if(action.type !== 'COMMAND_REQUEST') return
    log.info(`command_request id:${socket.id} command:${JSON.stringify(action.command)}`)
    const stateBeforeRequest = store.getState()
    store.dispatch({
      type: action.type,
      command : action.command,
      id : clientGUIDs[socket.id]
    })
    const stateAfterRequest = store.getState()
    stateAfterRequest.contexts.keys().forEach((key) => {
      if(stateAfterRequest.contexts[key] !== stateBeforeRequest.contexts[key]){
        log.info(`sending action back to client ${key}`)
      }
    })
  })
}
