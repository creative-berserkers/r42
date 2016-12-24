import guid from '../utils/guid'
import log from './log'

export default function command({ getState, dispatch }) {
  const socket = io()

  let authToken = localStorage.getItem('auth-token')
  if(!authToken){
    authToken = guid()
    localStorage.setItem('auth-token', authToken)
  }

  socket.on('connect', function(){
    log.info('connected')
    socket.emit('authentication', authToken)
  })

  socket.on('action', function(action){
    dispatch(action)
  })

  return (next) => (action) => {
    if(action.type === 'COMMAND_REQUEST'){
      log.info(`will dispatch: ${action}`)
      socket.emit('command_request', JSON.stringify(action))
      return {}
    } else {
      return next(action)
    }
  }
}
