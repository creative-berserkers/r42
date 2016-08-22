import React from 'react'
import { render } from 'react-dom'

import {MessageLogContainer} from './messagelog/index'
import { Provider } from 'react-redux'
import {createStore } from 'redux'
import {GameReducer} from './GameReducer'

const store = createStore(GameReducer)

/*const socket = new WebSocket(`ws://${location.host}/severEndpoint`)

socket.onmessage = (event)=>{
  //console.log(event)
  store.dispatch(JSON.parse(event.data))
  console.log(store.getState().toJS())
}*/
const messages = [{text: 'test message 1'}, {text: 'test message 2'}]

render(<Provider store={store} >
        <MessageLogContainer messages={messages} onSend="(msg)=>{console.log(msg)}"></MessageLogContainer>
    </Provider>,document.getElementById('mount'));
