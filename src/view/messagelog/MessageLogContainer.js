import css from './style.css'
import * as React from 'react'
import {connect} from 'react-redux'

class MessageLogContainer extends React.Component {

  constructor() {
    super()
  }

  static propTypes(){
    return {
      messages: React.PropTypes.arrayOf(React.PropTypes.shape({
        text: React.PropTypes.string
      }))
    }
  }

  static defaultProps(){
    return {
      messages: []
    }
  }

  render(){

    const messages = this.props.messages

    let handleClick = ()=>{
      this.props.onSend(this.refs.chatInput.value)
      this.refs.chatInput.value = ''
    }

    let handleKeyboard = (e)=>{
      if (e.key === 'Enter') {
        handleClick()
      }
    }

    return <div className={`${this.props.className} ${css.messageLogContainer}`}>
        <div key="list" className={css.messageLogContainerList}>
          { messages.map((message)=>{ return <div key={message.id}>{message.text}</div> }) }
        </div>
        <input key="input" className={css.messageLogContainerInput} ref="chatInput" onKeyUp={handleKeyboard}></input>
        <button key="send" className={css.messageLogContainerSend} onClick={handleClick} >Send</button>
    </div>
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    onSend: function(command) {
      dispatch({type: 'COMMAND_REQUEST', command: command})
    }
  }
}

const mapStateToProps = function(store) {
  return {
    messages: store.messages
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageLogContainer)
