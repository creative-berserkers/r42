export default ({context, props}) => {
    <div class='message-log-container'>
        <div class='message-log-container-list'>
          { props.messages.map((message)=>{ return <div>{message.text}</div> }) }
        </div>
        <input class='message-log-container-input' onChange={()=>{}}></input>
        <button class='message-log-container-send' onClick={props.onSend()} >Send</button>
    </div>
}
