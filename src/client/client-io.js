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
      const actionJSON = JSON.stringify(action)
      log.info(`will dispatch: ${actionJSON}`)
      socket.emit('command_request', action)
      return {}
    } else {
      return next(action)
    }
  }
}
