

export default function command({ getState, dispatch }) {
  const socket = io()

  socket.on('action', function(action){
    dispatch(action)
  });

  return (next) => (action) => {
    if(action.type === 'COMMAND_REQUEST'){
      console.log(`will dispatch: ${action}`)
      socket.emit('command_request', JSON.stringify(action))
      return {}
    } else {
      return next(action)
    }
  }
}
