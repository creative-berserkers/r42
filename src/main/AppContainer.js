import css from 'style.css'

import MessageLogContainer from './messagelog'
import MapContainer from './map'
import DicePoolContainer from './DicePoolContainer'
import ActionContainer from './action'

const messages = [{id:"1",text: 'test message 1'}, {id:"2",text: 'test message 2'}]
const groups = [{
  name : 'group1',
  units : [{name:'unit1'},{name:'unit2'}]
}]

export default class AppContainer extends React.Component {
  constructor() {
    super()
  }

  render(){
    return <div className={css.mainContainer}>
        <MessageLogContainer className={css.chat} messages={messages} onSend={(msg)=>{console.log(msg)}}></MessageLogContainer>
        <MapContainer   className={css.map}
                        groups={groups}>
        </MapContainer>
        <DicePoolContainer  className={css.dicepool}></DicePoolContainer>
        <ActionContainer className={css.action}></ActionContainer>
    </div>
  }
}
