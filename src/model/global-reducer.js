import sharedContextReducer from './context-reducer'
import redux from 'redux'
import {changed} from '../utils'

const initialState = {
  connected : false,
  shared : sharedContextReducer(undefined, {type:'@INIT@'})
}

function clientContextReducer(state = initialState, action){
  switch (action.type){
    case 'CONTEXT_SPAWNED': return {
      shared : sharedContextReducer(state.shared, action),
      connected: true
    }
    case 'CONTEXT_DESPAWNED': return {
      shared: sharedContextReducer(state.shared, action),
      connected: false
    }
    default : return changed(state, {
      ...state,
      shared : sharedContextReducer(state.shared, action)
    })
  }
}

function allContextsReducer(state = {}, action){
  switch(action.type){
    case 'CONTEXT_SPAWNED': return {...state, [action.id]: clientContextReducer(state[action.id], action)}
    case 'CONTEXT_DESPAWNED': return {...state, [action.id]: clientContextReducer(state[action.id], action)}
    default : return changed(state, Object.keys(state).reduce((newState, context) => {
      newState[context] = clientContextReducer(state[context], action)
      return newState
    }, {}))
  }
}

export default redux.combineReducers({
  contexts : allContextsReducer
})
