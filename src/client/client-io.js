import guid from '../utils/guid'
import log from './log'

export default function command({ getState, dispatch }) {
  const socket = io()

  let authToken = localStorage.getItem('auth-token')
  if(!authToken){
    authToken = guid()
    localStorage.setItem('auth-token', authToken)
  }

  socket.on('connect', function onConnect(){
    log.info('connected')
    socket.emit('authentication', authToken)
  })

  socket.on('initial_state', function onInitialState(state){
    log.info('initial_state', state)
    dispatch({
      type: 'LOAD_CLIENT_STATE',
      state: state
    })
  })

  socket.on('action', function onAction(action){
    dispatch(action)
  })

  return (next) => (action) => {
    if(action.type === 'COMMAND_REQUEST'){
      const actionJSON = JSON.stringify(action)
      log.info(`will dispatch: ${actionJSON}`)
      socket.emit('command_request', action)
      return {}
    } else {
      return next(action)
    }
  }
}
