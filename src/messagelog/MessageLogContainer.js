const MessageLogContainer = ({messages}) => {
    <div class='message-log-container'>
        <div class='message-log-container-list'>
          { messages.map((message)=>{ return <div>{message.text}</div> }) }
        </div>
        <input class='message-log-container-input' onChange={()=>{}}></input>
        <button class='message-log-container-send' onClick={()=>{}} >Send</button>
    </div>
}

MessageLogContainer.propTypes = {
  messages: React.PropTypes.arrayOf(React.PropTypes.shape({
    text: React.PropTypes.string
  }))
}
MessageLogContainer.defaultProps = {
  messages: []
}

export default MessageLogContainer
