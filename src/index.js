/* global React, ReactDOM, ReactRedux */
import {createStore, combineReducers} from 'redux'
import AppContainer from './view/AppContainer'
import dicePoolReducer from './model/dicePool.duck.js'
import actionPoolReducer from './model/actionPool.duck.js'
import diceReducer from './model/roll.duck'

const Provider = ReactRedux.Provider

const uiReducer = combineReducers({
  locks : dicePoolReducer
})

rootReducer = combineReducers({
  actions : actionPoolReducer,
  rolls : diceReducer,
  ui : uiReducer
})

const store = createStore(rootReducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

ReactDOM.render(
    <Provider store={store}>
      <AppContainer></AppContainer>
    </Provider>
    ,document.getElementById('mount'))
