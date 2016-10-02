import css from 'style.css'
import {randomInt} from './utils'
import * as actions from './model/roll.duck'

import DicePoolComponent from './dicepool'

const dice = this.props.dice
const r = randomInt.bind(null, 1,6)

const mapStateToProps = (state) => ({
  dices : state.rolls
})

const mapDispatchToProps = (dispatch)=>({
  onReroll : () => dispatch(actions.reroll([r(),r(),r(),r(),r(),r()]))
})

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(DicePoolComponent)
