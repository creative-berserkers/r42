'use strict'
const {element} = require('deku')
const {getBoardSize} = require('../selectors/BoardSelector')
const {forEachPlayer} = require('../selectors/PlayerSelector')
const {MessageLogContainer} = require('messagelog')

module.exports = {
  render({context}) {

    const messages = [{text: 'test message 1'}, {text: 'test message 2'}]

    return (
      <MessageLogContainer messages={messages} onSend="(msg)=>{console.log(msg)}"></MessageLogContainer>
    )
  }
}
