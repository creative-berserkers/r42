import css from './style.css'
import * as React from 'react'

import MessageLogContainer from './messagelog'

export default class AppContainer extends React.Component {
  constructor() {
    super()
  }

  render(){
    return <div className={css.mainContainer}>
        <MessageLogContainer className={css.chat}>
        </MessageLogContainer>
    </div>
  }
}
