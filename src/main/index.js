/* global React, ReactDOM, ReactRedux */
import css from 'style.css'
import {createStore, combineReducers} from 'redux'
import AppContainer from './AppContainer'
import diceReducer from './dice/dice.duck'
import {randomInt} from './utils'

const Provider = ReactRedux.Provider

const rootReducer = combineReducers({
  dice : diceReducer
})
const store = createStore(rootReducer)

ReactDOM.render(
    <Provider store={store}>
      <AppContainer></AppContainer>
    </Provider>
    ,document.getElementById('mount'))
