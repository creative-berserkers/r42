const initialState = {
  messages : []
}

export default function contextReducer(state = initialState, action){
  switch(action.type){
    case 'SAY' : return {
      ...state,
      messages : state.messages.concat({
        from: action.id,
        message: action.message
      })
    }
    default: return state
  }
}
