
export default function(state, action, dispatch){
  const fullCommand = action.command
  if(fullCommand.size > 1024) return
  let command, args = []
  const commandSegments = fullCommand.split(' ')
  if(fullCommand.startsWith('/')){
    [command, ...args] = commandSegments
  } else {
    command = '/say'
    args = commandSegments
  }

  switch(command){
    case '/say' : dispatch({
      type : 'SAY',
      id : action.id,
      to: 'all',
      message : args.join(' ')
    })
  }

}
