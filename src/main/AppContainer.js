import css from 'style.css'

import MessageLogContainer from './messagelog'
import MapContainer from './map'
import DiceContainer from './dice'
import ActionContainer from './action'
import {Dice} from './dice'

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
        <MessageLogContainer className={css.chat} messages={messages} onSend="(msg)=>{console.log(msg)}"></MessageLogContainer>
        <MapContainer className={css.map} groups={groups}></MapContainer>
        <DiceContainer className={css.dicepool} dices=store.getState().dice onReroll={(action)=>store.dispatch(action)}></DiceContainer>
        <ActionContainer></ActionContainer>
    </div>
  }
}
