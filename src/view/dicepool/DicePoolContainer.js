import css from 'style.css'
import {randomInt} from '../../utils'
import * as actions from '../../model/roll.duck'

import DicePoolComponent from './DicePoolComponent'

const dice = this.props.dice
const r = randomInt.bind(null, 1,7)

const mapStateToProps = (state) => ({
  dices : state.rolls,
  locks: state.ui.locks,
  state : state.ui.locks
})

const mapDispatchToProps = (dispatch)=>({
  onReroll : (dices,locks) => dispatch(actions.reroll(dices.map((dice, index)=>locks[index]?dice:r()))),
  onLock : (diceNumber) => dispatch(dicePoolActions.switchDiceLock(diceNumber))
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(DicePoolComponent)
