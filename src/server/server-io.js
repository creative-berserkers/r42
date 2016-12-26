import fs from 'fs'
import path from 'path'
import globalReducer from 'model/global-reducer'
import chatActionHandler from '../action-handlers/chat'
import log from './log'

const Redux = require('redux')
const stateFilePath = path.join(__dirname, 'data/state.json')

let stateStr = fs.readFileSync(stateFilePath, 'utf8')
if(stateStr.trim().length === 0) stateStr = '{}'
const store = Redux.createStore(globalReducer, JSON.parse(stateStr))

store.subscribe(function persistState(){
  const currentState = store.getState()
  fs.writeFile(stateFilePath, JSON.stringify(currentState, null, 2), function(err) {
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
      type: 'CONTEXT_SPAWNED',
      id: clientGUIDs[socket.id]
    })
  })

  socket.on('disconnect', function() {
    log.info(`client ${clientGUIDs[socket.id]}@${clientId} disconnected`)
    store.dispatch({
      type: 'CONTEXT_DESPAWNED',
      id: clientGUIDs[socket.id]
    })
    clientGUIDs[socket.id] = undefined
  })

  socket.on('command_request', function(action){
    if(action.type !== 'COMMAND_REQUEST') return
    log.info(`client ${clientGUIDs[socket.id]}@${clientId} command:${JSON.stringify(action.command)}`)
    //const stateBeforeRequest = store.getState()
    chatActionHandler(store.getState(), {
      type: action.type,
      command: action.command,
      id : clientGUIDs[socket.id]
    }, (action)=>{
      log.info(`dispatching ${JSON.stringify(action)}`)
      store.dispatch(action)
    })
    /*const stateAfterRequest = store.getState()
    stateAfterRequest.contexts.keys().forEach((key) => {
      if(stateAfterRequest.contexts[key] !== stateBeforeRequest.contexts[key]){
        log.info(`sending action back to client ${key}`)
      }
    })*/
  })
}
