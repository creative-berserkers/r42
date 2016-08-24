import css from 'style.css'

const MessageLogContainer = ({messages}) => {

    //return <h1>Hello World</h1>
    return <div className={css.messageLogContainer}>
        <div key="list" className={css.messageLogContainerList}>
          { messages.map((message)=>{ return <div key={message.id}>{message.text}</div> }) }
        </div>
        <input key="input" className={css.messageLogContainerInput} onChange={()=>{}}></input>
        <button key="send" className={css.messageLogContainerSend} onClick={()=>{}} >Send</button>
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
