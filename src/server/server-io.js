//import globalReducer from 'model/global-state'

//const Redux = require('redux')

//const store = Redux.createStore(globalReducer)

export default function onSocket(socket){

  /*store.dispatch({
    type: 'CONTEXT_SPAWNED_REQUEST',
    id: socket.id
  })

  socket.on('disconnect', function() {
    store.dispatch({
      type: 'CONTEXT_DESPAWNED_REQUEST',
      id: socket.id
    })
  })

  socket.on('command_request', function(action){
    if(action.type !== 'COMMAND_REQUEST') return
    console.log(`command_request id:${socket.id} msg:${JSON.stringify(msg)}`)
    const stateBeforeRequest = store.getState()
    store.dispatch(action)
    const stateAfterRequest = store.getState()
    stateAfterRequest.contexts.keys().forEach((key) => {
      if(stateAfterRequest.contexts[key] !== stateBeforeRequest.contexts[key]){
        console.log(`sending action back to client ${key}`)
      }
    })
  })*/
}
