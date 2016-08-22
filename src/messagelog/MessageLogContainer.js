'use strict'
const {element} = require('deku')
const MessageLog = require('./MessageLog')
const MessageInput = require('./MessageInput')

module.exports = {
  render({context, props}) {

    return (
      <div class='message-log-container'>
        <div class='message-log-container-list'>
          { props.messages.map((message)=>{ return <div>{message.text}</div> }) }
        </div>
        <input class='message-log-container-input' onChange={}></input>
        <button class='message-log-container-send' onClick={props.onSend()} >Send</button>
      </div>
    )
  }
}
