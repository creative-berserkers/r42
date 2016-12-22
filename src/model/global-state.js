import contextReducer from './contextReducer'

export default function allContextsReducer(state = {}, action){
  switch(action.type){
    case 'CONTEXT_SPAWNED': return {...state, [action.id]:{
        ...contextReducer(state, action),
        active: true
      }}
    case 'CONTEXT_DESPAWNED': return {...state, [action.id]:{
      ...contextReducer(state[action.id], action),
      active: false
    }}
      default : return state
  }
}

redux.combineReducers({
  contexts : allContextsReducer
})
