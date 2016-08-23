/* global React, ReactDOM, ReactRedux */
import {createStore} from 'redux'
import MessageLogContainer from './messagelog'
import {GameReducer} from './GameReducer'


const Provider = ReactRedux.Provider

const store = createStore(GameReducer)

/*const socket = new WebSocket(`ws://${location.host}/severEndpoint`)

socket.onmessage = (event)=>{
  //console.log(event)
  store.dispatch(JSON.parse(event.data))
  console.log(store.getState().toJS())
}*/
const messages = [{text: 'test message 1'}, {text: 'test message 2'}]

ReactDOM.render(
        <MessageLogContainer messages={messages} onSend="(msg)=>{console.log(msg)}"></MessageLogContainer>
    ,document.getElementById('mount'))
