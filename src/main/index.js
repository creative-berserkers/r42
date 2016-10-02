/* global React, ReactDOM, ReactRedux */
import css from 'style.css'
import {createStore, combineReducers} from 'redux'
import AppContainer from './AppContainer'
import diceReducer from './model/roll.duck'

const Provider = ReactRedux.Provider

const rootReducer = combineReducers({
  rolls : diceReducer
})
const store = createStore(rootReducer)

ReactDOM.render(
    <Provider store={store}>
      <AppContainer></AppContainer>
    </Provider>
    ,document.getElementById('mount'))
